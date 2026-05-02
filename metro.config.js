const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Tambahkan ekstensi yang kamu butuhkan sebagai asset
config.resolver.assetExts.push('txt', 'css', 'html', 'json', 'JPG', 'jpeg', 'jpg');

// JANGAN hapus 'js' dari assetExts (biarkan Metro yang handle default-nya)
// Tapi pastikan folder khusus kamu di-block agar tidak dianggap module
config.resolver.blockList = [
  ...(config.resolver.blockList || []),
  /assets\/reader\/js/,           // blokir seluruh folder ini
  /assets\/reader\/js\/.*\.(js|txt|css)$/   // lebih spesifik
];

module.exports = config; 