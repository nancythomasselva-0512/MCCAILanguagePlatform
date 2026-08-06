import re

file_path = 'src/components/tools/AudioToText.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Bruteforce any remaining amber and orange tailwind classes
content = re.sub(r'\b(text|bg|border|from|to|via|shadow|ring)-amber-([0-9]{2,3}(?:/[0-9]{1,3})?)\b', r'\1-teal-\2', content)
content = re.sub(r'\b(text|bg|border|from|to|via|shadow|ring)-orange-([0-9]{2,3}(?:/[0-9]{1,3})?)\b', r'\1-emerald-\2', content)

# dark modes as well
content = re.sub(r'\bdark:text-amber-([0-9]{2,3}(?:/[0-9]{1,3})?)\b', r'dark:text-teal-\1', content)
content = re.sub(r'\bdark:from-amber-([0-9]{2,3}(?:/[0-9]{1,3})?)\b', r'dark:from-teal-\1', content)
content = re.sub(r'\bdark:to-amber-([0-9]{2,3}(?:/[0-9]{1,3})?)\b', r'dark:to-teal-\1', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
