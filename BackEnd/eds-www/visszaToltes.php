<?php 
header('Access-Control-Allow-Origin: *');
require_once('connect.php'); //csatlakozás meghívása

$json = file_get_contents('php://input');
$data = json_decode($json);

$docId = $data->DocId;

if (isset($docId)) {
    
    $posts = array();

    $query="SELECT Szoveg, CCTag FROM mentetthibak WHERE dokID = $docId";
    $result = mysqli_query($connect, $query);
    
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $szoveg = $row['Szoveg'];
            $ccId = $row['CCTag'];

            $posts[] =array('text'=> $szoveg, 'ccId'=> $ccId);
        }
        

        print(json_encode($posts));
        
    }
    
}

?>