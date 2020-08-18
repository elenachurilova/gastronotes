"use strict";

$(".folder_title").on("click", (evt) => {

    evt.preventDefault(); 

    let folder_id = evt.target.id
    
    $.get(`/myfolders/myrecipes/${folder_id}`, (data) => {

        for (let item of data) {
            $("#recipe_title").append(`<li class="recipe_title"><a href="/myfolders">${item.recipe_title}</a></li>`)
        }
    
        $(".folder_title").on('click', function() {
            $(".recipe_title").toggle();
        });


        $(".recipe_title").on("click", (evt) => {

            evt.preventDefault();
        
            let folder_id = evt.target.id
            
            for (let item of data) {

                $("#whole_recipe").append(`<h1 id="recipetitle">${item.recipe_title}</h1>
                                            <ul id="recipe_ingred">${item.recipe_ingred}</ul>
                                            <ul id="recipe_direct">${item.recipe_direct}</ul>
                                            <a href=${item.recipe_src}id="recipe_src">${item.recipe_src}</a>
                                            <p id="recipe_image">${item.picture_url}</p>`)


            }
            
        });

    // <-- closing .get ajax request -->  
    });

// <-- closing event handler --> 
});




// console.log(($("#recipe_title"))[0].textContent)