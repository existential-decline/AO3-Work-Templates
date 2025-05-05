// ==UserScript==
// @name         AO3 Work Templates
// @namespace    https://github.com/existential-decline/AO3-Work-Templates/
// @version      2025-05-05
// @description  Save, load, and delete templates for AO3 new works.
// @author       existential-decline@tumblr
// @match        https://archiveofourown.org/works/new*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// ==/UserScript==
/* globals jQuery, $ */

(function() {



    function saveTemplate(name) {
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
            name.collections = $("#associations > dl > dd.collection > ul li.added.tag").text().split(" ×").filter(e => e);
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
            GM_setValue(name.name, name);
            alert("Template " + name.name + " created!");

        }
        catch {alert("Something went wrong with saving!")};
        //reload the div box
        createModalContent();
    }

    function loadTemplate(name) {
        //load from userscript storage
        const currtemplate = GM_getValue(name,null)
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
    <div id="saveTemplateButton"><input type="button" value="Create"></div>
    <div id="loadTemplateButton"><input type="button" value="Load"></div>
    <div id="deleteTemplateButton"><input type="button" value="Delete"></div>
    </div>`);
    let $close = $modal.find('#close-template-modal');
    let $modalContent = $modal.find('#template-modal-content');
    let $templateButton = $('<div id="template-button"><span>Templates</span></div>');
    let $deleteTemplateButton = $modal.find('#deleteTemplateButton');
    let $saveTemplateButton = $modal.find('#saveTemplateButton');
    let $loadTemplateButton = $modal.find('#loadTemplateButton');




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
        height:180px;
        width:250px;
        background:white;
        padding:10px;
        overflow:auto;
        border:2px solid grey;
        color:black;
        z-index:2;
        }

        #close-template-modal{
        position:fixed;
        right:15px;
        }

        #saveTemplateButton{
        padding-top:10px;
        padding-right:10px;
        display: inline-block;
        }

        #loadTemplateButton{
        padding-top:10px;
        padding-right:10px;
        display: inline-block;
        }

        #deleteTemplateButton{
        padding-top:10px;
        padding-right:10px;
        display: inline-block;
        }

        #templateSelectDiv{
        width:70%;
        }

        #template-button{
        display:block;
        position:fixed;
        background:white;
        color:black;
        border:2px solid grey;
        bottom:0;
        right:0;
        padding:10px;
        z-index:1;
        }`);

        setupMouseHandlers();
    }

    function setupMouseHandlers() {
        $close.click(function() {
            $modal.hide();
        });

        $templateButton.click(function() {
            createModalContent();
            $modal.show();
        });

        $saveTemplateButton.click(function() {
            saveTemplate(new Template($("#newtemplatename").val()));
        });

        $loadTemplateButton.click(function() {
            loadTemplate($("#templateselect").val());
        });

        $deleteTemplateButton.click(function() {
            deleteTemplate($("#templateselect").val());
        });

    }

    function createModalContent(){
        const templateList = GM_listValues();
        var modalContentHTML = `<h3>New Work Templates</h3><p>Create new template: <input type="text" id="newtemplatename" value="NewTemplate"></p>Choose a template:</label><div id="templateSelectDiv"><select name="templateselect" id="templateselect">`;
        for (let i = 0; i < templateList.length; i++) {
            modalContentHTML += `<option value="` + templateList[i] + `">` + templateList[i] + `</option>`
        };
        modalContentHTML += `</select></div>`;
        $modalContent[0].innerHTML = modalContentHTML;
    };



    function deleteTemplate(name) {

        GM_deleteValue(name);
        alert("Template " + name + " deleted.");

        //reload the div box
        createModalContent();
    };







    function Template(name) {
        this.name = name;
    }



    function setupCss(css) {
        let head = $('head');
        let style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = css;
        head.append(style);
    }

})();
