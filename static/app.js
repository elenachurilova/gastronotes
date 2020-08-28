"use strict";

// < ---------------- FUNCTIONS ---------------- > 

$( dragAndDropInit );

//create a form to edit an existing recipe
function create_form() {

    $("#whole_recipe_edit").append(

        `<form>
            <select id="folder__options"></select>
            <input id="recipe_id_field" type="hidden">
            <input type="text" id="recipe_title" name="recipe_title" placeholder="Recipe Title">
            <textarea  id="recipe_ingred" name="recipe_ingred"
            rows="5" cols="33" placeholder="List Of Ingredients"></textarea>
            <textarea id="recipe_direct" name="recipe_direct" rows="5" cols="33" placeholder="Directions"></textarea>
            <input type="text" id="recipe_src" name="recipe_src" placeholder="Recipe Source">
            <input type="text" id="image_url" name="image_url" placeholder="URL to picture">

            <button id="edition_submit" value="Submit">Submit</button>
        </form>
        `
    );

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
        'recipe_ingred' : $("#recipe_ingred").val(),
        'recipe_direct' : $("#recipe_direct").val(),
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
    });

    // clicking on EDIT button, populate fields to edit a recipe
    li.find(".edit").on("click", (evt) => {

        $("#whole_recipe_edit").show()
        $("#whole_recipe_edit").empty()
        
        evt.preventDefault();

        create_form()

        $.get('/api/myfolders.json', (res) => {
            for (const folder of res) {
                $("#folder__options").append(`<option id="${folder.folder_id}" value="${folder.folder_title}" > ${folder.folder_title} </option>`)
            }
        })

        $("#recipe_id_field").val(recipe.recipe_id)
        $("#recipe_title").val(recipe.recipe_title)
        $("#recipe_ingred").val(recipe.recipe_ingred)
        $("#recipe_direct").val(recipe.recipe_direct)
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

//submit new recipe to db
function submit_new_recipe(evt) {
    evt.preventDefault();

    let folder_idd = $("#folder_options").val()

    //hide new recipe input form
    $("#new_recipe_field").toggle()

    const formInputs = {
        'recipe_title' : $("#recipe_ttl").val(),
        'recipe_ingred' : $("#recipe_ing").val(),
        'recipe_direct' : $("#recipe_dir").val(),
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
    $("#new_recipe_form")[0].reset()
    
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


function show_new_recipe(folder_id) {

    $("#recipes").empty()

    $.get(`/api/myfolders/myrecipes/${folder_id}.json`, (data) => {

        for (let item of data) {

            show_recipe(item)
        }

    });
}

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
$("#new_recipe_button").on("click", (evt) => {

    evt.preventDefault();

    $("#new_recipe_field").toggle()    

});

// event: clicking on RECIPE FROM URL button
$("#recipe_from_url_button").on("click", (evt) => {
 
    evt.preventDefault();

    $("#scraped_recipe_field").toggle()

});

// event: clicking on delete a folder button
$(".delete_folder").on("click", delete_folder)

// event: submitting a new (manually entered) recipe...
$("#recipe_addition_submit").on("click", submit_new_recipe)

//event: submitting a URL to scrape a recipe... 
$("#recipe_scraping_submit").on("click", scrape_a_recipe)
