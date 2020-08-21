"""CRUD operations"""

from model import db, User, Folder, Recipe, Tag, RecipeTag, connect_to_db


def create_user(email, password, fname, lname):
    """Create and return a new user."""

    user = User(email=email, password=password, fname=fname, lname=lname)

    db.session.add(user)
    db.session.commit()

    return user

def create_folder(user, folder_title):
    """Create and return a new folder"""

    folder = Folder(user=user, folder_title=folder_title)

    db.session.add(folder)
    db.session.commit()

    return folder


def create_recipe(folder, recipe_title, recipe_ingred, recipe_direct, 
                    recipe_src, picture_url):
    """Create and return a new recipe"""

    recipe = Recipe(folder=folder, recipe_title=recipe_title,
                    recipe_ingred=recipe_ingred, recipe_direct=recipe_direct,
                    recipe_src=recipe_src, picture_url=picture_url)

    db.session.add(recipe)
    db.session.commit()

    return recipe


def create_tag(user, tag_name):
    """Create and return a new tag"""

    tag = Tag(user=user, tag_name=tag_name)

    db.session.add(tag)
    db.session.commit()

    return tag


def create_recipe_tag(tag, recipe):
    """Create and return a new recipe tag"""

    recipe_tag = RecipeTag(tag=tag, recipe=recipe)

    db.session.add(recipe_tag)
    db.session.commit()

    return recipe_tag

def get_user_by_email(email):
    """Find and return a user by their email"""

    return User.query.filter(User.email==email).first()


def show_user_folders(user_id):
    """Find and return user's folder by user id"""

    current_user = User.query.get(user_id)
    user_folders = current_user.folders

    return user_folders

def show_recipe_by_folder(folder_id):
    """Find and return a list of recipes in a folder"""

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

    return recipes_list

def update_recipe(recipe_id, recipe_title, recipe_ingred, recipe_direct):
    """Find a recipe by it's id and update it"""

    recipe = Recipe.query.get(recipe_id)

    recipe.recipe_title = recipe_title
    recipe.recipe_ingred = recipe_ingred
    recipe.recipe_direct = recipe_direct

    print(f"This is Crud - recipe id = {recipe_id}, {recipe_title}")
    
    db.session.commit()

def delete_folder_and_contents(folder_id):
    """DELETE A GIVEN FOLDER AND IT'S CONTENTS"""

    folder = Folder.query.get(folder_id)
    recipes = folder.recipes
    for recipe in recipes:
        db.session.delete(recipe)
    
    db.session.delete(folder)

    db.session.commit()

    print(f"This is CRUD - FOLDER WITH ID {folder_id} WAS DELETED")


if __name__ == '__main__':
    from server import app
    connect_to_db(app)






