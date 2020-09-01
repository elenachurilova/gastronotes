"""Seeding database"""

import os
import json
from random import choice, randint
from datetime import datetime
from passlib.hash import argon2

import crud
import model
import server

os.system('dropdb recipes')
os.system('createdb recipes')

fnames = ["Mary", "Alex", "James", "Michelle", "Cassandra"]
lnames = ["Aniston", "Dawson", "Harrison", "Grohl", "Roberts"]

model.connect_to_db(server.app)
model.db.create_all()

with open('data/recipes_data.json') as r:
    recipes_data = json.loads(r.read())

with open('data/folders_data.json') as f:
    folders_data = json.loads(f.read())

# with open('data/tags_data.json') as t:
#     tags_data = json.loads(t.read()) 


for user in range(5):

    email = f'test_user{user}@test.com'
    password = argon2.hash('12345678')
    fname = choice(fnames)
    lname = choice(lnames)

    new_user = crud.create_user(email, password, fname, lname)

    for fold in range(5):

        current_folder = choice(folders_data['folders'])

        new_folder = crud.create_folder(new_user, current_folder)

        for rec in range(3):

            random_recipe = choice(recipes_data)

            recipe_title = random_recipe["recipe_title"]
            recipe_ingred = random_recipe["recipe_ingred"]
            recipe_direct = random_recipe["recipe_direct"]
            recipe_src = random_recipe["recipe_src"]
            picture_url = random_recipe["picture_url"]

            new_recipe = crud.create_recipe(new_folder, recipe_title, recipe_ingred, recipe_direct, recipe_src, picture_url)

        # for tg in range(3):

        #     tags = []

        #     random_tag = choice(tags_data["tag"])

        #     new_tag = crud.create_tag(new_user, random_tag)

        #     tags.append(new_tag)

        #     current_tag = crud.create_recipe_tag((choice(tags)), new_recipe)














