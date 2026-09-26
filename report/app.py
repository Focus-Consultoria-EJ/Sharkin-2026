from typing import Any
from pathlib import Path
from emails.sender import send_report
from datetime import date, timedelta, datetime
from database.query import fetchDuties
from pdf.format.format_entries import formatDays
from pdf.pdf_gen import genPdf
from apscheduler.schedulers.blocking import BlockingScheduler

def main():
    today = datetime.now().date() #Sexta-feira, em teoria
    start_date = today - timedelta(days=today.weekday()) #segunda-feira, em teoria
    #como vai ser disparado toda sexta, deve-se calcular a data de inicio(começo da semana) e fim(o dia que foi disparado) do filtro
    duties = fetchDuties(
        start_date,
        today,
    )
    print(duties)
    days: list[dict[str, list[Any] | str | Any]] = formatDays(duties)
    pdfName = genPdf(days)
    print(f"PDF gerado:{pdfName}")
    reportPath = Path(f"reports/{pdfName}")
    send_report(reportPath)

main()
scheduler = BlockingScheduler(timezone="America/Sao_Paulo")

scheduler.add_job(
    main,
    trigger="cron",
    day_of_week="fri",
    hour=18,
    minute=20,
)

scheduler.start()