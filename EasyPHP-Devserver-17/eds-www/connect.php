<?php
//csatlakozik az adatbázisokhoz
    $connect = mysqli_connect("localhost","root",""); //itt kell váltani az elérést
    if (!$connect)
        die("Nem lehet csatlakozni a MySQL szerverhez!" . mysqli_error());
    

    if (!mysqli_select_db($connect, 'hszkdb_v2.0')) // itt kell váltani az adatbázis nevét
        print('nem sikerültcsatlakozni az adatbázishoz'. mysqli_error());


?>