from typing import Any
from pathlib import Path
from emails.sender import send_report
from datetime import date, timedelta, datetime
from database.query import fetchDuties
from pdf.format.format_entries import formatDays
from pdf.pdf_gen import genPdf


def main():
    start_date = (datetime.now() - timedelta(days=7)).date()
    end_date = datetime.now().date() + timedelta(2)

    duties = fetchDuties(
        start_date,
        end_date,
    )

    days: list[dict[str, list[Any] | str | Any]] = formatDays(duties)
    pdfName = genPdf(days)
    print(f"PDF gerado:{pdfName}")
    reportPath = Path(f"reports/{pdfName}")
    # send_report(reportPath)
main()