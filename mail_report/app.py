from sqlalchemy import create_engine, text

with engine.connect() as conn:
    result = conn.execute(text("""
        SELECT
            name,
            amount,
            created_at
        FROM sales
        WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
    """))

    data = result.mappings().all()