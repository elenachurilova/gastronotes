# 🍴 Gastronotes
A web app to organize all your cooking recipes

# 🍴 Features
- [x] Sign up and Log In
- [x] Create a folder
- [x] Add a recipe (type in)
- [x] Import a recipe (web scraping)
- [x] Search for a recipe (title, ingredients, directions)
- [x] Move a recipe between folders
- [x] Edit a recipe and apply styling (wysiwyg editor)
- [x] Delete a recipe
- [x] Delete a folder

# 🍴 Demo

## Homepage
![](https://media.giphy.com/media/LrSCf2L28f2hFOUci8/giphy.gif)

## Showing recipes per folder and search

![](https://media.giphy.com/media/d7kThZEfrWk4mjrM74/giphy.gif)

## Importing a recipe 

![](https://media.giphy.com/media/gLViWL5javiJ6p3knb/giphy.gif)


# 🍴 Requirements 

Install PostgresQL (Mac OSX)

Clone or fork this repo:
```
https://github.com/elenachurilova/gastronotes
```

Create and activate a virtual environment inside your Adventure Awaits directory:
```
virtualenv env
source env/bin/activate
```

Install the dependencies:
```
pip install -r requirements.txt
```

Set up the database:

```
createdb recipes
python3 model.py
```

Run the app:

```
python3 server.py
```

