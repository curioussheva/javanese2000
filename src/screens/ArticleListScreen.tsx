// src/screens/ArticleListScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ArticleStackScreenProps } from '../types';
import { articles, categories } from '../data/articles';

type Props = ArticleStackScreenProps<'ArticleList'>;

const ArticleListScreen: React.FC<Props> = ({ route, navigation }) => {
  const { categoryId, subcategoryId } = route.params || {};
  
  const filteredArticles = categoryId 
    ? articles.filter(article => 
        article.category === categoryId && 
        (!subcategoryId || article.subcategory === subcategoryId)
      )
    : articles;

  const category = categoryId ? categories.find(cat => cat.id === categoryId) : null;
  const subcategory = category?.subcategories?.find(sub => sub.id === subcategoryId);

  const getScreenTitle = () => {
    if (subcategory) return subcategory.name;
    if (category) return category.name;
    return 'Semua Artikel';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getScreenTitle()}</Text>
      <Text style={styles.count}>{filteredArticles.length} artikel ditemukan</Text>
      
      {filteredArticles.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Tidak ada artikel ditemukan</Text>
        </View>
      ) : (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.articleCard}
              onPress={() => navigation.navigate('ArticleDetail', { articleId: item.id })}
            >
              <Text style={styles.articleTitle}>{item.title}</Text>
              <Text style={styles.articleCategory}>
                {categories.find(cat => cat.id === item.category)?.name}
                {item.subcategory && ` • ${category?.subcategories?.find(sub => sub.id === item.subcategory)?.name}`}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1a1a2e' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 5 },
  count: { fontSize: 14, color: '#8b9bb4', marginBottom: 20 },
  articleCard: { backgroundColor: '#16213e', padding: 15, borderRadius: 8, marginBottom: 10 },
  articleTitle: { fontSize: 16, color: '#ffffff', marginBottom: 5 },
  articleCategory: { fontSize: 12, color: '#8b9bb4' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: '#8b9bb4', textAlign: 'center' },
});

export default ArticleListScreen;