<?php
header('Access-Control-Allow-Origin: *');
require_once('connect.php');

$json = file_get_contents('php://input');
$data = json_decode($json);

$docName = $data->DocName;

$query = "SELECT * FROM docnames WHERE DocName = '$docName'";
$result = mysqli_query($connect, $query);
$row_cnt = mysqli_num_rows($result);

if ($row_cnt != 0) {
    print('Létezik már ilyen dokumentum név');
}

?>