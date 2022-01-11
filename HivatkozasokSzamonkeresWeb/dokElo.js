(function () {
    "use strict";
    var jsonData = new Object();//ebben tároljuk az adatokat küldées elött
    jsonData.DocName = new Array();
    jsonData.Text = new Array();
    jsonData.CCid = new Array();

    var counter = 0;
    

    // The initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(function () {
            // Add a click event handler for the highlight button.
            $('#save_C').click(saveOnClient);
            $('#deletelast').click(deleteLast);
            $('#save_S').click(sender);
        });
    };

    function saveOnClient() {
        
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
                text = range.text;

                await context.sync();

                let ccs = context.document.contentControls;
                ccs.load();

                await context.sync();

                var amount = ccs.items.length;
                ccId = ccs.items[amount - 1].id;
                               
                jsonData.DocName[counter] = docName;
                jsonData.Text[counter] = text;
                jsonData.CCid[counter] = ccId;
                $('#tarolt').html(jsonData.CCid.length);
                counter++;
            });
        }
        
    }

    function deleteLast() {
        let popped = jsonData.DocName.pop();
        popped = jsonData.Text.pop();
        popped = jsonData.CCid.pop();
        $('#tarolt').html(jsonData.CCid.length);
        deleteLast()

        async function deleteLast() {
            await Word.run(async (context) => {
                let ccs = context.document.contentControls;
                ccs.load();

                await context.sync();

                var amount = ccs.items.length;
                var ccID = ccs.items[amount - 1].id;
                var wordCC = ccs.getByIdOrNullObject(ccID);

                wordCC.font.highlightColor = null;

                await context.sync();

                wordCC.delete(true);
            });
        }
    }

    function sender() {
        
        var json = JSON.stringify(jsonData);
        counter = 0;

        $('#siker').html(' ');

        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8080/ujfeladat.php", //ide kell majd írni az aktuális php-t
            data: json,
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
})();