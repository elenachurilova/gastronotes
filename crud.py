"""CRUD operations"""

from model import db, User, Folder, Recipe, Tag, RecipeTag, connect_to_db

def create_user(email, password, fname, lname):
    """Create and return a new user."""

    user = User(email=email, password=password, fname=fname, lname=lname)

    db.session.add(user)
    db.session.commit()

    return user

def create_folder(user, folder_title):

    folder = Folder(user=user, folder_title=folder_title)

    db.session.add(folder)
    db.session.commit()

    return folder


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

def get_user_by_email(email):

    return User.query.filter(User.email==email).first()


def show_user_folders(user_id):

    current_user = User.query.get(user_id)
    user_folders = current_user.folders

    return user_folders
    # for i in range(len(current_user.folders)):
    #     recipes[current_user.folders[i].folder_title] = ""
    #     for a in range(len(current_user.folders[i].recipes)):
    #         recipes[current_user.folders[i].folder_title] = (current_user.folders[i].recipes[a].recipe_title)

    # return recipes


if __name__ == '__main__':
    from server import app
    connect_to_db(app)






