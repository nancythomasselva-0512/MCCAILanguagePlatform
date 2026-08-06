from sqlalchemy import create_engine, text
engine = create_engine('mssql+pyodbc://sa:Admin123@localhost/master?driver=ODBC+Driver+17+for+SQL+Server')
with engine.connect() as conn:
    r = conn.execute(text('SELECT feature_name FROM feature_provider_mapping'))
    print([x[0] for x in r])
