import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  Easing,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { articles } from '../../../data/articles';
const GalleryImages = [
  require('../../../assets/images/Keris Jawa-24.jpg'),
  require('../../../assets/images/Tombak-3.jpeg'),
  require('../../../assets/images/Jin Kunti 1.jpg'),
  require('../../../assets/images/Batu Biduri Bulan-4.jpg'),
  require('../../../assets/images/Mustika Merah Delima 1-1.jpg'),
];


// --- Aktifkan animasi layout di Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Helper: urut artikel berdasarkan sourceFolder
const sortArticlesBySource = (articleList: any[]) => {
  return articleList.sort((a, b) => {
    const aFolder = a.sourceFolder || '';
    const bFolder = b.sourceFolder || '';
    const numA = parseInt(aFolder.match(/^\d+/)?.[0] || '999', 10);
    const numB = parseInt(bFolder.match(/^\d+/)?.[0] || '999', 10);
    return numA - numB;
  });
};

const Drawer: React.FC<DrawerContentComponentProps> = (props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);

  // Fade animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleCategoryToggle = (category: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCategory((prev) => (prev === category ? null : category));
    setExpandedSubCategory(null);
  };

  const handleSubCategoryToggle = (subcategory: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSubCategory((prev) => (prev === subcategory ? null : subcategory));
  };

  const handleArticlePress = (article: any) => {
    props.navigation.closeDrawer();
    navigation.navigate('ArticleDetail', {
      articleId: article.id,
      articleTitle: article.title,
    });
  };

  // Ambil kategori unik
  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image source={require('../../../assets/images/LOGO1.jpg')} style={styles.logo} resizeMode="cover" />
        <Text style={styles.appTitle}>Javanese2000</Text>
        <Text style={styles.appSubtitle}>Filosofi Kebatinan, Spiritual, dan Kegaiban.</Text>
      </View>
  <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        

      {/* === NAV UTAMA === */}
      <View style={styles.navSection}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.menuItem}
        >
         <Ionicons name="home-outline" size={20} color="#2C5530" />
          <Text style={styles.menuText1}>Welcome to Javanese2000</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Bookmarks')}
          style={styles.menuItem}
        >
        <Ionicons name="bookmark-outline" size={20} color="#2C5530" />
          <Text style={styles.menuText1}>Bookmarks</Text>
        </TouchableOpacity>
      </View>
      
     <View style={styles.divider} />
     
      {/* === KATEGORI + SUBKATEGORI === */}
      <View>
        <Text style={styles.sectionTitle}>Kategori</Text>
        {categories.map((category) => {
          const categoryArticles = articles.filter((a) => a.category === category);
          const subcategories = Array.from(
            new Set(categoryArticles.map((a) => a.subcategory).filter(Boolean))
          );

          // Artikel utama (tanpa subkategori)
          const mainArticles = categoryArticles.filter((a) => !a.subcategory);

          return (
          
             <View key={category} style={styles.categoryBlock}>
              {/* === KATEGORI HEADER === */}
              <TouchableOpacity
                onPress={() => handleCategoryToggle(category)}
                style={styles.categoryHeader}
              >   
                <Ionicons
                  name={expandedCategory === category ?'chevron-down' : 'chevron-forward'}
                      size={18}
                      color="#2C5530"
                     />
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>

              {/* === ISI KATEGORI === */}
              {expandedCategory === category && (
                <View style={styles.subContainer}>
                  {/* Artikel di kategori utama */}
                  {mainArticles.length > 0 && (
                    <View style={styles.articleList}>
                      {sortArticlesBySource(mainArticles).map((article) => (
                        <TouchableOpacity
                          key={article.id}
                          onPress={() => handleArticlePress(article)}
                          style={styles.articleItem}
                        >
                          <Text style={styles.articleText}>{article.title}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Subkategori */}
                  {subcategories.map((sub) => {
                    const subArticles = categoryArticles.filter((a) => a.subcategory === sub);
                    return (
                      <View key={sub}>
                        <TouchableOpacity
                          onPress={() => handleSubCategoryToggle(sub)}
                          style={styles.subCategoryHeader}
                        >
                          <Ionicons
                            name={
                              expandedSubCategory === sub ? 'chevron-down' : 'chevron-forward'
                            }
                            size={16}
                            color="#ccc"
                            style={{ marginRight: 6 }}
                          />
                          <Text style={styles.subCategoryTitle}>
                             {sub} ({subArticles.length})
                          </Text>
                        </TouchableOpacity>

                        {expandedSubCategory === sub && (
                          <View style={styles.articleList}>
                            {sortArticlesBySource(subArticles).map((article) => (
                              <TouchableOpacity
                                key={article.id}
                                onPress={() => handleArticlePress(article)}
                                style={styles.articleItem}
                              >
                                <Text style={styles.articleText}>{article.title}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </View>

        {/* GALLERY */}
        <View style={styles.galleryContainer}>
          <Text style={styles.galleryTitle}>Galeri</Text>
          <View>
            {GalleryImages.map((img, idx) => (
              <View key={idx} style={styles.imageWrapper}>
                <Image source={img} style={styles.galleryImage} resizeMode="cover" />
                <View style={styles.imageOverlay} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Image
          source={require('../../../assets/images/curioussheva.png')}
          style={styles.footerLogo}
          resizeMode="contain"
        />
        <Text style={styles.footerText}>© 2025 CuriousSheva</Text>
      </View>
    </Animated.View>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 24, borderBottomWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#2C5530',
  },
  logo: { width: 150, height: 90, marginBottom: 8, marginTop: 10, borderRadius: 8 },
  appTitle: { fontSize: 21, fontWeight: '700', color: '#fff' },
  appSubtitle: { fontSize: 14, color: '#fff', textAlign: 'center', marginTop: 4 },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 7, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#333', marginTop: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 5, paddingVertical: 8 },
  menuText1: { fontSize: 16, marginLeft: 8, color: '#222', fontWeight: '600', flex: 1 },
  divider: { height: 1, backgroundColor: '#ccc', marginVertical: 5, opacity: 0.4 },
  categoryBlock: { marginBottom: 16, },
  categoryHeader: {
    flexDirection: 'row', alignItems: 'left', flex: 1, 
    marginVertical: 1, paddingVertical: 2, paddingHorizontal: 8, backgroundColor: '#f8f9fa', borderRadius: 2,
  },
  categoryHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  categoryText: { fontSize: 15, marginLeft: 6, color: '#222', fontWeight: '500' },
  categoryCount: { fontSize: 12, color: '#666', fontWeight: '500' },
  subcategoriesContainer: { marginLeft: 10, marginTop: 8 },
  subcategoryBlock: { marginBottom: 8 },
  subcategoryHeader: {
    flexDirection: 'row', alignItems: 'center', flex: 1, 
    marginVertical: 1, paddingVertical: 2, paddingHorizontal: 8, backgroundColor: '#f8f9fa', borderRadius: 2,
  },
  subcategoryHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  subcategoryHeaderText: { fontSize: 14, color: '#444', marginLeft: 4, fontWeight: '500' },
  subcategoryCount: { fontSize: 11, color: '#666' },
  articlesContainer: { marginLeft: 20, marginTop: 4 },
  articleItem: {
    paddingVertical: 6, paddingHorizontal: 12, marginVertical: 2,
    backgroundColor: 'rgba(44,85,48,0.03)', borderRadius: 4,
  },
  articleText: { fontSize: 13, color: '#555', lineHeight: 16 },
  galleryContainer: {
    paddingHorizontal: 16, paddingVertical: 10, marginTop: 10,
    backgroundColor: 'rgba(44,85,48,0.05)', borderRadius: 8, marginHorizontal: 10,
  },
  galleryTitle: {
    fontSize: 14, fontWeight: '600', color: '#2C5530', marginBottom: 10,
    textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5,
  },
  imageWrapper: {
    position: 'relative', marginBottom: 10, borderRadius: 8, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  galleryImage: { width: 230, height: 210, borderRadius: 8 },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(44,85,48,0.03)' },
  footer: {
    paddingVertical: 9, alignItems: 'center', borderTopWidth: 1,
    borderColor: '#E0E0E0', backgroundColor: '#F2F2F2',
  },
  footerLogo: { width: '100%', height: 60, borderRadius: 12, marginBottom: 6 },
  footerText: { fontSize: 12, color: '#666' },
});

export default Drawer;