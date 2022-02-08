
(function () {
    "use strict";

    // The initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(function () {
            Office.onReady();

            dropDownListDN();

            // Add a click event handler for the highlight button.
            $('#betoltes').click(betoltes);
            $('#docNames').change(dropDownListFS); //a click nem lesz jó
        });
    };

    function dropDownListDN() {
        //dokumentum nevek legördülő listája
        $('#docNames').html(' ');
        var data = '{"docNames": true}';

        $.ajax({
            type: "POST",
            url: "http://localhost:8080/edsa-gited/v3/docNamesDD.php", //ide kell majd írni az aktuális php-t
            data: data,
            contentType: false,
            cache: false,
            processData: false,
            mimeType: 'multipart/form-data',
            success: function (result) {
                $('#docNames').html(result);
            },

        }).fail((jqXHR, error) => {
            $('#docNames').html(new Error(error), "  ", new Error(jqXHR));
        });

    }
    function dropDownListFS() {
        //feladat sor legördülő listája
        var docID = document.getElementById("docNamesDD").value;
        var data = new Object();
        data.DocID = docID;
        data.submit = true;
        var json = JSON.stringify(data);

        $.ajax({
            type: "POST",
            url: "http://localhost:8080/edsa-gited/v3/feladatSorNamesDD.php", //ide kell majd írni az aktuális php-t
            data: json,
            contentType: false,
            cache: false,
            processData: false,
            mimeType: 'multipart/form-data',
            success: function (result) {
                $('#feladatSorNames').html(result);
            },

        }).fail((jqXHR, error) => {
            $('#feladatSorNames').html(new Error(error), "  ", new Error(jqXHR));
        });

    }

    function betoltes() {
        //kiválasztott adatok JSON formázása
        var docID = document.getElementById("docNamesDD").value;
        var fsID = document.getElementById("feladatSorDD").value;
        var data = new Object();
        data.DocID = docID;
        data.FSID = fsID;
        var json = JSON.stringify(data);

        //request küldése
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/edsa-gited/v3/visszaToltes2.php", //ide kell majd írni az aktuális php-t
            data: json,
            contentType: false,
            cache: false,
            processData: false,
            mimeType: 'multipart/form-data',
            success: function (result) {
                const obj = JSON.parse(result);
                findErrors(obj);
                showOrigin();
            },

        }).fail((jqXHR, error) => {
            $('#javitasDone').html(new Error(error), "  ", new Error(jqXHR));
        });
        //hibás CC kijelőlése helyes szöveg mögéírása
        async function findErrors(obj) {
            await Word.run(async (context) => {
                let ccs = context.document.contentControls;
                ccs.load();
                
                await context.sync();

                for (var i = 0; i < obj.length; i++) {
                    var ccID = obj[i].ccID;
                    var text = obj[i].text;
                    var wordCC = ccs.getByIdOrNullObject(parseInt(ccID));
                    wordCC.load();
                    
                    await context.sync();
                    var wText = wordCC.text;
                    
                    if (wText != text) { //szöveg összehasonlítása
                        wordCC.font.highlightColor = 'red';
                        wordCC.appearance = "BoundingBox"; //szín és megjelenés váltás

                        await context.sync();

                        let range = wordCC.getRange();
                        let correctR = range.getRange('After');
                        let correctCC = correctR.insertContentControl();//új cc beszúrása

                        await context.sync();

                        correctCC.font.highlightColor = "yellow";

                        correctCC.load();
                        correctCC.insertText(obj[i].text, 'Replace');//helyes szöveg beszúrása
                    }
                }

            });
        }
        function showOrigin() {
            //kiválasztott adatok JSON formázása
            var docID = document.getElementById("docNamesDD").value;
            var fsID = document.getElementById("feladatSorDD").value;
            var data = new Object();
            data.DocID = docID;
            data.FSID = fsID;
            var json = JSON.stringify(data);
            //request küldése
            $.ajax({
                type: "POST",
                url: "http://localhost:8080/edsa-gited/v3/showOrigin.php", //ide kell majd írni az aktuális php-t
                data: json,
                contentType: false,
                cache: false,
                processData: false,
                mimeType: 'multipart/form-data',
                success: function (result) {
                    findOrigin(result);
                },

            }).fail((jqXHR, error) => {
                $('#javitasDone').html(new Error(error), "  ", new Error(jqXHR));
            });
            //eredeti feladatok megjelőlése
            async function findOrigin(json) {
                await Word.run(async (context) => {
                    let ccs = context.document.contentControls;
                    ccs.load();
                    const obj = JSON.parse(json);
                    await context.sync();

                    for (var i = 0; i < obj.length; i++) {
                        var ccID = obj[i].ccID;
                        var wordCC = ccs.getByIdOrNullObject(parseInt(ccID));

                        await context.sync();
                        
                        wordCC.font.highlightColor = "green";
                    }

                });
            }
        }
    } 

})();
