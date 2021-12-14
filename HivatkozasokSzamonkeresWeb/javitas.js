
(function () {
    "use strict";

    var messageBanner;
   
    // The initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(function () {
            // Initialize the notification mechanism and hide it
            var element = document.querySelector('.MessageBanner');
            messageBanner = new components.MessageBanner(element);
            messageBanner.hideBanner();

            loadDocNames();

            $('#betoltes').click(betoltes);
        });
    };

    function loadDocNames() {
        //ez igy jó lesz
        var data = '{ "submit": "True"}';

        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8080/loadDocNames.php",
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            mimeType: 'multipart/form-data',
            success: function (result) {
                $('#dokNevLG').html(result);
            },

        }).fail((jqXHR, error) => {
            $('#dokNevLG').html(new Error(error), "  ", new Error(jqXHR));
        });
    }

    function betoltes() {
        var selectId = document.getElementById("dokNevLGS").value;
        var data = '{ "DocId": "' + selectId + '"}';

        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8080/visszaToltes.php",
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            mimeType: 'multipart/form-data',
            success: function (result) {
                const json = result;
                
                const obj = JSON.parse(json);
                
                beiras(obj);
            },

        }).fail((jqXHR, error) => {
            $('#dokNevLG').html(new Error(error), "  ", new Error(jqXHR));
        });
    } 

    function beiras(obj) {//valami a sync-ekkel nem jó, getbyid után
        var hibaszam = obj.length;
        betolt();
        async function betolt(){
            await Word.run(async (context) => {
                let ccs = context.document.contentControls;
                ccs.load();
                await context.sync();

                var amount = ccs.items.length;
                var ccId = ccs.items[amount - 1].id;

                for (var i = 0; i < hibaszam; i++) {
                    var ccId = obj[i].ccId;
                    var wordCC = ccs.getByIdOrNullObject(parseInt(ccId));
                    
                    wordCC.font.highlightColor = '#FFFF00';
                    await context.sync();

                    let range = wordCC.getRange();
                    let answerR = range.getRange('After');
                    let answerCC = answerR.insertContentControl();
                    await context.sync();
                    answerCC.font.highlightColor = '#00FF00';

                    answerCC.load();
                    answerCC.insertText(obj[i].text,'Replace');
                }
                await context.sync();
            });
        }
        
    }
    //$$(Helper function for treating errors, $loc_script_taskpane_home_js_comment34$)$$
    function errorHandler(error) {
        // $$(Always be sure to catch any accumulated errors that bubble up from the Word.run execution., $loc_script_taskpane_home_js_comment35$)$$
        showNotification("Error:", error);
        console.log("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
            console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
    }

    // Helper function for displaying notifications
    function showNotification(header, content) {
        $("#notification-header").text(header);
        $("#notification-body").text(content);
        messageBanner.showBanner();
        messageBanner.toggleExpansion();
    }
})();
