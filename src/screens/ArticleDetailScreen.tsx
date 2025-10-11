// src/screens/ArticleDetailScreen.tsx
import React, { useRef } from 'react';
import { View, StyleSheet, Text, Alert, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { StackScreenProps } from '@react-navigation/stack';
import { ArticleStackParamList } from '../types';
import { articles } from '../data/articles';

type Props = StackScreenProps<ArticleStackParamList, 'ArticleDetail'>;

const ArticleDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { articleId } = route.params;
  const webViewRef = useRef<WebView>(null);
  
  const article = articles.find(a => a.id === articleId);

  const handleNavigation = (url: string) => {
    if (url.startsWith('article://')) {
      const targetArticleId = url.replace('article://', '');
      const targetArticle = articles.find(a => a.id === targetArticleId);
      if (targetArticle) {
        navigation.push('ArticleDetail', { articleId: targetArticleId });
      } else {
        Alert.alert('Artikel Tidak Ditemukan', 'Artikel yang dituju tidak tersedia.');
      }
      return false;
    } else if (url.startsWith('http')) {
      Linking.openURL(url).catch(err => 
        Alert.alert('Error', 'Tidak dapat membuka link: ' + err.message)
      );
      return false;
    }
    return true;
  };

  const getArticleStyles = (theme = 'default') => {
    const themes = {
      cultural: `:root { --primary-color: #8B4513; --secondary-color: #D2691E; --accent-color: #CD853F; --bg-color: #FFF8DC; }`,
      grammar: `:root { --primary-color: #2E8B57; --secondary-color: #3CB371; --accent-color: #90EE90; --bg-color: #F0FFF0; }`,
      default: `:root { --primary-color: #2c3e50; --secondary-color: #3498db; --accent-color: #e74c3c; --bg-color: #ffffff; }`
    };

    return `
      ${themes[theme as keyof typeof themes] || themes.default}
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333; background: var(--bg-color); }
        h1 { color: var(--primary-color); border-bottom: 2px solid var(--accent-color); padding-bottom: 10px; }
        h2 { color: var(--secondary-color); margin-top: 25px; }
        .conversation-example { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    `;
  };

  const getFullHTMLContent = (articleContent: string, theme: string = 'default') => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${getArticleStyles(theme)}
      </head>
      <body>
        ${articleContent}
      </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'navigation') {
        handleNavigation(data.url);
      }
    } catch (error) {
      console.log('Error parsing message:', error);
    }
  };

  if (!article) {
    return (
      <View style={styles.container}>
        <Text>Artikel tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView 
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: getFullHTMLContent(article.content, article.theme) }}
        style={styles.webview}
        onMessage={handleWebViewMessage}
        onShouldStartLoadWithRequest={(request) => handleNavigation(request.url)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});

export default ArticleDetailScreen;