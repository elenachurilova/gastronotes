"use strict";


function show_recipe(recipe) {

    //add li to recipes list
    
    let li = $(`<li class="recipe_title" id=${recipe.recipe_id}><span class="show">${recipe.recipe_title}</span><span class="edit"><button> Edit </button></span></li>`)

    $("#recipes").append(li)

    //upon clicking on li, show recipe inside #whole_recipe

    li.find(".show").on("click", (evt) => {

        evt.preventDefault();

        $("#whole_recipe").empty()

        $("#whole_recipe").append(`<h1 id="recipetitle">${recipe.recipe_title}</h1>
                                    <img id="recipeimage" src=${recipe.picture_url}></img>
                                    <ul id="recipeingred">${recipe.recipe_ingred}</ul>
                                    <ul id="recipedirect">${recipe.recipe_direct}</ul>
                                    <a href=${recipe.recipe_src} id="recipesrc">${recipe.recipe_src}</a>`);
    });


    li.find(".edit").on("click", (evt) => {

        evt.preventDefault();

        $("#recipe_title").val(recipe.recipe_title)
        $("#recipe_ingred").val(recipe.recipe_ingred)
        $("#recipe_direct").val(recipe.recipe_direct)
        $("#recipe_id_field").val(recipe.recipe_id)

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

// upon clicking on Submit button, send ajax POST request to the server /myfolders/edit route
$("#submit").on("click", (evt) => {
    evt.preventDefault();

    const formInputs = {
        'recipe_title' : $("#recipe_title").val(),
        'recipe_ingred' : $("#recipe_ingred").val(),
        'recipe_direct' : $("#recipe_direct").val(),
        'recipe_id' : $("#recipe_id_field").val()
    }

    $.post('/myfolders/edit', formInputs, (res) => {
        console.log(res)
    })

    // $.ajax({
    //     url: "/myfolders/edit",
    //     data: $("#recipe_form").serialize(),
    //     type: "POST",
    //     success: function(response) {
    //         console.log(response.success);
    //     },
    //     error: function(error) {
    //         console.log(error);
    //     }
    // })
    
})

