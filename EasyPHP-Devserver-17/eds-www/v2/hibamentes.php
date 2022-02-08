<?php header('Access-Control-Allow-Origin: *');
require_once('connect.php'); //csatlakozás meghívása

//adatok változóba másolása
$json = file_get_contents('php://input');
$data = json_decode($json);

$docName[] = $data->DocName;
$feladatSorName[] = $data->FeladatSorName;
$ccId[] = $data->CCid;
$counter = 0;

$lenght = count($docName[0]);

for ($i=0; $i < $lenght; $i++) { 

    $dumy = $docName[0][$i];
    $query ="SELECT * FROM docnames WHERE DocName = '$dumy'";
    $result = mysqli_query($connect, $query);
    $row_cnt = mysqli_num_rows($result);
    if ($row_cnt == 1) {
        $row = mysqli_fetch_assoc($result);
        $docID = (int)$row['ID'];
        
        $dumy = $feladatSorName[0][$i];
        $query = "SELECT * FROM docverzions WHERE vName = '$dumy' and DocID ='$docID'";
        $result = mysqli_query($connect, $query);
        $row_cnt = mysqli_num_rows($result);

        if ($row_cnt == 0) {
            //var_dump($dumy);
            $query = "INSERT INTO docverzions (DocID, vName) VALUES ('$docID', '$dumy')";
            //print($query);
            mysqli_query($connect, $query);
        }
        $dIDq = "SELECT * FROM docverzions WHERE vName = '$dumy' and DocID ='$docID'";
        $result = mysqli_query($connect, $dIDq);
        $row = mysqli_fetch_assoc($result);
        $verzionID = (int)$row['ID'];
        //var_dump($verzionID);

        $dumy = $ccId[0][$i];
        $query = "SELECT * FROM citations WHERE CCId = '$dumy'";
        //var_dump($query);
        $result = mysqli_query($connect, $query);
        $row = mysqli_fetch_assoc($result);
        $citationID = (int)$row['ID'];
        //var_dump($citationID);

        $query = "INSERT INTO errors (CitationID, DocID, DocVerzionID) values('$citationID', '$docID', '$verzionID')";

        if (mysqli_query($connect, $query)) $counter++;
        else die('Hiba ' . mysqli_error($connect));
    } else {
        print('Rossz documentum név');
    }

}

print($counter);
print(' hiba hozzáadva');

mysqli_close($connect);
?>