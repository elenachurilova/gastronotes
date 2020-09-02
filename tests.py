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



# select folders.folder_id, folders.user_id, users.fname, users.lname, folders.folder_title, recipes.recipe_title FROM folders JOIN users on folders.user_id = users.user_id JOIN recipes ON folders.folder_id = recipes.folder_id ORDER BY users.user_id;

class TestServerFunctions(TestCase):
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

    