// src/screens/CategoriesScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CategoryStackScreenProps } from '../types';
import { categories } from '../data/articles';

type Props = CategoryStackScreenProps<'CategoriesMain'>;

const CategoriesScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Kategori Pembelajaran</Text>
      <Text style={styles.subtitle}>Pilih kategori untuk melihat artikel terkait</Text>
      
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryCard}
          onPress={() => navigation.navigate('CategoryArticles', { categoryId: category.id })}
        >
          <Text style={styles.categoryIcon}>{category.icon || '📁'}</Text>
          <View style={styles.categoryContent}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryCount}>
              {category.subcategories?.length} subkategori • {category.subcategories?.reduce((total, sub) => total + sub.articleCount, 0)} artikel
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1a1a2e' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#8b9bb4', textAlign: 'center', marginBottom: 30 },
  categoryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', padding: 20, borderRadius: 12, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#e94560' },
  categoryIcon: { fontSize: 24, marginRight: 15 },
  categoryContent: { flex: 1 },
  categoryName: { fontSize: 18, fontWeight: '600', color: '#ffffff', marginBottom: 5 },
  categoryCount: { fontSize: 14, color: '#8b9bb4' },
  arrow: { fontSize: 18, color: '#e94560', fontWeight: 'bold' },
});

export default CategoriesScreen;