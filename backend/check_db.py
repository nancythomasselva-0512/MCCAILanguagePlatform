import sqlite3

conn = sqlite3.connect('../mcc_saas.db')
cursor = conn.cursor()

# List all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tables = cursor.fetchall()
print("=== DATABASE TABLES ===")
for t in tables:
    print(f"  - {t[0]}")

print("\n=== ROW COUNTS ===")
for t in tables:
    cursor.execute(f"SELECT COUNT(*) FROM {t[0]}")
    count = cursor.fetchone()[0]
    print(f"  {t[0]}: {count} rows")

print("\n=== USERS (tenants) ===")
cursor.execute("SELECT id, name, email, role, created_at FROM tenants LIMIT 10")
rows = cursor.fetchall()
for r in rows:
    print(f"  id={r[0]} | name={r[1]} | email={r[2]} | role={r[3]} | created={r[4]}")

print("\n=== SUBSCRIPTIONS ===")
cursor.execute("SELECT id, tenant_id, plan_name, status, start_date, expiry_date FROM user_subscriptions LIMIT 10")
rows = cursor.fetchall()
for r in rows:
    print(f"  id={r[0]} | tenant={r[1]} | plan={r[2]} | status={r[3]} | start={r[4]} | expiry={r[5]}")

print("\n=== PAYMENTS ===")
cursor.execute("SELECT id, tenant_id, amount, currency, payment_status, transaction_date FROM payments LIMIT 10")
rows = cursor.fetchall()
for r in rows:
    print(f"  id={r[0]} | tenant={r[1]} | amount={r[2]} {r[3]} | status={r[4]} | date={r[5]}")

conn.close()
