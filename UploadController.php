<?php

/**
 * Class for checking and processing uploaded gif, png and jpg images
 *
 */
class UploadController {
    
    public $new_height;
    public $new_width;
    protected $srcimg;
    protected $destimg;
    protected $upload;    
    protected $imgpath;
    protected $ext;
    protected $filename;
    protected $_destination;

    /**
     * Constructor
     *
     */
    public function __construct($destination=null) {
        $this->imgpath = $destination;
    }

    /**
     * Move file
     *
     * @param string $name
     * @return boolean
     */

    public function movefile($file) {
        if(!file_exists($file)){
            return FALSE;
        }

        return copy($file, $this->imgpath);
    }
   
    public function checkMimeType($imageType){

        if (false === $this->ext = array_search(
            $imageType,
            array(
                'jpg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                ),true)){
            
                return false;
                } else {
                return true;
            }
    }
   
    public function debug(){
        $output = "<div class='alert alert-danger'><strong>Vi kom i alla fall hit :-).</strong></div>";
        header('Content-type: application/json');
        echo json_encode($output);
        exit;
    }
  
    public function entryAction($file, $imageType, $imageName) {

        $res = $this->checkUpload($file, $imageType, $imageName);
        if($res === true){    
            $this->imageSize();
            $res = $this->createImageSource();
            if($res === false){
                $this->errorMessage();
            }
            $res = $this->createImage();
            if($res === false){
                $this->errorMessage();
            }
            $res = $this->transparencyAndResample();
            if($res === false){
                $this->errorMessage();
            } 
            $res = $this->outputImage();
            if($res === false){
                $this->errorMessage();
            }            
        } else {
           $this->errorMessage();                    
        }
    }
   
    public function errorMessage(){
        $output = "<div class='alert alert-danger'><strong>Ett fel uppstod. Enbart JPG-, GIF- och PNG-bilder är tillåtna.</strong></div>";
        header('Content-type: application/json');
        echo json_encode($output);
        exit;
    }

    
    public function checkUpload($file, $imageType, $imageName){

            if(mb_strlen($file,"UTF-8") > 80) {
                $output = "<div class='alert alert-danger'><strong>Filnamnet är för långt.</strong></div>";
                header('Content-type: application/json');
                echo json_encode($output);
                exit;
            }
            
            if(!$this->checkMimeType($imageType)){
                $output = "<div class='alert alert-danger'><strong>Fel filtyp. Enbart JPG-, GIF- och PNG-bilder är tillåtna.</strong></div>";
                header('Content-type: application/json');
                echo json_encode($output);
                exit;
        }


            $filesize = filesize($file);
            if($filesize > 2000000) {
                $output = "<div class='alert alert-danger'><strong>Filen är för stor. Max tillåten storlek är 2MB.</strong></div>";
                header('Content-type: application/json');
                echo json_encode($output);
                exit;
        }        

            $this->imgpath = sprintf('collage_img/%s.%s',
            $this->sanitizeFilename($imageName), $this->ext);

            if(!$this->movefile($file)){
                $output = "<div class='alert alert-danger'><strong>Kunde inte flytta filen.</strong></div>";
                header('Content-type: application/json');
                echo json_encode($output);
                exit;
        }         
            
            return true; // passed all checks
    }

    public function imageSize() {
 
        $size = 3500; // the default image height
        chmod ($this->imgpath, octdec('0666')); // read-write
        $sizes = getimagesize($this->imgpath);
        $aspect_ratio = $sizes[1]/$sizes[0]; 
        if ($sizes[1] <= $size) {
            $this->new_width = $sizes[0];
            $this->new_height = $sizes[1];
        } else {
            $this->new_height = $size; 
            $this->new_width = round($this->new_height/$aspect_ratio); 
        }
    }
        
    public function createImageSource(){    
        /* create an image source with specified dimensions */
        $this->destimg=imagecreatetruecolor($this->new_width,$this->new_height);
        if(!$this->destimg){
            return false;
        }
        return true;
    }

    public function createImage(){

        switch ($this->ext) {
            case 'gif':
                $this->srcimg = imagecreatefromgif($this->imgpath);
                if(!$this->srcimg){
                    return false;
                }
                return true;
            case 'jpg':
                $this->srcimg = imagecreatefromjpeg($this->imgpath);
                if(!$this->srcimg){
                    return false; 
                }
                return true;
            case 'png':
                $this->srcimg = imagecreatefrompng($this->imgpath);
                if(!$this->srcimg){
                    return false;
                }
                return true;
            default:
                $this->srcimg = null;
                return false;
        }
    }
    
    public function transparencyAndResample(){
        
        if($this->ext == 'png' || $this->ext == 'gif'){
            imagecolortransparent($this->destimg, imagecolorallocatealpha($this->destimg, 0, 0, 0, 0)); // numbers are red, green, blue and last alpha
            imagealphablending($this->destimg, false);
            imagesavealpha($this->destimg, true); //true makes surre that all alpha channel-info is kept
        }
        /* copy frame from $srcimg to the image in $destimg and resample image to reduce data size  */	
        $res = imagecopyresampled($this->destimg,$this->srcimg,0,0,0,0,$this->new_width,$this->new_height,imagesx($this->srcimg),imagesy($this->srcimg));
         if(!$res){
             return false;
         } 
         return true;
    }

    public function outputImage(){

        switch ($this->ext) {
        case 'gif':
            $res = imagegif($this->destimg,$this->imgpath);
            if(!$res){
                return false;
            }     
            return true;
        case 'jpg':
            $res = imagejpeg($this->destimg,$this->imgpath); 
            if(!$res){
                return false;
            }
            return true;
        case 'png':
            $res = imagepng($this->destimg,$this->imgpath);                
            if(!$res){
                return false;
            } 
            return true;    
        }
    }
    
    public function sanitizeFilename($imageName){

        /* in this pattern you can add special characters used in you language and their replacements, otherwise they will just be stripped from the filename */ 
        $filename = preg_replace(array('/å/', '/ä/', '/ö/', '/Å/', '/Ä/', '/Ö/', '/[^a-zA-Z0-9\/_|+ .-]/', '/[ -]+/', '/^-|-$/'),
        array('a', 'a', 'o', 'a', 'a', 'o', '', '_', ''), mb_strtolower($imageName, 'UTF-8'));
        return $filename;
    }
}
        
