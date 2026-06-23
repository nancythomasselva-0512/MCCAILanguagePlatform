import re

with open('src/components/landing/LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Badges (Lines 237-250)
content = content.replace('bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-400', 'bg-teal-500/10 dark:bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-400')
content = content.replace('bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-400', 'bg-lime-500/10 border border-lime-500/30 text-lime-700 dark:text-lime-400')

# Text Gradients
content = content.replace('from-blue-600 via-cyan-500 to-purple-600', 'from-emerald-600 via-teal-500 to-cyan-600')
content = content.replace('from-blue-400 via-cyan-400 to-purple-400', 'from-emerald-400 via-teal-400 to-cyan-400')

content = content.replace('from-blue-600 via-cyan-600 to-purple-600', 'from-emerald-600 via-teal-600 to-cyan-600')
content = content.replace('from-blue-400 via-cyan-400 to-purple-400', 'from-emerald-400 via-teal-400 to-cyan-400')

content = content.replace('from-blue-600 to-purple-600', 'from-teal-600 to-emerald-600')
content = content.replace('from-blue-400 to-purple-400', 'from-teal-400 to-emerald-400')

content = content.replace('from-blue-600 via-purple-600 to-cyan-600', 'from-teal-600 via-emerald-600 to-cyan-600')
content = content.replace('from-blue-400 via-purple-400 to-cyan-400', 'from-teal-400 via-emerald-400 to-cyan-400')

# Hero Auroras
content = content.replace('from-blue-600 via-cyan-500', 'from-emerald-500 via-teal-400')
content = content.replace('from-purple-600 via-indigo-500', 'from-teal-500 via-cyan-400')

# Launch Button
content = content.replace('linear-gradient(135deg, #1e40af, #0891b2)', 'linear-gradient(135deg, #0D9488, #10B981)')

# Connector Line
content = content.replace('linear-gradient(to right, #3b82f6, #a855f7, #f59e0b, #10b981)', 'linear-gradient(to right, #14b8a6, #0d9488, #10b981, #059669)')

# Step Gradient
content = content.replace('linear-gradient(135deg, #3b82f6, #a855f7)', 'linear-gradient(135deg, #14b8a6, #10b981)')

# Map Nodes
content = content.replace('bg-blue-400', 'bg-teal-400')
content = content.replace('bg-blue-500', 'bg-teal-500')
content = content.replace('bg-purple-400', 'bg-emerald-400')
content = content.replace('bg-purple-500', 'bg-emerald-500')

# Map Vector Lines
content = content.replace('rgba(168, 85, 247, 0.45)', 'rgba(16, 185, 129, 0.45)')
content = content.replace('rgba(59, 130, 246, 0.45)', 'rgba(20, 184, 166, 0.45)')

with open('src/components/landing/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
