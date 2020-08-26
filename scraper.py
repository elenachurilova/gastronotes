import requests
from bs4 import BeautifulSoup

def web_scraper(web_page_url):
    """Web scraper for recipes from foodnetwork.com"""

    page = requests.get(web_page_url)
    soup = BeautifulSoup(page.content, 'html.parser')

    # < --- getting the first part that includes recipe title, image --- >
    results_part1 = soup.find(class_="recipe_lead")

    # < --- pulling recipe title --- >
    title_element = results_part1.find('span', class_="o-AssetTitle__a-HeadlineText")
    recipe_title = title_element.text

    # < --- pulling image URL --- >
    image_url_element = results_part1.find('img', class_="m-MediaBlock__a-Image a-Image")
    image_url = image_url_element['src'][2:] #this removes two leading slashes included in URL

    # < --- getting the second part that includes recipe ingredients and directions --- >
    results_part2 = soup.find(class_="recipe-body")

    # < --- pulling recipe ingredients and making a long string --- >
    ingredients_element = results_part2.find_all('p', class_='o-Ingredients__a-Ingredient')
    ingred_list = []

    for i in ingredients_element:
        ingred_list.append(i.text)
    recipe_ingredients = (", ".join(ingred_list))

    # < --- pulling recipe directions and making a long string --- >
    directions_section = results_part2.find('section', class_="o-Method")

    directions_element = directions_section.find_all('li', class_="o-Method__m-Step")
    directions_list = []

    for i in directions_element:
        directions_list.append((i.text).strip())
    recipe_directions = (", ".join(directions_list))

    # < --- putting it all together --- >
    return {
            "recipe_title" : recipe_title,
            "recipe_ingred" : recipe_ingredients,
            "recipe_direct" : recipe_directions,
            "recipe_url" : web_page_url,
            "image_url" : image_url 
            }
