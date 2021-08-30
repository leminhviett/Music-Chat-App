FROM python:3.7-slim-buster

WORKDIR chat-app

COPY ./requirements.txt ./requirements.txt
RUN pip install -r ./requirements.txt

COPY ./static/ ./static
COPY ./templates/ ./templates/
COPY ./database.py ./database.py
COPY ./database.py ./database.py
COPY ./main.py ./main.py

CMD ["python", "./main.py"]
