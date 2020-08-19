"use strict";

function create_form() {

    $("#whole_recipe_edit").append(
        `<form id="recipe_form">
            <input id="recipe_id_field" type="hidden">
            <input type="text" id="recipe_title" name="recipe_title"    placeholder="Recipe Title">
            <textarea  id="recipe_ingred" name="recipe_ingred"
            rows="5" cols="33" placeholder="List Of Ingredients"></textarea>
            <textarea id="recipe_direct" name="recipe_direct" rows="5" cols="33" placeholder="Directions"></textarea>
            <button id="submit" value="Submit">Submit</button>
        </form>`
    );

    $("#submit").on("click", submit_form)

}

function submit_form(evt) {

    evt.preventDefault();

    const formInputs = {
        'recipe_title' : $("#recipe_title").val(),
        'recipe_ingred' : $("#recipe_ingred").val(),
        'recipe_direct' : $("#recipe_direct").val(),
        'recipe_id' : $("#recipe_id_field").val()
    }

    $.post('/myfolders/edit', formInputs, (res) => {
       alert("This was saved!")
    })
    
}


function show_recipe(recipe) {

    //add li to recipes list
    
    let li = $(`<li class="recipe_title" id=${recipe.recipe_id}><span class="show">${recipe.recipe_title}</span><span class="edit"><button> Edit </button></span></li>`)

    $("#recipes").append(li)

    //upon clicking on li, show recipe inside #whole_recipe

    li.find(".show").on("click", (evt) => {

        evt.preventDefault();

        $("#whole_recipe_edit").empty()
        $("#whole_recipe").empty()

        $("#whole_recipe").append(`<h1 id="recipetitle">${recipe.recipe_title}</h1>
                                    <img id="recipeimage" width="400" height="300" src=${recipe.picture_url}></img>
                                    <ul id="recipeingred">${recipe.recipe_ingred}</ul>
                                    <ul id="recipedirect">${recipe.recipe_direct}</ul>
                                    <a href=${recipe.recipe_src} id="recipesrc">${recipe.recipe_src}</a>`);
    });


    li.find(".edit").on("click", (evt) => {

        $("#whole_recipe_edit").empty()

        evt.preventDefault();

        create_form()

        $("#recipe_title").val(recipe.recipe_title)
        $("#recipe_ingred").val(recipe.recipe_ingred)
        $("#recipe_direct").val(recipe.recipe_direct)
        $("#recipe_id_field").val(recipe.recipe_id)

    });
}

//clicking on folder title...
$(".folder_title").on("click", (evt) => {

    evt.preventDefault(); 

    //emptying all previous outputs - folders, recipes, textareas 
    $("#recipes").empty()
    $("#whole_recipe").empty()
    $("#whole_recipe_edit").empty()

    let folder_id = evt.target.id
    
    $.get(`/myfolders/myrecipes/${folder_id}`, (data) => {

        for (let item of data) {

            show_recipe(item)
        }

    });
    
});






