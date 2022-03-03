<?php
header('Access-Control-Allow-Origin: *');
require_once('connect.php'); //csatlakozás meghívása

$json = file_get_contents('php://input');
$data = json_decode($json);

$request = $data->Request;
$doknev = $data->DokNev;

if ($request = true) {
    $query = "SELECT ID FROM doknevek WHERE Nev = '$doknev'";
    $result = mysqli_query($connect, $query);
    $row = mysqli_fetch_assoc($result);
    $id = $row['ID'];
    $query = "SELECT * FROM mentetthibak WHERE dokID = '$id'";
    $result = mysqli_query($connect, $query);
    $row_count = mysqli_num_rows($result);

    print $row_count;
}

?>