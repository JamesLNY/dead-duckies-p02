# dead-duckies
# Roster: James Lei, Kiran Soemardjo, Sarah Zou, Emaan Asif
# SoftDev pd4
# 2026-01-16f

from flask import Flask, render_template, request, session, redirect, flash, url_for
from flask_socketio import SocketIO, join_room, emit

app = Flask(__name__)
app.secret_key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
socketio = SocketIO(app)

import auth
app.register_blueprint(auth.bp) 

#restricting app to logged in users only
@app.before_request
def check_authentification():
    allowedEndpoints = ['static', 'auth.login_get', 'auth.login_post', 'auth.signup_get', 'auth.signup_post']
    if 'username' not in session and request.endpoint not in allowedEndpoints:
        flash("Please log in to view our website", 'info')
        return redirect(url_for('auth.login_get'))

@app.get('/game')
def game_get():
  session["username"] = "user1" # TESTING
  return render_template("game.html")

@app.post('/lobby')
def lobby_post():
  session["room"] = request.args["room"]
  return redirect("/game")

@socketio.on('join')
def handle_join(data):
  username = session["username"]
  room = session["room"]
  join_room(room)
  emit("message", f'{username} has entered room {room}', to=room)

if __name__ == '__main__':
  app.debug = True
  socketio.run(app)