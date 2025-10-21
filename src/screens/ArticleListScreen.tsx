// src/screens/ArticleListScreen.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { articles } from '../data/articles';

type ArticleListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ArticleList'>;

interface Props {
  navigation: ArticleListScreenNavigationProp;
}

const ArticleListScreen: React.FC<Props> = ({ navigation }) => {
  const [sortBy, setSortBy] = useState<'title' | 'readTime'>('title');

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return a.readTime - b.readTime;
  });

  const handleArticlePress = (article: any) => {
    navigation.navigate('ArticleDetail', { article });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleArticlePress(item)}
      activeOpacity={0.8}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.excerpt}>{item.excerpt}</Text>
      <Text style={styles.meta}>
        🕒 {item.readTime} menit · 📂 {item.category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Daftar Artikel</Text>
        <TouchableOpacity
          onPress={() => setSortBy(sortBy === 'title' ? 'readTime' : 'title')}
        >
          <Text style={styles.sortBtn}>
            Urutkan: {sortBy === 'title' ? 'Judul' : 'Durasi'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedArticles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: { fontSize: 20, fontWeight: '700', color: '#222' },
  sortBtn: { fontSize: 14, color: '#007AFF', fontWeight: '500' },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  title: { fontSize: 17, fontWeight: '600', color: '#333' },
  excerpt: { fontSize: 14, color: '#555', marginTop: 6 },
  meta: { fontSize: 12, color: '#777', marginTop: 4 },
});

export default ArticleListScreen;