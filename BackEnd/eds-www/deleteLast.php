<?php
header('Access-Control-Allow-Origin: *');
require_once('connect.php'); //csatlakozás meghívása

$json = file_get_contents('php://input');
$data = json_decode($json);

if ($data->DeleteLast == 1){
    //törölni kivánt hibához tartozó dokumentum névhez tartozó ID lekérdezése
    $dokNev = $data->DokNev;
    $dIDq = "SELECT * FROM doknevek WHERE Nev = '$dokNev'";
    $result = mysqli_query($connect, $dIDq);
    $row=mysqli_fetch_assoc($result);
    $dokID= $row['ID'];

    //dokumentumban utoljára velvett hiba törlése
    $query = "DELETE FROM mentetthibak WHERE dokID='$dokID' order by ID desc limit 1";
    if(mysqli_query($connect, $query)) print("utolsó elem törölve");
    else print("hiba ". mysqli_error($connect));
}


mysqli_close($connect);
?>