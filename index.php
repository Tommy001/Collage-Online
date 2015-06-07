<?php
include "header.html";
$content = isset($content) ? $content : null;
$collage = isset($_POST['collage']) ? $_POST['collage'] : 'no_selection';
$collageimg = isset($_POST['collageimg']) ? $_POST['collageimg'] : '';
?>
<div style='display:none' id='postdata'><?=$collage?></div>
<div style='display:none' id='collageimg'><?=$collageimg?></div>

<div class="container">
    <div class="row">
        <div class="col-md-8">
        	<div id='wrap'>
    			<div id='output'>
                </div>

        		<div id="drop-target"><h4>Släpp bilderna här.</h4></div>
            		<div id="preview">
                		<canvas id="image1"></canvas>
		                <canvas id="image2"></canvas>
        		        <canvas id="image3"></canvas>
                		<canvas id="image4"></canvas>
		                <canvas id="image5"></canvas>
        		        <canvas id="image6"></canvas>
		                <canvas id="image7"></canvas>
		                <canvas id="image8"></canvas>
		                <canvas id="image9"></canvas>
		                <canvas id="image10"></canvas>
		            </div>
                </div>    
            	<div id='HR'>
                	<canvas id="image_HR_1"></canvas>
	                <canvas id="image_HR_2"></canvas>
	                <canvas id="image_HR_3"></canvas>
	                <canvas id="image_HR_4"></canvas>
	                <canvas id="image_HR_5"></canvas>
	                <canvas id="image_HR_6"></canvas>
	                <canvas id="image_HR_7"></canvas>
	                <canvas id="image_HR_8"></canvas>
	                <canvas id="image_HR_9"></canvas>
	                <canvas id="image_HR_10"></canvas>
	            </div>
		        <div style="display:none;">
        		    <img id="frame1" src="http://www.student.bth.se/~toja14/javascript/img/frames/wooden_frame1.png" alt='frame1'>
		            <img id="frame2" src="http://www.student.bth.se/~toja14/javascript/img/frames/picture_frame_page_BW_T.png" alt='frame2'>
    		        <img id="frame3" src="http://www.student.bth.se/~toja14/javascript/img/frames/wooden_frame2.png" alt='frame3'>
            		<img id="frame4" src="http://www.student.bth.se/~toja14/javascript/img/frames/guldram.png" alt='frame4'>
		            <img id="frame5" src="http://www.student.bth.se/~toja14/javascript/img/frames/gold-scrollwork-rectangle.png" alt='frame5'>            
        		</div>
		        <div id='board_b'>
                </div>
        		<div id='board'>
			        <canvas id="canvas_image1" style='z-index:1' width=600 height=700></canvas>
           			<canvas id="canvas_image2"  style='z-index:2' width=600 height=700></canvas>
			        <canvas id="canvas_image3"  style='z-index:3' width=600 height=700></canvas>
			        <canvas id="canvas_image4"  style='z-index:4' width=600 height=700></canvas>
			        <canvas id="canvas_image5"  style='z-index:5' width=600 height=700></canvas>
			        <canvas id="canvas_image6"  style='z-index:6' width=600 height=700></canvas>
			        <canvas id="canvas_image7"  style='z-index:7' width=600 height=700></canvas>
			        <canvas id="canvas_image8"  style='z-index:8' width=600 height=700></canvas>
			        <canvas id="canvas_image9"  style='z-index:9' width=600 height=700></canvas>
			        <canvas id="canvas_image10"  style='z-index:10' width=600 height=700></canvas>
		        </div>   
        		<div id='layerbox'>        
            		<div id='layermode'>
                		<fieldset class="form-group">
                		<legend>Lagerhantering</legend>
                		<form id='layermodes'>
                    		<p><input name='layeroption' type='radio' value='all_layers'> Dölj lagermeny</p>
                    		<p><input name='layeroption' type='radio' value='one_layer' checked='checked'> Visa lagermeny</p>
                		</form>  
                		</fieldset>
            		</div>    
            		<div id='layer_options' class='hidden'>
                		<div id='dropdown'>
                    		<select id='layers'>
                        		<option value="canvas_image1">Lager 1</option>
	                        	<option value="canvas_image2">Lager 2</option>
	    	                    <option value="canvas_image3">Lager 3</option>
	        	                <option value="canvas_image4">Lager 4</option>
	            	            <option value="canvas_image5">Lager 5</option>
	                	        <option value="canvas_image6">Lager 6</option>
	                    	    <option value="canvas_image7">Lager 7</option>
		                        <option value="canvas_image8">Lager 8</option>
	    	                    <option value="canvas_image9">Lager 9</option>
	        	                <option value="canvas_image10">Lager 10</option>
	                    </select><br><br> 
    	            </div>
        	        <div id='buttons'>
            	        <form id='knappar'>
                	        <input class="btn btn-primary" id='moveup' type='button' value='Upp'><br>
                    	    <input class="btn btn-primary" id='movedown' type='button' value='Ned'><br>
                        	<p><input id='anchors_on' name='ankare' type='radio' value='Markera'> Visa hörn<br>
                            <input id='anchors_off' name='ankare' type='radio' checked='checked' value='Avmarkera'> Dölj hörn</p>
                    	</form>    
                	</div> 
                	<div id='ramar'>
                		<label for="frames">Ramar</label><br>
                    	<select id='frames'>       
                        	<option value="noframe">Ingen ram</option>
	                        <option value="frame1">Tjock träram</option>
	                        <option value="frame2">Grå ram</option>
	                        <option value="frame3">Smal träram</option>
	                        <option value="frame4">Guldram</option>
	                        <option value="frame5">Gräslig ram</option>
	                    </select><br><br>
    	            </div>

        	    </div> <!-- layer_options tar slut här -->    
	        </div>    <!-- layerbox tar slut här -->
    	    <div id='more_buttons'>
        	    <form id='savedelete'>
                
                	<div class="input-group">
                    	<input id='savename' type="text" class="form-control" placeholder="Spara som bild">
                    	<span class="input-group-btn">
	                    <button id='save' class="btn btn-primary" type="button">Spara</button>
    	                </span>
        	        </div><!-- /input-group -->
                
            	    <div class="input-group">
                	    <input id='filename' type="text" class="form-control" placeholder="Spara som arbetsfil">
                    	<span class="input-group-btn">
	                    <button id='save_current' class="btn btn-primary" type="button">Spara</button>
    	                </span>
        	        </div><!-- /input-group -->
  
                	<input class="btn btn-primary" id='delete_all' type='button' value='Starta ett nytt collage'>                   
            	</form>    
        	</div>  
        	<div>
            	<canvas width=600 height=700 style='display:none; z-index:-1;'  id="save_canvas"></canvas>
        	</div>
        	<div id='download'></div>
        	<div id='filecontrol'>
        		<?php
	            $html = "<form method='post' action='#' id='files'>";
	            $html .= "<select name='collage' class='form-control' id='selectfile'>";
	            $html .= "<option value='nofile'>Öppna en arbetsfil</option>";
	            $files = scandir('collage', 1);
	            $files = array_diff($files, array('.', '..'));
	            foreach($files as $key => $val){
	                $html .= "<option value="."\"$val\"".">"."$val"."</option>";
	            }
	            $html .= "</select></form>";
	            echo $html;
	        	?>
        	</div>    
    	    <div id='collagecontrol'>
        		<?php
	            $html = "<form method='post' action='#' id='collagefiles'>";
	            $html .= "<select name='collageimg' class='form-control' id='selectcollage'>";
	            $html .= "<option value='nofile'>Ladda hem ett collage</option>";
	            $files = scandir('collage_img', 1);
	            $files = array_diff($files, array('.', '..'));
	            foreach($files as $key => $val){
	                $html .= "<option value="."\"$val\"".">"."$val"."</option>";
	            }
	            $html .= "</select></form>";
	            echo $html;
		        ?>
    	    </div>
   
        	<div id='manual' class='manual'><?=$content?></div>
        </div>
    </div>
</div>
<?php include "footer.html"; ?>
