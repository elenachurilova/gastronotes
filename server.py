"""Server for Gastronotes app."""

from flask import (Flask, jsonify, render_template, request, flash, session,
                   redirect)
from model import connect_to_db, Folder, User, Recipe, Tag, RecipeTag
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

@app.route('/logout', methods = ["GET"])
def logout():
    """Log user out"""

    session.pop("userid", None)

    return render_template("homepage.html")
    

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

    return jsonify({"success" : "Your recipe was updated!"})


@app.route('/myfolders/add_folder', methods=["POST"])
def add_new_folder():
    """Adding new folder from UI"""

    folder_title = request.form['folder_title']
    user_id = session['userid']
    user = User.query.get(user_id)

    crud.create_folder(user, folder_title)

    return jsonify({"success" : "New folder was added!"})

@app.route('/myfolders/add_recipe', methods=["POST"])
def add_new_recipe():
    """Adding a new recipe into a folder"""

    recipe_title = request.form['recipe_title']
    recipe_ingred = request.form['recipe_ingred']
    recipe_direct = request.form['recipe_direct']
    recipe_src = request.form['recipe_src']
    picture_url = request.form['picture_url']
    folder_id = request.form['folderid']
    current_folder = Folder.query.get(folder_id)

    crud.create_recipe(current_folder, recipe_title, recipe_ingred, recipe_direct, 
                    recipe_src, picture_url)

    folders = crud.show_user_folders(session['userid'])

    return render_template('myrecipes.html', folders=folders)

if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)

