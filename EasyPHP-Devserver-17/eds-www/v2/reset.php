<?php
header('Access-Control-Allow-Origin: *');
require_once('connect.php');

//adatok változóba másolása
$json = file_get_contents('php://input');
$data = json_decode($json);

$docName = $data->DocName;

if (isset($docName)) {
    
    $posts = array();

    $query="SELECT * FROM docnames WHERE DocName = '$docName'";
    $result = mysqli_query($connect, $query);
    $row = mysqli_fetch_assoc($result);
    $docID = (int)$row['ID'];

    $query="SELECT Text, CCId FROM citations WHERE DocID = $docID";
    $result = mysqli_query($connect, $query);
    
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $text = $row['Text'];
            $ccId = $row['CCId'];

            $posts[] = array('text'=> $text, 'ccId'=> $ccId);
        }
        
        print(json_encode($posts));
        
    }
    
}

mysqli_close($connect);
?>