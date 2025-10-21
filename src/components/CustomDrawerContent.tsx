import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { DrawerContentComponentProps, DrawerActions } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  // Navigasi dan tutup drawer otomatis
  const handleNavigate = (screen: string, params?: any) => {
    navigation.dispatch(DrawerActions.closeDrawer());
    setTimeout(() => {
      navigation.navigate(screen as never, params);
    }, 200);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>JAVANESE2000</Text>
        <Text style={styles.subtitle}>Filosofi Nusantara</Text>
      </View>

      {/* Isi Drawer */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.item} onPress={() => handleNavigate('Home')}>
          <Ionicons name="home-outline" size={22} color="#e94560" />
          <Text style={styles.label}>Halaman Utama</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => handleNavigate('Categories')}>
          <MaterialIcons name="category" size={22} color="#e94560" />
          <Text style={styles.label}>Kategori</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => handleNavigate('Articles')}>
          <Ionicons name="book-outline" size={22} color="#e94560" />
          <Text style={styles.label}>Semua Artikel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => handleNavigate('Bookmarks')}>
          <Ionicons name="star-outline" size={22} color="#e94560" />
          <Text style={styles.label}>Favorit Saya</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            handleNavigate('Category', {
              categoryId: 'sangkan-paran',
              categoryName: 'Sangkan Paraning Dumadi',
            })
          }
        >
          <Ionicons name="leaf-outline" size={22} color="#e94560" />
          <Text style={styles.label}>Sangkan Paraning Dumadi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            handleNavigate('Category', {
              categoryId: 'pamor-jawa',
              categoryName: 'Pamor Jawa & Filsafat',
            })
          }
        >
          <Ionicons name="flame-outline" size={22} color="#e94560" />
          <Text style={styles.label}>Pamor Jawa & Filsafat</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 CuriousSheva</Text>
      </View>
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    color: '#e94560',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: '#8b9bb4',
    marginTop: 4,
  },
  scroll: {
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  label: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#1e293b',
    marginVertical: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#1e293b',
    paddingVertical: 15,
    alignItems: 'center',
  },
  footerText: {
    color: '#64748b',
    fontSize: 12,
  },
});