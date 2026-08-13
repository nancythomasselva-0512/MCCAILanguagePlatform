import sys
sys.path.insert(0, '.')
from app.core.database import engine
from sqlalchemy import text

plan_defaults = {
    'Free':         dict(tts_file_limit=3,   tts_char_limit=5000,   audio_file_limit=3,   audio_minutes_limit=15,  voice_session_limit=5,   voice_minutes_limit=15,  translation_text_limit=10,  translation_char_limit=10000),
    'Starter':      dict(tts_file_limit=20,  tts_char_limit=50000,  audio_file_limit=20,  audio_minutes_limit=60,  voice_session_limit=30,  voice_minutes_limit=60,  translation_text_limit=100, translation_char_limit=100000),
    'Professional': dict(tts_file_limit=100, tts_char_limit=250000, audio_file_limit=100, audio_minutes_limit=300, voice_session_limit=200, voice_minutes_limit=300, translation_text_limit=1000,translation_char_limit=500000),
    'Enterprise':   dict(tts_file_limit=0,   tts_char_limit=1000000,audio_file_limit=0,   audio_minutes_limit=1200,voice_session_limit=0,   voice_minutes_limit=1200,translation_text_limit=0,   translation_char_limit=2000000),
}

with engine.connect() as conn:
    for plan_name, vals in plan_defaults.items():
        sets = ', '.join([f'{k} = {v}' for k, v in vals.items()])
        result = conn.execute(text(f"UPDATE subscription_plans SET {sets} WHERE name = '{plan_name}'"))
        print(f'Updated {plan_name}: {result.rowcount} row(s)')
    conn.commit()

print('Seed update done!')
