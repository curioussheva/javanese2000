import React, { useRef, useEffect, useState } from 'react';
import { 
  StyleSheet, BackHandler, Alert, ActivityIndicator, 
  View, Text, Linking
} from 'react-native';
import { w3css, customCss } from './styles';
import { htmlAssets } from './htmlAssets';
import { imageAssets } from './imageAssets';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { BannerAd, BannerAdSize, TestIds, useInterstitialAd } from 'react-native-google-mobile-ads'; 
 
const READER_DIR = FileSystem.documentDirectory + 'reader/';
const VERSION_FILE = READER_DIR + '.version';
const APP_VERSION = '3';

const adUnitIdBanner = __DEV__ ? TestIds.BANNER : 'ca-app-pub-2718792162592521/1039823651';
const adUnitIdInterstitial = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-2718792162592521/2240406446';

// Script fungsional inti
const customJS = `
  window.w3_open = () => { if(document.getElementById("mySidebar")) document.getElementById("mySidebar").style.display = "block"; };
  window.w3_close = () => { if(document.getElementById("mySidebar")) document.getElementById("mySidebar").style.display = "none"; };
  
  window.printPage = async function() {
    if (!window.ReactNativeWebView) return;
    const bodyClone = document.body.cloneNode(true);
    const unwanted = bodyClone.querySelectorAll('button, nav, header, footer, .no-print, .w3-sidebar, [onclick*="w3_open"]');
    unwanted.forEach(el => el.remove());
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PRINT', payload: bodyClone.innerHTML }));
  };

  function initAccordion() {
    const acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
      if (!acc[i].dataset.bound) {
        acc[i].dataset.bound = "true";
        acc[i].onclick = function() {
          this.classList.toggle("active");
          const panel = this.nextElementSibling;
          if (panel) panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
        };
      }
    }
  }
  initAccordion();
`;

// Injeksi Tunggal (CSS + BaseURL + Meta + JS)
const fullInjectedJS = `
(function() {
  // 1. Meta Viewport agar tidak zoom-out
  if (!document.querySelector('meta[name="viewport"]')) {
    var meta = document.createElement('meta');
    meta.name = "viewport"; meta.content = "width=device-width, initial-scale=1.0";
    document.head.appendChild(meta);
  }

  // 2. Injeksi CSS
  try {
    const style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(w3css)} + "\\n" + ${JSON.stringify(customCss)};
    document.head.appendChild(style);
  } catch (e) {}

    // 3. Base URL (Optimasi untuk Termux/Metro)
  if (!document.querySelector('base')) {
    const base = document.createElement('base');
    // Gunakan jalur tunggal
    base.href = ${__DEV__ ? "'http://localhost:8081/assets/reader/'" : `'file://${READER_DIR}'`};
    document.head.insertBefore(base, document.head.firstChild);
  }
  
  // 4. Masukkan fungsionalitas
  ${customJS}

  window.ReactNativeWebView.postMessage(JSON.stringify({type: 'JS_READY'}));
})();
true;
`;

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false); 
  const [pageViews, setPageViews] = useState(0); 
  const [lastUrl, setLastUrl] = useState('');
  const [lastAdShownTime, setLastAdShownTime] = useState(0);
  const [indexUri, setIndexUri] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(__DEV__);
  const [copyProgress, setCopyProgress] = useState(0);

  const { isLoaded, isClosed, load, show } = useInterstitialAd(adUnitIdInterstitial);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (isClosed) load(); }, [isClosed, load]);

  useEffect(() => {
    if (__DEV__) return;
    (async () => {
      try {
        const indexPath = READER_DIR + 'index.html';
        const versionInfo = await FileSystem.getInfoAsync(VERSION_FILE);
        
        if (versionInfo.exists) {
          const ver = await FileSystem.readAsStringAsync(VERSION_FILE);
          if (ver.trim() === APP_VERSION) {
            setIndexUri(indexPath); setIsReady(true); return;
          }
        }

        const totalAssets = htmlAssets.length + imageAssets.length;
        let copied = 0; 
        const allAssets = [...htmlAssets, ...imageAssets];

        for (const item of allAssets) {
          const asset = Asset.fromModule(item.module);
          await asset.downloadAsync();
          const destPath = READER_DIR + item.path;
          const destFolder = destPath.substring(0, destPath.lastIndexOf('/'));
          
          await FileSystem.makeDirectoryAsync(destFolder, { intermediates: true });
          await FileSystem.copyAsync({ from: asset.localUri!, to: destPath });
          
          copied++;
          setCopyProgress(Math.round((copied / totalAssets) * 100));
        }

        await FileSystem.writeAsStringAsync(VERSION_FILE, APP_VERSION);
        setIndexUri(indexPath);
        setIsReady(true);
      } catch (e: any) {
        Alert.alert('Setup Error', e.message);
        setIsReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    const currentTime = Date.now();
    if (pageViews > 0 && pageViews % 5 === 0 && isLoaded && (currentTime - lastAdShownTime > 60000)) {
      show();
      setLastAdShownTime(currentTime);
    }
  }, [pageViews, isLoaded, show, lastAdShownTime]);

  const handlePrint = async (htmlPayload: string) => {
    setIsPrinting(true);
    try {
      const { uri } = await Print.printToFileAsync({ html: `<html><body>${htmlPayload}</body></html>` });
      await Sharing.shareAsync(uri);
    } finally { setIsPrinting(false); }
  };

  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack(); return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [canGoBack]);

  if (!isReady) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ color: 'white', marginTop: 16 }}>Mempersiapkan konten {copyProgress}%</Text>
      </View>
    );
  }

  const webViewSource = __DEV__
    ? require('./assets/reader/index.html') 
    : { uri: indexUri || '' };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <WebView
          ref={webViewRef}
          source={webViewSource}
          originWhitelist={['*']}
          injectedJavaScript={fullInjectedJS}
          injectedJavaScriptBeforeContentLoaded={fullInjectedJS}
          onShouldStartLoadWithRequest={(request) => {
            const { url } = request;
            if (url.includes('localhost') || url.startsWith('file://') || url.startsWith('data:')) return true;
            if (url.startsWith('http')) { Linking.openURL(url); return false; }
            return true;
          }}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
            if (!navState.loading && navState.url !== lastUrl) {
              setLastUrl(navState.url); setPageViews(prev => prev + 1);
            }
          }}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'PRINT') handlePrint(data.payload);
            } catch (e) {}
          }}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          style={styles.webview}
        />
        
        {isPrinting && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={{color: '#fff'}}>Memproses PDF...</Text>
          </View>
        )}

        <View style={styles.adContainer}>
          <BannerAd unitId={adUnitIdBanner} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  webview: { flex: 1 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  adContainer: { alignItems: 'center', backgroundColor: '#1a1a1a', paddingBottom: 2 }
});

