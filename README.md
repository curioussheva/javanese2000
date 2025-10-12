🎯 Aksara Jawa - Aplikasi Pembelajaran Bahasa Jawa

Aplikasi mobile untuk mempelajari bahasa dan budaya Jawa dengan antarmuka yang modern dan fitur lengkap.

https://img.shields.io/badge/React_Native-0.72.6-61DAFB?style=for-the-badge&logo=react&logoColor=white
https://img.shields.io/badge/TypeScript-4.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white
https://img.shields.io/badge/Expo-49.0.0-000020?style=for-the-badge&logo=expo&logoColor=white

✨ Fitur Utama

· 📚 500+ Artikel pembelajaran bahasa Jawa
· 🏠 Navigasi Drawer dengan kategori bertingkat
· 🔍 Pencarian Real-time artikel
· ⭐ Sistem Bookmark artikel favorit
· 🎨 Tema Artikel yang berbeda per kategori
· 📱 Desain Responsif untuk semua perangkat
· 🔗 Navigasi Internal antar artikel terkait
· 📊 Statistik Pembelajaran

🛠️ Teknologi

· Framework: React Native 0.72.6 + Expo 49.0.0
· Bahasa: TypeScript
· Navigasi: React Navigation (Drawer + Stack)
· UI Components: Custom dengan styling native
· Web Content: React Native WebView

📦 Instalasi

Prerequisites

· Node.js 16 atau lebih baru
· Yarn package manager
· Expo CLI (opsional)

Langkah Instalasi

1. Clone atau download project
2. Install dependencies

```bash
yarn install
```

1. Install Expo packages

```bash
npx expo install @react-navigation/native @react-navigation/drawer @react-navigation/stack
npx expo install react-native-gesture-handler react-native-reanimated
npx expo install react-native-webview
npx expo install expo-dev-client
```

1. Konfigurasi Babel
   Tambahkan plugin Reanimated kebabel.config.js:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
```

1. Jalankan aplikasi

```bash
yarn start
```

🗂️ Struktur Project

```
javanese2000/
├── App.tsx
├── index.ts
├── package.json
└── src/
    ├── types/
    │   └── index.ts              # Type definitions
    ├── navigation/
    │   └── AppNavigator.tsx      # Main navigation setup
    ├── data/
    │   └── articles.ts           # Article data & categories
    ├── components/
    │   └── CustomDrawerContent.tsx # Custom drawer dengan search & bookmark
    └── screens/
        ├── HomeScreen.tsx        # Dashboard utama
        ├── CategoriesScreen.tsx  # Daftar kategori
        ├── ArticleListScreen.tsx # Daftar artikel
        ├── ArticleDetailScreen.tsx # Detail artikel dengan WebView
        └── BookmarksScreen.tsx   # Artikel favorit
```

🎨 Tema & Desain

Aplikasi menggunakan tema dark modern dengan palette warna:

· Background: #1a1a2e
· Surface: #16213e
· Primary: #0f3460
· Accent: #e94560
· Text Primary: #ffffff
· Text Secondary: #8b9bb4

📱 Fitur Navigasi

Drawer Navigation

· Logo header dengan aksara Jawa
· Search bar real-time
· Quick actions (Home, Semua Artikel, Favorit)
· Kategori collapse/expand
· Statistik pembelajaran
· Footer dengan informasi app

Stack Navigation

· HomeStack: Dashboard utama
· CategoryStack: Navigasi berdasarkan kategori
· ArticleStack: Daftar dan detail artikel

📊 Data Structure

Kategori & Subkategori

```typescript
type Category = {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

type Subcategory = {
  id: string;
  name: string;
  articleCount: number;
  icon: string;
}
```

Artikel

```typescript
type Article = {
  id: string;
  title: string;
  content: string;        // HTML content
  category: string;
  subcategory?: string;
  difficulty: 'pemula' | 'menengah' | 'mahir';
  estimatedReadTime: number;
  theme: string;
}
```

🔧 Scripts Available

```bash
yarn start          # Jalankan development server
yarn android        # Jalankan di Android
yarn ios            # Jalankan di iOS (hanya macOS)
yarn web            # Jalankan di web browser
yarn start --reset-cache  # Clear cache dan restart
```

🚀 Build untuk Production

Untuk Expo

```bash
npx expo prebuild
npx eas build --platform android
npx eas build --platform ios
```

Untuk React Native CLI

```bash
npx react-native run-android
npx react-native run-ios
```

🐛 Troubleshooting

Common Issues

1. Reanimated tidak bekerja
   ```bash
   npx expo install --fix
   rm -rf node_modules
   yarn install
   ```
2. Navigation errors
   ```bash
   yarn start --reset-cache
   ```
3. TypeScript errors
   ```bash
   npx tsc --noEmit --skipLibCheck
   ```
4. WebView issues
   ```bash
   yarn remove react-native-webview
   npx expo install react-native-webview
   ```

Clean Install

```bash
rm -rf node_modules
yarn install
yarn start --reset-cache
```

📈 Statistik Konten

· Total Artikel: 500+
· Kategori Utama: 5
· Subkategori: 50+
· Tingkat Kesulitan: Pemula, Menengah, Mahir
· Waktu Baca: 3-15 menit per artikel

🔗 Internal Linking

Artikel mendukung navigasi internal:

· article://article-id - Navigasi ke artikel lain
· category://category-id/subcategory-id - Navigasi ke kategori
· Anchor links untuk navigasi dalam artikel

🤝 Kontribusi

Untuk menambahkan konten baru:

1. Tambahkan artikel di src/data/articles.ts
2. Update kategori jika diperlukan
3. Test navigasi dan linking
4. Verifikasi tampilan di berbagai device

📄 Lisensi

MIT License - bebas digunakan untuk project edukasi bahasa Jawa.

👥 Credits

Dikembangkan untuk melestarikan bahasa dan budaya Jawa melalui teknologi modern.

---

ꦲꦭꦩꦤ꧀ꦲꦸꦠꦩ - Mari lestarikan bahasa Jawa! 🇮🇩