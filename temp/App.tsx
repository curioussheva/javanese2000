import React, { useRef, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  BackHandler, 
  Alert, 
  ActivityIndicator, 
  View 
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

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

  // ==================== FIXED PRINT FUNCTION ====================
  window.printPage = async function() {
    if (!window.ReactNativeWebView) {
      console.warn("ReactNativeWebView not available");
      return;
    }

    try {
      // 1. Clone the body
      const bodyClone = document.body.cloneNode(true);

      // 2. Remove UI elements that shouldn't appear in PDF
      const selectors = ['#myDropdown', '#mySidebar', '.navbar', 'button', 'input', 'nav', 'script', '.no-print'];
      selectors.forEach(selector => {
        bodyClone.querySelectorAll(selector).forEach(el => el.remove());
      });

      // 3. Process images safely (this fixes the "undefined src" error)
      const originalImages = document.querySelectorAll('img');
      const clonedImages = bodyClone.querySelectorAll('img');

      for (let i = 0; i < Math.min(originalImages.length, clonedImages.length); i++) {
        const origImg = originalImages[i];
        const cloneImg = clonedImages[i];

        if (!origImg || !cloneImg) continue;

        // Try converting image to base64 using canvas (best for PDF)
        try {
          const canvas = document.createElement('canvas');
          const width = origImg.naturalWidth || origImg.width || 800;
          const height = origImg.naturalHeight || origImg.height || 600;

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(origImg, 0, 0, width, height);
            const dataURL = canvas.toDataURL('image/jpeg', 0.82);

            if (dataURL && dataURL.length > 20) {
              cloneImg.src = dataURL;
              continue;
            }
          }
        } catch (canvasErr) {
          console.warn('Canvas conversion failed for image index:', i);
        }

        // Fallback: keep original src (useful for Android local files)
        if (origImg.src) {
          cloneImg.src = origImg.src;
        }
      }

      // 4. Send cleaned HTML to React Native
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'PRINT',
        payload: bodyClone.innerHTML
      }));

    } catch (err) {
      console.error('PrintPage error:', err);
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'PRINT_ERROR',
        message: err.message || 'Failed to process print'
      }));
    }
  };

  // Make standard window.print() also work
  window.print = window.printPage;

  // Accordion functionality
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

  // Initialize accordion
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initAccordion();
  } else {
    document.addEventListener("DOMContentLoaded", initAccordion);
  }
})();
`;

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

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
              @page { margin: 15mm; }
              body { 
                font-family: 'Helvetica', Arial, sans-serif; 
                line-height: 1.6; 
                color: #000; 
                padding: 10px;
              }
              h1, h2, h3 { text-align: center; color: #1a1a1a; }
              p { 
                text-align: justify; 
                font-size: 12pt; 
                margin-bottom: 12pt; 
              }
              img { 
                max-width: 100%; 
                height: auto; 
                display: block; 
                margin: 15px auto; 
                page-break-inside: avoid; 
              }
              .center { text-align: center; }
              a { color: black !important; text-decoration: none !important; }
            </style>
          </head>
          <body>
            <div id="pdf-content">${htmlPayload}</div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html: finalHtml,
        base64: false,
        basePath: 'file:///android_asset/reader/', // Helps on Android
      });

      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Export PDF - Pasar Batu Akik',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      Alert.alert("Gagal", "Tidak dapat membuat PDF. Silakan coba lagi.");
    } finally {
      setIsPrinting(false);
    }
  };

  // Handle Android back button
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
          injectedJavaScript={customJS}
          onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'PRINT') {
                handlePrint(data.payload || "");
              } else if (data.type === 'PRINT_ERROR') {
                Alert.alert("Print Error", data.message || "Terjadi kesalahan saat memproses konten");
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

        {/* Loading Overlay when printing */}
        {isPrinting && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
            <View style={{ marginTop: 16 }}>
              <ActivityIndicator size="small" color="#ffffff" />
            </View>
            <Text style={styles.loadingText}>Membuat PDF...</Text>
          </View>
        )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 12,
    fontSize: 16,
  },
}); 