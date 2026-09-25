from datetime import datetime
from database.query import fetchDuties

duties = fetchDuties()


dutyTime = datetime.fromisoformat(str(duties[0].dateTime_in))
print(dutyTime.time()) #Extraio apenas o tempo