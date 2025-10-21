// src/utils/navigationMigration.ts
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export const navigateToScreen = (
  navigation: NavigationProp<RootStackParamList>,
  screen: string,
  params?: any
) => {
  // Map old screen names to new ones for backward compatibility
  const screenMap: { [key: string]: keyof RootStackParamList } = {
    'CategoryScreen': 'Category',
    'CategoriesScreen': 'Categories',
    'BookmarkScreen': 'Bookmarks',
    'BookmarksScreen': 'Bookmarks',
    // Add other deprecated names here
  };

  const targetScreen = screenMap[screen] || screen;
  
  // @ts-ignore - we're handling the mapping
  navigation.navigate(targetScreen, params);
};

// Update your Drawer's handleItemPress function:
const handleItemPress = (screen: string, params?: any, itemId?: string) => {
  console.log('Navigating to:', screen, params);
  setActiveItem(itemId || null);
  
  nav.dispatch(DrawerActions.closeDrawer());
  
  // Use the migration helper instead of direct navigation
  if (screen === 'Home') {
    nav.navigate('Home');
  } else {
    navigateToScreen(nav, screen, params);
  }
};