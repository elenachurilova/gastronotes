"use strict";


function show_recipe(recipe) {

    //add li to recipes list
    
    let li = $(`<li class="recipe_title" id=${recipe.recipe_id}><span class="show">${recipe.recipe_title}</span><span class="edit">(edit)</span></li>`)

    $("#recipes").append(li)

    //upon clicking on li, show recipe inside #whole_recipe

    li.find(".show").on("click", (evt) => {

        evt.preventDefault();

        $("#whole_recipe").empty()

        $("#whole_recipe").append(`<h1 id="recipetitle">${recipe.recipe_title}</h1>
                                    <ul id="recipeingred">${recipe.recipe_ingred}</ul>
                                    <ul id="recipedirect">${recipe.recipe_direct}</ul>
                                    <a href=${recipe.recipe_src} id="recipesrc">${recipe.recipe_src}</a>
                                    <p id="recipeimage">${recipe.picture_url}</p>`);
    });

    li.find(".edit").on("click", (evt) => {

        evt.preventDefault();

        $("#recipe_title").val(recipe.recipe_title)
        $("#recipe_ingred").val(recipe.recipe_ingred)
        $("#recipe_direct").val(recipe.recipe_direct)

    });
}

$(".folder_title").on("click", (evt) => {

    evt.preventDefault(); 

    $("#recipes").empty()
    $("#whole_recipe").empty()

    let folder_id = evt.target.id
    
    $.get(`/myfolders/myrecipes/${folder_id}`, (data) => {

        for (let item of data) {

            show_recipe(item)
        }

    });
    
});

// < ------ ISSUES ------- >

// 4 - need an advice on how to start editing recipes


