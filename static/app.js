// JS for Gastronotes app


"use strict";

// < ---------------- FUNCTIONS ---------------- > 

$( dragAndDropInit );

//create a form to edit an existing recipe
function create_form() {

    $("#whole_recipe_edit").append(

		`<form>
			<div class="form-group">
				<label class="form-control-header" for="folder__options">Select a folder:</label>
				<select class="form-control" id="folder__options"></select>
			</div>
				<input id="recipe_id_field" type="hidden">
			<div class="form-group">
				<label for="recipe_title" class="form-control-header">Enter recipe title:</label>
				<input type="text" id="recipe_title" class="form-control" name="recipe_title" placeholder="Recipe Title">
			</div>
			<div class="form-group">
				<label for="recipe_src" class="form-control-header">Recipe link (optional but recommended):</label>
				<input type="text" id="recipe_src" class="form-control" name="recipe_src" placeholder="Recipe Source">
			</div>
			<div class="form-group">
				<label for="image_url" class="form-control-header">Picture link (optional but recommended):</label>
				<input type="text" id="image_url" class="form-control" name="image_url" placeholder="URL to picture">
			</div>
			<div class="form-group">
				<label for="recipe_ingred" class="form-control-header">Edit ingredients:</label>
				<textarea id="recipe_ingred" class="editor" name="recipe_ingred" rows="5" cols="33" 
				placeholder="List Of Ingredients"></textarea>
			</div>
			<div class="form-group">
				<label for="recipe_direct" class="form-control-header">Edit directions:</label>
				<textarea id="recipe_direct" class="editor" name="recipe_direct" rows="5" cols="33" placeholder="Directions"></textarea>
			</div>

				<button id="edition_submit" class="btn btn-primary" value="Submit">Submit</button>
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

	let li = $(`<li class="nav-item d-flex align-items-start makeMeDraggable recipe_title" id="${recipe.recipe_id}">
					<a class="delete nav-link" id="${recipe.recipe_id}">
						<svg width="24" height="24" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
					</a>
					<a class="edit nav-link">
						<svg width="24" height="24" viewBox="0 0 16 16" class="bi bi-pen-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" d="M13.498.795l.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z"/>
						</svg>
					</a>

					<a class="nav-link show" href="#">${recipe.recipe_title}</a>
					
				</li>`)
	

    $("#recipes").append(li)

    // apply draggable & droppable properties to these freshly-rendered elements 
    dragAndDropInit();


    //clicking on recipe's NAME, show recipe
    li.find(".show").on("dblclick", (evt) => {

		evt.preventDefault();
		
		// $("#new_folder_field").empty()	
		// $("#whole_recipe").empty()
		// $("#whole_recipe_edit").empty()
		// $("#new_recipe_field").empty()     
		// $("#scraped_recipe_field").empty()
		// $("#searched_recipe_body").empty()

		$("#temp").empty()
		$("#temp").append(`<div id="whole_recipe" class="flex-fill"></div>`)

        $("#whole_recipe").append(`<h1 id="recipetitle">${recipe.recipe_title}</h1>
                                    <img id="recipeimage" width="400" height="300" src="${recipe.picture_url}"></img>
                                    <ul id="recipeingred">${recipe.recipe_ingred}</ul>
                                    <ul id="recipedirect">${recipe.recipe_direct}</ul>
                                    <a href=${recipe.recipe_src} id="recipesrc">${recipe.recipe_src}</a>`);
    
        $("#whole_recipe").show()
    });

    // clicking on EDIT button, populate fields to edit a recipe
    li.find(".edit").on("click", (evt) => {

		evt.preventDefault();
		
		// $("#whole_recipe_edit").show()
		
		// $("#whole_recipe_edit").empty()
		// $("#new_folder_field").empty()	
		// $("#whole_recipe").empty()
		// $("#new_recipe_field").empty()     
		// $("#scraped_recipe_field").empty()
		// $("#searched_recipe_body").empty()

		$("#temp").empty()
		$("#temp").append(`<div id="whole_recipe_edit" class="flex-fill"></div>`)

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
		
		const parent = $(evt.target).closest("a")

		const recipe_id_value = parent.attr("id")

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

        // $("#msg").html(userPreference).fadeIn("slow");
        // message_fade_out() 

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
			`<li class="nav-item makeMeDroppable d-flex" id="folder${res.folder_id}" folder_id="${res.folder_id}">

				<a class="delete_folder nav-link" value="${res.folder_id}">
					<svg width="24" height="24" viewBox="0 0 16 16" value="${res.folder_id}" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path value="${res.folder_id}" d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path value="${res.folder_id}" fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
				</a>
				<a class="nav-link folder_title" id="${res.folder_id}" value="${res.folder_id}" href="#">
					${res.folder_title}
				</a>
			</li>`

            // `<div id="folder${res.folder_id}">
            //     <h2 class="makeMeDroppable folder_title" id="${res.folder_id}" value="${res.folder_title}"> ${res.folder_title} </h2>
            //     <button class="delete_folder" value="${res.folder_id}"> Delete </button>
            // </div>`
        )
    }) 

    // clear out the input box after submission
    $("#new_folder_title")[0].value = ""
}

//render html for new recipe addition 
function create_edition_form() {

	// $("#new_folder_field").empty()
	// $("#whole_recipe").empty()
	// $("#whole_recipe_edit").empty()
	// $("#new_recipe_field").empty()
	// $("#scraped_recipe_field").empty()
	// $("#searched_recipe_body").empty()
	
	$("#temp").empty()
	$("#temp").append(`<div id="new_recipe_field" class="flex-fill"></div>`)

    // $("#new_recipe_field").toggle()

    $("#new_recipe_field").append(`
		<form id="new_recipe_form">
			<div class="form-group">
				<label for="folder_options" class="form-control-header">Select a folder:</label>
				<select id="folder_options" class="form-control" required></select>
			</div>
			<div class="form-group">
				<label for="recipe_ttl" class="form-control-header">Enter recipe title:</label>
				<input id="recipe_ttl" class="form-control" placeholder="Recipe Title" required></input>
			</div>
			<div class="form-group">
				<label for="recipe_source" class="form-control-header">Recipe link (optional but recommended):</label>
				<input id="recipe_source" class="form-control" placeholder="Source - self or URL"  required></input>
			</div>
			<div class="form-group">
				<label for="picture_url" class="form-control-header">Picture link (optional but recommended):</label>
				<input id="picture_url" class="form-control" placeholder="Picture URL" required></input>
			</div>
			<div class="form-group">
				<label for="recipe_ing" class="form-control-header">Enter ingredients:</label>
				<textarea id="recipe_ing" class="editor" placeholder="Ingredients" required></textarea>
			</div>
			<div class="form-group">
				<label for="recipe_dir" class="form-control-header">Enter directions:</label>
				<textarea id="recipe_dir" class="editor" placeholder="Directions" required></textarea>
			</div>
				<button id="recipe_addition_submit" class="btn btn-primary" value="Submit">Submit</button>
        </form>`)

    $.get('/api/myfolders.json', (res) => {

        for (const folder of res) {
            $("#folder_options").append(`<option id="${folder.folder_id}" value="${folder.folder_id}" > ${folder.folder_title} </option>`)
        }
    });

    wysIwyg();

    $("#recipe_addition_submit").on("click", submit_new_recipe)

}


//submit new recipe to db
function submit_new_recipe(evt) {

    evt.preventDefault();

    let folder_idd = $("#folder_options").val()

    //hide new recipe input form
    // $("#new_recipe_field").toggle()

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

	const parent = $(evt.target).closest("a")

	const folder_id_value = parent.attr("value")

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

    
    // $("#msg").html(userPreference).fadeIn("slow")
    // message_fade_out() 

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

	// $("#new_folder_field").empty()
	// $("#whole_recipe").empty()
	// $("#whole_recipe_edit").empty()
	// $("#new_recipe_field").empty()
	// $("#scraped_recipe_field").empty()
	// $("#searched_recipe_body").empty()
	
	$("#temp").empty()
	$("#temp").append(`<div id="scraped_recipe_field" class="flex-fill"></div>`)

    // $("#scraped_recipe_field").toggle()

    $("#scraped_recipe_field").append(`
		<form id="scraped_recipe_form">
			<div class="form-group">
				<label for="folder_options_2" class="form-control-header">Select a folder:</label>
				<select id="folder_options_2" class="form-control" required></select>
			</div>
			<div class="form-group">
				<label for="url_link" class="form-control-header">Paste recipe link:</label>
				<input id="url_link"  class="form-control" placeholder="URL"></input>
			</div>
			<button id="recipe_scraping_submit" class="btn btn-primary" value="Submit">Submit</button>
        </form>`)

    $.get('/api/myfolders.json', (res) => {

        for (const folder of res) {
            $("#folder_options_2").append(`<option id="${folder.folder_id}" value="${folder.folder_id}"> ${folder.folder_title} </option>`)
        }
    });

    //event: submitting a URL to scrape a recipe... 
    $("#recipe_scraping_submit").on("click", scrape_a_recipe)
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
		snap: 'document',

    });
    $(".makeMeDroppable").droppable( {
        drop: handleDropEvent,
    });
}

//detect dropped recipe's id and folder_id and submit to DB
function handleDropEvent( event, ui ) {

	event.preventDefault();
	
	const folder_id = $(event.target).attr("folder_id")

    const formInputs = {
        'recipe_id' : ui.draggable.attr('id'),
        'folder_id' : folder_id,
	}
	
    $.post('/api/myfolders/update_recipe_folder.json', formInputs, () => {
        show_new_recipe(folder_id)
    })
    
}

function search_for_recipe() {

    $("#recipes").empty()
    $("#search_list").empty()
    $("#searched_recipe_body").empty()

    const userInput = {
        "data" : $("#search_input").val()
    }


    $.get('/api/search.json', userInput, (res) => {
    
        for (let recipe of res) {

            show_searched_recipe(recipe)
        }
    });
}

function show_searched_recipe(recipe) {

    // add each recipe to search list

	let li = 
	$(`<li class="searched_recipe nav-item d-flex align-items-start" id="${recipe.recipe_id}" value="${recipe.recipe_id}"><span class="show_search_result nav-link"> 
		<svg width="24" height="24" viewBox="0 0 16 16" class="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
		<path fill-rule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
		<path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
		</svg>${recipe.recipe_title}</span></li>`)

    if (recipe.hasOwnProperty('recipe_title')) {
        $("#search_list").append(li)
        
    } else { 
        $("#search_list").append(`<div> ${recipe.error} <div>`)
        
    }

    //clicking on recipe's name, show recipe
    li.find(".show_search_result").on("click", (evt) => {


        evt.preventDefault();

        // $("#searched_recipe_body").empty()
        // $("#whole_recipe").empty()

        // $("whole_recipe_edit").empty()
        // $("new_recipe_field").empty()
		// $("scraped_recipe_field").empty()
		
		$("#temp").empty()
		$("#temp").append(`<div id="searched_recipe_body" class="flex-fill"></div>`)
        

        $("#searched_recipe_body").append(`<h1 id="rec_title">${recipe.recipe_title}</h1>
                                            <img id="rec_image" width="400" height="300" src="${recipe.picture_url}"></img>
                                            <ul id="rec_ingred">${recipe.recipe_ingredients}</ul>
                                            <ul id="rec_direct">${recipe.recipe_directions}</ul>
                                            <a href=${recipe.recipe_source} id="rec_src">${recipe.recipe_source}</a>`);

});

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
$("#folder_directory").on("click", ".folder_title", (evt) => {  

	evt.preventDefault(); 

	const current = $(event.target)
	current.parent().parent().find('li>a.folder_title').removeClass('active')
	current.addClass('active')

    //emptying all previous outputs - folders, recipes, textareas 
    $("#recipes").empty()
    $("#search_list").empty()
    $("#whole_recipe").empty()
    $("#whole_recipe_edit").empty()
    $("#searched_recipe_body").empty()

    $("#new_recipe_field").empty()
    $("#scraped_recipe_field").empty()

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



	// $("#new_folder_field").empty()
	// $("#whole_recipe").empty()
	// $("#whole_recipe_edit").empty()
	// $("#new_recipe_field").empty()
	// $("#scraped_recipe_field").empty()
	// $("#searched_recipe_body").empty()

	$("#temp").empty()
	$("#temp").append(`<div id="new_folder_field" class="flex-fill"></div>`)
	
    // if ($("#new_folder_field")[0].hidden === false) {
    //     $("#new_folder_field").attr("hidden", true)
    // } else {
    //     $("#new_folder_field").attr("hidden", false)
    // }

    $("#new_folder_field").append(
		`<form>
			<div class="form-group">
				<label for="new_folder_title" class="form-control-header">Folder title:</label>
				<input id="new_folder_title" class="form-control" type="text" placeholder="Folder Title" required="required"></input>
			</div>
				<button id="folder_addition_submit" class="btn btn-primary" value="Submit">Submit</button>
        </form>`
    );
    
    $("#folder_addition_submit").on("click", submit_new_folder)

});

// event: clicking on ENTER A RECIPE RECIPE button...
$("#new_recipe_button").on("click", create_edition_form);

// event: clicking on IMPORT A RECIPE button
$("#recipe_from_url_button").on("click", create_scraping_form);

// event: clicking on delete a folder button
$(".delete_folder").on("click", delete_folder)

//event: clicking on search submit button
$("#search_button").on("click", search_for_recipe);

