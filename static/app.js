"use strict";

$(".folder_title").on('click', (evt) => {

    alert("Title was clicked!")

    $.get('/myfolders/myrecipes/1', (data) => {

        for (let item of data)

            $("#recipe_title").html(item.recipe_title)
            

    })

    }
);