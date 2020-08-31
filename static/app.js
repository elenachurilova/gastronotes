"use strict";

// < ---------------- FUNCTIONS ---------------- > 

$( dragAndDropInit );
// $ ( wysIwyg );

//create a form to edit an existing recipe
function create_form() {

    $("#whole_recipe_edit").append(

        `<form>
            <label for="folder__options">Select a folder:</label>
            <select id="folder__options"></select>
            <input id="recipe_id_field" type="hidden">
            <label for="recipe_title">Enter recipe title:</label>
            <input type="text" id="recipe_title" name="recipe_title" placeholder="Recipe Title">
            <label for="recipe_src">Recipe link (optional but recommended):</label>
            <input type="text" id="recipe_src" name="recipe_src" placeholder="Recipe Source">
            <label for="image_url">Picture link (optional but recommended):</label>
            <input type="text" id="image_url" name="image_url" placeholder="URL to picture">
            <label for="recipe_ingred">Edit ingredients:</label>
            <textarea id="recipe_ingred" class="editor" name="recipe_ingred" rows="5" cols="33" placeholder="List Of Ingredients"></textarea>
            <label for="recipe_direct">Edit directions:</label>
            <textarea id="recipe_direct" class="editor" name="recipe_direct" rows="5" cols="33" placeholder="Directions"></textarea>

            <button id="edition_submit" value="Submit">Submit</button>
        </form>
        `
    );

    wysIwyg();
        
    $("#edition_submit").on("click", submit_form)

}

//submit edits to an exisitng recipe
function submit_form(evt) {

    evt.preventDefault();

    $("#whole_recipe_edit").fadeOut()

    const formInputs = {
        'recipe_id' : $("#recipe_id_field").val(),
        'folder_id' : $("#folder__options").children(":selected").attr("id"),
        'recipe_title' : $("#recipe_title").val(),
        'recipe_ingred' : $("#recipe_ingred").trumbowyg('html'),
        'recipe_direct' : $("#recipe_direct").trumbowyg('html'),
        'recipe_src' : $("#recipe_src").val(),
        'image_url' : $("#image_url").val(),
    }

    $.post('/api/myfolders/edit_recipe.json', formInputs, (res) => {
        $("#msg").html(res.success);
        message_fade_out() 
    })
    
}

//show a recipe in a given folder
function show_recipe(recipe) {

    //add li to recipes list
    
    let li = $(`<li class="makeMeDraggable recipe_title" id=${recipe.recipe_id}><span class="show">${recipe.recipe_title}</span><span class="edit"><button> Edit </button></span><span class="delete"><button id=${recipe.recipe_id}> Delete </button></span></li>`)

    $("#recipes").append(li)

    // apply draggable & droppable properties to these freshly-rendered elements 
    dragAndDropInit();


    //clicking on recipe's NAME, show recipe
    li.find(".show").on("dblclick", (evt) => {

        evt.preventDefault();

        $("#whole_recipe_edit").empty()
        $("#whole_recipe").empty()

        $("#whole_recipe").append(`<h1 id="recipetitle">${recipe.recipe_title}</h1>
                                    <img id="recipeimage" width="400" height="300" src="${recipe.picture_url}"></img>
                                    <ul id="recipeingred">${recipe.recipe_ingred}</ul>
                                    <ul id="recipedirect">${recipe.recipe_direct}</ul>
                                    <a href=${recipe.recipe_src} id="recipesrc">${recipe.recipe_src}</a>`);
    
        $("#whole_recipe").show()
    });

    // clicking on EDIT button, populate fields to edit a recipe
    li.find(".edit").on("click", (evt) => {

        $("#whole_recipe_edit").show()
        $("#whole_recipe_edit").empty()
        // when edit button is hit hide recipe view 
        $("#whole_recipe").hide()
        
        evt.preventDefault();

        create_form()

        $.get('/api/myfolders.json', (res) => {
            for (const folder of res) {
                $("#folder__options").append(`<option id="${folder.folder_id}" value="${folder.folder_title}" > ${folder.folder_title} </option>`)
            }
        })

        $("#recipe_id_field").val(recipe.recipe_id)
        $("#recipe_title").val(recipe.recipe_title)
        $("#recipe_ingred").trumbowyg('html', recipe.recipe_ingred)
        $("#recipe_direct").trumbowyg('html', recipe.recipe_direct)
        $("#recipe_src").val(recipe.recipe_src)
        $("#image_url").val(recipe.picture_url)
        

    });

    // clicking on DELETE (recipe) button, confirm user's selection, delete a recipe if OK
    li.find(".delete").on("click", (evt) => {
        evt.preventDefault();

        const recipe_id_value = evt.target.id

        let userPreference;

		if (confirm("You sure you want to delete this recipe permanently?") == true) {

            const formInputs = {
                "recipe_id" : recipe_id_value
            }

            $.post('/api/myfolders/delete_recipe.json', formInputs, (res) => {
                // remove li element fompletely 
                $(`li#${recipe_id_value}`).remove()
                $("#whole_recipe").empty()
                userPreference = res.success;
            })

		} else {
			userPreference = "Recipe was't deleted";
		}

        $("#msg").html(userPreference).fadeIn("slow");
        message_fade_out() 

    })

}

//submit new folder to db
function submit_new_folder(evt) {

    evt.preventDefault();

    const formInputs = {
        'folder_title' : $("#new_folder_title").val(),
    }

    $.post('/api/myfolders/add_folder.json', formInputs, (res) => {
        $("#folder_directory").append(
            `<div id="folder${res.folder_id}">
                <h1 class="makeMeDroppable folder_title" id="${res.folder_id}" value="${res.folder_title}"> ${res.folder_title} </h1>
                <button class="delete_folder" value="${res.folder_id}"> Delete </button>
            </div>`
        )
    }) 

    // clear out the input box after submission
    $("#new_folder_title")[0].value = ""
}

//render html for new recipe addition 
function create_edition_form() {

    $("#new_recipe_field").empty();
    $("#new_recipe_field").toggle()

    $("#new_recipe_field").append(`
        <form id="new_recipe_form">
            <label for="folder_options">Select a folder:</label>
                <select id="folder_options" required></select>
            <label for="recipe_ttl">Enter recipe title:</label>
                <input id="recipe_ttl" placeholder="Recipe Title" required></input>
            <label for="recipe_source">Recipe link (optional but recommended):</label>
                <input id="recipe_source" placeholder="Source - self or URL"  required></input>
            <label for="picture_url">Picture link (optional but recommended):</label>
                <input id="picture_url" placeholder="Picture URL" required></input>
            <label for="recipe_ing">Enter ingredients:</label>
                <textarea id="recipe_ing" class="editor" placeholder="Ingredients" required></textarea>
            <label for="recipe_dir">Enter directions:</label>
                <textarea id="recipe_dir" class="editor" placeholder="Directions" required></textarea>
            <button id="recipe_addition_submit" value="Submit">Submit</button>
        </form>`)

    $.get('/api/myfolders.json', (res) => {

        for (const folder of res) {
            $("#folder_options").append(`<option id="${folder.folder_id}" value="${folder.folder_id}" > ${folder.folder_title} </option>`)
        }
    });

    wysIwyg();

}


//submit new recipe to db
function submit_new_recipe(evt) {
    evt.preventDefault();

    let folder_idd = $("#folder_options").val()

    //hide new recipe input form
    $("#new_recipe_field").toggle()

    const formInputs = {
        'recipe_title' : $("#recipe_ttl").val(),
        'recipe_ingred' : $("#recipe_ing").trumbowyg('html'),
        'recipe_direct' : $("#recipe_dir").trumbowyg('html'),
        'recipe_src' : $("#recipe_source").val(),
        'picture_url' : $("#picture_url").val(),
        'folderid' : $("#folder_options").val()
    }

    $.post('/myfolders/add_recipe', formInputs, (res) => {
        show_new_recipe(folder_idd)
        $("#msg").html("New recipe was added!").fadeIn("slow")
        message_fade_out() 

    })

    //clear out form contents after submission
    $("#new_recipe_form")[0].reset();
    $('#recipe_ing.editor').trumbowyg('empty');
    $('#recipe_dir.editor').trumbowyg('empty')
    
}

// fade out message div
function message_fade_out() {
    $("#msg").fadeOut(1600);
}

//delete folder and it's contents
function delete_folder(evt) {
    evt.preventDefault();

    const folder_id_value = evt.target.value

    let userPreference;

		if (confirm("Deleting a folder will delete its contents. \nAre you sure you want to continue?") == true) {

            const formInputs = {
                "folder_id" : folder_id_value
            }

            $.post('/api/myfolders/delete_folder.json', formInputs, (res) => {
                $(`#folder${folder_id_value}`).remove()
                $("#recipes").empty()

            })

            userPreference = "Folder was deleted";

		} else {
			userPreference = "Folder was't deleted";
		}

    
    $("#msg").html(userPreference).fadeIn("slow")
    message_fade_out() 

}

//get folders list from the server and pass to show_recipe function
function show_new_recipe(folder_id) {

    $("#recipes").empty()

    $.get(`/api/myfolders/myrecipes/${folder_id}.json`, (data) => {

        for (let item of data) {

            show_recipe(item)
        }

    });
}

function create_scraping_form() {

    $("#scraped_recipe_field").empty()
    $("#scraped_recipe_field").toggle()

    $("#scraped_recipe_field").append(`
        <form id="scraped_recipe_form">
            <label for="folder_options_2">Select a folder:</label>
            <select id="folder_options_2" required></select>
            <label for="url_link">Paste recipe link:</label>
            <input id="url_link" placeholder="URL"></input>
            <button id="recipe_scraping_submit" value="Submit">Submit</button>
        </form>`)

    $.get('/api/myfolders.json', (res) => {

        for (const folder of res) {
            $("#folder_options_2").append(`<option id="${folder.folder_id}" value="${folder.folder_id}"> ${folder.folder_title} </option>`)
        }
    });

    wysIwyg();
}

//scrape a recipe using given user input (URL and folder id)
function scrape_a_recipe(evt) {
    evt.preventDefault();

    let folderidd = $("#folder_options_2").val()

    $("#scraped_recipe_field").toggle()
    
    const formInputs = {
        "folderid" : folderidd,
        "recipe_scrape_url" : $("#url_link").val()
    }

    $.post("/myfolders/scrape_recipe", formInputs, (res) => {
        show_new_recipe(folderidd)
        $("#msg").html("New recipe was added!").fadeIn("slow")
        message_fade_out() 
        $("#scraped_recipe_form")[0].reset()
    })

} 

//initiate drag and drop functionalities on selected elements
function dragAndDropInit() {
    $(".makeMeDraggable").draggable({
        // containment: 'document',
        cursor: 'move',
        snap: 'document'

    });
    $(".makeMeDroppable").droppable( {
        drop: handleDropEvent,
    });
}

//detect dropped recipe's id and folder_id and submit to DB
function handleDropEvent( event, ui ) {

    event.preventDefault();

    const formInputs = {
        'recipe_id' : `${ui.draggable.attr('id')}`,
        'folder_id' : `${event.target.id}`,
    }

    $.post('/api/myfolders/update_recipe_folder.json', formInputs, () => {
        show_new_recipe(`${event.target.id}`)
    })
    
}

//initiate wysiwig library on .editor class elements
function wysIwyg() {
    $('.editor').trumbowyg({
        removeformatPasted: true,
        btns: [
            ['viewHTML'],
            ['undo', 'redo'], // Only supported in Blink browsers
            ['formatting'],
            ['strong', 'em', 'del'],
            ['superscript', 'subscript'],
            ['link'],
            ['insertImage'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
            ['unorderedList', 'orderedList'],
            ['horizontalRule'],
            ['removeformat'],
            ['fullscreen'],
        ]
    });
}

// < ---------------- EVENTS ---------------- > 

// event: clicking on folder title...
$(".folder_title").on("click", (evt) => {

    evt.preventDefault(); 

    //emptying all previous outputs - folders, recipes, textareas 
    $("#recipes").empty()
    $("#whole_recipe").empty()
    $("#whole_recipe_edit").empty()


    let folder_id = evt.target.id
    
    $.get(`/api/myfolders/myrecipes/${folder_id}.json`, (data) => {

        for (let item of data) {

            show_recipe(item)
        }

    });

    dragAndDropInit();
    
});

// event clicking on NEW FOLDER button...
$("#new_folder_button").on("click", (evt) => {
    evt.preventDefault();

    $("#new_folder_field").empty()

    if ($("#new_folder_field")[0].hidden === false) {
        $("#new_folder_field").attr("hidden", true)
    } else {
        $("#new_folder_field").attr("hidden", false)
    }

    $("#new_folder_field").append(
        `<form>
            <input id="new_folder_title" type="text" placeholder="Folder Title" required="required"></input>
            <button id="folder_addition_submit" value="Submit">Submit</button>
        </form>`
    );
    
    $("#folder_addition_submit").on("click", submit_new_folder)

});

// event: clicking on NEW RECIPE button...
$("#new_recipe_button").on("click", create_edition_form);

// event: clicking on RECIPE FROM URL button
$("#recipe_from_url_button").on("click", create_scraping_form);

// event: clicking on delete a folder button
$(".delete_folder").on("click", delete_folder)

// event: submitting a new (manually entered) recipe...
$("#recipe_addition_submit").on("click", submit_new_recipe)

//event: submitting a URL to scrape a recipe... 
$("#recipe_scraping_submit").on("click", scrape_a_recipe)

//event: clicking on search submit button
$("#search_button").on("click", search_for_recipe);

function search_for_recipe() {

    $("#recipes").empty()
    $("#search_list").empty()
    $("#searched_recipe_body").empty()

    const userInput = {
        "data" : $("#search_input").val()
    }

    console.log(userInput)

    $.get('/api/search.json', userInput, (res) => {
    
        for (let recipe of res) {

            show_searched_recipe(recipe)
        }
    });
}


function show_searched_recipe(recipe) {

    // add each recipe to search list

    console.log("Hello 1")
    let li = $(`<li class="searched_recipe" id="${recipe.recipe_id}" value="${recipe.recipe_id}"><span class="show_search_result"> ${recipe.recipe_title} </span></li>`)

    console.log("Hello 2")
    if (recipe.hasOwnProperty('recipe_title')) {
        $("#search_list").append(li)
        console.log("Hello 3")
    } else { 
        $("#search_list").append(`<div> ${recipe.error} <div>`)
        console.log("Hello 3.1")
    }

    //clicking on recipe's name, show recipe
    li.find(".show_search_result").on("click", (evt) => {

        //const recipe_id_val = evt.target.id
        console.log("Hello 4")
        evt.preventDefault();

        $("#searched_recipe_body").empty()

        $("#searched_recipe_body").append(`<h1 id="rec_title">${recipe.recipe_title}</h1>
                                            <img id="rec_image" width="400" height="300" src="${recipe.picture_url}"></img>
                                            <ul id="rec_ingred">${recipe.recipe_ingredients}</ul>
                                            <ul id="rec_direct">${recipe.recipe_directions}</ul>
                                            <a href=${recipe.recipe_source} id="rec_src">${recipe.recipe_source}</a>`);

        console.log("Hello 5")


});

}
