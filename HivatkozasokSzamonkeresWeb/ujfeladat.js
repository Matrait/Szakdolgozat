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
        Word.run(function (context) {
            var range = context.document.getSelection();

            var body = context.document.body;
            // Queue a command to load the range selection result.
            context.load(range, 'text');

            //Pozició meghatározása
            var start = range.startOffset;
            var end = range.endOffset;

            console.log('start:', start, 'end:', end);

            // Synchronize the document state by executing the queued commands
            // and return a promise to indicate task completion.

            //csak proba POST metod
            /*var data = "{}";
            
            var url = "serverURL";
            var xhr = new XMLHttpRequest();

            xhr.open("POST", url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({data}))*/

            return context.sync()
                .then(function () {
                    context.load(range, 'font');
                    // Queue a command to highlight the search results.
                    range.font.highlightColor = '#FFFF00'; // Yellow

                   // body.insertText(start, end);

                    //Contetnt Control hozzáadás
                    var rangAfter = range.getRange("End");

                    var wordCC = rangAfter.insertContentControl();

                    
                    wordCC.tag = "CC1";
                    wordCC.insertText(" ", 'Replace');
                    wordCC.appearance = 'Hidden';
                    wordCC.font.highlightColor = 'red';

                    
                   
                   
                    //pozició kiírása
                    
                })
                .then(context.sync);
        })
            .catch(errorHandler);

        // var ccid = wordCC.id;

    }

    function torles() {
        Word.run(function (context) {
            var range = context.document.getSelection();

            // Queue a command to load the range selection result.
            context.load(range, 'text');

            return context.sync()
                .then(function () {
                    context.load(range, 'font');
                    // gomb teszt
                    range.font.highlightColor = 'green';

                })
                .then(context.sync);
        })
            .catch(errorHandler);
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