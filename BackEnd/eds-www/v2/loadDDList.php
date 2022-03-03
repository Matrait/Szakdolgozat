<?php
header('Access-Control-Allow-Origin: *');
require_once('connect.php'); //csatlakozás meghívása

//adatok változóba másolása
$json = file_get_contents('php://input');
$data = json_decode($json);

$submit = $data->ddList;

if ($submit) {
    $query = "SELECT ID, DocName FROM docnames";
    $result = mysqli_query($connect, $query);
    if (mysqli_num_rows($result) > 0) {
        print('<select id="docNamesDDL" class="docNamesDDL" name="docNamesDDL">');
        while ($row = mysqli_fetch_assoc($result)) {
            print('<option value="');
            print($row["DocName"]);
            print('">');
            print($row["DocName"]);
            print('</option>');
        }
        print('</select>');
    }
}
mysqli_close($connect);
?>