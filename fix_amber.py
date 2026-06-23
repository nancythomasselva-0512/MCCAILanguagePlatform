import re

def fix_colors(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace amber/orange/blue/fuchsia with teal/emerald for standard UI elements
    # Be careful not to replace error/warning colors if possible, but these are mostly banner icons
    
    # AudioToText specific
    content = content.replace("text-amber-500", "text-teal-500")
    content = content.replace("bg-amber-500", "bg-teal-500")
    content = content.replace("from-amber-500", "from-teal-500")
    content = content.replace("to-orange-500", "to-emerald-500")
    content = content.replace("via-orange-500", "via-emerald-500")
    content = content.replace("shadow-amber-500", "shadow-teal-500")
    content = content.replace("border-amber-100", "border-teal-100")
    content = content.replace("text-amber-600", "text-teal-600")
    
    # VoiceToText specific (if any blue/cyan remain)
    content = content.replace("text-cyan-500", "text-teal-500")
    content = content.replace("bg-cyan-500", "bg-teal-500")
    content = content.replace("from-cyan-500", "from-teal-500")
    content = content.replace("to-blue-500", "to-emerald-500")
    content = content.replace("via-blue-500", "via-emerald-500")
    content = content.replace("shadow-cyan-500", "shadow-teal-500")
    content = content.replace("border-cyan-100", "border-teal-100")

    # TextTranslation specific (if any fuchsia/pink remain)
    content = content.replace("text-fuchsia-500", "text-teal-500")
    content = content.replace("bg-fuchsia-500", "bg-teal-500")
    content = content.replace("from-fuchsia-500", "from-teal-500")
    content = content.replace("to-pink-500", "to-emerald-500")
    content = content.replace("via-pink-500", "via-emerald-500")
    content = content.replace("shadow-fuchsia-500", "shadow-teal-500")
    content = content.replace("border-fuchsia-100", "border-teal-100")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_colors('src/components/tools/AudioToText.tsx')
fix_colors('src/components/tools/VoiceToText.tsx')
fix_colors('src/components/tools/TextTranslation.tsx')
