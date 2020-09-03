from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import update
from passlib.hash import argon2

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
    password = db.Column(db.String)
    fname = db.Column(db.String(20))
    lname = db.Column(db.String(20))

    folders = db.relationship('Folder')
    # tags = db.relationship('Tag')

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
    # recipe_tags = db.relationship('Tag', 
    #                                secondary='recipe_tags')

    def __repr__(self):
        return f'<Recipe recipe_id={self.recipe_id}, title={self.recipe_title}>'


def example_data():
    """Create some sample data."""

    # In case we will run this more than once, empty out existing data
    Recipe.query.delete()
    Folder.query.delete()
    User.query.delete()
    
    #Add sample users, their folders and recipes
    test_user1 = User(email='testemail@email.test', password=argon2.hash('12345678'), fname='Jane', lname='Doe')
    test_user2 = User(email='testemail2@email.test', password=argon2.hash('12345678'), fname='John', lname='Doe')

    
    test_folder1 = Folder(user_id=1, folder_title='Entrees')
    test_folder2 = Folder(user_id=1, folder_title='Drinks')
    test_folder3 = Folder(user_id=1, folder_title='Appetizers')
    test_folder4 = Folder(user_id=2, folder_title='Quick dinners')
    test_folder5 = Folder(user_id=2, folder_title='Game night')
    test_folder6 = Folder(user_id=2, folder_title='Breakfasts')


    test_recipe1 = Recipe(folder_id=1, recipe_title='Fried Bananas', recipe_ingred='bananas, sugar', recipe_direct='slice banans', recipe_src='http://google.com', picture_url='/static/bananas.png')
    test_recipe2 = Recipe(folder_id=1, recipe_title='Marinated Apples', recipe_ingred='apples, sugar', recipe_direct='slice apples', recipe_src='http://google.com', picture_url='/static/apples.png')
    test_recipe3 = Recipe(folder_id=4, recipe_title='Marinated Cucumbers', recipe_ingred='cucumbers, salt', recipe_direct='slice cucumbers', recipe_src='http://google.com', picture_url='/static/cucumbers.png')
    test_recipe4 = Recipe(folder_id=4, recipe_title='Marinated Beets', recipe_ingred='beets, salt', recipe_direct='slice beets', recipe_src='http://google.com', picture_url='/static/beets.png')

    db.session.add_all([test_user1, test_user2, test_folder1, test_folder2, test_folder3, test_folder4, test_folder5, test_folder6, test_recipe1, test_recipe2, test_recipe3, test_recipe4])
    db.session.commit()
    

if __name__ == '__main__':
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)









