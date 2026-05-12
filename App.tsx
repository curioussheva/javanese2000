import React, { useRef, useEffect, useState } from 'react';
import { 
  StyleSheet, BackHandler, Alert, ActivityIndicator, 
  View, Text, Linking, Image
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

  // ========== Lightbox ==========
  function initLightbox() {
    document.querySelectorAll('a.lightbox').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var imgSrc = link.getAttribute('href');
        if (!imgSrc) return;

        // Buat overlay
        var overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        
        var img = document.createElement('img');
        img.src = imgSrc;
        overlay.appendChild(img);

        var closeBtn = document.createElement('span');
        closeBtn.className = 'lightbox-close';
        closeBtn.innerHTML = '×';
        overlay.appendChild(closeBtn);

        // Tutup saat klik di luar gambar atau tombol close
        overlay.addEventListener('click', function(e) {
          if (e.target === overlay || e.target === closeBtn) {
            overlay.remove();
          }
        });

        document.body.appendChild(overlay);
      });
    });
  }

  // Inisialisasi semua
  function initAll() {
    initAccordion();
    handleInternalLinks();
    initLightbox();
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    initAll();
  } else {
    document.addEventListener("DOMContentLoaded", initAll);
  }
})();
`;
  
const cssInjectionScript = `
(function() {
  function injectCSS(cssContent) {
    var style = document.createElement('style');
    style.innerHTML = cssContent;
    document.head.appendChild(style);
  }
  // Gunakan JSON.stringify agar karakter newline di file styles.ts tidak merusak script
  injectCSS(${JSON.stringify(w3css)});
  injectCSS(${JSON.stringify(customCss)});
})();
`; 


// 1. Deklarasikan dulu
const READER_DIR = FileSystem.documentDirectory + 'reader/';
const VERSION_FILE = READER_DIR + '.version';
const APP_VERSION = '2';

// 2. Baru gunakan di baseUrlScript
const baseUrlScript = `
(function() {
  var base = document.createElement('base');
  base.href = '${READER_DIR}';
  document.head.insertBefore(base, document.head.firstChild);
})();`;

const fullInjectedJS = cssInjectionScript + baseUrlScript + customJS;

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false); 
  const [pageViews, setPageViews] = useState(0); 
  const [lastUrl, setLastUrl] = useState('');
  const [lastAdShownTime, setLastAdShownTime] = useState(0);
  const [indexUri, setIndexUri] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false); // 1. Selalu mulai dari false
  const [copyProgress, setCopyProgress] = useState(0);

  const { isLoaded, isClosed, load, show } = useInterstitialAd(adUnitIdInterstitial, {
    requestNonPersonalizedAdsOnly: true,
  });

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (isClosed) load();
  }, [isClosed, load]);

  // Setup assets - semua logic ada di dalam useEffect ini
  useEffect(() => {
  (async () => {
    try {
      const indexPath = READER_DIR + 'index.html';
      let versionOk = false;

      // Cek versi
      const versionInfo = await FileSystem.getInfoAsync(VERSION_FILE);
      if (versionInfo.exists) {
        const ver = await FileSystem.readAsStringAsync(VERSION_FILE);
        versionOk = ver.trim() === APP_VERSION;
      }

      // 2. Jika DEV, kita paksa copy ulang agar perubahan terlihat
      if (__DEV__) versionOk = false;

      if (versionOk) {
        setIndexUri(indexPath);
        setIsReady(true);
        return;
      }

      const totalAssets = htmlAssets.length + imageAssets.length;
      let copied = 0;

      // Copy HTML
      for (const item of htmlAssets) {
        try {
          const asset = Asset.fromModule(item.module);
          await asset.downloadAsync();
          const destPath = READER_DIR + item.path;
          const destFolder = destPath.substring(0, destPath.lastIndexOf('/'));
          await FileSystem.makeDirectoryAsync(destFolder, { intermediates: true });
          await FileSystem.copyAsync({ from: asset.localUri!, to: destPath }); // Overwrite aktif
          copied++;
          setCopyProgress(Math.round((copied / totalAssets) * 100));
        } catch (e) { console.error(e); }
      }

      // Copy Images
      for (const item of imageAssets) {
        try {
          const asset = Asset.fromModule(item.module);
          await asset.downloadAsync();
          const destPath = READER_DIR + item.path;
          const destFolder = destPath.substring(0, destPath.lastIndexOf('/'));
          await FileSystem.makeDirectoryAsync(destFolder, { intermediates: true });
          
          // 3. Hanya cek 'exists' jika BUKAN mode dev
          const exists = await FileSystem.getInfoAsync(destPath);
          if (!exists.exists || __DEV__) {
            await FileSystem.copyAsync({ from: asset.localUri!, to: destPath });
          }
          
          copied++;
          setCopyProgress(Math.round((copied / totalAssets) * 100));
        } catch (e) { console.error(e); }
      }

      await FileSystem.writeAsStringAsync(VERSION_FILE, APP_VERSION);
      setIndexUri(indexPath);
      setIsReady(true);

    } catch (e: any) {
      console.error(e);
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

// Loading screen
// Loading screen
if (!isReady) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          {/* Title */}
          <Text style={styles.loadingTitle}>Javanese 2000</Text>
          
          {/* Subtitle */}
          <Text style={styles.loadingSubtitle}>
            Filosofi Kebatinan, Spiritual, dan Kegaiban
          </Text>
          
          {/* Logo */}
          <Image
            source={require('./assets/logo.png')}
            style={styles.loadingLogo}
            resizeMode="contain"
          />
          
          {/* Spinner */}
          <ActivityIndicator size="large" color="#FFFFFF" style={styles.loadingSpinner} />
          
          {/* Progress text */}
          <Text style={styles.loadingProgressText}>
            Memuat data... {copyProgress}%
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
 
  const webViewSource = indexUri
  ? { uri: indexUri, baseUrl: READER_DIR }
  : { html: '<html><body style="background:#486344;color:white;padding:20px"><h3>Loading...</h3></body></html>' }; 

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
  
  // 1. Tangani mailto: dan skema non-http/file
  if (url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('sms:')) {
    Linking.openURL(url).catch(() => {
      Alert.alert('Info', 'Tidak dapat membuka aplikasi');
    });
    return false;
  }
   
  // 2. Tangani link eksternal (http/https) selain localhost
  if ((url.startsWith('http://') || url.startsWith('https://')) &&
      !url.includes('127.0.0.1') && !url.includes('localhost')) {
    Linking.openURL(url);
    return false;
  }
  
  // 3. Izinkan file://, about:, data: (WebView internal)
  return true;
}}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
              if (!navState.loading && navState.url !== lastUrl && !navState.url.includes('#')) {
              setLastUrl(navState.url);
              setPageViews(prev => prev + 1);
              if (webViewRef.current) {
              webViewRef.current.injectJavaScript(fullInjectedJS);
               }
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
  container: { flex: 1, backgroundColor: '#486344' },
  webview: { flex: 1 },
  
  // Loading screen styles
  loadingContainer: {
    flex: 1,
    backgroundColor: '#486344',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  loadingTitle: {
    color: '#FFFFFF',
    fontSize: 33,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  loadingSubtitle: {
    color: '#D4E4C9',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  loadingLogo: {
    width: 240,
    height: 240,
    marginBottom: 30,
  },
  loadingSpinner: {
    marginBottom: 20,
  },
  loadingProgressText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.9,
  },
  
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: { color: '#ffffff', marginTop: 16, fontSize: 16 },
  adContainer: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#486344', paddingBottom: 5 }
}); 