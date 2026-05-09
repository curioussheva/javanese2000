#!/usr/bin/env python3
"""
Pembersihan link dan image source pada file HTML di direktori assets/reader.
Aturan:
  - kebab-case dan lowercase untuk path (folder & file)
  - multiple dash (---) di URL → single dash
  - multiple dash di teks tautan (anchor text) → spasi
  - hanya memproses URL relatif (../, ./ atau tanpa scheme)
"""

import os
import re
import argparse
from urllib.parse import urlparse, urlunparse
from bs4 import BeautifulSoup

def slugify_component(name: str, is_last: bool = False) -> str:
    """
    Bersihkan satu komponen path (folder atau nama file).
    - Lowercase
    - Ganti semua karakter selain [a-z0-9-] dengan '-'
    - Hapus '-' berulang menjadi satu
    - Buang '-' di awal dan akhir
    - Khusus komponen terakhir: pertahankan ekstensi file (bagian setelah titik terakhir)
    """
    # Simpan direktori spesial
    if name in ('.', '..'):
        return name

    # Pisahkan ekstensi untuk komponen terakhir (file)
    if is_last:
        # Cari titik terakhir yang bukan di awal
        base, dot, ext = name.rpartition('.')
        if dot and base:  # ada ekstensi
            base_clean = slugify_component(base, is_last=False)
            ext_clean = ext.lower()  # ekstensi lowercase saja, tanpa slugify
            return f"{base_clean}.{ext_clean}"
        # Tidak ada ekstensi, proses utuh
    # Proses nama folder atau nama file tanpa ekstensi
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9-]', '-', slug)  # ganti karakter non-alnum menjadi '-'
    slug = re.sub(r'-{2,}', '-', slug)        # gabungkan '-' berulang
    slug = slug.strip('-')                    # buang '-' di tepi
    return slug

def normalize_relative_url(url: str) -> str:
    """
    Normalisasi URL relatif.
    Contoh:
      ../Kebatinan-dan-Spiritual/Ngobrol-5---3.html
      → ../kebatinan-dan-spiritual/ngobrol-5-3.html
    """
    # Pisahkan fragment dan query
    parsed = urlparse(url)
    path = parsed.path
    # Bagi path menjadi komponen dengan '/' sebagai pemisah
    parts = path.split('/')
    cleaned_parts = []
    for i, part in enumerate(parts):
        is_last = (i == len(parts) - 1)
        cleaned = slugify_component(part, is_last=is_last)
        cleaned_parts.append(cleaned)
    cleaned_path = '/'.join(cleaned_parts)

    # Susun kembali URL dengan path yang sudah dibersihkan
    new_parsed = parsed._replace(path=cleaned_path)
    return urlunparse(new_parsed)

def should_process_url(url: str) -> bool:
    """
    URL diproses hanya jika relatif (tidak memiliki scheme).
    """
    if not url:
        return False
    return not (url.startswith(('http://', 'https://', '//', 'mailto:', 'tel:', '#')))

def clean_anchor_text(soup):
    """
    Di dalam setiap tag <a>, ganti urutan '-' dua kali atau lebih (--, ---, dll)
    menjadi SPASI pada teks yang terlihat.
    """
    for a_tag in soup.find_all('a'):
        # Iterasi semua string di dalam tag <a>, termasuk di dalam child tag
        for string in list(a_tag.strings):  # list() agar bisa di-iterasi sambil dimodifikasi
            if string and isinstance(string, str):
                new_text = re.sub(r'-{2,}', ' ', string)
                if new_text != string:
                    string.replace_with(new_text)

def process_html_file(filepath):
    """
    Baca, proses, dan timpa file HTML.
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    # Proses atribut href dan src
    for tag in soup.find_all(attrs={'href': True}):
        url = tag['href']
        if should_process_url(url):
            tag['href'] = normalize_relative_url(url)
    for tag in soup.find_all(attrs={'src': True}):
        url = tag['src']
        if should_process_url(url):
            tag['src'] = normalize_relative_url(url)
    # Bersihkan teks di dalam tag <a>
    clean_anchor_text(soup)

    # Tulis kembali ke file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(str(soup))

def main():
    parser = argparse.ArgumentParser(
        description='Bersihkan link dan src di file HTML (kebab-case, lowercase, dash normalisasi)'
    )
    parser.add_argument(
        'directory',
        nargs='?',
        default='assets/reader',
        help='Direktori root yang akan diproses (default: assets/reader)'
    )
    args = parser.parse_args()
    root_dir = args.directory

    if not os.path.isdir(root_dir):
        print(f"Error: Direktori '{root_dir}' tidak ditemukan.")
        return

    # Telusuri semua file .html secara rekursif
    count = 0
    for dirpath, _, filenames in os.walk(root_dir):
        for fname in filenames:
            if fname.lower().endswith('.html'):
                full_path = os.path.join(dirpath, fname)
                print(f"Memproses: {full_path}")
                process_html_file(full_path)
                count += 1
    print(f"\nSelesai. {count} file HTML telah diproses.")

if __name__ == "__main__":
    main() 