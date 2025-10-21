// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView,
  ScrollView 
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerActions } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import NavBar from '../components/common/NavBar/NavBar';
import HeroSection from '../components/sections/HeroSection/HeroSection';
import CategoryGrid from '../components/sections/CategoryGrid/CategoryGrid';
import SearchResultsView from '../components/sections/SearchResultsView/SearchResultsView';
import { articles } from '../data/articles';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

// Di HomeScreen.tsx
const handleSubcategoryPress = (category: string, subcategory: string) => {
  const subcategoryArticles = articles.filter(article => 
    article.category === category && article.subcategory === subcategory
  );
  
  if (subcategoryArticles.length > 0) {
    setSearchQuery(`${category} - ${subcategory}`);
    setSearchResults(subcategoryArticles);
    setIsSearching(true);
  }
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleSearch = (query: string): void => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const lowerQuery = query.toLowerCase();

    const results = (articles || []).filter(article =>
      article.title?.toLowerCase().includes(lowerQuery) ||
      article.content?.toLowerCase().includes(lowerQuery) ||
      article.category?.toLowerCase().includes(lowerQuery)
    );

    setSearchResults(results);
  };

  const handlePrint = (): void => {
    if (searchResults.length > 0) {
      alert(`Print ${searchResults.length} hasil pencarian untuk: "${searchQuery}"`);
    } else if (searchQuery) {
      alert(`Tidak ada hasil untuk: "${searchQuery}"`);
    } else {
      alert('Fitur Print/Export akan datang!');
    }
  };

  const handleMenuClick = (): void => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleArticlePress = (article: any): void => {
    navigation.navigate('ArticleDetail', { 
      articleId: article.id,
      articleTitle: article.title 
    });
  };

  const handleCategoryPress = (categoryId: string, categoryName: string): void => {
    // Jika Anda memiliki screen Category, uncomment line berikut
     navigation.navigate('Category', { categoryId, categoryName });
    
    // Untuk sementara, tampilkan alert
   // alert(`Kategori: ${categoryName} (ID: ${categoryId})`);
  };

  const handleExplorePress = (): void => {
    // Navigate ke kategori tertentu atau tampilkan semua kategori
    handleCategoryPress('all', 'Semua Kategori');
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavBar 
        onMenuClick={handleMenuClick}
        onSearch={handleSearch}
        onPrint={handlePrint}
      />
      
      <View style={styles.mainContent}>
        {isSearching || searchQuery ? (
          <SearchResultsView 
            results={searchResults}
            query={searchQuery}
            onArticlePress={handleArticlePress}
          />
        ) : (
          <ScrollView style={styles.homeContent} showsVerticalScrollIndicator={false}>
            <View style={styles.heroContainer}>
              <HeroSection onExplorePress={handleExplorePress} />
            </View>
            
            <View style={styles.categoryContainer}>
              <CategoryGrid onCategoryPress={handleCategoryPress} />
            </View>
          </ScrollView>
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
  mainContent: {
    flex: 1,
  },
  homeContent: {
    flex: 1,
  },
  heroContainer: {
    minHeight: 450,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});

export default HomeScreen;