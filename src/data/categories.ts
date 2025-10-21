import { folderCategoryMapping, subcategoryMapping, categoryOrder } from './categoryMapping';

export interface Category {
  id: string;
  name: string;
  parentId?: string;
}

// Generate categories otomatis dari mapping di atas
export const categories: Category[] = [
  // Kategori utama
  ...categoryOrder.map((name, index) => ({
    id: Object.keys(folderCategoryMapping)[index] || name.toLowerCase().replace(/\s+/g, '-'),
    name,
  })),

  // Subkategori (parentId = kategori utamanya)
  ...Object.entries(subcategoryMapping).map(([key, sub]) => {
    const [parentName] = key.split('.');
    return {
      id: sub.toLowerCase().replace(/\s+/g, '-'),
      name: sub,
      parentId: parentName,
    };
  }),
];