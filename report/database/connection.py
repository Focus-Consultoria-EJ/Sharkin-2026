from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()


def returnConn():
    engine = create_engine(os.environ["DATABASE_URL"])
    return engine
