// src/screens/DebugScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { clearAllBookmarks, getBookmarks, getBookmarksCount } from '../utils/bookmarks';
import Navbar from '../components/common/Navbar/Navbar';

const DebugScreen: React.FC = () => {
  const [bookmarks, setBookmarks] = React.useState<any[]>([]);
  const [count, setCount] = React.useState(0);

  const loadData = async () => {
    const [bookmarksData, countData] = await Promise.all([
      getBookmarks(),
      getBookmarksCount()
    ]);
    setBookmarks(bookmarksData);
    setCount(countData);
  };

  const handleClearBookmarks = async () => {
    await clearAllBookmarks();
    await loadData();
  };

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <Navbar title="Debug Tools" />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Bookmarks Debug</Text>
        
        <View style={styles.stats}>
          <Text style={styles.statText}>Total Bookmarks: {count}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={loadData}>
          <Text style={styles.buttonText}>Refresh Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClearBookmarks}>
          <Text style={styles.buttonText}>Clear All Bookmarks</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Current Bookmarks:</Text>
        {bookmarks.map((bookmark, index) => (
          <View key={bookmark.id} style={styles.bookmarkItem}>
            <Text style={styles.bookmarkTitle}>{bookmark.title}</Text>
            <Text style={styles.bookmarkDate}>{new Date(bookmark.dateSaved).toLocaleDateString()}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2C5530',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#2C5530',
  },
  stats: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  statText: {
    fontSize: 16,
    color: '#3E2723',
  },
  button: {
    backgroundColor: '#2C5530',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    backgroundColor: '#A52A2A',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bookmarkItem: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookmarkTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3E2723',
    marginBottom: 4,
  },
  bookmarkDate: {
    fontSize: 12,
    color: '#8D6E63',
  },
});

export default DebugScreen;