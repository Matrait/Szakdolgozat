<?php
header('Access-Control-Allow-Origin: *');
require_once('connect.php'); //csatlakozás meghívása

//adatok változóba másolása
$json = file_get_contents('php://input');
$data = json_decode($json);

$dokNev = $data->DocName;
$szoveg = $data->Text;
$CCTag = $data->CCtag;

//dokumentum nevének ellenörzése
$query = "SELECT * FROM doknevek WHERE Nev = '$dokNev'";
$result = mysqli_query($connect, $query);
$row_cnt = mysqli_num_rows($result);
if ($row_cnt == 1){
    //Ha már létezik a név hozzátartozó ID- változóba másoljuk
    $row=mysqli_fetch_assoc($result);
    $dokID= $row['ID'];
    //print("már van");
}
else{
    //Ha még nem létezett akkor hozzáadjuk és lekérdezzük a hozzátartozó ID-t
    $dnQuery ="INSERT INTO doknevek (Nev) values('$dokNev')";
    mysqli_query($connect, $dnQuery);

    $dIDq = "SELECT * FROM doknevek WHERE Nev = '$dokNev'";
    $result = mysqli_query($connect, $dIDq);
    $row=mysqli_fetch_assoc($result);
    $dokID= $row['ID'];
    //print("most már van");
}

//Hiba mentése az adatbáziba
$hibaQuery = "INSERT INTO mentetthibak (dokID, Szoveg, CCTag) values('$dokID', '$szoveg', '$CCTag')";
print($hibaQuery);
if(mysqli_query($connect, $hibaQuery)) print('új elem hozzáadva');
else die('Hiba ' . mysqli_error($connect));



mysqli_close($connect);
?>