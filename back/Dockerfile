FROM python:3.10-slim

WORKDIR /back

COPY req.txt .
COPY ./run.sh /
RUN chmod +x /run.sh
RUN pip install --no-cache-dir -r req.txt

EXPOSE 8000
RUN python -m venv .venv
RUN echo "source .venv/bin/activate" >> ~/.bashrc
RUN pip install --upgrade pip

RUN pip install -r req.txt

CMD ["bash", "/run.sh"]
