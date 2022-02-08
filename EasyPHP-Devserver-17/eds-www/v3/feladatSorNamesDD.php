<?php
header('Access-Control-Allow-Origin: *');
require_once('connect.php'); //csatlakozás meghívása

//adatok változóba másolása
$json = file_get_contents('php://input');
$data = json_decode($json);

$docID = $data->DocID;
$submit = $data->submit;

if ($submit) {
    $query = "SELECT ID, vName FROM docverzions WHERE DocID = '$docID'";
    $result =mysqli_query($connect, $query);
    
    if (mysqli_num_rows($result) > 0) {
        print('<select id="feladatSorDD" class="docNamesDDL" name="docNamesDD">');
        while ($row = mysqli_fetch_assoc($result)) {
            print('<option value="');
            print($row["ID"]);
            print('">');
            print($row["vName"]);
            print('</option>');
        }
        print('</select>');
    }
    else {
        print("ehhez a documentumhoz nincsenek feladat sor verziók");
    }
}
mysqli_close($connect);
?>