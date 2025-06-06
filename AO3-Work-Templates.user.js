// ==UserScript==
// @name         AO3 Work Templates
// @namespace    https://github.com/existential-decline/AO3-Work-Templates/
// @version      1.0.2
// @description  Save, load, and delete templates for AO3 new works.
// @author       existential-decline@tumblr
// @match        https://archiveofourown.org/works/new*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// ==/UserScript==
/* globals jQuery, $ */

(function() {



    async function saveTemplate(name) {
        try {
            //collect all the current form data
            name.rating = $("#work_rating_string").val();
            name.warnings = [$("#work_archive_warning_strings_choose_not_to_use_archive_warnings").is(":checked"),
                             $("#work_archive_warning_strings_graphic_depictions_of_violence").is(":checked"),
                             $("#work_archive_warning_strings_major_character_death").is(":checked"),
                             $("#work_archive_warning_strings_no_archive_warnings_apply").is(":checked"),
                             $("#work_archive_warning_strings_rapenon-con").is(":checked"),
                             $("#work_archive_warning_strings_underage_sex").is(":checked")];
            name.fandoms = $("#work-form > fieldset.work.meta > dl > dd.fandom.required > ul li.added.tag").text().split(" ×").filter(e => e);
            name.categories = [$("#work_category_strings_ff").is(":checked"),
                               $("#work_category_strings_fm").is(":checked"),
                               $("#work_category_strings_gen").is(":checked"),
                               $("#work_category_strings_mm").is(":checked"),
                               $("#work_category_strings_multi").is(":checked"),
                               $("#work_category_strings_other").is(":checked")];
            name.relationships = $("#work-form > fieldset.work.meta > dl > dd.relationship > ul li.added.tag").text().split(" ×").filter(e => e);
            name.characters = $("#work-form > fieldset.work.meta > dl > dd.character > ul li.added.tag").text().split(" ×").filter(e => e);
            name.additionalTags = $("#work-form > fieldset.work.meta > dl > dd.freeform > ul li.added.tag").text().split(" ×").filter(e => e);
            name.title = $("#work_title").val();
            name.hasCoauthors = $("#co-authors-options-show").is(":checked");
            name.coauthors = $("#co-authors-options > ul li.added.tag").text().split(" ×").filter(e => e);
            name.summary = $("#work_summary").val();
            name.hasNotesBeginning = $("#front-notes-options-show").is(":checked");
            name.notesBeginning = $("#work_notes").val();
            name.hasNotesEnd = $("#end-notes-options-show").is(":checked");
            name.notesEnd = $("#work_endnotes").val();
            //collections can't load properly because of spaces, so call a function for it.
            name.collections = extractCollections($("#associations > dl > dd.collection > ul li.added.tag").text().split(" ×").filter(e => e));
            name.giftTo = $("#associations > dl > dd.recipient > ul li.added.tag").text().split(" ×").filter(e => e);
            name.isInspiredBy = $("#parent-options-show").is(":checked");
            name.inspiredBy = [$("#work_parent_work_relationships_attributes_0_url").val(),
                               $("#work_parent_work_relationships_attributes_0_title").val(),
                               $("#work_parent_work_relationships_attributes_0_author").val(),
                               $("#work_parent_work_relationships_attributes_0_language_id").val(),
                               $("#work_parent_work_relationships_attributes_0_translation").is(":checked")];
            name.isSeries = $("#series-options-show").is(":checked");
            name.series = [$("#work_series_attributes_id").val(), $("#work_series_attributes_title").val()];
            name.isMultichap = $("#chapters-options-show").is(":checked");
            name.multichap = [$("#work_wip_length").val(), $("#work_chapter_attributes_title").val()];
            name.isPubDate = $("#backdate-options-show").is(":checked");
            name.pubDate = [$("#work_chapter_attributes_published_at_3i").val(), $("#work_chapter_attributes_published_at_2i").val(), $("#work_chapter_attributes_published_at_1i").val()]
            name.language = $("#work_language_id").val();
            name.workSkin = $("#work_work_skin_id").val();
            name.regUsers = $("#work_restricted").is(":checked");
            name.commentMod = $("#work_moderated_commenting_enabled").is(":checked");
            name.whoComments = [$("#work_comment_permissions_enable_all").is(":checked"),
                                $("#work_comment_permissions_disable_anon").is(":checked"),
                                $("#work_comment_permissions_disable_all").is(":checked")];
            name.workText = $("#content").val();

            //save to userscript storage
            await GM.setValue(name.name, name);
            alert("Template " + name.name + " saved!");

        }
        catch {alert("Something went wrong with saving!")};
        //reload the div box
        createModalContent();
    }

    async function loadTemplate(name) {

        //remove current added tags
        removeTags();

        //load from userscript storage
        const currtemplate = await GM.getValue(name,null);

        try {
            //set all the form data
            $("#work_rating_string").val(currtemplate.rating);
            $("#work_archive_warning_strings_choose_not_to_use_archive_warnings").prop("checked",currtemplate.warnings[0]);
            $("#work_archive_warning_strings_graphic_depictions_of_violence").prop("checked",currtemplate.warnings[1]);
            $("#work_archive_warning_strings_major_character_death").prop("checked",currtemplate.warnings[2]);
            $("#work_archive_warning_strings_no_archive_warnings_apply").prop("checked",currtemplate.warnings[3]);
            $("#work_archive_warning_strings_rapenon-con").prop("checked",currtemplate.warnings[4]);
            $("#work_archive_warning_strings_underage_sex").prop("checked",currtemplate.warnings[5]);
            $('#work_fandom_autocomplete').val(currtemplate.fandoms);
            $("#work_category_strings_ff").prop("checked",currtemplate.categories[0]);
            $("#work_category_strings_fm").prop("checked",currtemplate.categories[1]);
            $("#work_category_strings_gen").prop("checked",currtemplate.categories[2]);
            $("#work_category_strings_mm").prop("checked",currtemplate.categories[3]);
            $("#work_category_strings_multi").prop("checked",currtemplate.categories[4]);
            $("#work_category_strings_other").prop("checked",currtemplate.categories[5]);
            $("#work_relationship_autocomplete").val(currtemplate.relationships);
            $("#work_character_autocomplete").val(currtemplate.characters);
            $("#work_freeform_autocomplete").val(currtemplate.additionalTags);
            $("#work_title").val(currtemplate.title);

            $("#co-authors-options-show").prop("checked",currtemplate.hasCoauthors);
            if (currtemplate.hasCoauthors) {
                $("#co-authors-options").removeClass("hidden");
                $("#pseud_byline_autocomplete").val(currtemplate.coauthors);
            } else {
                $("#co-authors-options").addClass("hidden");
            };

            $("#work_summary").val(currtemplate.summary);

            $("#front-notes-options-show").prop("checked",currtemplate.hasNotesBeginning);
            if (currtemplate.hasNotesBeginning) {
                $("#front-notes-options").removeClass("hidden");
                $("#work_notes").val(currtemplate.notesBeginning);
            } else {
                $("#front-notes-options").addClass("hidden");
            };

            $("#end-notes-options-show").prop("checked",currtemplate.hasNotesEnd);
            if (currtemplate.hasNotesEnd) {
                $("#end-notes-options").removeClass("hidden");
                $("#work_endnotes").val(currtemplate.notesEnd);
            } else {
                $("#end-notes-options").addClass("hidden");
            };

            $("#work_collection_names_autocomplete").val(currtemplate.collections);
            $("#work_recipients_autocomplete").val(currtemplate.giftTo);

            $("#parent-options-show").prop("checked",currtemplate.isInspiredBy);
            if (currtemplate.isInspiredBy) {
                $("#parent-options").removeClass("hidden");
                $("#work_parent_work_relationships_attributes_0_url").val(currtemplate.inspiredBy[0]);
                $("#work_parent_work_relationships_attributes_0_title").val(currtemplate.inspiredBy[1]);
                $("#work_parent_work_relationships_attributes_0_author").val(currtemplate.inspiredBy[2]);
                $("#work_parent_work_relationships_attributes_0_language_id").val(currtemplate.inspiredBy[3]);
                $("#work_parent_work_relationships_attributes_0_translation").prop("checked",currtemplate.inspiredBy[4]);
            } else {
                $("#parent-options").addClass("hidden");
            };

            $("#series-options-show").prop("checked",currtemplate.isSeries);
            if (currtemplate.isSeries) {
                $("#series-options").removeClass("hidden");
                $("#work_series_attributes_id").val(currtemplate.series[0]);
                $("#work_series_attributes_title").val(currtemplate.series[1]);
            } else {
                $("#series-options").addClass("hidden");
            };

            $("#chapters-options-show").prop("checked",currtemplate.isMultichap);
            if (currtemplate.isMultichap) {
                $("#chapters-options").removeClass("hidden");
                $("#work_wip_length").val(currtemplate.multichap[0]);
                $("#work_chapter_attributes_title").val(currtemplate.multichap[1]);
            } else {
                $("#chapters-options").addClass("hidden");
            };

            $("#backdate-options-show").prop("checked",currtemplate.isPubDate);
            if (currtemplate.isPubDate) {
                $("#backdate-options").removeClass("hidden");
                $("#work_chapter_attributes_published_at_3i").val(currtemplate.pubDate[0]);
                $("#work_chapter_attributes_published_at_2i").val(currtemplate.pubDate[1]);
                $("#work_chapter_attributes_published_at_1i").val(currtemplate.pubDate[2]);
            } else {
                $("#backdate-options").addClass("hidden");
            };
            $("#work_language_id").val(currtemplate.language);
            $("#work_work_skin_id").val(currtemplate.workSkin);
            $("#work_restricted").prop("checked",currtemplate.regUsers);
            $("#work_moderated_commenting_enabled").prop("checked",currtemplate.commentMod);
            $("#work_comment_permissions_enable_all").prop("checked",currtemplate.whoComments[0]);
            $("#work_comment_permissions_disable_anon").prop("checked",currtemplate.whoComments[1]);
            $("#work_comment_permissions_disable_all").prop("checked",currtemplate.whoComments[2]);
            $("#content").val(currtemplate.workText);


        }
        catch {alert("Something went wrong with loading!")};
    };



    let $body = $('body');
    let $modal = $(`
    <div id="template-modal">
    <div id="close-template-modal"><span>X</span></div>
    <div id="template-modal-content"></div>
    <div id="saveTemplateButton"><input type="button" value="Save"></div>
    <div id="loadTemplateButton"><input type="button" value="Load"></div>
    <div id="deleteTemplateButton"><input type="button" value="Delete"></div>
    <div id="createTemplateButton"><input type="button" value="Create New Template"></div>
    </div>`);
    let $close = $modal.find('#close-template-modal');
    let $modalContent = $modal.find('#template-modal-content');
    let $templateButton = $('<div id="template-button"><span>Templates</span></div>');
    let $deleteTemplateButton = $modal.find('#deleteTemplateButton');
    let $saveTemplateButton = $modal.find('#saveTemplateButton');
    let $loadTemplateButton = $modal.find('#loadTemplateButton');
    let $createTemplateButton = $modal.find('#createTemplateButton');




    init();

    function init() {
        $body.append($modal);
        $body.append($templateButton);
        setupCss(`
        #template-modal{
        display:none;
        position:fixed;
        bottom:0;
        right:0;
        height:200px;
        width:250px;
        padding:10px;
        background-color:` + colorTheme("background-color") + `;
        color:` + colorTheme("color") + `;
        overflow:auto;
        border:2px solid grey;
        z-index:2;
        }

        #close-template-modal{
        position:fixed;
        right:15px;
        }

        #createTemplateButton {
        display:block;
        padding-top:20px;
        align:center;
        }

        #saveTemplateButton{
        padding-top:10px;
        padding-right:10px;
        display: inline-block;
        align:center;
        }

        #loadTemplateButton{
        padding-top:10px;
        padding-right:10px;
        display: inline-block;
        align:center;
        }

        #deleteTemplateButton{
        padding-top:10px;
        padding-right:10px;
        display: inline-block;
        align:center;
        }

        #templateSelectDiv{
        align:center;
        padding-right:10px;
        padding-bottom:5px;
        }

        #template-button{
        display:block;
        position:fixed;
        border:2px solid grey;
        background-color:` + colorTheme("background-color") + `;
        color:` + colorTheme("color") + `;
        bottom:0;
        right:0;
        padding:10px;
        z-index:1;
        }`);

        setupMouseHandlers();
    }

    function setupMouseHandlers() {
        //handle click inputs
        $close.click(function() {
            $modal.hide();
        });

        $templateButton.click(function() {
            createModalContent();
            $modal.show();
        });

        $createTemplateButton.click(function() {
            createTemplate();
        });

        $saveTemplateButton.click(function() {
            saveTemplate(new Template($("#templateselect").val()));
        });

        $loadTemplateButton.click(function() {
            loadTemplate($("#templateselect").val());
        });

        $deleteTemplateButton.click(function() {
            deleteTemplate($("#templateselect").val());
        });

    }

    async function createModalContent(){
        const templateList = await GM.listValues();
        var modalContentHTML = `<h3>New Work Templates</h3>
    <label="templateselection">Choose a template:</label><div id="templateSelectDiv"><select name="templateselect" id="templateselect">`;
        for (let i = 0; i < templateList.length; i++) {
            modalContentHTML += `<option value="` + templateList[i] + `">` + templateList[i] + `</option>`
        };
        modalContentHTML += `</select></div>`;
        $modalContent[0].innerHTML = modalContentHTML;
    };


    function createTemplate() {
        //creates a js prompt to input a new template name.
        var templateName = prompt("Please enter new template name:", "NewTemplate");
        //check if field is blank; if yes, do nothing
        if (templateName!=null && templateName != "") {
            //check if a template exists.
            var templateList = $("#templateselect option").toArray().map(o => o.value);
            
            if (!(templateList.includes(templateName))) {
                saveTemplate(new Template(templateName));
            } else {
                alert("Template " + templateName + " already exists!")};
        };
    };

    async function deleteTemplate(name) {
        //delete the named template.
        await GM.deleteValue(name);
        alert("Template " + name + " deleted.");

        //reload the div box (update selection list)
        createModalContent();
    };

    function removeTags() {
        //checks through all the added tags and clicks the x link (removes them)
        $("li[class='added tag']").each(function (index, element) {
            $(element).find('a')[0].click();
        });
    };


    function Template(name) {
        //just creating a template object with a name.
        this.name = name;
    };

    function colorTheme(elementName) {
        switch (elementName) {
        //checks if div outer wrapper has a color; if it has none/is transparent, take background color from body instead
            case "background-color":
        return ($("#outer.wrapper").css(elementName) == null || $("#outer.wrapper").css(elementName) == "rgba(0, 0, 0, 0)") ? $body.css(elementName):$("#outer.wrapper").css(elementName);
            case "color":
            return ($("label").css(elementName));
            default:
                return ($body.css(elementName));
        };
    };

    function extractCollections(list) {
        //collections don't work without the dropdown autofill select; this fixes that by taking only the unique collection name inside parentheses
        var collections = [];
        for (let i = 0; i<list.length; i++) {
            try {
                collections[i] = /(?<=\(([\w]*)\))/.exec(list[i])[1];
            }
            catch {collections[i] = list[i];}
        };
        return collections;
    };



    function setupCss(css) {
        let head = $('head');
        let style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = css;
        head.append(style);
    }

})();
