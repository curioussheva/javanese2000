// src/utils/bookmarks.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Bookmark {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  excerpt: string;
  content: string;
  readTime: number;
  icon?: string;
  dateSaved: string; // Changed to string for better serialization
}

const BOOKMARKS_KEY = 'javanese2000_bookmarks';

// Load bookmarks from storage
export const loadBookmarks = async (): Promise<Bookmark[]> => {
  try {
    const stored = await AsyncStorage.getItem(BOOKMARKS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading bookmarks:', error);
  }
  return [];
};

// Save bookmarks to storage
export const saveBookmarks = async (bookmarks: Bookmark[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Error saving bookmarks:', error);
  }
};

// Get all bookmarks
export const getBookmarks = async (): Promise<Bookmark[]> => {
  return await loadBookmarks();
};

// Add bookmark
export const addBookmark = async (article: Omit<Bookmark, 'dateSaved'>): Promise<boolean> => {
  try {
    const bookmarks = await loadBookmarks();
    const existingBookmark = bookmarks.find(b => b.id === article.id);
    
    if (!existingBookmark) {
      const newBookmark: Bookmark = {
        ...article,
        dateSaved: new Date().toISOString(), // Use ISO string for better serialization
      };
      bookmarks.unshift(newBookmark);
      await saveBookmarks(bookmarks);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return false;
  }
};

// Remove bookmark
export const removeBookmark = async (id: string): Promise<boolean> => {
  try {
    const bookmarks = await loadBookmarks();
    const filteredBookmarks = bookmarks.filter(b => b.id !== id);
    await saveBookmarks(filteredBookmarks);
    return true;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return false;
  }
};

// Check if article is bookmarked
export const isBookmarked = async (id: string): Promise<boolean> => {
  try {
    const bookmarks = await loadBookmarks();
    return bookmarks.some(b => b.id === id);
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return false;
  }
};

// Get bookmarks count
export const getBookmarksCount = async (): Promise<number> => {
  const bookmarks = await loadBookmarks();
  return bookmarks.length;
};

// Clear all bookmarks (useful for debugging)
export const clearAllBookmarks = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(BOOKMARKS_KEY);
  } catch (error) {
    console.error('Error clearing bookmarks:', error);
  }
};