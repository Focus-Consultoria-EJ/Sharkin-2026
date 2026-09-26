from sqlalchemy import text
from database.connection import returnConn

def fetchDuties(start_date, end_date):
    engine = returnConn()
    with engine.connect() as conn:
        query = text("""
        SELECT duties."dateTime_in" ,duties."dateTime_out", users.name 
        FROM duties 
        INNER JOIN users ON duties.user_id = users.user_id
        WHERE duties."dateTime_in" >= :start_date
        AND duties."dateTime_in" < :end_date
        ORDER BY duties."dateTime_in";
        """)

        result =  conn.execute(
            query,
            {
                "start_date": start_date,
                "end_date": end_date,
            }
            )

    return result.mappings().all()
