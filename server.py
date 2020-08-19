"""Server for Gastronotes app."""

from flask import (Flask, jsonify, render_template, request, flash, session,
                   redirect)
from model import connect_to_db, Folder
import crud
from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


@app.route('/')
def homepage():
    """View homepage"""

    if "userid" in session:
        return redirect('/myfolders')
    else:
        return render_template("homepage.html")


@app.route('/signup', methods=["GET","POST"])
def signup():
    """View sign up form and register user"""

    if request.method == "GET":
    
        return render_template("signup.html")

    elif request.method == "POST":

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

@app.route('/login', methods = ["GET", "POST"])
def login():
    """View log in form and log user in"""

    if request.method == "GET":

        return render_template("login.html")
    
    elif request.method == "POST":

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
    """Showing folders to the signed-in user"""

    if "userid" in session:

        current_user_id = session['userid']
        folders = crud.show_user_folders(current_user_id)

        return render_template('myrecipes.html', folders=folders)


@app.route('/myfolders/myrecipes/<int:folder_id>')
def show_folder_recipes(folder_id):
    """Showing recipes in folder"""

    recipes_list = crud.show_recipe_by_folder(folder_id)

    return jsonify(recipes_list)


@app.route('/myfolders/edit', methods=["POST"])
def update_recipe():
    """Updating existing recipe"""

    recipe_title = request.form['recipe_title']
    recipe_ingred = request.form['recipe_ingred']
    recipe_direct = request.form['recipe_direct']
    recipe_id = request.form['recipe_id']

    crud.update_recipe(recipe_id, recipe_title, recipe_ingred, recipe_direct)

    print(f"This is Server - recipe id = {recipe_id}, {recipe_title}")

    return jsonify({"success" : "Your recipe was updated!"})



# ----- testing React route ------
@app.route("/api/home")
# @app.route("/api/login")
def root():
    return render_template("root.html")
# --------------------------------

# ----- keeping this for now, need to fix bugs in funct on line 50 ------ 
# @app.route('/login', methods=["POST"])
# def show_user_profile():
#     """Log user in"""

#     email = request.form.get("email")
#     password = request.form.get("password")

#     user_info = crud.get_user_by_email(email)

#     if password == user_info.password:
#         #adding user_id to the Flask session
#         session['userid'] = user_info.user_id
#         flash(f'Logged in as {user_info.email}!')
#         return redirect('/myfolders')
#     else:
#         flash('Wrong password!')


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)

