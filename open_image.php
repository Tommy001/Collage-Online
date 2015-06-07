<?php

if(!empty($_GET['img'])) {
    $filename = $_GET['img'];
    $file = "collage_img/".$filename;
    $size = getimagesize($file);  
    if ($size) {
        header("Content-Description:File Transfer");
        header("Content-Type:{$size['mime']}");
        header("Content-Length: " . filesize($file));         
        header('Content-Disposition:attachment;filename="'.$filename.'"');
        header("Content-Transfer-Encoding:binary");
        header("Expires:0");
        header("Cache-Control:must-revalidate,post-check=0,pre-check=0");
        header("Cache-Control:private",false);
        header("Pragma:public");
        readfile($file); 
        exit; 
    }
}
        $output = "<div class='alert alert-danger'><strong>Så pinsamt, något gick fel.</strong></div>";
        header('Content-type: application/json');
        echo json_encode($output);
        exit;
