const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Tambahkan ekstensi asset
config.resolver.assetExts.push('txt', 'css', 'html', 'json', 'JPG', 'jpeg', 'jpg');

// Fix blockList - gunakan array langsung tanpa spread
const blockList = [
  /assets\/reader\/js\/.*/,
];

// Merge dengan existing blockList dengan aman
const existing = config.resolver.blockList;
if (existing) {
  if (Array.isArray(existing)) {
    config.resolver.blockList = [...existing, ...blockList];
  } else {
    // existing adalah RegExp tunggal
    config.resolver.blockList = [existing, ...blockList];
  }
} else {
  config.resolver.blockList = blockList;
}

module.exports = config;
