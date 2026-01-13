# DeadDuckies
# Roster: James Lei, Kiran Soemardjo, Sarah Zou, Emaan Asif
# SoftDev pd4
# 2026-01-16f

from flask import Flask, render_template, request, session, redirect, flash, url_for
from flask_socketio import SocketIO, join_room, emit
import uuid

app = Flask(__name__)
app.secret_key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
socketio = SocketIO(app)

lobbies = {}

import auth
app.register_blueprint(auth.bp) 

#restricting app to logged in users only
@app.before_request
def check_authentification():
  allowedEndpoints = ['static', 'auth.login_get', 'auth.login_post', 'auth.signup_get', 'auth.signup_post']
  if 'username' not in session and request.endpoint not in allowedEndpoints:
    flash("Please log in to view our website", 'info')
    return redirect(url_for('auth.login_get'))

@app.get('/')
def home_get():
  return redirect("/game")

@app.get("/game")
def game_get():
    if "username" not in session:
        flash("Please log in", "error")
        return redirect(url_for("auth.login_get"))
    if "room" not in session:
        return redirect("/lobby")
    return render_template("game.html", lobby_id=session["room"], username=session["username"])


@app.post("/create")
def create_lobby():
    lobby_id = str(uuid.uuid4()).replace("-", "")[:6].upper()  
    session["room"] = lobby_id
    if lobby_id not in lobbies:
        lobbies[lobby_id] = []
    return redirect("/game")

@app.post("/join")
def join_lobby():
    lobby_id = request.form["room"].upper()
    if lobby_id not in lobbies:
        flash("Lobby does not exist", "error")
        return redirect("/lobby")
    session["room"] = lobby_id
    return redirect("/game")

@app.get("/lobby")
def lobby_get():
    return render_template("lobby.html")

def handle_join(data):
    global lobbies
    lobby_id = data.get("lobby_id")
    username = data.get("username")
    if not lobby_id or not username:
        return
    if lobby_id not in lobbies:
        lobbies[lobby_id] = []
    if username not in lobbies[lobby_id]:
        lobbies[lobby_id].append(username)
    join_room(lobby_id)
    emit("lobby_update", lobbies[lobby_id], room=lobby_id)

if __name__ == '__main__':
    app.debug = True
    socketio.run(app)