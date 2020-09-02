"""CRUD operations"""

from model import db, User, Folder, Recipe, connect_to_db


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

    folder = Folder.query.options(db.joinedload(Folder.recipes)).filter(Folder.folder_id==folder_id).first()

    recipes_list = []

    if folder.recipes:
        for recipe in folder.recipes:
            recipes_list.append({"recipe_id" : recipe.recipe_id,
                                "folder_id" : recipe.folder_id,
                                "recipe_title" : recipe.recipe_title,
                                "recipe_ingred" : recipe.recipe_ingred,
                                "recipe_direct": recipe.recipe_direct,
                                "recipe_src" : recipe.recipe_src,
                                "picture_url" : recipe.picture_url})
    else:
        pass

    return recipes_list

def update_recipe(recipe_id, folder_id, recipe_title, recipe_ingred, recipe_direct, recipe_src, picture_url):
    """Find a recipe by it's id and update it"""

    recipe = Recipe.query.get(recipe_id)

    recipe.folder_id = folder_id
    recipe.recipe_title = recipe_title
    recipe.recipe_ingred = recipe_ingred
    recipe.recipe_direct = recipe_direct
    recipe.recipe_src = recipe_src
    recipe.picture_url = picture_url

    print(f"This is Crud - recipe id = {recipe_id}, {recipe_title}")
    
    db.session.commit()


def update_recipes_folder(recipe_id, folder_id):
    """Update folder for given recipe"""

    recipe = Recipe.query.options(db.joinedload(Recipe.folder)).filter(Recipe.recipe_id==recipe_id).first() 
    recipe.folder_id = folder_id
    
    db.session.commit()


def delete_folder_and_contents(folder_id):
    """Delete a given folder and its contents"""

    folder = Folder.query.options(db.joinedload(Folder.recipes)).filter(Folder.folder_id==folder_id).first()

    for recipe in folder.recipes:
        db.session.delete(recipe)
    
    db.session.delete(folder)

    db.session.commit()

def delete_recipe(recipe_id):

    recipe = Recipe.query.get(recipe_id)
    db.session.delete(recipe)
    db.session.commit()

def search_for_recipe(user_id, data):

    return db.session.query(Recipe).join(Folder).join(User).filter( (User.user_id == user_id) & ( (Recipe.recipe_title.like("%" +data+ "%")) | (Recipe.recipe_ingred.like("%" +data+ "%")) | (Recipe.recipe_direct.like("%" +data+ "%")))).all()





if __name__ == '__main__':
    from server import app
    connect_to_db(app)






