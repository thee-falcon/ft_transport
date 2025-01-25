FROM python:3.9.1-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY requirements.txt /app/

RUN apt-get update && apt-get install -y \
    libpq-dev \
    && pip install --no-cache-dir -r requirements.txt

EXPOSE 8082

ENTRYPOINT ["tail", "-f", "/dev/null"]

# CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput && python manage.py runserver 0.0.0.0:8000"]
