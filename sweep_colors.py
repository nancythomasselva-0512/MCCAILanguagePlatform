import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Replace tailwind color classes globally in the file
    # Replace blue -> teal
    content = re.sub(r'\b(text|bg|border|from|to|via|shadow|ring|hover:bg|hover:text|hover:border|dark:bg|dark:text|dark:border)-blue-([0-9]{2,3}(?:/[0-9]{1,3})?)\b', r'\1-teal-\2', content)
    # Replace purple -> emerald
    content = re.sub(r'\b(text|bg|border|from|to|via|shadow|ring|hover:bg|hover:text|hover:border|dark:bg|dark:text|dark:border)-purple-([0-9]{2,3}(?:/[0-9]{1,3})?)\b', r'\1-emerald-\2', content)
    # Replace indigo -> emerald
    content = re.sub(r'\b(text|bg|border|from|to|via|shadow|ring|hover:bg|hover:text|hover:border|dark:bg|dark:text|dark:border)-indigo-([0-9]{2,3}(?:/[0-9]{1,3})?)\b', r'\1-emerald-\2', content)
    # Replace violet -> teal
    content = re.sub(r'\b(text|bg|border|from|to|via|shadow|ring|hover:bg|hover:text|hover:border|dark:bg|dark:text|dark:border)-violet-([0-9]{2,3}(?:/[0-9]{1,3})?)\b', r'\1-teal-\2', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('src/components'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

# Fix SidebarMenuNode.tsx specific hardcoded colors
sidebar_file = 'src/components/workspace/SidebarMenuNode.tsx'
with open(sidebar_file, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("text-white/80 hover:text-white hover:bg-white/5", "text-[var(--sidebar-panel-text)] hover:text-[var(--sidebar-panel-text-active)] hover:bg-[var(--sidebar-panel-hover-bg)]")
content = content.replace("text-white/70 hover:text-white hover:bg-white/5", "text-[var(--sidebar-panel-text)] hover:text-[var(--sidebar-panel-text-active)] hover:bg-[var(--sidebar-panel-hover-bg)]")
content = content.replace("text-white font-bold", "text-[var(--sidebar-panel-text-active)] font-bold")
content = content.replace("bg-gradient-to-r from-teal-600/80 to-teal-500/80", "var(--sidebar-panel-active-bg)")
content = content.replace("bg-white/30 group-hover:bg-white/50", "bg-[var(--sidebar-panel-text)] opacity-30 group-hover:opacity-50")
content = content.replace("text-white/50 relative", "opacity-50 text-[var(--sidebar-panel-text)] relative")
content = content.replace("bg-white/[0.02] dark:bg-black/[0.05]", "bg-[var(--bg-subtle)]")
content = content.replace("border-white/10", "border-[var(--border-subtle)]")
content = content.replace("text-white/90", "text-current")

# Specifically fix the Active pill background in SidebarMenuNode
content = re.sub(r'className="absolute inset-0 (.*?) rounded-xl"', r'className="absolute inset-0 rounded-xl" style={{ zIndex: 0, background: "var(--sidebar-panel-active-bg)" }}', content)

with open(sidebar_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Color sweep completed.")
