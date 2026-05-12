#!/usr/bin/env python3
"""
master-fixes.py – Gabungan semua pembersihan HTML dalam satu skrip.
Jalankan: python3 master-fixes.py [folder_target]
Default folder_target = "assets/assets"
"""

import os
import sys
import re
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urlunparse

ROOT_DIR = sys.argv[1] if len(sys.argv) > 1 else "assets/reader"

# ============================================================
# 0. RENAME FISIK FOLDER & FILE -> kebab-case, lowercase
# ============================================================
def kebab_case(name: str, is_file: bool = True) -> str:
    name = name.lower()
    name = re.sub(r'&', ' dan ', name)
    
    if is_file:
        base, dot, ext = name.rpartition('.')
        if dot:  # ada ekstensi
            base = re.sub(r'[^a-z0-9]', '-', base)
            base = re.sub(r'-+', '-', base)
            base = base.strip('-')
            return f"{base}.{ext}"
    
    # Folder atau file tanpa ekstensi
    name = re.sub(r'[^a-z0-9]', '-', name)
    name = re.sub(r'-+', '-', name)
    name = name.strip('-')
    return name

def rename_fisik_recursive(root: str):
    for dirpath, dirnames, filenames in os.walk(root, topdown=False):
        # Rename file dulu
        for old_name in filenames:
            old_path = os.path.join(dirpath, old_name)
            new_name = kebab_case(old_name, is_file=True)
            if new_name != old_name:
                os.rename(old_path, os.path.join(dirpath, new_name))
                print(f"  [rename] {old_path} -> {new_name}")
        # Lalu folder
        for old_name in dirnames:
            old_path = os.path.join(dirpath, old_name)
            new_name = kebab_case(old_name, is_file=False)
            if new_name != old_name:
                os.rename(old_path, os.path.join(dirpath, new_name))
                print(f"  [rename] {old_path} -> {new_name}") 
# ============================================================
# HELPER: Normalisasi URL relatif
# ============================================================
def slugify_component(name: str, is_last: bool = False) -> str:
    if name in ('.', '..'):
        return name
    if is_last:
        base, dot, ext = name.rpartition('.')
        if dot and base:
            base_clean = slugify_component(base, is_last=False)
            return f"{base_clean}.{ext.lower()}"
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9-]', '-', slug)
    slug = re.sub(r'-{2,}', '-', slug)
    slug = slug.strip('-')
    return slug if slug else name.lower()

def normalize_relative_url(url: str) -> str:
    parsed = urlparse(url)
    parts = parsed.path.split('/')
    cleaned = []
    for i, part in enumerate(parts):
        cleaned.append(slugify_component(part, i == len(parts) - 1))
    cleaned_path = '/'.join(cleaned)
    return urlunparse(parsed._replace(path=cleaned_path))

def should_process_url(url: str) -> bool:
    if not url:
        return False
    return not (url.startswith(('http://','https://','//','mailto:','tel:','#')))

# ============================================================
# PERBAIKAN PER FILE HTML
# ============================================================
def process_html_file(filepath: str) -> bool:
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html5lib')
    changed = False

    # --- 1. Hapus <link rel="stylesheet"> ke w3.css / custom.css ---
    for link in soup.find_all('link', rel='stylesheet'):
        href = link.get('href', '')
        if 'w3' in href.lower() or 'custom' in href.lower():
            link.decompose()
            changed = True

    # --- 2. Perbaiki class accordion / sidebar ---
    for button in soup.find_all('button'):
        # Tambahkan class "accordion" jika diikuti panel
        next_elem = button.next_sibling
        while next_elem and isinstance(next_elem, str) and not next_elem.strip():
            next_elem = next_elem.next_sibling
        if next_elem and next_elem.name == 'div' and 'panel' in next_elem.get('class', []):
            classes = button.get('class', [])
            if 'accordion' not in classes:
                classes.append('accordion')
                button['class'] = classes
                changed = True
        # Perbaiki class yang menyatu (accordion-w3-bar-item -> accordion w3-bar-item)
        if button.get('class'):
            new_classes = []
            for c in button['class']:
                # Pecah class yang mengandung tanda hubung antar class (misal accordion-w3-bar-item)
                parts = re.split(r'-(?=w3|accordion)', c)  # hati-hati, tidak sempurna, tapi cukup untuk pola umum
                new_classes.extend(parts)
            if new_classes != button['class']:
                button['class'] = new_classes
                changed = True

    # Sidebar: jika id=mySidebar tapi class kosong, tambahkan class w3
    sidebar = soup.find(id='mySidebar')
    if sidebar:
        if not sidebar.get('class'):
            sidebar['class'] = ['w3-sidebar', 'w3-bar-block']
            sidebar['style'] = 'display:none'
            changed = True

    # --- 3. Hapus teks sampah "----", "--" yang berdiri sendiri ---
    for string in soup.find_all(string=True):
        if re.match(r'^\s*-{2,}\s*$', string):
            string.extract()
            changed = True

    # --- 4. Normalisasi href dan src ---
    for tag in soup.find_all(attrs={'href': True}):
        if should_process_url(tag['href']):
            new_href = normalize_relative_url(tag['href'])
            if new_href != tag['href']:
                tag['href'] = new_href
                changed = True
    for tag in soup.find_all(attrs={'src': True}):
        if should_process_url(tag['src']):
            new_src = normalize_relative_url(tag['src'])
            if new_src != tag['src']:
                tag['src'] = new_src
                changed = True

    # --- 5. Hilangkan ?attredirects=0 dan encoded ---
    for attr in ['href', 'src']:
        for tag in soup.find_all(attrs={attr: True}):
            value = tag[attr]
            new_val = re.sub(r'(%3[fF]attredirects%3[dD]0|\?attredirects=0)', '', value)
            if new_val != value:
                tag[attr] = new_val
                changed = True

    # --- 6. Perbaiki ekstensi tanpa titik: -jpg -> .jpg, dll. ---
    for attr in ['href', 'src']:
        for tag in soup.find_all(attrs={attr: True}):
            value = tag[attr]
            # Ekstensi ganda: -2jpg-jpg -> .jpg
            value = re.sub(r'-(\d+)(jpg|png|jpeg|gif|svg|ico|html)-(jpg|png|jpeg|gif|svg|ico|html)',
                           r'.\3', value, flags=re.IGNORECASE)
            # Sisa attredirects (jika masih ada sebagai dash palsu)
            value = re.sub(r'-[fF]?attredirects-0', '', value)
            # Tunggal: -jpg, -png, dll. diikuti kutip/spasi/>
            for ext in ['jpg', 'png', 'jpeg', 'gif', 'svg', 'ico', 'html']:
                value = re.sub(rf'-({ext})(["\'\s>])', r'.\1\2', value, flags=re.IGNORECASE)
            if value != tag[attr]:
                tag[attr] = value
                changed = True

    # --- 7. Isi src kosong dari parent <a> (lightbox) ---
    for img in soup.find_all('img'):
        if not img.get('src') or not img['src'].strip():
            a = img.find_parent('a')
            if a and a.get('href'):
                href = a['href']
                if href.lower().endswith(('.jpg','.jpeg','.png','.gif','.svg','.webp','.bmp')):
                    img['src'] = href
                    changed = True

    # --- 8. Tambahkan class="lightbox" pada <a> yang membungkus gambar ---
    for a in soup.find_all('a'):
        if a.get('href') and a['href'].lower().endswith(('.jpg','.jpeg','.png','.gif','.svg','.webp','.bmp')):
            if a.find('img'):
                classes = a.get('class', [])
                if 'lightbox' not in classes:
                    classes.append('lightbox')
                    a['class'] = classes
                    changed = True

    # --- 9. Tuning path gambar: ../folder/images/ -> ../images/ ---
    for img in soup.find_all('img', src=True):
        src = img['src']
        new_src = re.sub(r'^(\.\./)[^/]+/images/(.+)$', r'\1images/\2', src)
        if not new_src.startswith('../') and src.startswith('images/'):
            new_src = '../' + src
        if new_src != src:
            img['src'] = new_src
            changed = True

    # --- 10. Sederhanakan href: hapus ../ di awal path (karena base tag) ---
    for a in soup.find_all('a', href=True):
        href = a['href']
        if href.startswith('../') and not href.startswith(('http','https','//','#')):
            new_href = href[3:]  # buang ../
            a['href'] = new_href
            changed = True

    # --- 11. Struktur section/article: pastikan section ditutup sebelum article ---
    section = soup.find('section')
    article = soup.find('article')
    if section and article:
        # Teks sampah di antara section dan article
        for elem in list(section.next_siblings):
            if elem == article:
                break
            if isinstance(elem, str) and re.match(r'^\s*-{2,}\s*$', elem):
                elem.extract()
                changed = True
        # Bungkus tbody tanpa table di dalam article
        for tbody in article.find_all('tbody', recursive=False):
            if not tbody.find_parent('table'):
                table = soup.new_tag('table')
                tbody.wrap(table)
                changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        return True
    return False

# ============================================================
# MAIN
# ============================================================
def main():
    print(f"Memproses folder: {ROOT_DIR}")
    # 0. Rename fisik
    print("\n[0] Rename fisik file/folder...")
    rename_fisik_recursive(ROOT_DIR)

    # Proses semua file HTML
    print("\n[1-11] Membersihkan HTML...")
    count = 0
    for dirpath, _, filenames in os.walk(ROOT_DIR):
        for fname in filenames:
            if fname.lower().endswith(('.html', '.htm')):
                path = os.path.join(dirpath, fname)
                try:
                    if process_html_file(path):
                        print(f"  ✅ {path}")
                        count += 1
                except Exception as e:
                    print(f"  ❌ {path} — {e}")
    print(f"\n🎯 Total file diubah: {count}")

if __name__ == '__main__':
    main() 