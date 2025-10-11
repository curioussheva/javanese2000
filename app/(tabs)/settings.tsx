import React, { useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet, ScrollView, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "APP_SETTINGS";

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAds, setShowAds] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        setIsDarkMode(parsed.isDarkMode ?? false);
        setShowAds(parsed.showAds ?? true);
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
  };

  const saveSettings = async (newSettings: any) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  };

  const toggleTheme = () => {
    const updated = { isDarkMode: !isDarkMode, showAds };
    setIsDarkMode(!isDarkMode);
    saveSettings(updated);
  };

  const toggleAds = () => {
    const updated = { isDarkMode, showAds: !showAds };
    setShowAds(!showAds);
    saveSettings(updated);
  };

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.header, isDarkMode && styles.darkText]}>⚙️ Settings</Text>

      <View style={styles.item}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>🌙 Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      <View style={styles.item}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>💰 Show Ads</Text>
        <Switch value={showAds} onValueChange={toggleAds} />
      </View>

      <View style={styles.aboutSection}>
        <Text style={[styles.aboutTitle, isDarkMode && styles.darkText]}>🧾 About This App</Text>
        <Text style={[styles.aboutText, isDarkMode && styles.darkText]}>
          Built with ❤️ by <Text style={styles.link} onPress={() => Linking.openURL("https://github.com/CuriousSheva")}>CuriousSheva</Text>
        </Text>
        <Text style={[styles.aboutText, isDarkMode && styles.darkText]}>
          Version: 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  darkText: {
    color: "#fff",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  label: {
    fontSize: 16,
  },
  aboutSection: {
    marginTop: 30,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    marginBottom: 4,
  },
  link: {
    color: "#007aff",
    textDecorationLine: "underline",
  },
});