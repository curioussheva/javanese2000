// HTMLViewerScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { DrawerScreenProps } from './types';
import * as FileSystem from 'expo-file-system';

type Props = DrawerScreenProps<'Home' | 'Terms' | 'Privacy'>;

const HTMLViewerScreen: React.FC<Props> = ({ route }) => {
  const { screenName, htmlFile } = route.params;
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHTMLFile();
  }, [htmlFile]);

  const loadHTMLFile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Method 1: Using require() for local files (if they're in the bundle)
      let htmlSource;
      switch (htmlFile) {
        case 'home.html':
          htmlSource = require('../assets/home.html');
          break;
        case 'terms.html':
          htmlSource = require('../assets/terms.html');
          break;
        case 'privacy.html':
          htmlSource = require('../assets/privacy.html');
          break;
        default:
          throw new Error('File HTML tidak ditemukan');
      }

      // For React Native, we need to read the file content
      const content = await FileSystem.readAsStringAsync(
        FileSystem.documentDirectory + htmlFile
      ).catch(async () => {
        // If file doesn't exist in document directory, use the bundled asset
        // This is a workaround for loading local HTML files
        return getFallbackHTML(screenName);
      });

      setHtmlContent(content);

    } catch (err) {
      setError(`Gagal memuat file: ${htmlFile}`);
      console.error('Error loading HTML:', err);
      setHtmlContent(getFallbackHTML(screenName));
    } finally {
      setLoading(false);
    }
  };

  const getFallbackHTML = (title: string) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            line-height: 1.6;
            color: #333;
          }
          h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
          .error { color: #e74c3c; background-color: #fdf2f2; padding: 10px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="error">
          File HTML tidak dapat dimuat: ${htmlFile}
        </div>
        <p>Silakan coba lagi nanti atau hubungi dukungan teknis.</p>
      </body>
      </html>
    `;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Memuat {screenName}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView 
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
          setError('Terjadi kesalahan saat menampilkan konten');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
});

export default HTMLViewerScreen;