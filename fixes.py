#!/usr/bin/env python3
"""
Perbaiki href pada <a class="lightbox"> yang masih mengarah ke folder lama.
Contoh: spiritual-dan-kebatinan-keris-jawa/images/x.jpg -> ../images/x.jpg
"""
import os
import re
from bs4 import BeautifulSoup

ROOT = "assets/reader"

def fix_lightbox_href(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html5lib')
    changed = False

    for a in soup.find_all('a', class_='lightbox', href=True):
        old = a['href']
        # Ubah: (folder)/images/(file) -> ../images/(file)
        new = re.sub(r'^[^/]+/images/(.+)$', r'../images/\1', old)
        if new != old:
            a['href'] = new
            changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        return True
    return False

def main():
    count = 0
    for dirpath, _, filenames in os.walk(ROOT):
        for fname in filenames:
            if fname.endswith(('.html', '.htm')):
                path = os.path.join(dirpath, fname)
                if fix_lightbox_href(path):
                    print(f"✅ {path}")
                    count += 1
    print(f"Total: {count}")

if __name__ == '__main__':
    main() 