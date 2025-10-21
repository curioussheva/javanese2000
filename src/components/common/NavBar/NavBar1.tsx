// src/components/common/Navbar/Navbar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

const colors = {
  primary: '#2C5530',
  secondary: '#8D6E63',
  background: '#F5F1E8',
  accent: '#A52A2A',
  text: '#3E2723',
  lightText: '#D7CCC8',
};

interface NavbarProps {
  title: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  rightComponent?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ 
  title, 
  showBackButton = true, 
  showMenuButton = true,
  rightComponent 
}) => {
  const navigation = useNavigation();

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <View style={styles.navbar}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {showMenuButton && (
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={handleMenuPress}
              accessibilityLabel="Buka menu"
            >
              <Text style={styles.icon}>☰</Text>
            </TouchableOpacity>
          )}
          {showBackButton && (
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={handleBackPress}
              accessibilityLabel="Kembali"
            >
              <Text style={styles.icon}>←</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Center Section - Title */}
        <View style={styles.centerSection}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {rightComponent || <View style={styles.placeholder} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  icon: {
    fontSize: 20,
    color: colors.lightText,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.lightText,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
});

export default Navbar1;