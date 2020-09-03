"""Unittests for Gastronotes app"""

# python3 -m unittest tests.py


from unittest import TestCase
from server import app
from model import connect_to_db, db, example_data, User, Folder, Recipe
from flask import session
import crud
import os

os.system('dropdb testdb')
os.system('createdb testdb')

class TestCrudFunctions(TestCase):
    """Test crud functions"""

    def setUp(self):
        """Run before every test"""

        self.client = app.test_client()
        app.config['TESTING'] = True
        connect_to_db(app, "postgresql:///testdb")
        db.create_all()
        
    def tearDown(self):
        """Do at end of every test."""

        db.session.close()
        db.drop_all()

    def test_create_user(self):
        """Can we create user instance"""

        user1 = crud.create_user("ut_email1@test.test", "1234567", "Dave", "Grohl")
        self.assertIsNotNone(user1.user_id)
        
    def test_create_folder(self):
        """Can we create folder instance"""

        user2 = crud.create_user("ut_email2@test.test", "1234567", "Matthew", "Bellamy")
        folder2 = crud.create_folder(user2, "Drinks")
        self.assertIsNotNone(folder2.folder_id)

    def test_create_recipe(self):
        """Can we create recipe instance"""

        user3 = crud.create_user("ut_email3@test.test", "1234567", "Billy", "Corgan")
        folder3 = crud.create_folder(user3, "Pies")
        recipe3 = crud.create_recipe(folder3, "Apple Pie", "Apples, Crust, Sugar, Cinnamon", "Mix everything together", "http://google.com", "/static/pie.png")
        self.assertIsNotNone(recipe3.recipe_id)
        self.assertEqual(recipe3.recipe_title, "Apple Pie")

    def test_get_user_by_email(self):
        """Can we find a user by email 
        (email is a unique field in db)"""

        example_data()
        user = crud.get_user_by_email('testemail@email.test')
        self.assertIsNotNone(user.user_id)
        self.assertEqual(user.fname, 'Jane')
        self.assertEqual(user.lname, 'Doe')

    def test_show_user_folders(self):
        """Can we look up folders for a given user"""

        example_data()
        folders = crud.show_user_folders(1)
        self.assertIsNotNone(folders[0].folder_id)
        self.assertEqual(folders[0].folder_title, 'Entrees')
        self.assertEqual(folders[1].folder_title, 'Drinks')

    def test_show_recipe_by_folder(self):
        """Can we look up recipes for a given folder"""

        example_data()
        recipes = crud.show_recipe_by_folder(1)
        self.assertEqual(recipes[0]['recipe_title'], 'Fried Bananas')
        self.assertNotEqual(recipes[0]['folder_id'], 2)
        self.assertNotIn(recipes[0]['recipe_title'], 'Marinated Cucumbers')
    
    def test_update_recipes_folder(self):
        """Can we re-assign a recipe to a different folder"""

        example_data()
        recipe = Recipe.query.get(2)
        self.assertEqual(recipe.folder_id, 1)
        crud.update_recipes_folder(2, 3)
        self.assertEqual(recipe.folder_id, 3)

    def test_delete_folder_and_contents(self):
        """Can we delete a given folder"""
        
        example_data()
        folder = Folder.query.get(1)
        self.assertEqual(folder.folder_title, 'Entrees')
        self.assertIsNotNone(folder.folder_id)
        crud.delete_folder_and_contents(1)
        new_folder = Folder.query.get(1)
        self.assertIsNone(new_folder)
        
    def test_delete_recipe(self):
        """Can we delete a given recipe"""

        example_data()
        recipe = Recipe.query.get(4)
        self.assertEqual(recipe.recipe_title, 'Marinated Beets')
        self.assertIsNotNone(recipe.recipe_id)
        crud.delete_recipe(4)
        new_recipe = Recipe.query.get(4)
        self.assertIsNone(new_recipe)

    def test_search_for_recipe(self):
        """Can we find a recipe by its title||ingredients||directions"""

        example_data()
        recipes = crud.search_for_recipe(1, "Marinated")
        self.assertEqual(recipes[0].recipe_ingred, 'apples, sugar')
        self.assertEqual(recipes[0].recipe_id, 2)

# SQL query for quering in psql -- select folders.folder_id, folders.user_id, users.fname, users.lname, folders.folder_title, recipes.recipe_title FROM folders JOIN users on folders.user_id = users.user_id JOIN recipes ON folders.folder_id = recipes.folder_id ORDER BY users.user_id;


class ServerTestBasic(TestCase):
    """Test server functions"""

    def setUp(self):
        """Run before every test"""

        self.client = app.test_client()
        app.config['TESTING'] = True
        connect_to_db(app, "postgresql:///testdb")
        db.create_all()
        example_data()
    
    def tearDown(self):
        """Do at end of every test."""

        db.session.close()
        db.drop_all()

    def test_homepage(self):
        """Test homepage page"""

        result = self.client.get("/")
        self.assertIn(b"Your favorite recipes. Organized.", result.data)


class ServerTestLogInSignUp(TestCase):
    """Test log in and sign up pages"""

    def setUp(self):
        """Run before every test"""

        self.client = app.test_client()
        app.config['TESTING'] = True
        connect_to_db(app, "postgresql:///testdb")
        db.create_all()

    def tearDown(self):
        """Do at end of every test."""

        db.session.close()
        db.drop_all()

    def test_login(self):
        """Test login page"""

        example_data()

        result = self.client.post("/login",
                        data={"email": "testemail@email.test", "password": "12345678"},
                        follow_redirects=True)
        self.assertIn(b"Successfully logged in as", result.data)

        result2 = self.client.post("/login",
                        data={"email": "testemail@email.test", "password": "87654321"},
                        follow_redirects=True)
        self.assertIn(b"Incorrect password", result2.data)

    def test_signup(self):
        """Test signup page"""

        result = self.client.post("/signup",
                                data={"email": "unittest_1@unittest.test", "password": "87654321", "fname" : "Anthony", "lname" :"Kiedis"},
                                follow_redirects=True)
        self.assertIn(b"Account created! Yay!", result.data)

        result2 = self.client.post("/signup",
                                data={"email": "unittest_1@unittest.test", "password": "87654321", "fname" : "Anthony", "lname" :"Kiedis"},
                                follow_redirects=True)
        self.assertIn(b"Account with this email already exists!", result2.data)


class ServerTestsLoggedIn(TestCase):
    """Server tests with user logged in to session."""

    def setUp(self):
        """Stuff to do before every test."""

        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = 'key'
        self.client = app.test_client()

        connect_to_db(app, "postgresql:///testdb")
        db.create_all()
        example_data()

        with self.client as c:
            with c.session_transaction() as sess:
                sess['userid'] = 1

    def tearDown(self):
        """Do at end of every test."""

        db.session.close()
        db.drop_all()

    def test_myrecipes_page(self):
        """Test page with user's recipes"""

        result = self.client.get("/myfolders")
        self.assertIn(b"NEW FOLDER", result.data)
        self.assertNotIn(b"Your favorite recipes. Organized.", result.data)

class ServerTestsLoggedOut(TestCase):
    """Server tests with user logged in to session."""

    def setUp(self):
        """Stuff to do before every test."""

        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_myfolders_page(self):
        """Test that user can't see important page when logged out."""

        result = self.client.get("/myfolders", follow_redirects=True)
        self.assertNotIn(b"NEW FOLDER", result.data)
        self.assertIn(b"Collect and save your favorite recipes,", result.data)

class ServerTestsLogInLogOut(TestCase):  # Bonus example. Not in lecture.
    """Test log in and log out."""

    def setUp(self):
        """Before every test"""

        app.config['TESTING'] = True
        self.client = app.test_client()

        connect_to_db(app, "postgresql:///testdb")
        db.create_all()
        example_data()

    def tearDown(self):
        """Do at end of every test."""

        db.session.close()
        db.drop_all()

    def test_login(self):
        """Test log in form."""

        with self.client as c:
            result = c.post('/login',
                            data={"email": "testemail@email.test", "password": "12345678"},
                            follow_redirects=True
                            )
            self.assertEqual(session['userid'], 1)
            self.assertIn(b"NEW FOLDER", result.data)
            self.assertIn(b"Successfully logged in as", result.data)

    def test_logout(self):
        """Test logout route."""

        with self.client as c:
            with c.session_transaction() as sess:
                sess['userid'] = 1

            result = self.client.get('/logout', follow_redirects=True)

            self.assertNotIn(b'userid', session)
            self.assertIn(b'Your favorite recipes. Organized', result.data)