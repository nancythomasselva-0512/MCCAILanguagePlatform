import re

def fix_hue(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # The base image is purple. To make it teal/green, we rotate by 250 degrees.
    content = re.sub(r'hue-rotate-\[[0-9]+deg\]', 'hue-rotate-[250deg]', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_hue('src/components/tools/AudioToText.tsx')
fix_hue('src/components/tools/VoiceToText.tsx')
fix_hue('src/components/tools/TextToVoice.tsx')
fix_hue('src/components/tools/TextTranslation.tsx')
