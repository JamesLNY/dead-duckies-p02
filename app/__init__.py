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
    session["game"] = str(game["id"])
    return redirect("/game")

@app.get("/join_lobby")
def join_lobby_get():
    game = request.args["game"]
    general_query("UPDATE games SET player2=? WHERE id=?", (session["username"], game))
    session["game"] = str(game)
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
    game = select_query("SELECT * FROM games WHERE id=?", (session["game"]))[0]
    if (game["player2"]):
        emit("game start", {"turn": game["player1"] == session["username"]})
        emit("game start", {"turn": game["player2"] == session["username"]}, room=session["game"], include_self=False)

@socketio.on("buy tile")
def buy_tile(data):
    # general_query("UPDATE tiles SET owner=? WHERE game=? AND x_pos=? AND y_pos=?", (session["username"], str(session["game"]), data["x"], data["y"]))
    emit("buy tile", data, room=session["game"], include_self=False)

@socketio.on("build improvement")
def build_improvement(data):
    # general_query("UPDATE tiles SET improvement=? WHERE game=? AND x_pos=? AND y_pos=?", (session["username"], data["x"], data["y"]))
    emit("build improvement", data, room=session["game"], include_self=False)

@socketio.on("build district")
def build_district(data):
    # insert_query("districts", {
    #     "game": session["game"],
    #     "name": data["name"],
    #     "x_pos": data["x"],
    #     "y_pos": data["y"]
    # })
    emit("build district", data, room=session["game"], include_self=False)

@socketio.on("build building")
def build_building(data):
    district = select_query("SELECT * FROM districts WHERE game=? AND name=? AND x_pos=? AND y_pos=?", (
        session["game"], data["district"], data["x"], data["y"]
    ))[0]
    insert_query("buildings", {
        "district": district["id"],
        "name": data["name"]
    })
    emit("build building", data, room=session["game"], include_self=False)

@socketio.on("finish tech")
def finish_tech(data):
    insert_query("technologies", {"game": session["game"], "player": session["username"], "name": data["technology_name"]})

@socketio.on("end turn")
def end_turn(data):
    # for key, value in data.items():
    #     general_query("UPDATE resources SET amount_stored=? WHERE game=? AND player=? AND name=?", (
    #         value,
    #         session["game"],
    #         session["username"],
    #         key
    #     ))
    # game = select_query("SELECT * FROM games WHERE id=?", (session["game"]))
    # if not game["player1Turn"]:
    #     general_query("UPDATE games SET turn=turn+1 WHERE id=?", (session["game"]))
    # general_query("UPDATE games SET player1Turn=? WHERE id=?", (not game["player1Turn"]))
    emit("end turn", data, room=session["game"], include_self=False)

@socketio.on("win game")
def win_game(data):
    general_query("UPDATE games SET winner=? WHERE id=?", (session["username"], session["game"]))
    emit("win game", data, room=session["game"], include_self=False)

if __name__ == '__main__':
    app.debug = True
    socketio.run(app)
