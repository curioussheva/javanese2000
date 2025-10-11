// src/components/CustomDrawerContent.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { categories, articles } from '../data/articles';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleBookmark = (articleId: string) => {
    const newBookmarks = new Set(bookmarkedArticles);
    if (newBookmarks.has(articleId)) {
      newBookmarks.delete(articleId);
    } else {
      newBookmarks.add(articleId);
    }
    setBookmarkedArticles(newBookmarks);
  };

  const navigateToHome = () => props.navigation.navigate('Home');
  const navigateToAllArticles = () => props.navigation.navigate('AllArticles');
  const navigateToBookmarks = () => props.navigation.navigate('Bookmarks');
  const navigateToCategory = (categoryId: string, subcategoryId?: string) => {
    props.navigation.navigate('Category', { categoryId, subcategoryId });
  };
  const navigateToArticle = (articleId: string) => {
    props.navigation.navigate('ArticleDetail', { articleId });
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>ꦧꦱ</Text>
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoTitle}>ꦲꦭꦩꦤ꧀ꦲꦸꦠꦩ</Text>
            <Text style={styles.logoSubtitle}>Aksara Jawa</Text>
          </View>
        </View>
        <Text style={styles.headerDescription}>
          Mari lestarikan bahasa dan budaya Jawa melalui pembelajaran yang menyenangkan
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari artikel..."
              placeholderTextColor="#95a5a6"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.quickAction]} onPress={navigateToHome}>
            <Text style={styles.quickActionIcon}>🏠</Text>
            <Text style={styles.quickActionText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction]} onPress={navigateToAllArticles}>
            <Text style={styles.quickActionIcon}>📚</Text>
            <Text style={styles.quickActionText}>Semua</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction]} onPress={navigateToBookmarks}>
            <Text style={styles.quickActionIcon}>🔖</Text>
            <Text style={styles.quickActionText}>Favorit</Text>
          </TouchableOpacity>
        </View>

        {searchQuery.length > 0 && (
          <View style={styles.searchResultsSection}>
            <Text style={styles.sectionTitle}>Hasil Pencarian ({filteredArticles.length})</Text>
            {filteredArticles.slice(0, 10).map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.searchResultItem}
                onPress={() => {
                  navigateToArticle(article.id);
                  setSearchQuery('');
                }}
              >
                <Text style={styles.searchResultIcon}>📖</Text>
                <View style={styles.searchResultContent}>
                  <Text style={styles.searchResultTitle} numberOfLines={2}>{article.title}</Text>
                  <Text style={styles.searchResultCategory}>
                    {categories.find(cat => cat.id === article.category)?.name}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => toggleBookmark(article.id)}>
                  <Text style={[styles.bookmarkIcon, bookmarkedArticles.has(article.id) && styles.bookmarked]}>
                    {bookmarkedArticles.has(article.id) ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {searchQuery.length === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kategori Pembelajaran</Text>
            {categories.map((category) => (
              <View key={category.id} style={styles.categoryContainer}>
                <TouchableOpacity
                  style={[styles.categoryHeader, expandedCategories.has(category.id) && styles.expandedCategoryHeader]}
                  onPress={() => toggleCategory(category.id)}
                >
                  <View style={styles.categoryHeaderContent}>
                    <Text style={styles.categoryIcon}>{category.icon || '📁'}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryCount}>
                      {category.subcategories?.reduce((total, sub) => total + sub.articleCount, 0)}
                    </Text>
                  </View>
                  <Text style={styles.expandIcon}>{expandedCategories.has(category.id) ? '▼' : '▶'}</Text>
                </TouchableOpacity>

                {expandedCategories.has(category.id) && (
                  <View style={styles.subcategoriesContainer}>
                    {category.subcategories?.map((subcategory) => (
                      <View key={subcategory.id} style={styles.subcategoryContainer}>
                        <TouchableOpacity
                          style={styles.subcategoryHeader}
                          onPress={() => navigateToCategory(category.id, subcategory.id)}
                        >
                          <View style={styles.subcategoryHeaderContent}>
                            <Text style={styles.subcategoryIcon}>{subcategory.icon || '📄'}</Text>
                            <Text style={styles.subcategoryName}>{subcategory.name}</Text>
                            <Text style={styles.subcategoryCount}>{subcategory.articleCount}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {searchQuery.length === 0 && (
          <View style={styles.statsSection}>
            <Text style={styles.statsTitle}>📊 Statistik Belajar</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}><Text style={styles.statNumber}>{articles.length}</Text><Text style={styles.statLabel}>Total Artikel</Text></View>
              <View style={styles.statItem}><Text style={styles.statNumber}>{categories.length}</Text><Text style={styles.statLabel}>Kategori</Text></View>
              <View style={styles.statItem}><Text style={styles.statNumber}>{categories.reduce((total, cat) => total + (cat.subcategories?.length || 0), 0)}</Text><Text style={styles.statLabel}>Subkategori</Text></View>
              <View style={styles.statItem}><Text style={styles.statNumber}>{bookmarkedArticles.size}</Text><Text style={styles.statLabel}>Favorit</Text></View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerImageContainer}><Text style={styles.footerImage}>🎭</Text></View>
        <Text style={styles.footerTitle}>Jagad Jawa</Text>
        <Text style={styles.footerDescription}>Melestarikan warisan budaya Jawa untuk generasi mendatang</Text>
        <View style={styles.footerStats}>
          <Text style={styles.footerStat}>📚 {articles.length}+ Materi</Text>
          <Text style={styles.footerStat}>👥 1.2K+ Pelajar</Text>
        </View>
        <Text style={styles.footerCopyright}>© 2024 Aksara Jawa App • v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { padding: 25, backgroundColor: '#16213e', borderBottomWidth: 1, borderBottomColor: '#0f3460' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  logoIcon: { fontSize: 32, color: '#e94560', marginRight: 12 },
  logoTextContainer: { flex: 1 },
  logoTitle: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', letterSpacing: 1 },
  logoSubtitle: { fontSize: 14, color: '#e94560', fontWeight: '500', marginTop: 2 },
  headerDescription: { fontSize: 13, color: '#8b9bb4', lineHeight: 18, textAlign: 'center' },
  scrollView: { flex: 1 },
  searchSection: { padding: 20, backgroundColor: '#16213e' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f3460', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12 },
  searchIcon: { fontSize: 16, color: '#e94560', marginRight: 10 },
  searchInput: { flex: 1, color: '#ffffff', fontSize: 16 },
  clearIcon: { fontSize: 16, color: '#8b9bb4', padding: 4 },
  quickActions: { flexDirection: 'row', padding: 15, backgroundColor: '#16213e', borderBottomWidth: 1, borderBottomColor: '#0f3460' },
  quickAction: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 10, backgroundColor: '#0f3460', marginHorizontal: 5 },
  quickActionIcon: { fontSize: 20, color: '#ffffff', marginBottom: 5 },
  quickActionText: { fontSize: 12, color: '#ffffff', fontWeight: '500' },
  searchResultsSection: { padding: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#e94560', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#16213e', letterSpacing: 0.5 },
  searchResultItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', padding: 15, borderRadius: 10, marginBottom: 8 },
  searchResultIcon: { fontSize: 16, color: '#e94560', marginRight: 12 },
  searchResultContent: { flex: 1 },
  searchResultTitle: { fontSize: 14, color: '#ffffff', fontWeight: '500', marginBottom: 4 },
  searchResultCategory: { fontSize: 12, color: '#8b9bb4' },
  bookmarkIcon: { fontSize: 18, color: '#8b9bb4', padding: 4 },
  bookmarked: { color: '#e94560' },
  categoryContainer: { borderBottomWidth: 1, borderBottomColor: '#0f3460' },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#16213e' },
  expandedCategoryHeader: { backgroundColor: '#0f3460', borderLeftWidth: 4, borderLeftColor: '#e94560' },
  categoryHeaderContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  categoryIcon: { fontSize: 18, color: '#e94560', marginRight: 12, width: 24 },
  categoryName: { fontSize: 15, fontWeight: '600', color: '#ffffff', flex: 1 },
  categoryCount: { backgroundColor: '#e94560', color: 'white', fontSize: 11, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  expandIcon: { fontSize: 12, color: '#8b9bb4', marginLeft: 10 },
  subcategoriesContainer: { backgroundColor: '#0f3460' },
  subcategoryContainer: { borderTopWidth: 1, borderTopColor: '#16213e' },
  subcategoryHeader: { paddingHorizontal: 30, paddingVertical: 14, backgroundColor: 'transparent' },
  subcategoryHeaderContent: { flexDirection: 'row', alignItems: 'center' },
  subcategoryIcon: { fontSize: 16, color: '#8b9bb4', marginRight: 10, width: 20 },
  subcategoryName: { fontSize: 14, color: '#ffffff', flex: 1 },
  subcategoryCount: { backgroundColor: '#8b9bb4', color: '#0f3460', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  statsSection: { padding: 20, backgroundColor: '#16213e', margin: 20, borderRadius: 15, borderWidth: 1, borderColor: '#0f3460' },
  statsTitle: { fontSize: 16, fontWeight: '700', color: '#e94560', marginBottom: 15, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statItem: { width: '48%', alignItems: 'center', padding: 12, backgroundColor: '#0f3460', borderRadius: 10, marginBottom: 10 },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#e94560' },
  statLabel: { fontSize: 11, color: '#8b9bb4', marginTop: 4, textAlign: 'center' },
  footer: { padding: 25, backgroundColor: '#16213e', borderTopWidth: 1, borderTopColor: '#0f3460', alignItems: 'center' },
  footerImageContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#e94560', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  footerImage: { fontSize: 28, color: '#ffffff' },
  footerTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 8 },
  footerDescription: { fontSize: 13, color: '#8b9bb4', textAlign: 'center', marginBottom: 15, lineHeight: 18 },
  footerStats: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
  footerStat: { fontSize: 12, color: '#e94560', marginHorizontal: 10, fontWeight: '500' },
  footerCopyright: { fontSize: 11, color: '#8b9bb4', textAlign: 'center' },
});

export default CustomDrawerContent;