// src/types/index.ts
import { DrawerScreenProps as BaseDrawerScreenProps } from '@react-navigation/drawer';
import { StackScreenProps as BaseStackScreenProps } from '@react-navigation/stack';

export type Article = {
  id: string;
  title: string;
  content: string;
  category: string;
  subcategory?: string;
  difficulty?: 'pemula' | 'menengah' | 'mahir';
  estimatedReadTime?: number;
  theme?: string;
};

export type Category = {
  id: string;
  name: string;
  icon?: string;
  subcategories?: Subcategory[];
};

export type Subcategory = {
  id: string;
  name: string;
  articleCount: number;
  icon?: string;
};

export type RootDrawerParamList = {
  Home: undefined;
  Categories: undefined;
  Articles: undefined;
  Bookmarks: undefined;
  ArticleDetail: { articleId: string };
  Category: { categoryId: string; subcategoryId?: string };
  AllArticles: undefined;
};

export type ArticleStackParamList = {
  ArticleList: { categoryId?: string; subcategoryId?: string };
  ArticleDetail: { articleId: string };
};

export type CategoryStackParamList = {
  CategoriesMain: undefined;
  CategoryArticles: { categoryId: string; subcategoryId?: string };
};

export type MainDrawerScreenProps<T extends keyof RootDrawerParamList> = 
  BaseDrawerScreenProps<RootDrawerParamList, T>;

export type ArticleStackScreenProps<T extends keyof ArticleStackParamList> = 
  BaseStackScreenProps<ArticleStackParamList, T>;

export type CategoryStackScreenProps<T extends keyof CategoryStackParamList> = 
  BaseStackScreenProps<CategoryStackParamList, T>;