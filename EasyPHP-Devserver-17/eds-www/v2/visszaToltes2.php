<?php 
header('Access-Control-Allow-Origin: *');
require_once('connect.php'); //csatlakozás meghívása

$json = file_get_contents('php://input');
$data = json_decode($json);

$docID = $data->DocID;
$vID = $data->FSID;

if (isset($docID)) {
    $posts = array();
    $query = "SELECT * FROM citations WHERE docID = '$docID'";
    $result = mysqli_query($connect, $query);

    if (mysqli_num_rows($result) > 0) {
        
        while ($row = mysqli_fetch_assoc($result)) {
            $text = $row['Text'];
            $ccID = $row['CCId']; 

            $posts[]= array('text'=>$text, 'ccID'=>$ccID);
        }
        print(json_encode($posts));
    }
}
?>