<?php
header('Access-Control-Allow-Origin: *');
require_once('connect.php');
//work in progress
if (isset($_POST['DokNev'])) {
    $dokNev = $_POST['DokNev'];
    $dnQuery = "SELECT ID FROM doknevek WHERE Nev = '$dokNev'";
    $result = mysqli_query($connect, $dnQuery);
    $row = mysqli_fetch_assoc($result);
    $dokID = $row['ID'];

    $querry = "SELECT * FROM mentetthibak WHERE dokID = '$dokID'";
    $endResult = mysqli_query($connect, $querry);
    $rows[] =  mysqli_fetch_array($endResult);
    print_r($rows);
}
else print("hiba ". mysqli_error($connect));


mysqli_close($connect);
?>