from flask import Flask, render_template, request, session, redirect
from flask_socketio import SocketIO, join_room, emit

app = Flask(__name__)
app.secret_key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
socketio = SocketIO(app)

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