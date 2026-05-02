import os
from pathlib import Path

reader_dir = Path("assets/reader")

# Pola eksak yang mau dihapus
exact_pattern = '''<hr>
<center>
 <a href="https://play.google.com/store/apps/details?id=com.curioussheva.Javanese2000"> <img src="../images/" style=" height: 100px;
  width: 180px; "></a>
 </center>'''

def clean_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if exact_pattern in content:
            cleaned = content.replace(exact_pattern, '')
            # Bersihkan sisa <hr> atau <br> berlebih
            cleaned = cleaned.replace('<hr><br>', '<br>')
            cleaned = cleaned.replace('<br><br><br>', '<br><br>')
            cleaned = cleaned.replace('<center></center>', '')
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(cleaned)
            print(f"✅ Dihapus dari: {file_path.name}")
        else:
            print(f"   Tidak ditemukan di: {file_path.name}")
            
    except Exception as e:
        print(f"❌ Error di {file_path.name}: {e}")

# Jalankan
print("🔍 Menghapus pola Rate Us yang tersisa...\n")
html_files = list(reader_dir.rglob("*.html"))

for html_file in html_files:
    clean_file(html_file)

print("\n✅ Proses selesai. Silakan cek hasilnya.") 