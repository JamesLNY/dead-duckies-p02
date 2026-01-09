from flask import Flask, render_template

app = Flask(__name__)
app.secret_key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"

@app.get('/')
def home_get():
  return render_template("game.html")

app.run(debug=True)