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

    folder = Folder.query.get(folder_id)

    recipes = folder.recipes

    recipes_list = []

    for recipe in recipes:
        recipes_list.append({"recipe_id" : recipe.recipe_id,
                            "folder_id" : recipe.folder_id,
                            "recipe_title" : recipe.recipe_title,
                            "recipe_ingred" : recipe.recipe_ingred,
                            "recipe_direct": recipe.recipe_direct,
                            "recipe_src" : recipe.recipe_src,
                            "picture_url" : recipe.picture_url})

    return jsonify(recipes_list)


# @app.route("/myrecipes/<int:recipe_id>")
# def show_user_recipes(recipe_id):

#     recipe = Recipe.query.get(recipe_id)

#     if recipe:
#         return jsonify({"recipe_id" : recipe.recipe_id,
#                         "folder_id" : recipe.folder_id,
#                         "recipe_title" : recipe.recipe_title,
#                         "recipe_ingred" : recipe.recipe_ingred,
#                         "recipe_direct": recipe.recipe_direct,
#                         "recipe_src" : recipe.recipe_src,
#                         "picture_url" : recipe.picture_url})
#     else:
#         return jsonify("recipe_id" : "error",
#                         "message" : "No recipe found with this ID")



    # current_user_id = session['userid']

    # folders = crud.show_user_folders(current_user_id)
    # # folders: 
    # #[<Folder folder_id=1, title=quick dinners>, <Folder folder_id=2, title=snacks>, 
    # # <Folder folder_id=3, title=quick dinners>, <Folder folder_id=4, title=entrees>, 
    # # <Folder folder_id=5, title=breakfast>]

    # dic = {}

    # for folder in folders:
    # # e.g. <Folder folder_id=1, title=quick dinners>

    #     dic[folder.folder_title] : ""
    #     # e.g. "quick dinners" 

    #     for recipe in folder.recipes:
    #     #[<Recipe recipe_id=1, title=Shrimp, Watercress and Farro Salad>, 
    #     # <Recipe recipe_id=2, title=Mexican Chicken Stew>, 
    #     # <Recipe recipe_id=3, title=BUTTERY SOFT PRETZELS> 

    #         dic[folder.folder_title] = {recipe.recipe_title : {"recipe_id" : recipe.recipe_id,
    #                                                             "folder_id" : recipe.folder_id,
    #                                                             "recipe_ingred" : recipe.recipe_ingred,
    #                                                             "recipe_direct": recipe.recipe_direct,
    #                                                             "recipe_src " : recipe.recipe_src,
    #                                                             "picture_url" : recipe.picture_url}}

    # return jsonify(dic)

# <-------- NEED TO RETURN SOMETHING LIKE THIS: ------------>
# {   "dinners" : {"chicken curry" : {"ingredients" : "1 onion, 2 peppers"},
#                   "beef stroganoff" : {"ingredients" : "1 onion, 2 peppers"}}
#             },

#     "breakfasts" : {"hashbrowns" : {"ingredients" : "1 onion, 2 peppers"},
#                       "scrambled eggs" : {"ingredients" : "1 onion, 2 peppers"}
#                 }
# }
        


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)

