#!/usr/bin/env python3
"""
Memperbaiki class yang salah penulisan (tanpa spasi) di semua file HTML.
- accordion-w3-bar-item-w3-button -> accordion w3-bar-item w3-button
- w3-button-w3-white-w3-xxlarge -> w3-button w3-white w3-xxlarge
- dll.
- Menambahkan class w3-sidebar w3-bar-block pada #mySidebar
- Menghapus teks sampah '--' yang berdiri sendiri di body.
"""
import os
import re

ROOT = "assets/reader"

FIX_CLASS_MAP = {
    # pola class salah -> class benar
    "accordion-w3-bar-item-w3-button": "accordion w3-bar-item w3-button",
    "w3-button-w3-white-w3-xxlarge": "w3-button w3-white w3-xxlarge",
    "w3-bar-item-w3-button": "w3-bar-item w3-button",
    "w3-bar-item-w3-button-w3-green": "w3-bar-item w3-button w3-green",
    "w3-sidebar-w3-bar-block-w3-dark-grey-w3-card-w3-animate-left": "w3-sidebar w3-bar-block w3-dark-grey w3-card w3-animate-left",
    "w3-sidebar-w3-bar-block-w3-dark-grey-w3-card-w3-animate-left-stylish": "w3-sidebar w3-bar-block w3-dark-grey w3-card w3-animate-left",
    # tambahkan pola lain sesuai kebutuhan
}

def fix_classes(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content

    # 1. Ganti pola class yang salah
    for wrong, right in FIX_CLASS_MAP.items():
        content = content.replace(wrong, right)

    # 2. Perbaiki class="" kosong dengan menambahkan class sidebar jika id=mySidebar
    content = re.sub(
        r'(<div\s+)(class="")?(\s*id="mySidebar")',
        r'\1class="w3-sidebar w3-bar-block" \3 style="display:none"',
        content
    )

    # 3. Hapus teks '--' dan '----' yang berdiri sendiri (bukan di dalam atribut)
    #    Hanya di luar tag, sulit. Kita hapus baris yang hanya berisi strip.
    content = re.sub(r'^\s*--+\s*$', '', content, flags=re.MULTILINE)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

count = 0
for dirpath, _, files in os.walk(ROOT):
    for fname in files:
        if fname.endswith('.html'):
            path = os.path.join(dirpath, fname)
            if fix_classes(path):
                print(f"✅ {path}")
                count += 1
print(f"Total: {count}") 