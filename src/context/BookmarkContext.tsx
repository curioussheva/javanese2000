// src/context/BookmarkContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
}

interface BookmarkContextProps {
  bookmarks: Article[];
  addBookmark: (article: Article) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextProps>({
  bookmarks: [],
  addBookmark: () => {},
  removeBookmark: () => {},
  isBookmarked: () => false,
});

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const STORAGE_KEY = '@bookmarked_articles';

  // 🔁 Load dari AsyncStorage saat pertama kali app dibuka
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setBookmarks(JSON.parse(stored));
      } catch (error) {
        console.error('Gagal memuat bookmark dari storage:', error);
      }
    };
    loadBookmarks();
  }, []);

  // 💾 Simpan ke AsyncStorage setiap kali bookmarks berubah
  useEffect(() => {
    const saveBookmarks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      } catch (error) {
        console.error('Gagal menyimpan bookmark:', error);
      }
    };
    saveBookmarks();
  }, [bookmarks]);

  const addBookmark = (article: Article) => {
    if (!isBookmarked(article.id)) {
      setBookmarks((prev) => [...prev, article]);
      Alert.alert('Disimpan', `"${article.title}" ditambahkan ke bookmark.`);
    }
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((a) => a.id !== id));
  };

  const isBookmarked = (id: string) => bookmarks.some((a) => a.id === id);

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = () => useContext(BookmarkContext);