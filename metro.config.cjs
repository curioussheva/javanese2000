const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// 1. Ambil resolver yang ada
const { resolver } = config;

// 2. Tambahkan ekstensi yang hilang (INI BAGIAN YANG TADI TERLEWAT)
// Kita gunakan concat agar tidak menimpa ekstensi bawaan (png, jpg, dll)
resolver.assetExts.push('txt', 'css', 'html', 'json', 'webp', 'JPG');
resolver.sourceExts.push('css', 'html');

// 3. Tambahkan watchFolders 
config.watchFolders = [
  path.resolve(__dirname, 'assets')
];

// 4. Definisi blockList
const blockList = [
  /assets\/reader\/js\/.*/,
  /android\/.*/,
  /ios\/.*/,
];

// 5. Merge blockList secara aman
const existing = resolver.blockList;
if (existing) {
  if (Array.isArray(existing)) {
    resolver.blockList = [...existing, ...blockList];
  } else {
    resolver.blockList = [existing, ...blockList];
  }
} else {
  resolver.blockList = blockList;
}

module.exports = config;
