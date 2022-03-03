<?php
header('Access-Control-Allow-Origin: *');
require_once('connect.php'); //csatlakozás meghívása

$json = file_get_contents('php://input');
$data = json_decode($json);

$docID = $data->DocID;
$vID = $data->FSID;

if (isset($docID)) {

    $posts = array();

    $query = "SELECT * FROM errors WHERE DocID = '$docID' and DocVerzionID ='$vID'";
    $result = mysqli_query($connect, $query);
    if (mysqli_num_rows($result)>0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $citationID = $row['CitationID'];
            $query2 = "SELECT * FROM citations WHERE ID ='$citationID'";
            $result2 = mysqli_query($connect, $query2);
            $row2 = mysqli_fetch_assoc($result2);

            $ccID = $row2['CCId'];

            $posts[]= array('ccID' => $ccID);
        }
        print(json_encode($posts));
    }
}

?>