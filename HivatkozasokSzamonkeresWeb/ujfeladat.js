//const { error } = require("jquery");

(function () {
    "use strict";

    var messageBanner;
    var count = 0;

    // The initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(function () {
            // Initialize the notification mechanism and hide it
            var element = document.querySelector('.MessageBanner');
            messageBanner = new components.MessageBanner(element);
            messageBanner.hideBanner();

            loadSampleData();

            // Add a click event handler for the highlight button.
            $('#tarolas').click(tarolas);
            $('#torles').click(torles);
        });
    };

    function loadSampleData() {
        // Run a batch operation against the Word object model.
        Word.run(function (context) {
            // Create a proxy object for the document body.
            var body = context.document.body;

            // Queue a commmand to clear the contents of the body.
            body.clear();
            // Queue a command to insert text into the end of the Word document body.
            body.insertText(
                "This is a sample text inserted in the document",
                Word.InsertLocation.end);

            // Synchronize the document state by executing the queued commands, and return a promise to indicate task completion.
            return context.sync();
        })
            .catch(errorHandler);
    }

    function tarolas() {
        //használandó változók
        var data;
        var szoveg;
        var ccId;
        var dokNev = document.getElementById("dokNev").value;
        newErr();

        async function newErr() {
            //Ez igy jó
            await Word.run(async (context) => {
                var range = context.document.getSelection();
                context.load(range, 'text');
                await context.sync();

                
                let wordCC = range.insertContentControl();
                wordCC.font.highlightColor = 'Red';
                wordCC.appearance = 'BoundingBox';
                szoveg = range.text;

                await context.sync();

                let ccs = context.document.contentControls;
                ccs.load();

                await context.sync();

                var amount = ccs.items.length;
                ccId = ccs.items[amount-1].id;
                data = '{"DocName" : "' + dokNev + '", "Text" : "' + szoveg + '", "CCtag" : ' + ccId + '}';
                sender(data);                
            });
        }
        
    }

    function torles() {
        var dokNev = document.getElementById("dokNev").value;
        var data = '{ "DokNev": "' + dokNev + '", "DeleteLast": true }';
        $('#siker').html(' ');
        //ez igy müködik
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8080/deleteLast.php",
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            mimeType: 'multipart/form-data',
            success: function() {
                $('#siker').html('siker');
            },

        }).fail((jqXHR, error) => {
            $('#siker').html(new Error(error), "  ", new Error(jqXHR));
        });
    }

    function sender(data) {
        //Ez igy müködik

        $('#siker').html(' ');

        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8080/ujfeladat.php",
            data: data,
            contentType: false,
            cache: false,
            processData: false,
            mimeType:'multipart/form-data',
            success: function () {
                $('#siker').html('Adat rögzítve');
            },
            
        }).fail((jqXHR, error) => {
            $('#siker').html(new Error(error), "  ", new Error(jqXHR));
        });

    }

    function displaySelectedText() {
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Text,
            function (result) {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    showNotification('The selected text is:', '"' + result.value + '"');
                } else {
                    showNotification('Error:', result.error.message);
                }
            });
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