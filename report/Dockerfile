ARG PYTHON_VERSION=3.14
FROM python:${PYTHON_VERSION}-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

# Dependências de sistema do WeasyPrint (Pango/HarfBuzz), fontes e fuso horário
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpango-1.0-0 \
        libpangoft2-1.0-0 \
        libharfbuzz-subset0 \
        fonts-liberation \
        fonts-dejavu-core \
        tzdata \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instala as dependências Python primeiro, para aproveitar o cache de camadas
COPY requirements.txt .
RUN pip install -r requirements.txt

# Código da aplicação (o .dockerignore deixa de fora .env, .venv e PDFs gerados)
COPY . .

# Usuário sem privilégios, com permissão de escrita na pasta dos PDFs
RUN useradd --create-home --shell /usr/sbin/nologin appuser \
    && mkdir -p /app/pdf/reports \
    && chown -R appuser:appuser /app
USER appuser

CMD ["python", "app.py"]