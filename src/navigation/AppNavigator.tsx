// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ArticleListScreen from '../screens/ArticleListScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { RootDrawerParamList, ArticleStackParamList, CategoryStackParamList } from '../types';

const Drawer = createDrawerNavigator<RootDrawerParamList>();
const Stack = createStackNavigator<ArticleStackParamList>();
const CategoryStack = createStackNavigator<CategoryStackParamList>();

const ArticleStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#16213e' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontFamily: 'System' },
        cardStyle: { backgroundColor: '#1a1a2e' },
      }}
    >
      <Stack.Screen 
        name="ArticleList" 
        component={ArticleListScreen}
        options={({ route }) => ({ 
          title: route.params?.categoryId ? 'Daftar Artikel' : 'Semua Artikel'
        })}
      />
      <Stack.Screen 
        name="ArticleDetail" 
        component={ArticleDetailScreen}
        options={({ route }) => ({ title: 'Detail Artikel' })}
      />
    </Stack.Navigator>
  );
};

const CategoryStackNavigator = () => {
  return (
    <CategoryStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#16213e' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontFamily: 'System' },
        cardStyle: { backgroundColor: '#1a1a2e' },
      }}
    >
      <CategoryStack.Screen 
        name="CategoriesMain" 
        component={CategoriesScreen}
        options={{ title: 'Kategori' }}
      />
      <CategoryStack.Screen 
        name="CategoryArticles" 
        component={ArticleListScreen}
        options={({ route }) => ({ title: 'Daftar Artikel' })}
      />
    </CategoryStack.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: '#16213e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontFamily: 'System' },
          drawerStyle: { width: 340, backgroundColor: '#1a1a2e' },
          drawerLabelStyle: { color: '#ffffff', fontFamily: 'System' },
          drawerActiveBackgroundColor: '#e94560',
          drawerActiveTintColor: '#ffffff',
          drawerInactiveTintColor: '#8b9bb4',
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Halaman Utama', drawerLabel: '🏠 Halaman Utama' }} />
        <Drawer.Screen name="Categories" component={CategoryStackNavigator} options={{ title: 'Kategori', drawerLabel: '📂 Kategori', headerShown: false }} />
        <Drawer.Screen name="Articles" component={ArticleStackNavigator} options={{ title: 'Artikel', drawerLabel: '📚 Semua Artikel', headerShown: false }} />
        <Drawer.Screen name="Bookmarks" component={BookmarksScreen} options={{ title: 'Artikel Favorit', drawerLabel: '⭐ Favorit' }} />
        <Drawer.Screen name="ArticleDetail" component={ArticleDetailScreen} options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="Category" component={ArticleListScreen} options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="AllArticles" component={ArticleListScreen} options={{ drawerItemStyle: { display: 'none' } }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;