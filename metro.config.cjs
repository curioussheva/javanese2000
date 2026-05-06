const { getDefaultConfig } = require('expo/metro-config');

// 1. Tambahkan ekstensi asset (tambahkan webp jika Anda menggunakannya)
const path = require('path');

const config = getDefaultConfig(__dirname);

// Tambahkan ini agar Metro mengawasi folder assets dengan benar
config.watchFolders = [
  path.resolve(__dirname, 'assets')
];

// 2. Definisi blockList untuk mengabaikan file yang tidak perlu diproses Metro
const blockList = [
  /assets\/reader\/js\/.*/, // Mengabaikan folder JS di dalam reader
  /android\/.*/,           // Mengabaikan folder native android
  /ios\/.*/,               // Mengabaikan folder native ios
];

// 3. Merge dengan existing blockList secara aman
const existing = config.resolver.blockList;
if (existing) {
  if (Array.isArray(existing)) {
    config.resolver.blockList = [...existing, ...blockList];
  } else {
    config.resolver.blockList = [existing, ...blockList];
  }
} else {
  config.resolver.blockList = blockList;
}

module.exports = config;
 