import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { BookmarkProvider } from './src/context/BookmarkContext';
import AppNavigator from './src/navigation/AppNavigator';


export default function App() {
  return (
    <BookmarkProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </BookmarkProvider>
  );
}