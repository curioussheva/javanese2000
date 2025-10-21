// src/screens/BookmarksScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './ArticleDetailScreen';
import { Ionicons } from '@expo/vector-icons';
import { useBookmark } from '../context/BookmarkContext';

type BookmarksScreenProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const BookmarksScreen: React.FC<BookmarksScreenProps> = ({ navigation }) => {
  const { bookmarks, removeBookmark } = useBookmark();

  const handleArticlePress = (articleId: string, articleTitle: string) => {
    navigation.navigate('ArticleDetail', {
      articleId,
      articleTitle,
    });
  };

  const handleRemove = (id: string, title: string) => {
    Alert.alert(
      'Hapus Bookmark',
      `Hapus "${title}" dari daftar simpanan?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', onPress: () => removeBookmark(id), style: 'destructive' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Tombol kembali di header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bookmark</Text>
      </View>

      <ScrollView style={styles.scrollArea}>
        {bookmarks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Belum ada artikel yang disimpan</Text>
          </View>
        ) : (
          bookmarks.map((article) => (
            <View key={article.id} style={styles.articleCard}>
              <TouchableOpacity
                onPress={() => handleArticlePress(article.id, article.title)}
                style={{ flex: 1 }}
              >
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleCategory}>{article.category}</Text>
              </TouchableOpacity>

              {/* Tombol hapus */}
              <TouchableOpacity
                onPress={() => handleRemove(article.id, article.title)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#2C5530',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 3,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollArea: {
    padding: 16,
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  articleCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#A52A2A',
    borderRadius: 6,
    padding: 6,
    marginLeft: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default BookmarksScreen;