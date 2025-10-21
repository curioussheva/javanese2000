// src/utils/bookmarkStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from '../data/articles';

const BOOKMARK_KEY = 'BOOKMARKS_V1';

// Ambil semua bookmark dari storage
export const getBookmarks = async (): Promise<Article[]> => {
  try {
    const data = await AsyncStorage.getItem(BOOKMARK_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Gagal ambil bookmark:', e);
    return [];
  }
};

// Simpan semua bookmark ke storage
export const saveBookmarks = async (articles: Article[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(BOOKMARK_KEY, JSON.stringify(articles));
  } catch (e) {
    console.error('Gagal simpan bookmark:', e);
  }
};