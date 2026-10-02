from time import strftime
import os
import smtplib

from email.message import EmailMessage
from pathlib import Path
from datetime import date, timedelta, datetime

from dotenv import load_dotenv

load_dotenv()

def send_report(pdf_path: Path):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    recipient = os.getenv("REPORT_RECIPIENT")

    message = EmailMessage()

    #Os relatórios sempre são enviados no último dia da semana
    #Logo temos de voltar ao princípio
    endWeekDate = datetime.now()
    startWeekDate = endWeekDate - timedelta(days=7)

    message["From"] = smtp_user
    message["To"] = recipient
    message["Subject"] = f"Relatório semanal de plantões:{startWeekDate.strftime("%d/%m/%Y")}-{endWeekDate.strftime("%d/%m/%Y")}"


    message.set_content(f"Segue em anexo o relatório semanal de plantões.")

    template_dir = Path(__file__).parent / "template"
    html = (template_dir / "email_template.html").read_text(encoding="utf-8")
    message.add_alternative(html, subtype="html")

    html_part = message.get_payload()[1]
    for filename, cid in [("Linha (1).jpg", "topo"), ("Linha (5).jpg", "rodape")]:
        with open(template_dir / "assets" / filename, "rb") as f:
            html_part.add_related(
                f.read(),
                maintype="image",
                subtype="jpeg",
                cid=f"<{cid}>",  
            )



    with open(pdf_path, "rb") as file:
        pdf_data = file.read()

    message.add_attachment(
        pdf_data,
        maintype="application",
        subtype="pdf",
        filename=pdf_path.name,
    )

    with smtplib.SMTP(smtp_host, smtp_port) as smtp:
        smtp.starttls()
        smtp.login(smtp_user, smtp_password)
        smtp.send_message(message)