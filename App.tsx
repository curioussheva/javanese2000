import React, { useRef, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  BackHandler, 
  Alert, 
  ActivityIndicator, 
  View,
  Text
} from 'react-native';

import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// === IMPORT ADMOB ===
import { 
  BannerAd, 
  BannerAdSize, 
  TestIds, 
  useInterstitialAd 
} from 'react-native-google-mobile-ads';

// Tentukan ID Iklan (Ganti dengan ID Asli kamu nanti sebelum rilis)
const adUnitIdBanner = __DEV__ ? TestIds.BANNER : 'ca-app-pub-2718792162592521/1039823651';
const adUnitIdInterstitial = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-2718792162592521/2240406446';
 
const customJS = `
(function() {
  // Dropdown & Sidebar functions
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

// ==================== IMPROVED PRINT FUNCTION ====================
window.printPage = async function() {
  if (!window.ReactNativeWebView) {
    console.warn("ReactNativeWebView not available");
    return;
  }

  try {
    const bodyClone = document.body.cloneNode(true);

    // === CLEANING ===
    let sidebar = bodyClone.querySelector("#mySidebar");
    if (sidebar) sidebar.remove();

    let dropdown = bodyClone.querySelector("#myDropdown");
    if (dropdown) dropdown.remove();

    const unwanted = bodyClone.querySelectorAll('button, nav, header, footer, .no-print, [onclick*="w3_open"], [onclick*="w3_close"]');
    unwanted.forEach(el => el.remove());

    bodyClone.querySelectorAll('img').forEach(img => {
      if (img.closest('#mySidebar, .w3-sidebar, .dropdown, nav')) {
        img.remove();
      }
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
      } catch (e) {
        console.warn('Canvas failed');
      }
    }

    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'PRINT',
      payload: bodyClone.innerHTML
    }));

  } catch (err) {
    console.error('PrintPage error:', err);
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'PRINT_ERROR',
      message: err.message || 'Failed to prepare content'
    }));
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

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false); 
  const [pageViews, setPageViews] = useState(0); // Menghitung navigasi halaman

  // === SETUP INTERSTITIAL AD ===
  const { isLoaded, isClosed, load, show } = useInterstitialAd(adUnitIdInterstitial, {
    requestNonPersonalizedAdsOnly: true,
  });

  // Load Iklan saat aplikasi pertama dibuka
  useEffect(() => {
    load();
  }, [load]);

  // Load Iklan BARU setiap kali iklan lama ditutup
  useEffect(() => {
    if (isClosed) {
      load();
    }
  }, [isClosed, load]);

  // Tampilkan iklan setiap kelipatan 3 kali buka halaman
  useEffect(() => {
    if (pageViews > 0 && pageViews % 3 === 0 && isLoaded) {
      show();
    }
  }, [pageViews, isLoaded, show]);


  const handlePrint = async (htmlPayload: string) => {
    if (!htmlPayload) {
      Alert.alert("Error", "Tidak ada konten untuk dicetak");
      return;
    }

    setIsPrinting(true);

    try {
      const finalHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              @page { margin: 15mm; size: A4; }
              body { 
                font-family: Arial, Helvetica, sans-serif; 
                line-height: 1.6; 
                color: #000; 
                padding: 20px;
              }
              h1, h2, h3 { text-align: center; }
              p { text-align: justify; font-size: 12pt; margin-bottom: 12pt; }
              img { 
                max-width: 100% !important; 
                height: auto !important; 
                display: block; 
                margin: 15px auto; 
                page-break-inside: avoid; 
              }
            </style>
          </head>
          <body>
            <div id="pdf-content">${htmlPayload}</div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: finalHtml });

      console.log('PDF generated at:', uri);

      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Simpan PDF Artikel',
        UTI: 'com.adobe.pdf',
      });

    } catch (error: any) {
      console.error('PDF Generation Error:', error);
      Alert.alert("Gagal Membuat PDF", error.message || "Silakan coba lagi.");
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

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
                <WebView
          ref={webViewRef}
          source={require('./assets/reader/index.html')}
          originWhitelist={['*']} // <-- Ditambahkan untuk mencegah error CORS/Cleartext
          injectedJavaScript={customJS}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
            
            // Perbaikan: Tambah hitungan HANYA JIKA halaman SELESAI dimuat 
            // dan bukan navigasi sekadar hashtag/anchor
            if (!navState.loading && !navState.url.includes('#')) {
              setPageViews(prev => prev + 1);
            }
          }}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'PRINT') {
                handlePrint(data.payload || "");
              } else if (data.type === 'PRINT_ERROR') {
                Alert.alert("Print Error", data.message || "Terjadi kesalahan");
              }
            } catch (e) {
              console.log("WebView raw message:", event.nativeEvent.data);
            }
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode="always"
          style={styles.webview}
        />

        {/* LOADING OVERLAY */}
        {isPrinting && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Membuat PDF...</Text>
          </View>
        )}

        {/* Bawah: BANNER AD */}
        <View style={styles.adContainer}>
          <BannerAd
            unitId={adUnitIdBanner}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#1a1a1a' 
  },
  webview: { 
    flex: 1 
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  adContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a', 
    paddingBottom: 5, // Sedikit padding bawah agar tidak menempel border HP
  }
});
