from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML,CSS
from pathlib import Path


baseDir = Path(__file__).resolve().parent
templateDir = baseDir / "template"

env = Environment(
    loader=FileSystemLoader(templateDir)
)

template = env.get_template("report_template.html")

days = [
    {
        "name": "Segunda-feira",
        "date": "21/09/2026",
        "entries": [
            {
                "name": "João Silva",
                "entry_time": "08:00",
                "exit_time": "17:00",
            },
            {
                "name": "Maria Santos",
                "entry_time": "08:15",
                "exit_time": "17:30",
            },
        ],
    },
    {
        "name": "Terça-feira",
        "date": "22/09/2026",
        "entries": [
            {
                "name": "João Silva",
                "entry_time": "08:05",
                "exit_time": "17:10",
            },
        ],
    },
]

html = template.render(
    title="Relatório Semanal",
    days=days,
)

HTML(string=html).write_pdf(
    "reports/report.pdf",
    stylesheets=[
        CSS(filename=str(templateDir / "report_style.css"))
    ]
)
