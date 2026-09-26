from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from collections import defaultdict

weekdays = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
]


def formatDays(duties):
    days = defaultdict(list)
    dates = {}
    for duty in duties:
        date_time_in = duty["dateTime_in"].replace(tzinfo=timezone.utc).astimezone(ZoneInfo("America/Sao_Paulo"))
        date_time_out = duty["dateTime_out"].replace(tzinfo=timezone.utc).astimezone(ZoneInfo("America/Sao_Paulo"))

        day_index = date_time_in.weekday()

        dates[day_index] = date_time_in.strftime("%d/%m/%Y")

        days[day_index].append({
            "name": duty["name"],
            "entry_time": date_time_in.strftime("%H:%M"),
            "exit_time": date_time_out.strftime("%H:%M"),
        })
    result = []

    for day_index, day_name in enumerate(weekdays):

        result.append({
            "name": day_name,
            "date": dates.get(day_index, ""),
            "entries": days.get(day_index, []),
        })

    return result