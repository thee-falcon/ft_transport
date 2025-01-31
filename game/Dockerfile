FROM python:3.14-rc-slim
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY requirements.txt /app/

RUN apt-get update && apt-get install -y \
    libpq-dev \
    && pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 8082

CMD ["python", "back/manage.py", "runserver", "0.0.0.0:8082"]
# CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput && python manage.py runserver 0.0.0.0:8000"]


# pip install --upgrade pip