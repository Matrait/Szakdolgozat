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
        var ccTag;
        var dokNev = document.getElementById("dokNev").value;
        Word.run(function (context) {
            var range = context.document.getSelection();

            
            // Queue a command to load the range selection result.
            context.load(range, 'text');


            return context.sync()
                .then(function () {
                    context.load(range, 'font');
                    context.load(range, 'text');

                    //Contetnt Control hozzáadás
                    var jelCC = range.insertContentControl();

                    
                    jelCC.tag = count;
                    jelCC.font.highlightColor = 'Red';

                    szoveg = range.text;
                    ccTag = jelCC.tag;
                    
                    // adat csomagolás
                    data = "{DocName : ".concat(dokNev, ", Text : ", szoveg, ", CCtag : ", ccTag);
                    sender(data);

                    //CC változó növelése
                    count++;

                    
                })
                .then(context.sync);
            
        })
            .catch(errorHandler);

    }

    function torles() {
        data = "{DeleteLast : True}";
    }

    function sender(data) {
        //csak proba POST metod


        var url = "serverURL";
        var xhr = new XMLHttpRequest();

        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ data }));
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