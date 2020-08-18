"""Server for Gastronotes app."""

from flask import (Flask, jsonify, render_template, request, flash, session,
                   redirect)
from model import connect_to_db, Folder
import crud
from jinja2 import StrictUndefined


app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined



# ----- testing React route ------
@app.route("/api/home")
# @app.route("/api/login")
def root():
    return render_template("root.html")
# --------------------------------


@app.route('/')
def homepage():
    """View homepage"""

    return render_template("homepage.html")


@app.route('/signup')
def signup():
    """View sign up form"""

    return render_template("signup.html")


@app.route('/signup', methods=["POST"])
def register_user():

    email = request.form.get("email")
    password = request.form.get("password")
    fname = request.form.get("fname")
    lname = request.form.get("lname")

    user_info = crud.get_user_by_email(email)

    if user_info:
        flash("Account with this email already exists!")
        
    else:
        crud.create_user(email, password, fname, lname)
        flash("Account created! Yay!")

    return redirect('/')


@app.route('/login')
def login():
    """View log in form"""

    return render_template("login.html")


@app.route('/login', methods=["POST"])
def show_user_profile():
    """Log user in"""

    email = request.form.get("email")
    password = request.form.get("password")

    user_info = crud.get_user_by_email(email)

    if password == user_info.password:
        #adding user_id to the Flask session
        session['userid'] = user_info.user_id
        flash(f'Logged in as {user_info.email}!')
        return redirect('/myfolders')
    else:
        flash('Wrong password!')

@app.route('/myfolders')
def show_user_folders():

    if session['userid']:

        current_user_id = session['userid']
        folders = crud.show_user_folders(current_user_id)

        return render_template('myrecipes.html', folders=folders)

@app.route("/myfolders/myrecipes/<int:folder_id>")
def show_folder_recipes(folder_id):

    recipes_list = crud.show_recipe_by_folder(folder_id)

    return jsonify(recipes_list)


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)

