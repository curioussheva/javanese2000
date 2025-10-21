import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  HomeMain: undefined;
  BookmarksMain: undefined;
  ArticleDetail: { 
    articleId: string;
    articleTitle?: string;
  };
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeMain'>;
export type BookmarksScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookmarksMain'>;
export type ArticleDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ArticleDetail'>;