"""CRUD operations"""

from model import db, User, Folder, Recipe, Tag, RecipeTag, connect_to_db

def create_user(email, password, fname, lname):
    """Create and return a new user."""

    user = User(email=email, password=password, fname=fname, lname=lname)

    db.session.add(user)
    db.session.commit()

    return user

#HOW CAN I PASS AN INSTANCE AS AN ARGUMENT???
#The only way I could solve this is by doing so:

#create_folder((User.query.get(2), 'Appetizers'))
#so I have to look for a user instance first in order to pass it to my func? 
#is there a more organic way to do this?

def create_folder(user, folder_title):

    folder = Folder(user=user, folder_title=folder_title)

    db.session.add(folder)
    db.session.commit()

    return folder


#Same thing here
#create_recipe((User.query.get(2).folders[0]), 
#'Crepes with berries', 'Flour, milk, eggs, sugar, berries', 'Heat the skillet', 'self', '/static/crepes.png')

def create_recipe(folder, recipe_title, recipe_ingred, recipe_direct, 
                    recipe_src, picture_url):

    recipe = Recipe(folder=folder, recipe_title=recipe_title,
                    recipe_ingred=recipe_ingred, recipe_direct=recipe_direct,
                    recipe_src=recipe_src, picture_url=picture_url)

    db.session.add(recipe)
    db.session.commit()

    return recipe


def create_tag(user, tag_name):

    tag = Tag(user=user, tag_name=tag_name)

    db.session.add(tag)
    db.session.commit()

    return tag


def create_recipe_tag(tag, recipe):

    recipe_tag = RecipeTag(tag=tag, recipe=recipe)

    db.session.add(recipe_tag)
    db.session.commit()

    return recipe_tag
    

if __name__ == '__main__':
    from server import app
    connect_to_db(app)






