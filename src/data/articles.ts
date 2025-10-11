// src/data/articles.ts
export const categories = [
  {
    id: 'basics',
    name: 'Dasar Bahasa Jawa',
    icon: '🔤',
    subcategories: [
      { id: 'greetings', name: 'Sapaan', articleCount: 25, icon: '👋' },
      { id: 'numbers', name: 'Angka', articleCount: 15, icon: '🔢' },
      { id: 'family', name: 'Keluarga', articleCount: 30, icon: '👨‍👩‍👧‍👦' },
      { id: 'time', name: 'Waktu', articleCount: 20, icon: '⏰' },
      { id: 'colors', name: 'Warna', articleCount: 10, icon: '🎨' },
    ],
  },
  {
    id: 'grammar',
    name: 'Tata Bahasa',
    icon: '📝',
    subcategories: [
      { id: 'verbs', name: 'Kata Kerja', articleCount: 45, icon: '🏃' },
      { id: 'nouns', name: 'Kata Benda', articleCount: 60, icon: '📦' },
      { id: 'adjectives', name: 'Kata Sifat', articleCount: 35, icon: '🌟' },
      { id: 'sentences', name: 'Struktur Kalimat', articleCount: 40, icon: '🗣️' },
      { id: 'pronouns', name: 'Kata Ganti', articleCount: 25, icon: '👤' },
    ],
  },
  {
    id: 'culture',
    name: 'Budaya Jawa',
    icon: '🎎',
    subcategories: [
      { id: 'traditions', name: 'Tradisi', articleCount: 40, icon: '🏮' },
      { id: 'philosophy', name: 'Filosofi', articleCount: 20, icon: '💭' },
      { id: 'arts', name: 'Seni', articleCount: 35, icon: '🎭' },
      { id: 'ceremonies', name: 'Upacara', articleCount: 30, icon: '🕯️' },
      { id: 'culinary', name: 'Kuliner', articleCount: 25, icon: '🍲' },
    ],
  },
];

export const articles = [
  {
    id: 'greet-1',
    title: 'Sapaan Pagi dalam Bahasa Jawa',
    content: `
      <div class="article-container">
        <header class="article-header">
          <h1>ꦱꦥꦲꦤ꧀ꦥꦒꦶ</h1>
          <h2>Sapaan Pagi dalam Bahasa Jawa</h2>
        </header>
        <div class="article-content">
          <p>Dalam budaya Jawa, sapaan pagi memiliki makna yang dalam dan mencerminkan nilai-nilai kesopanan.</p>
          <h3>ꦱꦥꦲꦤ꧀ꦲꦺꦴꦩꦸꦩ꧀</h3>
          <p><strong>ꦱꦸꦒꦼꦁꦲꦺꦤꦁ</strong> (Sugeng enjang) - Selamat pagi</p>
          <p><strong>ꦩꦔꦺꦴꦤꦺꦴꦥꦸꦤ꧀ꦢꦶꦪ</strong> (Monggo dipun tedha) - Silakan sarapan</p>
          <h3>ꦏꦺꦴꦤ꧀ꦠꦺꦴꦃꦥꦼꦂꦕꦏꦥꦺꦴꦤ꧀</h3>
          <div class="conversation-example">
            <p><strong>A:</strong> Sugeng enjang, Pak!</p>
            <p><strong>B:</strong> Sugeng enjang, nduk. Piye kabare?</p>
            <p><strong>A:</strong> Alhamdulillah sae, Pak. Matur nuwun.</p>
          </div>
        </div>
      </div>
    `,
    category: 'basics',
    subcategory: 'greetings',
    difficulty: 'pemula',
    estimatedReadTime: 5,
    theme: 'cultural',
  },
  {
    id: 'num-1',
    title: 'Angka 1-10 dalam Bahasa Jawa',
    content: `
      <div class="article-container">
        <header class="article-header">
          <h1>ꦲꦁꦏ ꦱꦶꦗꦶ - ꦱꦼꦢꦱꦃ</h1>
          <h2>Angka 1-10 dalam Bahasa Jawa</h2>
        </header>
        <div class="article-content">
          <p>Berikut adalah angka dasar dalam bahasa Jawa:</p>
          <h3>Daftar Angka</h3>
          <p>1 - ꦱꦶꦗꦶ (siji)</p>
          <p>2 - ꦭꦺꦴꦫꦺꦴ (loro)</p>
          <p>3 - ꦠꦼꦭꦸ (telu)</p>
          <p>4 - ꦥꦥꦠ꧀ (papat)</p>
          <p>5 - ꦒꦁꦱꦭ꧀ (gangsal)</p>
          <p>6 - ꦲꦼꦤꦼꦩ꧀ (enem)</p>
          <p>7 - ꦥꦶꦠꦸ (pitu)</p>
          <p>8 - ꦮꦺꦭꦸ (wolu)</p>
          <p>9 - ꦱꦔ (sanga)</p>
          <p>10 - ꦱꦼꦢꦱꦃ (sedasa)</p>
        </div>
      </div>
    `,
    category: 'basics',
    subcategory: 'numbers',
    difficulty: 'pemula',
    estimatedReadTime: 3,
    theme: 'grammar',
  },
];