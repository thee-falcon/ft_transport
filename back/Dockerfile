FROM python:3.10-slim

WORKDIR /back

COPY requirements.txt .
COPY run.sh /
RUN chmod +x /run.sh

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    libjpeg-dev zlib1g-dev libfreetype6-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install psycopg2-binary

# Expose port for the Django app
EXPOSE 8000

# Run the application
CMD ["bash", "/run.sh"]
