// src/screens/ArticleDetailScreen.tsx
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  StatusBar,
  Text,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import SafeWebView from '../components/SafeWebView';
import { articles, Article } from '../data/articles';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useBookmark } from '../context/BookmarkContext';

type ArticleDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'ArticleDetail'>;
  navigation: StackNavigationProp<RootStackParamList, 'ArticleDetail'>;
};

const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { articleId, articleTitle } = route.params;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔖 Context
  const { addBookmark, removeBookmark, isBookmarked } = useBookmark();

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  const loadArticle = () => {
    try {
      setLoading(true);
      const foundArticle = articles.find((a) => a.id === articleId);

      if (foundArticle) {
        setArticle(foundArticle);
      } else {
        Alert.alert('Error', 'Artikel tidak ditemukan');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading article:', error);
      Alert.alert('Error', 'Gagal memuat artikel');
    } finally {
      setLoading(false);
    }
  };

  // 🧭 Update header title & tombol bookmark di header
  useLayoutEffect(() => {
    if (!article) return;

    const bookmarked = isBookmarked(article.id);

    navigation.setOptions({
      title:
        article.title.length > 20
          ? article.title.substring(0, 20) + '...'
          : article.title,
      headerRight: () => (
        <Ionicons
          name={bookmarked ? 'star' : 'star-outline'}
          size={24}
          color={bookmarked ? '#FFD700' : '#F0F0F0'}
          style={{ marginRight: 16 }}
          onPress={handleBookmarkToggle}
        />
      ),
    });
  }, [navigation, article, isBookmarked(article?.id)]);

  const handleBookmarkToggle = () => {
    if (!article) return;

    if (isBookmarked(article.id)) {
      removeBookmark(article.id);
      Alert.alert('Bookmark dihapus', `"${article.title}" telah dihapus dari daftar.`);
    } else {
      addBookmark({
        id: article.id,
        title: article.title,
        category: article.category,
        content: article.content,
      });
      Alert.alert('Berhasil disimpan', `"${article.title}" telah ditambahkan ke Bookmark.`);
    }
  };

  if (!article) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Artikel tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2C5530" barStyle="light-content" />
      <SafeWebView
        html={article.content}
        title={article.title}
        onLoadEnd={() => console.log('Loaded')}
        onError={(e) => console.error('WebView error:', e)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ArticleDetailScreen;