<?php

$selected = empty($_POST['selected']) ? null : $_POST['selected'];
if($selected !== null) {
        $collage = file_get_contents("collage/"."$selected");
        header('Content-type: application/json');
        echo json_encode($collage);
        exit;
}

$data = empty($_POST['data']) ? null : $_POST['data'];
$name = empty($_POST['name']) ? null : $_POST['name'];
$type = empty($_POST['type']) ? null : $_POST['type'];


if($data !== null) {
   $saved = null;
   $file = "collage"."/"."$name".$type;



    //$data = explode(',', $data);
    //$data = str_replace(' ','+',$data);  
   // $decodedData = base64_decode($data);

    $saved = file_put_contents($file, $data);

    if(isset($saved)){   
        $output = "<div class='alert alert-success'><strong>Collaget är sparat som en arbetsfil.</strong></div>";
        header('Content-type: application/json');
        echo json_encode($output);
        exit;
    } else {
        $output = "<div class='alert alert-danger'><strong>Ett fel uppstod. Collaget kunde inte sparas som en arbetsfil.</strong></div>";
        header('Content-type: application/json');
        echo json_encode($output);
        exit;

    }
    
    $output = "<div class='alert alert-danger'><strong>Uppladdningen misslyckades.</strong></div>";
    header('Content-type: application/json');
    echo json_encode($output);
    exit;   
}
