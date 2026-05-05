import React, { useRef, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  BackHandler, 
  Alert, 
  ActivityIndicator, 
  View,
  Text,
  Linking
} from 'react-native';
import { w3css, customCss } from './styles';
import { htmlAssets } from './htmlAssets';

import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { 
  BannerAd, 
  BannerAdSize, 
  TestIds, 
  useInterstitialAd 
} from 'react-native-google-mobile-ads'; 

const adUnitIdBanner = __DEV__ ? TestIds.BANNER : 'ca-app-pub-2718792162592521/1039823651';
const adUnitIdInterstitial = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-2718792162592521/2240406446';

const customJS = `
(function() {
  window.myFunction = function() {
    const dropdown = document.getElementById("myDropdown");
    if (dropdown) dropdown.classList.toggle("show");
  };
  window.filterFunction = function() {
    const input = document.getElementById("myInput");
    const filter = input ? input.value.toUpperCase() : "";
    const div = document.getElementById("myDropdown");
    const a = div ? div.getElementsByTagName("a") : [];
    for (let i = 0; i < a.length; i++) {
      const txtValue = a[i].textContent || a[i].innerText;
      a[i].style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? "" : "none";
    }
  };
  window.w3_open = function() {
    const sidebar = document.getElementById("mySidebar");
    if (sidebar) sidebar.style.display = "block";
  };
  window.w3_close = function() {
    const sidebar = document.getElementById("mySidebar");
    if (sidebar) sidebar.style.display = "none";
  };
  window.printPage = async function() {
    if (!window.ReactNativeWebView) return;
    try {
      const bodyClone = document.body.cloneNode(true);
      let sidebar = bodyClone.querySelector("#mySidebar");
      if (sidebar) sidebar.remove();
      let dropdown = bodyClone.querySelector("#myDropdown");
      if (dropdown) dropdown.remove();
      const unwanted = bodyClone.querySelectorAll('button, nav, header, footer, .no-print, [onclick*="w3_open"], [onclick*="w3_close"]');
      unwanted.forEach(el => el.remove());
      bodyClone.querySelectorAll('img').forEach(img => {
        if (img.closest('#mySidebar, .w3-sidebar, .dropdown, nav')) img.remove();
      });
      bodyClone.querySelector('img[src*="print-icon"]')?.remove();
      const images = bodyClone.querySelectorAll('img');
      for (let img of images) {
        if (!img.src || img.src.startsWith('data:')) continue;
        try {
          const canvas = document.createElement('canvas');
          const maxWidth = 1000;
          const ratio = maxWidth / (img.naturalWidth || img.width || 800);
          canvas.width = (img.naturalWidth || img.width || 800) * ratio;
          canvas.height = (img.naturalHeight || img.height || 600) * ratio;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            if (dataUrl.length > 50) img.src = dataUrl;
          }
        } catch (e) {}
      }
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PRINT', payload: bodyClone.innerHTML }));
    } catch (err) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PRINT_ERROR', message: err.message || 'Failed' }));
    }
  };
  window.print = window.printPage;
  function initAccordion() {
    const acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
      acc[i].onclick = function() {
        this.classList.toggle("active");
        const panel = this.nextElementSibling;
        if (panel) {
          panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
        }
      };
    }
  }
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initAccordion();
  } else {
    document.addEventListener("DOMContentLoaded", initAccordion);
  }
  function handleInternalLinks() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href') || link.href;
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        link.target = '_self';
      }
    }, true);
  }
  if (document.readyState === "complete" || document.readyState === "interactive") {
    handleInternalLinks();
  } else {
    document.addEventListener("DOMContentLoaded", handleInternalLinks);
  }
})();
`;

const cssInjectionScript = `
(function() {
  function injectCSS(css) {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
  injectCSS(\`${w3css}\`);
  injectCSS(\`${customCss}\`);
})();
`;

const baseUrlScript = __DEV__
  ? `(function() {
      var base = document.createElement('base');
      base.href = 'http://127.0.0.1:8081/assets/reader/';
      document.head.insertBefore(base, document.head.firstChild);
    })();`
  : ``;

const fullInjectedJS = cssInjectionScript + baseUrlScript + customJS;

const READER_DIR = FileSystem.documentDirectory + 'reader/';

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

  const { isLoaded, isClosed, load, show } = useInterstitialAd(adUnitIdInterstitial, {
    requestNonPersonalizedAdsOnly: true,
  });

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (isClosed) load();
  }, [isClosed, load]);

  // Copy semua HTML ke documentDirectory saat pertama launch
  useEffect(() => {
    if (__DEV__) return;
    (async () => {
      try {
        // Cek apakah sudah pernah di-copy
        const indexPath = READER_DIR + 'index.html';
        const info = await FileSystem.getInfoAsync(indexPath);
        
        if (info.exists) {
          // Sudah ada - langsung pakai
          setIndexUri(indexPath);
          setIsReady(true);
          return;
        }

        // Pertama kali - copy semua file
        console.log('First launch - copying HTML assets...');
        
        for (let i = 0; i < htmlAssets.length; i++) {
          const item = htmlAssets[i];
          const asset = Asset.fromModule(item.module);
          await asset.downloadAsync();
          
          if (!asset.localUri) continue;

          const destPath = READER_DIR + item.path;
          const destFolder = destPath.substring(0, destPath.lastIndexOf('/'));
          
          await FileSystem.makeDirectoryAsync(destFolder, { intermediates: true });
          await FileSystem.copyAsync({ from: asset.localUri, to: destPath });
          
          setCopyProgress(Math.round(((i + 1) / htmlAssets.length) * 100));
        }

        setIndexUri(indexPath);
        setIsReady(true);
        console.log('All HTML assets copied!');
        
      } catch (e) {
        console.error('Setup error:', e);
        // Fallback ke expo-asset langsung
        const asset = Asset.fromModule(require('./assets/reader/index.html'));
        await asset.downloadAsync();
        setIndexUri(asset.localUri ?? asset.uri);
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
    if (!htmlPayload) return;
    setIsPrinting(true);
    try {
      const finalHtml = `
        <html>
          <head>
            <style>
              body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
              img { max-width: 100%; height: auto; }
              h1, h2 { text-align: center; }
            </style>
          </head>
          <body>${htmlPayload}</body>
        </html>`;
      const { uri } = await Print.printToFileAsync({ html: finalHtml });
      await Sharing.shareAsync(uri);
    } catch (error: any) {
      Alert.alert("Gagal Membuat PDF", error.message);
    } finally {
      setIsPrinting(false);
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [canGoBack]);

  // Loading screen saat pertama copy
  if (!isReady) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={{ color: 'white', marginTop: 16, fontSize: 16 }}>
            Mempersiapkan konten... {copyProgress}%
          </Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const webViewSource = __DEV__
    ? require('./assets/reader/index.html')
    : indexUri
      ? { uri: indexUri, baseUrl: READER_DIR }
      : { html: '<html><body style="background:#1a1a1a;color:white;padding:20px"><h3>Loading...</h3></body></html>' };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <WebView
          ref={webViewRef}
          source={webViewSource}
          originWhitelist={['*']}
          injectedJavaScript={fullInjectedJS}
          onShouldStartLoadWithRequest={(request) => {
            const { url } = request;
            if ((url.startsWith('http://') || url.startsWith('https://')) &&
                !url.includes('127.0.0.1') && !url.includes('localhost')) {
              Linking.openURL(url);
              return false;
            }
            return true;
          }}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
            if (!navState.loading && navState.url !== lastUrl && !navState.url.includes('#')) {
              setLastUrl(navState.url);
              setPageViews(prev => prev + 1);
            }
          }}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'PRINT') handlePrint(data.payload || "");
              else if (data.type === 'PRINT_ERROR') Alert.alert("Print Error", data.message);
            } catch (e) {
              console.log("Log:", event.nativeEvent.data);
            }
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log('WebView error:', JSON.stringify(nativeEvent));
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode="always"
          style={styles.webview}
        />

        {isPrinting && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Membuat PDF...</Text>
          </View>
        )}

        <View style={styles.adContainer}>
          <BannerAd
            unitId={adUnitIdBanner}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  webview: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: { color: '#ffffff', marginTop: 16, fontSize: 16 },
  adContainer: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a1a', paddingBottom: 5 }
}); 