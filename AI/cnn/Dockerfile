FROM python:3.10

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir \
    --default-timeout=1000 \
    --retries 10 \
    --trusted-host pypi.org \
    --trusted-host files.pythonhosted.org \
    -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "src.predict:app", "--host", "0.0.0.0", "--port", "8000"]