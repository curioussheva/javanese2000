import React, { useRef, useState } from 'react';
import { 
  View, 
  ActivityIndicator, 
  StyleSheet,
  Dimensions,
  Text // ✅ Jangan lupa import Text
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { sanitizeHTML, isContentSafe } from '../utils/htmlSanitizer';

const { width: screenWidth } = Dimensions.get('window');

interface SafeWebViewProps {
  html: string;
  title?: string;
  onLoadEnd?: () => void;
  onError?: (error: any) => void;
}

// ✅ PERBAIKAN: Correct component declaration
const SafeWebView: React.FC<SafeWebViewProps> = ({ 
  html, 
  title = 'Artikel',
  onLoadEnd,
  onError 
}) => {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Sanitize HTML sebelum render
  const sanitizedHTML = sanitizeHTML(html);
  const isSafe = isContentSafe(sanitizedHTML);

  const HTML_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    /* Your CSS styles here */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #333;
      padding: 16px;
      margin: 0;
    }
  </style>
</head>
<body>
  ${sanitizedHTML}
</body>
</html>
`;

  const handleLoadEnd = () => {
    setLoading(false);
    onLoadEnd?.();
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView Error:', nativeEvent);
    setLoading(false);
    setHasError(true);
    onError?.(nativeEvent);
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'HEIGHT_UPDATE') {
        console.log('Content height:', data.height);
      }
    } catch (error) {
      console.warn('Failed to parse WebView message:', error);
    }
  };

  if (!isSafe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Konten tidak dapat ditampilkan karena masalah keamanan.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      )}
      
      {hasError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Gagal memuat konten.
          </Text>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ html: HTML_TEMPLATE }}
          style={styles.webview}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    zIndex: 1000,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SafeWebView;