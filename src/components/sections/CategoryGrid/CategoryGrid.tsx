import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { articles } from '../../../data/articles'; // ✅ sesuaikan path jika berbeda

interface CategoryGridProps {
  onCategoryPress: (categoryId: string, categoryName: string) => void;
}


const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategoryPress }) => {
  // Ambil daftar kategori unik dari artikel
  const categories = useMemo(() => {
    const unique = new Map<string, string>();

    articles.forEach((article) => {
      if (article.category) {
        unique.set(article.category, article.category);
      }
    });

    // Daftar warna dan ikon default (berulang otomatis)
    const colors = ['#2C5530', '#4A6572', '#8D6E63', '#6D4C41', '#3797A4', '#C06C84'];
    const icons = ['🏛️', '🕉️', '📚', '📜', '🎎', '🎨'];

    return Array.from(unique.values()).map((cat, index) => ({
      id: cat.toLowerCase().replace(/\s+/g, '-'),
      name: cat,
      color: colors[index % colors.length],
      icon: icons[index % icons.length],
    }));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📂 Kategori Artikel</Text>
      <Text style={styles.subtitle}>Jelajahi berdasarkan topik</Text>

      <View style={styles.grid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryCard, { backgroundColor: category.color }]}
            onPress={() => onCategoryPress(category.id, category.name)}
            activeOpacity={0.85}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2C5530',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 26,
    marginBottom: 8,
  },
  categoryName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CategoryGrid;