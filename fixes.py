#!/usr/bin/env python3
"""
Perbaikan final: 
1. Memperbaiki ekstensi ganda -2jpg-jpg -> .jpg
2. Menghilangkan -3fattredirects-3d0 (sisa dari ?attredirects=0)
3. Memperbaiki semua ekstensi tanpa titik: -jpg, -png, -jpeg, -gif, -svg, -ico, -html
"""
import os
import re

ROOT = "assets/reader"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content

    # 1. Perbaiki ekstensi ganda: -2jpg-jpg -> .jpg
    content = re.sub(r'-(\d+)(jpg|png|jpeg|gif|svg|ico|html)-(jpg|png|jpeg|gif|svg|ico|html)', r'.\3', content, flags=re.IGNORECASE)
    
    # 2. Hapus sisa -3fattredirects-3d0 (dan varian kapital)
    content = re.sub(r'-3[fF]attredirects-3[dD]0', '', content)
    # juga yang sudah terlanjur jadi -fattredirects-0 atau -attredirects-0
    content = re.sub(r'-[fF]?attredirects-0', '', content)

    # 3. Perbaiki ekstensi tunggal: -jpg, -png, dll yang diikuti kutip/spasi/>
    for ext in ['jpg', 'png', 'jpeg', 'gif', 'svg', 'ico', 'html']:
        content = re.sub(rf'-({ext})(["\'\s>])', r'.\1\2', content, flags=re.IGNORECASE)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

count = 0
for dirpath, _, filenames in os.walk(ROOT):
    for fname in filenames:
        if fname.endswith('.html'):
            path = os.path.join(dirpath, fname)
            if fix_file(path):
                print(f"✅ {path}")
                count += 1
print(f"\n🎯 Total file diubah: {count}")
