// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MainDrawerScreenProps } from '../types';
import { categories, articles } from '../data/articles';

type Props = MainDrawerScreenProps<'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ꦲꦭꦩꦤ꧀ꦲꦸꦠꦩ</Text>
      <Text style={styles.subtitle}>Aplikasi Pembelajaran Bahasa Jawa</Text>
      
      <View style={styles.stats}>
        <View style={styles.stat}><Text style={styles.statNumber}>{articles.length}+</Text><Text style={styles.statLabel}>Artikel</Text></View>
        <View style={styles.stat}><Text style={styles.statNumber}>{categories.length}+</Text><Text style={styles.statLabel}>Kategori</Text></View>
        <View style={styles.stat}><Text style={styles.statNumber}>{categories.reduce((total, cat) => total + (cat.subcategories?.length || 0), 0)}+</Text><Text style={styles.statLabel}>Subkategori</Text></View>
      </View>

      <Text style={styles.sectionTitle}>Kategori Pembelajaran</Text>
      
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryCard}
          onPress={() => navigation.navigate('Categories', { categoryId: category.id })}
        >
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.articleCount}>
            {category.subcategories?.reduce((total, sub) => total + sub.articleCount, 0)} artikel
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.categoryCard, { backgroundColor: '#e8f4fd' }]}
        onPress={() => navigation.navigate('Articles')}
      >
        <Text style={[styles.categoryName, { color: '#1976d2' }]}>Semua Artikel</Text>
        <Text style={styles.articleCount}>Lihat semua artikel tersedia</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1a1a2e' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#ffffff', marginBottom: 10 },
  subtitle: { fontSize: 18, textAlign: 'center', color: '#8b9bb4', marginBottom: 30 },
  stats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30 },
  stat: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#e94560' },
  statLabel: { fontSize: 12, color: '#8b9bb4', marginTop: 5 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 15 },
  categoryCard: { backgroundColor: '#16213e', padding: 20, borderRadius: 10, marginBottom: 15 },
  categoryName: { fontSize: 18, fontWeight: '600', color: '#ffffff', marginBottom: 5 },
  articleCount: { fontSize: 14, color: '#8b9bb4' },
});

export default HomeScreen;