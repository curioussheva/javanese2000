# Generate CSS sebagai TypeScript string
python3 - << 'EOF'
with open('/root/Javanese2000/assets/reader/css/w3.css', 'r') as f:
    w3 = f.read().replace('`', '\\`').replace('${', '\\${')

with open('/root/Javanese2000/assets/reader/css/custom.css', 'r') as f:
    custom = f.read().replace('`', '\\`').replace('${', '\\${')

output = f'''// Auto-generated - do not edit manually
export const w3css = `{w3}`;
export const customCss = `{custom}`;
'''

with open('/root/Javanese2000/styles.ts', 'w') as f:
    f.write(output)

print("Done - styles.ts created")
EOF