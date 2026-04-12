FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install --default-timeout=300 -r requirements.txt \
    --index-url https://download.pytorch.org/whl/cpu \
    --extra-index-url https://pypi.org/simple
COPY . .
EXPOSE 8000
CMD ["uvicorn", "src.predict:app", "--host", "0.0.0.0", "--port", "8000"]