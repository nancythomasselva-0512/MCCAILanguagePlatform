import re

with open('src/components/common/Header.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace hex gradients
content = content.replace('linear-gradient(135deg, #1e40af, #0891b2)', 'linear-gradient(135deg, #0D9488, #10B981)')
content = content.replace('rgba(6, 182, 212, 0.15)', 'rgba(13, 148, 136, 0.15)')

# Replace tailwind classes
content = content.replace('from-blue-600 to-cyan-500', 'from-teal-600 to-emerald-500')
content = content.replace('after:bg-blue-600 dark:after:bg-cyan-500', 'after:bg-teal-500 dark:after:bg-emerald-500')
content = content.replace('bg-blue-500', 'bg-teal-500')

with open('src/components/common/Header.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
