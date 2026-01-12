# DeadDuckies
# Roster: James Lei, Kiran Soemardjo, Sarah Zou, Emaan Asif
# SoftDev pd4
# 2026-01-16f

import sqlite3

DB_FILE = "data.db"

db = sqlite3.connect(DB_FILE)
c = db.cursor()

c.executescript("""
    DROP TABLE IF EXISTS profiles;
    CREATE TABLE profiles (
        username TEXT PRIMARY KEY,
        password TEXT               
    );
                    
    DROP TABLE IF EXISTS games;
    CREATE TABLE games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player1 TEXT,
        player2 TEXT,
        FOREIGN KEY (player1) REFERENCES profiles(username),
        FOREIGN KEY (player2) REFERENCES profiles(username)
    );

    DROP TABLE IF EXISTS resources;
    CREATE TABLE resources (
        game INTEGER,
        player TEXT,
        name TEXT,
        amount_stored INTEGER,
        FOREIGN KEY (game) REFERENCES games(id),
        FOREIGN KEY (player) REFERENCES profiles(username)
    );                                      

    DROP TABLE IF EXISTS tiles;
    CREATE TABLE tiles (
        game INTEGER,
        owner TEXT,
        x_pos INTEGER,
        y_pos INTEGER,
        resources TEXT,
        improvement TEXT,
        FOREIGN KEY (game) REFERENCES games(id),
        FOREIGN KEY (owner) REFERENCES profiles(username)
    );      
                    
    DROP TABLE IF EXISTS technologies;
    CREATE TABLE technologies (
        game INTEGER,
        player TEXT,
        name TEXT,
        FOREIGN KEY (game) REFERENCES games(id),
        FOREIGN KEY (player) REFERENCES profiles(username)
    );

    DROP TABLE IF EXISTS districts;
    CREATE TABLE districts (
        game INTEGER,
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        x_pos INTEGER,
        y_pos INTEGER,
        FOREIGN KEY (game) REFERENCES games(id)
    );

    DROP TABLE IF EXISTS buildings;
    CREATE TABLE buildings (
        district INTEGER,
        name TEXT,
        FOREIGN KEY (district) REFERENCES districts(id)
    );

    DROP TABLE IF EXISTS focuses;
    CREATE TABLE focuses (
        game INTEGER,
        player TEXT,
        name TEXT,
        FOREIGN KEY (game) REFERENCES games(id),
        FOREIGN KEY (player) REFERENCES profiles(username)
    );

    DROP TABLE IF EXISTS units;
    CREATE TABLE units (
        game INTEGER,
        owner TEXT,
        x_pos INTEGER,
        y_pos INTEGER,
        name TEXT,
        health INTEGER,
        FOREIGN KEY (game) REFERENCES games(id),
        FOREIGN KEY (owner) REFERENCES profiles(username)
    );
""")

db.commit()
db.close()