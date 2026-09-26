from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML,CSS
from pathlib import Path


def genPdf(days):

    baseDir = Path(__file__).resolve().parent
    templateDir = baseDir / "template"

    env = Environment(
        loader=FileSystemLoader(templateDir)
    )

    template = env.get_template("report_template.html")

    html = template.render(
        title="Relatório Semanal",
        days=days,
    )

    archName = f"report-{datetime.now()}.pdf"

    HTML(string=html).write_pdf(
        f"reports/{archName}",
        stylesheets=[
            CSS(filename=str(templateDir / "report_style.css"))
        ]
    )

    return archName
