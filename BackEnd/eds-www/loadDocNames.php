<?php
header('Access-Control-Allow-Origin: *');
require_once('connect.php'); //csatlakozás meghívása

//adatok változóba másolása
$json = file_get_contents('php://input');
$data = json_decode($json);

$submit = $data->submit;

if ($submit) {
    $query = "SELECT ID, Nev FROM doknevek";
    $result = mysqli_query($connect, $query);
    if (mysqli_num_rows($result) > 0) {
        print('<select id="dokNevLGS" class="dokNevLG" name="dokNevLGS">');
        while ($row = mysqli_fetch_assoc($result)) {
            print('<option value="');
            print($row["ID"]);
            print('">');
            print($row["Nev"]);
            print('</option>');
        }
        print('</select>');
    }
}

?>