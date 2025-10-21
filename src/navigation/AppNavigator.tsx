// src/navigation/AppNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import HomeScreen from '../screens/HomeScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import CategoryScreen from '../screens/CategoryScreen';

// Custom Drawer
import DrawerContent from '../components/common/Drawer/Drawer';

// --- Stack untuk halaman dalam Home
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2C5530' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerBackTitle: 'Kembali',
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          headerShown: false,
          title: 'Beranda',
        }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={({ route }) => ({
          title: 'Detail Artikel',
          headerTitle: route.params?.articleTitle
            ? route.params.articleTitle.length > 20
              ? route.params.articleTitle.substring(0, 20) + '...'
              : route.params.articleTitle
            : 'Detail Artikel',
        })}
      />
      {/* Add Category screen to HomeStack for navigation */}
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={({ route }) => ({
          title: route.params?.title || 'Kategori',
        })}
      />
    </Stack.Navigator>
  );
}

// --- Stack untuk Bookmarks
function BookmarksStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2C5530' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="BookmarksMain"
        component={BookmarksScreen}
        options={{
          title: 'Artikel Disimpan',
        }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={({ route }) => ({
          title: 'Detail Artikel',
          headerTitle: route.params?.articleTitle
            ? route.params.articleTitle.length > 20
              ? route.params.articleTitle.substring(0, 20) + '...'
              : route.params.articleTitle
            : 'Detail Artikel',
        })}
      />
    </Stack.Navigator>
  );
}

// --- Stack untuk Categories
function CategoryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2C5530' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="CategoryMain"
        component={CategoryScreen}
        options={({ route }) => ({
          title: route.params?.title || 'Kategori',
        })}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={({ route }) => ({
          title: 'Detail Artikel',
          headerTitle: route.params?.articleTitle
            ? route.params.articleTitle.length > 20
              ? route.params.articleTitle.substring(0, 20) + '...'
              : route.params.articleTitle
            : 'Detail Artikel',
        })}
      />
    </Stack.Navigator>
  );
}

// --- Drawer utama
const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerPosition: 'left',
        drawerActiveBackgroundColor: '#2C5530',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{
          drawerLabel: 'Beranda',
        }}
      />
      <Drawer.Screen
        name="Bookmarks"
        component={BookmarksStack}
        options={{
          drawerLabel: 'Artikel Disimpan',
        }}
      />
      <Drawer.Screen
        name="Category"
        component={CategoryStack}
        options={{
          drawerLabel: () => null, // Hide from drawer menu
          title: 'Kategori',
          swipeEnabled: false, // Prevent swipe gesture to open
        }}
      />
    </Drawer.Navigator>
  );
}