# DeadDuckies
# Roster: James Lei, Kiran Soemardjo, Sarah Zou, Emaan Asif
# SoftDev pd4
# 2026-01-16f

from flask import Flask, render_template, request, session, redirect, flash, url_for
from flask_socketio import SocketIO, join_room, emit
from db import general_query, select_query, insert_query
import json

app = Flask(__name__)
app.secret_key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
socketio = SocketIO(app)

import auth
app.register_blueprint(auth.bp) 

#restricting app to logged in users only
@app.before_request
def check_authentification():
    allowedEndpoints = ['static', 'home_get', 'auth.logout_get', 'game_get']
    if 'game' in session and request.endpoint not in allowedEndpoints:
        flash("You're already in a game; Please do not visit any other pages", 'error')
        return redirect(url_for('home_get'))
    allowedEndpoints = ['static', 'auth.login_get', 'auth.login_post', 'auth.signup_get', 'auth.signup_post']
    if 'username' not in session and request.endpoint not in allowedEndpoints:
        flash("Please log in to view our website", 'info')
        return redirect(url_for('auth.login_get'))

@app.get('/')
def home_get():
  return render_template("home.html")

# LOBBY STUFF

@app.get("/lobby")
def lobby_get():
    games = select_query("SELECT * FROM games WHERE player2 IS NULL")
    return render_template("lobby.html", games=games)

@app.get("/create_lobby")
def create_lobby_get():
    game = insert_query("games", {"player1": session["username"]})
    session["game"] = game["id"]
    return redirect("/game")

@app.get("/join_lobby")
def join_lobby_get():
    game = request.args["game"]
    session["game"] = game
    return redirect("/game")

# GAME STUFF

@app.get("/game")
def game_get():
    game = select_query("SELECT * FROM games WHERE id=?", [session["game"]])[0]

    if game["player2"] is None: 
        map = json.load(open("./static/json/map.json"))
        for y in range(len(map)):
            for x in range(len(map[y])):
                insert_query("tiles", {
                    "game": session["game"],
                    "x_pos": x,
                    "y_pos": y,
                    "terrain_type": map[y][x]["terrain_type"],
                    "resource": map[y][x]["resource"]
                })

    resources = ["science", "gold", "food", "production", "population", "iron", "horses", "niter", "coal"]
    for resource in resources:
        insert_query("resources", {
            "game": session["game"],
            "player": session["username"],
            "name": resource,
        })

    return render_template("game.html")

@socketio.on("join")
def handle_join(data):
    join_room(session["game"])
    emit("message", "hello", room=session["game"])

# @socketio.on("conquer tile")
# def conquer_tile(data):
#     general_query("UPDATE tiles SET owner=? WHERE game=? AND x_pos=? AND y_pos=?", (session["username"], data["x"], data["y"]))
#     emit("conquer tile", data, )

@socketio.on("build improvement")
def update_tile(data):
    general_query("UPDATE tiles SET improvement=? WHERE ")
 
if __name__ == '__main__':
    app.debug = True
    socketio.run(app)