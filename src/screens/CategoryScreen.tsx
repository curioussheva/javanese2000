import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation/AppNavigator';
import { articles, getSubcategories, getArticlesByCategory, getArticlesBySubcategory } from '../data/articles';

type CategoryScreenProps = {
  route: RouteProp<RootStackParamList, 'Category'>;
  navigation: StackNavigationProp<RootStackParamList, 'Category'>;
};

const CategoryScreen: React.FC<CategoryScreenProps> = ({ route, navigation }) => {
  // Safe destructuring with fallback values
  const { category, subcategory, title } = route.params || {
    category: '',
    subcategory: '',
    title: ''
  };

  const [displayedArticles, setDisplayedArticles] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(subcategory || null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Only load data if category is available
    if (category) {
      loadArticles();
      loadSubcategories();
    }
  }, [category, subcategory]);

  const loadArticles = () => {
    if (!category) return; // Guard clause if category is empty
    
    let articlesList;
    if (selectedSubcategory) {
      articlesList = getArticlesBySubcategory(category, selectedSubcategory);
    } else {
      articlesList = getArticlesByCategory(category);
    }
    
    // Apply search filter jika ada query
    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      articlesList = articlesList.filter(article =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.content.toLowerCase().includes(lowerQuery)
      );
    }
    
    setDisplayedArticles(articlesList);
  };

  const loadSubcategories = () => {
    if (!category) return; // Guard clause if category is empty
    const subs = getSubcategories(category);
    setSubcategories(subs);
  };

  const handleSubcategoryPress = (subcat: string | null) => {
    setSelectedSubcategory(subcat);
    setSearchQuery(''); // Reset search ketika ganti subkategori
  };

  // In CategoryScreen.tsx - update the handleArticlePress function
const handleArticlePress = (article: any) => {
  // Navigate to ArticleDetail within the current CategoryStack
  navigation.navigate('ArticleDetail', {
    articleId: article.id,
    articleTitle: article.title
  });
};
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Reload articles ketika search query atau subcategory berubah
  useEffect(() => {
    loadArticles();
  }, [selectedSubcategory, searchQuery]);

  // Show loading state if category is not available yet
  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderArticleItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => handleArticlePress(item)}
      activeOpacity={0.8}
    >
      <Text style={styles.articleTitle}>{item.title}</Text>
      {item.subcategory && (
        <Text style={styles.articleSubcategory}>📂 {item.subcategory}</Text>
      )}
      <Text style={styles.articleExcerpt}>
        {item.content?.replace(/<[^>]*>/g, '').slice(0, 150)}...
      </Text>
      <View style={styles.articleFooter}>
        <Text style={styles.wordCount}>📝 {item.wordCount || 0} kata</Text>
        {item.isBookmarked && (
          <Ionicons name="bookmark" size={16} color="#2C5530" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Subcategory Filter */}
      {subcategories.length > 0 && (
        <View style={styles.subcategoryFilter}>
          <Text style={styles.filterTitle}>Filter Subkategori:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterScrollContent}
          >
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedSubcategory === null && styles.filterButtonActive
              ]}
              onPress={() => handleSubcategoryPress(null)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedSubcategory === null && styles.filterButtonTextActive
              ]}>
                Semua
              </Text>
            </TouchableOpacity>
            
            {subcategories.map((subcat) => (
              <TouchableOpacity
                key={subcat}
                style={[
                  styles.filterButton,
                  selectedSubcategory === subcat && styles.filterButtonActive
                ]}
                onPress={() => handleSubcategoryPress(subcat)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedSubcategory === subcat && styles.filterButtonTextActive
                ]}>
                  {subcat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Search Bar Sederhana */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Cari dalam ${category}${selectedSubcategory ? ` - ${selectedSubcategory}` : ''}...`}
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Articles List */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.categoryTitle}>
            {category}
            {selectedSubcategory && ` - ${selectedSubcategory}`}
          </Text>
          <Text style={styles.articleCount}>
            {displayedArticles.length} artikel
          </Text>
        </View>

        {displayedArticles.length > 0 ? (
          <FlatList
            data={displayedArticles}
            renderItem={renderArticleItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Tidak ada artikel yang cocok dengan pencarian' : 'Tidak ada artikel ditemukan'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery 
                ? 'Coba gunakan kata kunci lain atau hapus pencarian'
                : 'Coba pilih subkategori yang berbeda'
              }
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  subcategoryFilter: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterScrollContent: {
    paddingRight: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#2C5530',
    borderColor: '#2C5530',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C5530',
    flex: 1,
  },
  articleCount: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingBottom: 20,
  },
  articleCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2C5530',
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  articleSubcategory: {
    fontSize: 12,
    color: '#2C5530',
    marginBottom: 8,
    fontWeight: '500',
  },
  articleExcerpt: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordCount: {
    fontSize: 12,
    color: '#888',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default CategoryScreen;