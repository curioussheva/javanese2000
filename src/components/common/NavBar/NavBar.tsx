// src/components/common/NavBar/NavBar.tsx

import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, StatusBar, Platform, Image } from 'react-native'; 
// NOTE: You must have this image file at the specified path for this to work.
 import PrintIcon from '../../../assets/images/print-icon.png'; 

interface NavBarProps {
  onMenuClick: () => void;
  onSearch: (query: string) => void;
  onPrint: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onMenuClick, onSearch, onPrint }) => {
  return (
    <View style={styles.container}>
      {/* Status Bar Space */}
      <StatusBar backgroundColor="#2C5530" barStyle="light-content" /> 
      
      <View style={styles.navbar}>
        {/* Menu Button - Kiri */}
        <TouchableOpacity onPress={onMenuClick} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        
        {/* Search Bar - Tengah */}
        <TextInput
          style={styles.searchInput}
          placeholder="Telusuri artikel..."
          onChangeText={onSearch}
          placeholderTextColor="#8D6E63"
        />
        
        {/* Print Button - Kanan */}
        <TouchableOpacity onPress={onPrint} style={styles.printButton}>
          { <Image source={require('../../../assets/images/print-icon.png')} style={styles.printImage} /> }
          {/* Using the text icon from the original code for simplicity if no image is provided */}

        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#192B39',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 60,
  },
  menuButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  menuIcon: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    fontSize: 13,
    color: '#2C2C2C',
alignItems:'center',
  },
  printButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  printIcon: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  /* If you use the Image component, you would need this style */
  
  printImage: {
    width: 24, 
    height: 24,
    tintColor: 'white',
  },
  
});

export default NavBar;
