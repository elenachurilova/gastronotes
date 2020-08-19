from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import update

db = SQLAlchemy()

def connect_to_db(flask_app, db_uri='postgresql:///recipes', echo=True):
    """Connect to database."""

    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = True
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')


class User(db.Model):

    __tablename__ = "users"

    user_id = db.Column(db.Integer, 
                        autoincrement=True,
                        primary_key=True)
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(50))
    fname = db.Column(db.String(20))
    lname = db.Column(db.String(20))

    folders = db.relationship('Folder')
    tags = db.relationship('Tag')

    def __repr__(self):
        return f'<User user_id={self.user_id}, email={self.email}, name={self.fname, self.lname}>'


class Folder(db.Model):

    __tablename__ = "folders"

    folder_id = db.Column(db.Integer,
                          autoincrement=True,
                          primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    folder_title = db.Column(db.String)

    user = db.relationship('User')
    recipes = db.relationship('Recipe')

    def __repr__(self):
        return f'<Folder folder_id={self.folder_id}, title={self.folder_title}>'


class Recipe(db.Model):

    __tablename__ = "recipes"

    recipe_id = db.Column(db.Integer,
                          autoincrement=True,
                          primary_key=True)
    folder_id = db.Column(db.Integer, db.ForeignKey('folders.folder_id'))
    recipe_title = db.Column(db.String)
    recipe_ingred = db.Column(db.Text)
    recipe_direct = db.Column(db.Text)
    recipe_src = db.Column(db.String)
    picture_url = db.Column(db.String)

    folder = db.relationship('Folder')
    recipe_tags = db.relationship('Tag', 
                                   secondary='recipe_tags')

    def __repr__(self):
        return f'<Recipe recipe_id={self.recipe_id}, title={self.recipe_title}>'


class Tag(db.Model):

    __tablename__ = "tags"

    tag_id = db.Column(db.Integer,
                          autoincrement=True,
                          primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    tag_name = db.Column(db.String)

    user = db.relationship('User')
    recipe_tags = db.relationship('Recipe', 
                                   secondary='recipe_tags')

    def __repr__(self):
        return f'<Tag recipe_id={self.tag_id}, tag_name={self.tag_name}>'


class RecipeTag(db.Model):

    __tablename__ = "recipe_tags"

    recipe_tag_id = db.Column(db.Integer,
                          autoincrement=True,
                          primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'))
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.recipe_id'))

    tag = db.relationship('Tag')
    recipe = db.relationship('Recipe')

    def __repr__(self):
        return f'<RecipeTag tag_id={self.tag_id} recipe_id={self.recipe_id}>'


if __name__ == '__main__':
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)


# test_user = User(email='testemail@email.test', password='12345678', fname='Jane', lname='Doe')
# test_user2 = User(email='testemail2@email.test', password='12345678', fname='John', lname='Doe')
# test_folder = Folder(user_id=1, folder_title='Entrees')
# test_recipe = Recipe(folder_id=1, recipe_title='fried bananas', recipe_ingred='bananas, sugar', recipe_direct='slice banans', recipe_src='self', picture_url='/static/bananas.png') 
# test_tag = Tag(user_id=1, tag_name='vegetarian')
# test_recipe_tag = RecipeTag(tag_id=1, recipe_id=1)


# db.session.add(test_user)
# db.session.add(test_folder)
# db.session.add(test_recipe)
# db.session.add(test_tag)
# db.session.add(test_recipe_tag)
# db.session.commit()









