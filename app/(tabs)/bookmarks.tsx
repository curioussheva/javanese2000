// src/screens/BookmarksScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MainDrawerScreenProps } from '../types';

type Props = MainDrawerScreenProps<'Bookmarks'>;

const BookmarksScreen: React.FC<Props> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Artikel Favorit</Text>
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🔖</Text>
        <Text style={styles.emptyTitle}>Belum ada favorit</Text>
        <Text style={styles.emptyDescription}>
          Tap ikon bintang pada artikel untuk menambahkannya ke favorit
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1a1a2e' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 20, textAlign: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 20 },
  emptyTitle: { fontSize: 18, color: '#ffffff', marginBottom: 10, textAlign: 'center' },
  emptyDescription: { fontSize: 14, color: '#8b9bb4', textAlign: 'center', lineHeight: 20 },
});

export default BookmarksScreen;