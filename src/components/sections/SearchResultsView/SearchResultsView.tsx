import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { useBookmark } from '../../../context/BookmarkContext';

interface SearchResultsViewProps {
  results: any[];
  query: string;
  onArticlePress: (article: any) => void;
}

const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  results,
  query,
  onArticlePress,
}) => {
  const { width } = useWindowDimensions();
  const { isBookmarked } = useBookmark();

  if (query.trim() === '') return null;

  const renderItem = ({ item }: { item: any }) => {
    const cleanedExcerpt =
      item.content?.length > 0
        ? item.content
        : '<p><i>(Tidak ada cuplikan konten)</i></p>';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onArticlePress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.title}</Text>
          {isBookmarked(item.id) && <Text style={styles.bookmarkBadge}>★</Text>}
        </View>

        <Text style={styles.meta}>📂 {item.category}</Text>

        {/* 👉 Render HTML di cuplikan konten */}
        <RenderHTML
          contentWidth={width}
          source={{ html: cleanedExcerpt.slice(0, 300) + '...' }}
          tagsStyles={{
            p: { fontSize: 14, color: '#555', lineHeight: 20 },
            h2: { fontSize: 16, fontWeight: '700', color: '#2C5530' },
            strong: { fontWeight: 'bold' },
            u: { textDecorationLine: 'underline' },
          }}
        />

        <View style={styles.footer}>
          <Text style={styles.wordCount}>📝 {item.wordCount || 0} kata</Text>
          {isBookmarked(item.id) && <Text style={styles.bookmarkedText}>Disimpan</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Hasil pencarian untuk: "{query}"</Text>
        <Text style={styles.resultCount}>{results.length} hasil ditemukan</Text>
      </View>

      {results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id || index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>Tidak ada hasil ditemukan</Text>
          <Text style={styles.emptySubtext}>Coba dengan kata kunci yang berbeda</Text>
        </View>
      )}
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  headerContainer: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C5530',
    marginBottom: 4,
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2C5530',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  bookmarkBadge: {
    fontSize: 16,
    color: '#FFD700',
    marginTop: 2,
  },
  meta: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordCount: {
    fontSize: 12,
    color: '#888',
  },
  bookmarkedText: {
    fontSize: 12,
    color: '#2C5530',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default SearchResultsView;