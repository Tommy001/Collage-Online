<?php
error_reporting(-1);
require_once "UploadController.php";
$upload = new UploadController();


$encodedData = empty($_POST['imageData']) ? null : $_POST['imageData'];
$imageName = empty($_POST['imageName']) ? null : $_POST['imageName'];
$imageType = empty($_POST['imageType']) ? null : $_POST['imageType'];



if($encodedData !== null) {
    $saved = null;
    $file = "tmp"."/"."$imageName";
    $encodedData = explode(',', $encodedData);
    $encodedData = str_replace(' ','+',$encodedData[1]);  
    $decodedData = base64_decode($encodedData);

    $saved = file_put_contents($file, $decodedData);
 
    if(isset($saved)){
        $upload->entryAction($file, $imageType, $imageName);    
        $output = "<div class='output alert alert-success'><strong>Collaget är är sparat som en bildfil i PNG-format.</strong></div>";
        header('Content-type: application/json');
        echo json_encode($output);
        exit;
    }

}

