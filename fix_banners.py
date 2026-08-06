import re

# Fix TextToVoice.tsx
file = 'src/components/tools/TextToVoice.tsx'
with open(file, 'r', encoding='utf-8') as f: content = f.read()
content = content.replace("'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)'", "'linear-gradient(135deg, rgba(6, 78, 59, 0.4) 0%, rgba(15, 118, 110, 0.6) 100%)'")
content = content.replace("'linear-gradient(135deg, #eef2ff 0%, #fae8ff 100%)'", "'linear-gradient(135deg, #ccfbf1 0%, #dcfce7 100%)'")
content = content.replace("filter drop-shadow-md", "filter drop-shadow-md hue-rotate-[250deg]") # Rotate purple to teal
with open(file, 'w', encoding='utf-8') as f: f.write(content)

# Fix VoiceToText.tsx
file = 'src/components/tools/VoiceToText.tsx'
with open(file, 'r', encoding='utf-8') as f: content = f.read()
content = content.replace("'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)'", "'linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(15, 118, 110, 0.05) 100%)'")
content = content.replace("filter drop-shadow-md", "filter drop-shadow-md hue-rotate-[60deg]") # Rotate blue to teal
with open(file, 'w', encoding='utf-8') as f: f.write(content)

# Fix AudioToText.tsx (amber -> emerald)
file = 'src/components/tools/AudioToText.tsx'
with open(file, 'r', encoding='utf-8') as f: content = f.read()
content = content.replace("'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)'", "'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)'")
content = content.replace("filter drop-shadow-md", "filter drop-shadow-md hue-rotate-[100deg]") # Rotate amber to green/emerald
with open(file, 'w', encoding='utf-8') as f: f.write(content)
