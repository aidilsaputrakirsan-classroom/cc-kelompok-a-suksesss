FROM python:3.12-slim AS base

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

FROM base AS development
ENV ENVIRONMENT=development
ENV DEBUG=True
ENV LOG_LEVEL=DEBUG
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

FROM base AS production
ENV ENVIRONMENT=production
ENV DEBUG=False
ENV LOG_LEVEL=INFO

RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

CMD ["sh", "-c", "if [ -z \"$DATABASE_URL\" ]; then echo 'ERROR: DATABASE_URL must be set in production and must not use the SQLite default.' >&2; exit 1; fi; case \"$DATABASE_URL\" in sqlite:*) echo 'ERROR: SQLite is not supported with --workers 4 in production. Configure a non-SQLite DATABASE_URL.' >&2; exit 1 ;; esac; exec python -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4"]