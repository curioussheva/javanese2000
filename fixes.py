cd ~/Javanese2000/assets/reader

python3 - << 'EOF'
import re

def to_kebab(name):
    # Lowercase
    name = name.lower()
    # Ganti spasi dan karakter khusus dengan dash
    name = re.sub(r'[\s]+', '-', name)
    # Ganti & dengan dan
    name = name.replace('&', 'dan')
    # Hapus karakter selain huruf, angka, dash, titik, slash
    name = re.sub(r'[^\w\-./]', '-', name)
    # Hapus double dash
    name = re.sub(r'-+', '-', name)
    return name

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

def replace_href(m):
    href = m.group(1)
    if href.startswith('http') or href.startswith('#'):
        return m.group(0)
    new_href = to_kebab(href)
    return f'href="{new_href}"'

def replace_src(m):
    src = m.group(1)
    if src.startswith('http') or src.startswith('data:'):
        return m.group(0)
    new_src = to_kebab(src)
    return f'src="{new_src}"'

content = re.sub(r'href="([^"]+)"', replace_href, content)
content = re.sub(r'src="([^"]+)"', replace_src, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
EOF

# Verifikasi sample
grep 'href="' index.html | grep -v http | head -10 