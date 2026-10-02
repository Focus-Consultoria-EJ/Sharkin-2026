from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML,CSS
from pathlib import Path
import base64

def image_to_data_uri(path: Path, mime="image/png"):
    with open(path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")
    return f"data:{mime};base64,{encoded}"

def genPdf(days):
    baseDir = Path(__file__).resolve().parent
    templateDir = baseDir / "template"
    reportsDir = baseDir / "reports"
    reportsDir.mkdir(parents=True, exist_ok=True)

    env = Environment(
        loader=FileSystemLoader(templateDir)
    )

    template = env.get_template("report_template.html")

    logoBase64 = image_to_data_uri(templateDir / "assets/logo.png")


    html = template.render(
        title="Relatório Semanal",
        days=days,
        logoBase64=logoBase64
    )

    archName = f"report-{datetime.now()}.pdf"
    pdfPath = reportsDir / archName

    HTML(string=html).write_pdf(
        str(pdfPath),
        stylesheets=[
            CSS(filename=str(templateDir / "report_style.css"))
        ]
    )

    return archName, pdfPath
