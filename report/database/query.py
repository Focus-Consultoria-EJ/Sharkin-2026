from sqlalchemy import text
from database.connection import returnConn

def fetchDuties():
    engine = returnConn()
    with engine.connect() as conn:
       result =  conn.execute(text("""
        SELECT duties."dateTime_in" ,duties."dateTime_out", users.name 
        FROM duties 
        INNER JOIN users ON duties.user_id = users.user_id; 
        """))

    return result.mappings().all()
