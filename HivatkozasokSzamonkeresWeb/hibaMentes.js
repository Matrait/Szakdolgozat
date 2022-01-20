(function () {
    "use strict";
    var jsonData = new Object();//ebben tároljuk az adatokat küldées elött
    jsonData.DocName = new Array();
    jsonData.FeladatSorName = new Array();
    jsonData.CCid = new Array();

    var counter = 0;
    

    // The initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(function () {
            dropDownList();

            // Add a click event handler for the highlight button.
            $('#chose_C').click(choseOnClient);
            $('#deletelast_Chose').click(deleteLast_chose);
            $('#chose_S').click(sender_chose);
            $('#reset').click(resetSend);

        });
    };
    function dropDownList() {
        //ez müködik
        $('#ddlist').html(' ');
        var data = '{"ddList": true}';

        $.ajax({
            type: "POST",
            url: "http://localhost:8080/v2/loadDDList.php", //ide kell majd írni az aktuális php-t
            data: data,
            contentType: false,
            cache: false,
            processData: false,
            mimeType: 'multipart/form-data',
            success: function (result) {
                $('#ddlist').html(result);
            },

        }).fail((jqXHR, error) => {
            $('#ddlist').html(new Error(error), "  ", new Error(jqXHR));
        });
    }
    function choseOnClient() {
        
        var ccId;
        var docName = document.getElementById("docNamesDDL").value;
        var feladatSorName = document.getElementById("feladatSorName").value;
        
        newErr();

        async function newErr() {
            
            await Word.run(async (context) => {
                let range = context.document.getSelection();
                range.load();

                await context.sync();

                let wordCC = range.parentContentControlOrNullObject;
                wordCC.load();

                await context.sync();

                wordCC.font.highlightColor = 'yellow';
                ccId = wordCC.id;

                jsonData.DocName[counter] = docName;
                jsonData.FeladatSorName[counter] = feladatSorName;
                jsonData.CCid[counter] = ccId;

                $('#tarolt').html(jsonData.CCid.length);
                counter++;
            });
        }
        
    }

    function deleteLast_chose() {
        let popped = jsonData.DocName.pop();
        popped = jsonData.FeladatSorName.pop();
        let poppedID = jsonData.CCid.pop();
        counter = counter - 1;
        deleteLast()

        async function deleteLast() {
            await Word.run(async (context) => {
                let ccs = context.document.contentControls;
                ccs.load();

                await context.sync();

                var wordCC = ccs.getByIdOrNullObject(poppedID);

                wordCC.font.highlightColor = 'gray';
            });
        }
    }

    function sender_chose() {
        //ez nem jó
        var json = JSON.stringify(jsonData);
        counter = 0;

        $('#choseDone').html(' ');
        hideCCs();

        async function hideCCs() {
            await Word.run(async (context) => {
                let ccs = context.document.contentControls;
                ccs.load();
                
                await context.sync();

                var amount = ccs.items.length;
                
                for (var i = 0; i < amount; i++) {
                    var ccID = ccs.items[i].id;

                    var wordCC = ccs.getByIdOrNullObject(ccID);

                    await context.sync();

                    wordCC.font.highlightColor = null;
                    wordCC.appearance = 'Hidden';
                }

            });
        }

        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8080/v2/hibamentes.php", //ide kell majd írni az aktuális php-t
            data: json,
            contentType: false,
            cache: false,
            processData: false,
            mimeType:'multipart/form-data',
            success: function () {
                $('#choseDone').html('Adat rögzítve');
            },
            
        }).fail((jqXHR, error) => {
            $('#choseDone').html(new Error(error), "  ", new Error(jqXHR));
        });

    }
    function resetSend() {
        var docName = document.getElementById("docNamesDDL").value;
        var data = new Object();
        data.DocName = docName;
        var json = JSON.stringify(data);

        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8080/v2/reset.php", //ide kell majd írni az aktuális php-t
            data: json,
            contentType: false,
            cache: false,
            processData: false,
            mimeType: 'multipart/form-data',
            success: function (result) {
                const json = result;

                const obj = JSON.parse(json);

                reset(obj);
            },

        }).fail((jqXHR, error) => {
            $('#resetDone').html(new Error(error), "  ", new Error(jqXHR));
        });

    }
    function reset(obj) {
        var CCcount = obj.length;
        resetCC();
        async function resetCC() {
            await Word.run(async (context) => {
                let ccs = context.document.contentControls;
                ccs.load();
                await context.sync();

                for (var i = 0; i < CCcount; i++) {
                    var ccID = obj[i].ccId;
                    var wordCC = ccs.getByIdOrNullObject(parseInt(ccID));

                    wordCC.font.highlightColor = 'gray';
                    wordCC.appearance = 'BoundingBox';

                    await context.sync();

                    wordCC.insertText(obj[i].text, 'Replace');
                }
            })
        }
    }
})();