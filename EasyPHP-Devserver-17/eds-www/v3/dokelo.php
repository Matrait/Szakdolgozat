<?php header('Access-Control-Allow-Origin: *');
require_once('connect.php'); //csatlakozás meghívása

//adatok változóba másolása
$json = file_get_contents('php://input');
$data = json_decode($json);

$docName[] = $data->DocName;
$text[] = $data->Text;
$ccId[] = $data->CCid;
$counter = 0;
$lenght = count($docName[0]);

$query2 = "INSERT INTO citations (DocID, Text, CCId) values";

for ($i=0; $i < $lenght; $i++) { 
    $dumy = $docName[0][$i];
    $query ="SELECT * FROM docnames WHERE DocName = '$dumy'";
    $result = mysqli_query($connect, $query);
    $row_cnt = mysqli_num_rows($result);
    if ($row_cnt == 1) {
        $row=mysqli_fetch_assoc($result);
        $docID= $row['ID'];
    }
    else {
        $query = "INSERT INTO docnames (DocName) values('$dumy')";
        mysqli_query($connect, $query);

        $dIDq = "SELECT * FROM Docnames WHERE DocName = '$dumy'";
        $result = mysqli_query($connect, $dIDq);
        $row=mysqli_fetch_assoc($result);
        $docID= $row['ID'];
    }
    $dumy2 =$text[0][$i];
    $dumy3=$ccId[0][$i];
    $query2 = $query2 . "('$docID', '$dumy2', '$dumy3'),";
}
if(mysqli_query($connect, substr_replace($query2 ,"",-1)));
    else die('Hiba ' . mysqli_error($connect));

print $lenght;
print(' elem hozzáadva');

mysqli_close($connect);
?>