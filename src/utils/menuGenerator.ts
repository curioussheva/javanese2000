// src/utils/menuGenerator.ts
import { categories } from '../data/articles';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  screen: string;
  params: any;
}

export interface MenuSection {
  title: string;
  icon: string;
  items: MenuItem[];
}

// Icon mapping for categories
const categoryIcons: { [key: string]: string } = {
  'Seputar Budaya Kebatinan Jawa': '🕉️',
  'Kebatinan dan Spiritual': '🌙',
  'Kebatinan & Spiritual Ketuhanan': '📜',
  'Spiritual & Kebatinan Keris Jawa': '⚔️',
  'Praktik Spiritual': '🪷',
  'Filsafat Kejawen': '📚'
};

// Item icons mapping
const itemIcons: { [key: string]: string } = {
  'sangkan paran': '🕉️',
  'memayu hayuning bawana': '🌍',
  'manunggaling kawula gusti': '⚡',
  'filosofi lainnya': '📚',
  'meditasi': '🪷',
  'semedi': '🧘',
  'tirakat': '🌙',
  'prihatin': '🌟',
  'lelaku spiritual': '🚶',
  'ritual harian': '🕯️',
  'serat wedhatama': '📜',
  'suluk': '✍️',
  'wejangan': '💭',
  'paribasan jawa': '💬',
  'primbon': '🔮',
  'ramalan': '🎯',
  'kalender spiritual': '📅',
  'weton': '🧮',
  'jurnal spiritual': '📓'
};

export const generateMenuStructure = (): { [key: string]: MenuSection } => {
  // Group articles by category
  const articlesByCategory = categories.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as { [key: string]: typeof categories });

  // Create menu structure from actual articles
  const menuStructure: { [key: string]: MenuSection } = {};

  Object.entries(articlesByCategory).forEach(([category, articles]) => {
    // Create a safe key from category name
    const categoryKey = category.replace(/[^a-zA-Z0-9]/g, '');
    
    // Get icon for category
    const categoryIcon = categoryIcons[category] || '📁';
    
    // Generate items from articles in this category
    const items: MenuItem[] = articles.map(article => {
      // Find appropriate icon for the item
      let itemIcon = '📄';
      const lowerTitle = article.title.toLowerCase();
      
      for (const [key, icon] of Object.entries(itemIcons)) {
        if (lowerTitle.includes(key)) {
          itemIcon = icon;
          break;
        }
      }

      return {
        id: article.id,
        label: article.title,
        icon: itemIcon,
        screen: 'Category',
        params: { 
          categoryId: article.categoryId || article.id,
          categoryName: category,
          articleTitle: article.title
        }
      };
    });

    menuStructure[categoryKey] = {
      title: category,
      icon: categoryIcon,
      items
    };
  });

  return menuStructure;
};

// Helper to get all unique categories from articles
export const getAllCategories = (): string[] => {
  return [...new Set(categories.map(article => article.category))];
};