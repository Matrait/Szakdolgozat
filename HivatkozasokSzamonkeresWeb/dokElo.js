(function () {
    "use strict";
    var jsonData = new Object();//ebben tároljuk az adatokat küldés elött
    jsonData.DocName = new Array();
    jsonData.Text = new Array();
    jsonData.CCid = new Array();

    var counter = 0;
    

    // The initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(function () {
            // Add a click event handler for the highlight button.
            $('#save_C').click(saveOnClient);
            $('#delete').click(deleteSelected);
            $('#save_S').click(sender);
            $('#docName').change(nameCheck);

        });
    };

    function saveOnClient() {
        $('#deleteDone').html('');
        var text;
        var ccId;
        var docName = document.getElementById("docName").value;
        newCitation();

        async function newCitation() {
            
            await Word.run(async (context) => {
                var range = context.document.getSelection();
                context.load(range, 'text');
                await context.sync();

                let wordCC = range.insertContentControl();
                wordCC.font.highlightColor = 'gray';
                wordCC.appearance = 'BoundingBox';

                wordCC.load();

                await context.sync();

                text = wordCC.text;
                ccId = wordCC.id;
                               
                jsonData.DocName[counter] = docName;
                jsonData.Text[counter] = encodeURIComponent(text);
                jsonData.CCid[counter] = ccId;
                $('#tarolt').html(jsonData.CCid.length);
                counter++;
            });
        }
        
    }

    function deleteSelected() {
        var ccID;
        $('#deleteDone').html('');
        findSelectedCC();
        async function findSelectedCC() {
            await Word.run(async (context) => {
                let range = context.document.getSelection();
                range.load();

                await context.sync();

                let wordCC = range.parentContentControlOrNullObject;
                wordCC.load();

                await context.sync();

                ccID = wordCC.id;
                if (typeof ccID == 'undefined') {
                    $('#deleteDone').html('A kiválasztott hivatkozás nem található');
                    return;
                }

                for (var i = 0; i < jsonData.CCid.length; i++) {
                    if (jsonData.CCid[i] === ccID) {

                        jsonData.DocName.splice(i, 1);
                        jsonData.Text.splice(i, 1);
                        jsonData.CCid.splice(i, 1);

                    }
                }

                wordCC.font.highlightColor = null;

                await context.sync();

                wordCC.delete(true);

                $('#tarolt').html(jsonData.CCid.length);
                counter = counter - 1;
            });
        }
    }

    function sender() {
        $('#deleteDone').html('');

        var json = JSON.stringify(jsonData);

        jsonData.DocName.length = 0;
        jsonData.Text.length = 0;
        jsonData.CCid.length = 0;

        counter = 0;

        $('#saveDone').html(' ');

        $.ajax({
            type: "POST",
            url: "http://localhost:8080/v3/dokelo.php",
            data: json,
            contentType: false,
            cache: false,
            processData: false,
            mimeType:'multipart/form-data',
            success: function (result) {
                $('#saveDone').html(result);
            },
            
        }).fail((jqXHR, error) => {
            $('#saveDone').html(new Error(error), "  ", new Error(jqXHR));
        });

    }

    function nameCheck() {
        //ez müködik
        var docName = document.getElementById("docName").value;
        var data = new Object();
        data.DocName = docName;
        var json = JSON.stringify(data);

        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8080/v3/docNameCheck.php", //ide kell majd írni az aktuális php-t
            data: json,
            contentType: false,
            cache: false,
            processData: false,
            mimeType: 'multipart/form-data',
            success: function (result) {
                $('#docNameCheck').html(result);
            },

        }).fail((jqXHR, error) => {
            $('#docNameCheck').html(new Error(error), "  ", new Error(jqXHR));
        });
    }
})();