from flask_cors import CORS
from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO, join_room, leave_room, emit
import os

from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path  # Python 3.6+ only

env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
socket = SocketIO(app, manage_session=False, cors_allowed_origins="*")
app.debug = True

app.config['SECRET_KEY'] = 'secret'
CORS(app)


@app.route("/")
def index():
    if 'username' in session:
        return redirect(url_for("chat"))
    return render_template("index.html")


@app.route("/chat", methods=['GET', 'POST'])
def chat():
    if request.method == 'POST':
        username, room = request.form["username"], request.form["room"]
        session["username"] = username
        session["room"] = room
        return render_template("chat.html", session=session, clientID=str(os.getenv('CLIENT_ID')))
    else:
        # check if user login
        if "username" in session:
            return render_template("chat.html", session=session)
        else:
            return redirect(url_for("index"))


@app.route("/leave", methods=['GET', 'POST'])
def leave():
    session.clear()
    return redirect(url_for("index"))


@socket.on('join', namespace='/chat')
def join(message):
    name = session['username']
    room = session['room']
    time = datetime.now()

    join_room(room)
    emit('status', {"username": name, "content": "has joined", "time": parseTime(time)}, room=room)


@socket.on('message', namespace='/chat')
def send_msg(message):
    name = session['username']
    room = session['room']
    time = datetime.now()
    content = message['content']

    if content == "":
        return
    # broadcast to everyone in the room of new message
    emit('message', {"username": name, "content": content, "time": parseTime(time)}, room=room)


@socket.on('leave', namespace='/chat')
def leave(message):
    room = session['room']
    name = session['username']
    time = datetime.now()

    # cannot clear session here. dk why
    leave_room(room)
    emit('status', {"username": name, "content": "has left", "time": parseTime(time)}, room=room)


@socket.on('play_music', namespace='/chat')
def play_music(info):
    room = session['room']
    name = session['username']
    print("broadcast music")
    emit('play_music', {"id" : info['id']}, room=room)

    content = f"'s just played {info['track_name']}"
    time = datetime.now()

    emit('status', {"username": name, "content": content, "time": parseTime(time)}, room=room)


def parseTime(obj):
    obj = str(obj)
    date = obj.split(" ")[0]
    time = ":".join(obj.split(" ")[-1].split(":")[:-1])
    return f"{time} {date}"


if __name__ == '__main__':
    socket.run(app, host='0.0.0.0')
