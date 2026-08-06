import sqlite3
conn = sqlite3.connect('mcc_saas.db')
c = conn.cursor()
c.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tables = c.fetchall()
print('Tables found:')
for t in tables:
    c.execute(f"SELECT COUNT(*) FROM [{t[0]}]")
    cnt = c.fetchone()[0]
    print(f'  {t[0]}: {cnt} rows')
conn.close()
