import re

with open('src/components/workspace/WorkspacePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix widget background
content = content.replace('bg-white/[0.03] hover:bg-white/[0.06]', 'bg-white/40 hover:bg-white/60 shadow-sm backdrop-blur-md')
content = content.replace('border-white/5', 'border-white/40')
content = content.replace('border-white/20', 'border-white/40')
content = content.replace('bg-white/10', 'bg-white/40')

# Text Colors
content = content.replace('text-white/80', 'text-[var(--sidebar-panel-text)]')
content = content.replace('text-white/60', 'text-[var(--sidebar-panel-text)] opacity-80')
content = content.replace('text-white', 'text-[var(--text-primary)]')

# Meter bars
content = content.replace('bg-blue-500', 'bg-teal-500')
content = content.replace('hover:border-blue-500/30', 'hover:border-teal-500/30')

with open('src/components/workspace/WorkspacePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
