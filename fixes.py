import os
import re

# Tentukan folder target (rekursif di assets/reader)
TARGET_DIR = 'assets/reader'

def slugify(text):
    """
    Mengubah teks menjadi lowercase, mengganti & dengan dan, 
    dan mengubah karakter non-alfanumerik menjadi strip.
    """
    # 1. Lowercase
    text = text.lower()
    # 2. Ganti & dengan 'dan'
    text = text.replace('&', 'dan')
    # 3. Ganti semua karakter non-alfanumerik (kecuali titik untuk ekstensi) menjadi strip
    text = re.sub(r'[^a-z0-9.]+', '-', text)
    # 4. Hapus strip ganda atau strip di ujung kata
    text = re.sub(r'-+', '-', text).strip('-')
    return text

def fix_path(path_str):
    """Memproses path per bagian (folder/folder/file.html)"""
    parts = path_str.split('/')
    # Proses setiap bagian folder dan nama file
    fixed_parts = [slugify(part) for part in parts]
    return "/".join(fixed_parts)

def fix_href_match(match):
    original_url = match.group(1)
    
    # Abaikan link luar, email, atau anchor internal
    if original_url.startswith(('http', 'https', 'mailto:', '#')):
        return f'href="{original_url}"'
    
    # Hapus prefix assets/reader/ jika ada agar path tetap relatif
    clean_url = re.sub(r'^assets/reader/', '', original_url)
    
    # Proses URL menjadi kebab-case
    new_url = fix_path(clean_url)
    
    return f'href="{new_url}"'

def main():
    if not os.path.exists(TARGET_DIR):
        print(f"Gagal: Folder '{TARGET_DIR}' tidak ditemukan.")
        return

    count = 0
    # Berjalan secara rekursif
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Cari pola href="..." dan eksekusi fungsi perbaikan
                updated_content = re.sub(r'href="([^"]+)"', fix_href_match, content)
                
                if updated_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(updated_content)
                    print(f"✅ Diperbaiki: {file_path}")
                    count += 1

    print(f"\nSelesai! {count} file berhasil diperbarui.")

if __name__ == "__main__":
    main()
 