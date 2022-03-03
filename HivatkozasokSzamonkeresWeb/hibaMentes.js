(function () {
    "use strict";
    var jsonData = new Object();//ebben tároljuk az adatokat küldés elött
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
            $('#deletelast_Chose').click(deleteSelected_chose);
            $('#chose_S').click(sender_chose);
            $('#reset').click(resetSend);
            $('#choseDone').html(' ');
        });
    };
    function dropDownList() {
        //ez müködik
        $('#ddlist').html(' ');
        var data = '{"ddList": true}';
        $('#choseDone').html(' ');

        $.ajax({
            type: "POST",
            url: "http://localhost:8080/v3/loadDDList.php", //ide kell majd írni az aktuális php-t
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
        $('#deleteDone').html('');

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

    function deleteSelected_chose() {
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
                        jsonData.FeladatSorName.splice(i, 1);
                        jsonData.CCid.splice(i, 1);

                    }
                }

                wordCC.font.highlightColor = "gray";

                $('#tarolt').html(jsonData.CCid.length);
                counter = counter - 1;
            });
        }
    }

    function sender_chose() {
        
        var json = JSON.stringify(jsonData);
        counter = 0;

        $('#deleteDone').html('');
        $('#choseDone').html(' ');

        jsonData.DocName.length = 0;
        jsonData.FeladatSorName.length = 0;
        jsonData.CCid.length = 0;

        $('#tarolt').html(jsonData.CCid.length);

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
            url: "http://127.0.0.1:8080/v3/hibamentes.php", //ide kell majd írni az aktuális php-t
            data: json,
            contentType: false,
            cache: false,
            processData: false,
            mimeType:'multipart/form-data',
            success: function (result) {
                $('#choseDone').html(result);
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

        $('#deleteDone').html('');
        $('#choseDone').html(' ');

        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8080/v3/reset.php", //ide kell majd írni az aktuális php-t
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

                    wordCC.insertText(decodeURIComponent(obj[i].text), 'Replace');
                }
            })
        }
    }
})();