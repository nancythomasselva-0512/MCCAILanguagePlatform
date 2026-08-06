import os

files_to_fix = [
    "src/components/workspace/TenantDashboard.tsx",
    "src/components/workspace/TenantBilling.tsx",
    "src/components/tools/VoiceToText.tsx",
    "src/components/tools/TextTranslation.tsx",
    "src/components/tools/TextToVoice.tsx",
    "src/components/tools/AudioToText.tsx"
]

for filepath in files_to_fix:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace max-w-7xl mx-auto and max-w-[1600px] mx-auto
        content = content.replace("max-w-7xl mx-auto ", "w-full ")
        content = content.replace("max-w-[1600px] mx-auto ", "w-full ")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Removed max width constraints from all tabs")
