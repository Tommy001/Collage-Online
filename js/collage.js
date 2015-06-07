/**
 * Collage Online Code.
 */


$(document).ready(function(){
    var MAX_WIDTH_HR = 500, MAX_WIDTH_PV = 100, drop=0, name, boards = ['canvas_image1', 'canvas_image2', 'canvas_image3', 'canvas_image4', 'canvas_image5', 'canvas_image6', 'canvas_image7', 'canvas_image8', 'canvas_image9', 'canvas_image10'],  highres = {image1:'image_HR_1', image2: 'image_HR_2', image3 : 'image_HR_3', image4 : 'image_HR_4', image5 : 'image_HR_5', image6 : 'image_HR_6', image7 : 'image_HR_7', image8 : 'image_HR_8', image9 : 'image_HR_9', image10 : 'image_HR_10'}, 
    MyProject={mode:'all_layers', layer:'', layercounter:0}, 
    counter=0, ramar, collage, postdata, collageimg, collageRequest = [];
    
    // parameterfunktion för att kunna hantera varje bildlager/canvas för sig
    // varje bild som klickas in på arbetsytan instantieras med denna funktion
    // och därefter uppdateras värdena när bilderna manipuleras på canvasen
    function collage(){
    this.canvas_board=''; 
    this.canvas=''; 
    this.ctx=''; 
    this.canvasOffset=''; 
    this.offsetX=''; 
    this.offsetY='';
    this.startX=''; 
    this.startY='';
    this.imageX=''; 
    this.imageY='';
    this.mouseX=''; 
    this.mouseY=''; 
    this.imageWidth=''; 
    this.imageHeight='';
    this.imageRight=''; 
    this.imageBottom=''; 
    this.imgframe=''; 
    this.frame='noframe'; 
    this.ankare='false';
    this.img='';
    collage.instances.push(this);
    }
    // i vissa lägen behöver man komma åt varje parameterobjekt med hjälp av 
    // ett numrerat index, därför pushas varje instans till den här arrayen
    // titta vidare på rad 620 
    collage.instances = [];

    // när användaren väljer ett alternativ i listan över PNG-bilder
    // så skapas en dynamisk länk för nedladdning, följt av ett klick
    $('#selectcollage').change(function(event){
        collagefiles.submit();
      
    });   
    
    (function () {    
        collageimg = document.getElementById('collageimg');
        console.log('collageimg ' + collageimg.textContent);
        if(collageimg.textContent !== ''){
            var link = document.createElement("a");
            link.setAttribute('href', "open_image.php?img="+collageimg.textContent);
            link.setAttribute('id', "link");            
            link.setAttribute('style', 'display:none;');            
            var t = document.createTextNode("Klicka här");  // text behövs för
            link.appendChild(t); // att kunna testa med synlig länk
            document.getElementById('download').appendChild(link);
            link.click();
        }
    })();      
         

    // När användaren väljer en arbetsfil i rullistan skickas en ajax-förfrågan
    // med filnamn till serversidan, för att hämta filen
    $('#selectfile').change(function(event){
        files.submit();   

    }); 

                
    (function () {
        postdata = document.getElementById('postdata');
        console.log('postdata ' + postdata.textContent);
        if(postdata.textContent !== 'no_selection'){
                $('#output').empty();
                $('#output').addClass('overlay');
                
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url:'server.php',
                    data:{
                        selected: postdata.textContent
                    },
                    success:function(data){
                        populate(data);
                        console.log('Filen hämtades!');
                    },
    	            error: function(data){
    	                console.log('Ajax request failed miserably.');	                
    	            }   	            
                }); 
        }
    })();
   
    // arbetsfilen hämtas, parameterobjekt populeras med parametrar och 
    // bilderna renderas om storleken överstiger 4000 bitar,
    // enbart canvasen består av 1594 bitar, så vi har lite marginal
    // det är just detta som inte fungerar i FireFox, men bara när ett arbete
    // sparas och hämtas första gången, så det bör ha att göra med cacheminnet??
    function populate(data){
        var jsondata = {}, pop, ii=1;
        jsondata = JSON.parse(data);
;
        for(i=0;i<10;i++){
            MyProject.layercounter += 1;
            pop = jsondata.layers[i];
            id = 'image'+ii++;
            index = boards[i];  
            console.log('pop' + pop.length);
            if(pop.length > 5000){
                renderPreview(pop);
                renderHighres(pop);
                dragAndResize(id, pop, jsondata.layers[index]);
            }
        }
        $('#output').removeClass('overlay');
   }
   
   // användaren klickar in bilder på arbetsytan
    $('#preview').on("click", function(event){	
        counter+=30; // bildernas startpos förskjuts på canvas
        MyProject.layercounter += 1;
        var collagedata = {};
        var id=event.target.id;
        var sourceCanvas = document.getElementById(highres[id]);
        var imageURL = sourceCanvas.toDataURL();
        dragAndResize(id, imageURL, collagedata);
     
        
      });


    // parameterobjekten fylls, bilder renderas, koden i denna funktion är 
    // "inspirerad" av ett svar på Stack Overflow, dock ordentligt omarbetad
    // http://stackoverflow.com/questions/19100009/dragging-and-resizing-an-image-on-html5-canvas
    function dragAndResize(id, imageURL, collagedata){
    var isDown=false, layer, rr=64, draggingResizer={x:0,y:0}, draggingImage=false, index;
    
    if(collagedata == undefined){
        return;
    }
        key = "canvas_"+id;
        $("#layers").val([key]);
        $("#frames").val(collagedata.frame || 'Ingen ram');
        MyProject.layer = key;
        index = "canvas_"+id;
        collage[key] = new collage();
        collage[key].canvas_board = "canvas_"+id;
        collage[key].canvas =  document.getElementById(collage[key].canvas_board);
        collage[key].ctx = collage[key].canvas.getContext("2d");    
        collage[key].canvasOffset= $("#"+collage[key].canvas_board).offset();
        collage[key].offsetX= collage[key].canvasOffset.left;
        collage[key].offsetY= collage[key].canvasOffset.top;
        collage[key].imageX=collagedata.imageX || counter;
        collage[key].imageY=collagedata.imageY || counter;
        collage[key].imgframe=collagedata.imgframe || '';
        collage[key].frame=collagedata.frame || 'noframe';
        collage[key].ankare=false;
        collage[key].img=new Image();
        collage[key].img.onload=function(){
        collage[key].imageWidth= collagedata.imageWidth || collage[key].img.width;
        collage[key].imageHeight= collagedata.imageHeight || collage[key].img.height;
        collage[key].imageRight= collagedata.imageRight || collage[key].imageX+collage[key].imageWidth;
        collage[key].imageBottom= collagedata.imageBottom || collage[key].imageY+collage[key].imageHeight;
        draw(collage[key].ankare,false);
    };

      collage[key].img.src = imageURL;
      collage[key].img.onload(function(){        
              return;
      });

        
    function draw(withAnchors,withBorders){
        layer = myLayer();
            
        // rensa canvas
        collage[layer].ctx.clearRect(0,0,collage[layer].canvas.width,collage[layer].canvas.height);


        // rita bilden
        collage[layer].ctx.drawImage(collage[layer].img,0,0,collage[layer].img.width,collage[layer].img.height,collage[layer].imageX,collage[layer].imageY,collage[layer].imageWidth,collage[layer].imageHeight);
        if(collage[layer].frame !== 'noframe'){
            collage[layer].imgframe = document.getElementById(collage[layer].frame);
            collage[layer].ctx.drawImage(collage[layer].imgframe,collage[layer].imageX,collage[layer].imageY,collage[layer].imageWidth,collage[layer].imageHeight);
        }

        // rita med ankare
        if(withAnchors){
            drawDragAnchor(collage[layer].imageX,collage[layer].imageY); // top left
            drawDragAnchor(collage[layer].imageRight+8,collage[layer].imageY); // top right
            drawDragAnchor(collage[layer].imageRight+8,collage[layer].imageBottom+8); // bottom right
            drawDragAnchor(collage[layer].imageX,collage[layer].imageBottom+8); // bottom left
        }

        // rita med kantlinjer
        if(withBorders){
            collage[layer].ctx.beginPath();
            collage[layer].ctx.moveTo(collage[layer].imageX,collage[layer].imageY);
            collage[layer].ctx.lineTo(collage[layer].imageRight,collage[layer].imageY);
            collage[layer].ctx.lineTo(collage[layer].imageRight,collage[layer].imageBottom);
            collage[layer].ctx.lineTo(collage[layer].imageX,collage[layer].imageBottom);
            collage[layer].ctx.closePath();
            collage[layer].ctx.stroke();
        }

    };
    

    function drawDragAnchor(x,y){
            collage[layer].ctx.beginPath();
            collage[layer].ctx.moveTo(x,y);
            collage[layer].ctx.lineTo(x-8,y);
            collage[layer].ctx.lineTo(x-8,y-8);
            collage[layer].ctx.lineTo(x,y-8);
            collage[layer].ctx.closePath();
            collage[layer].ctx.stroke();
    }

    function anchorHitTest(x,y){

        var dx,dy;

        // top-left
        dx=x-collage[layer].imageX;
        dy=y-collage[layer].imageY;
        if(dx*dx+dy*dy<=rr){ return(0); }
        // top-right
        dx=x-collage[layer].imageRight;
        dy=y-collage[layer].imageY;
        if(dx*dx+dy*dy<=rr){ return(1); }
        // bottom-right
        dx=x-collage[layer].imageRight;
        dy=y-collage[layer].imageBottom;
        if(dx*dx+dy*dy<=rr){ return(2); }
        // bottom-left
        dx=x-collage[layer].imageX;
        dy=y-collage[layer].imageBottom;
        if(dx*dx+dy*dy<=rr){ return(3); }
        return(-1);

    }


    function hitImage(x,y){
        return(x>collage[layer].imageX && x<collage[layer].imageX+collage[layer].imageWidth && y>collage[layer].imageY && y<collage[layer].imageY+collage[layer].imageHeight);
    }


    function handleMouseDown(e){     

      collage[layer].startX=parseInt(e.pageX-collage[layer].offsetX);
      collage[layer].startY=parseInt(e.pageY-collage[layer].offsetY);

      draggingResizer=anchorHitTest(collage[layer].startX,collage[layer].startY);
      console.log('draggingresizer: '+draggingResizer);
      draggingImage= draggingResizer<0 && hitImage(collage[layer].startX,collage[layer].startY);
    }

    function handleMouseUp(e){
      draggingResizer=-1;
      draggingImage=false;

          draw(collage[layer].ankare,false);
      
    }

    function handleMouseOut(e){
      handleMouseUp(e);
    }

    function handleMouseMove(e){

      if(draggingResizer>-1){

          collage[layer].mouseX=parseInt(e.pageX-collage[layer].offsetX);
          collage[layer].mouseY=parseInt(e.pageY-collage[layer].offsetY);

          // ändra bildstorlek
          switch(draggingResizer){
              case 0: //top-left
                  collage[layer].imageX=collage[layer].mouseX;
                  collage[layer].imageWidth=collage[layer].imageRight-collage[layer].mouseX;
                  collage[layer].imageY=collage[layer].mouseY;
                  collage[layer].imageHeight=collage[layer].imageBottom-collage[layer].mouseY;
                  break;
              case 1: //top-right
                  collage[layer].imageY=collage[layer].mouseY;
                  collage[layer].imageWidth=collage[layer].mouseX-collage[layer].imageX;
                  collage[layer].imageHeight=collage[layer].imageBottom-collage[layer].mouseY;
                  break;
              case 2: //bottom-right
                  collage[layer].imageWidth=collage[layer].mouseX-collage[layer].imageX;
                  collage[layer].imageHeight=collage[layer].mouseY-collage[layer].imageY;
                  break;
              case 3: //bottom-left
                  collage[layer].imageX=collage[layer].mouseX;
                  collage[layer].imageWidth=collage[layer].imageRight-collage[layer].mouseX;
                  collage[layer].imageHeight=collage[layer].mouseY-collage[layer].imageY;
                  break;
          }

          // sätt minsta bildstorlek till 25x25
          if(collage[layer].imageWidth<25){collage[layer].imageWidth=25;}
          if(collage[layer].imageHeight<25){collage[layer].imageHeight=25;}

          // sätt värden för image right och bottom
          collage[layer].imageRight=collage[layer].imageX+collage[layer].imageWidth;
          collage[layer].imageBottom=collage[layer].imageY+collage[layer].imageHeight;

          // rita om bilden, eventuellt med ankare

          draw(collage[layer].ankare,true);
          

      }else if(draggingImage){

          imageClick=false;
          collage[layer].mouseX=parseInt(e.pageX-collage[layer].offsetX);
          collage[layer].mouseY=parseInt(e.pageY-collage[layer].offsetY);

          // flytta bilden lika långt som den senaste "dragningen"
          var dx=collage[layer].mouseX-collage[layer].startX;
          var dy=collage[layer].mouseY-collage[layer].startY;
          collage[layer].imageX+=dx;
          collage[layer].imageY+=dy;
          collage[layer].imageRight+=dx;
          collage[layer].imageBottom+=dy;
          // nollställ startXY
          collage[layer].startX=collage[layer].mouseX;
          collage[layer].startY=collage[layer].mouseY;
          // rita om bilden med kant
        
          draw(false,true);

      }


    }
   
    // läge "Dölj lagerhantering": iterera "mekaniskt" genom alla canvaslager
         $('#board canvas').on("click", function(event){
                 console.log('Klick!');
            var i = 0;
            var selector;    
            var mode = myMode() || 'all_layers';
            var layer = myLayer() || boards[0];
            var layercounter = myLayerCounter();
            console.log('mode = ' + mode);
            console.log('canvas = ' + layer);
           if(mode === 'all_layers'){
                for(i=0;i<boards.length;i++){
                    handler('#board #'+boards[i]);
                }
            }
            
    // på att-göra-listan: ett försök att manipulera alla bilder samtidigt
    // genom att iterera genom lagren i en loop
            /*if(mode == 'all_layers'){
                function loop(){     
                    for(i=0;i<boards.length;i++){
                        handler('#'+boards[i]);
                    }
                    //clearInterval(canvasloop);
                }
                var canvasloop=setInterval(loop,200); 
            }*/
        // läge "Visa lagerhantering": manipulera varje lager för sig
        // z-index, ram, position, storlek
            if(mode === 'one_layer'){
                console.log('one_layer= ' + layer);
                handler('#board #'+collage[layer].canvas_board);
            } 

        });
                  

    function handler(layers){
         
                $(layers).mousedown(function(e){
                    handleMouseDown(e);
                });
                $(layers).mousemove(function(e){
                    handleMouseMove(e);
                });
                $(layers).mouseup(function(e){   
                    handleMouseUp(e);
                });
                $(layers).mouseout(function(e){  
                    handleMouseOut(e);
                });
     }
     
       
                $("#"+layer).trigger("click");                
 
    }
    
    
    // växla mellan Visa lagerhantering och Dölj lagerhantering
    document.getElementById('layermodes').onclick = function() {

        var form = document.getElementById("layermodes");
        if(form.layeroption[0].checked){
            console.log('lagerfunktion ' + form.layeroption[0].value);
            $('#layer_options').addClass('hidden').fadeOut('slow');
            MyProject.mode = 'all_layers';
        }
        if(form.layeroption[1].checked){
            console.log('lagerfunktion ' + form.layeroption[1].value);
            $('#layer_options').removeClass('hidden').fadeIn('slow');
            MyProject.mode = 'one_layer';
        }

    };
    // byta lager i rullgardinslista
    layer = document.getElementById("layers");
    layer.addEventListener("change", function(event) {
         
            option = this.value;
            MyProject.layer = option;
            layer = myLayer();   
            
            var frame = collage[layer].frame;
            $('#frames').val([frame]);   
            $('#'+option).trigger("click");
            $('#'+option).trigger("mouseover");
            $('#'+option).trigger("mouseout");

    });
    
    // byta ram i rullgardinslista
    ramar = document.getElementById("frames");
    $('#frames').on("change", function(event) {
            option = this.value;
            layer = myLayer();
            
            for(i=0;i<collage.instances.length;i++){
                collage.instances[i].ankare = false;
                $('#'+layer).trigger("click");
                $('#'+layer).trigger("mouseover");
                $('#'+layer).trigger("mouseout");
            }

           
           collage[layer].frame = option;
           MyProject.mode = 'all_layers';
           $('#'+layer).trigger("click");
           $('#'+layer).trigger("mouseover");
           $('#'+layer).trigger("mouseout");


    });    
   
    // diverse knappar, ändra z-index upp och ner
    // visa/dölja dragankare
    // ta bort en bild
    $('#buttons #knappar').on("click", function(event){	
        var button=event.target.id;
        // get current layer
        var layer = myLayer() || boards[0];
        console.log('Lager: ' + layer);
        // get current z-index for layer
        var currentZindex = parseInt($('#'+layer).css('z-index'));
        if(button === 'moveup'){
            currentZindex++;
            moveup(currentZindex);
            $('#'+layer).css("z-index", currentZindex);
            console.log('Lager '+ layer +' har z-index '+ currentZindex);
        }
        if(button === 'movedown'){
            currentZindex--;
            movedown(currentZindex);
            $('#'+layer).css("z-index", currentZindex);
            console.log('Lager '+ layer +' har z-index '+ currentZindex);
        }
        if(button === 'anchors_on'){
            for(i=0;i<collage.instances.length;i++){
                collage.instances[i].ankare = true;
            }
           $('#'+layer).trigger("click");
           $('#'+layer).trigger("mouseover");
           $('#'+layer).trigger("mouseout");
        }
        if(button === 'anchors_off'){
            for(i=0;i<collage.instances.length;i++){
                collage.instances[i].ankare = false;
            }
           $('#'+layer).trigger("click");
           $('#'+layer).trigger("mouseover");
           $('#'+layer).trigger("mouseout");
        }          
    
    });
    
    
    // när z-index ökar på en canvas, ska den minska på den som ersätts 
    function moveup(currentZindex){
        for(i=0; i < boards.length; i++){
            if(currentZindex == $('#'+boards[i]).css('z-index')){
                $('#'+boards[i]).css('z-index', --currentZindex);
            }
        }
    }

    // när z-index minskar på en canvas ska den öka på den som ersätts
    function movedown(currentZindex){
        for(i=0; i < boards.length; i++){
            if(currentZindex == $('#'+boards[i]).css('z-index')){
                $('#'+boards[i]).css('z-index', ++currentZindex);
            }
        }
    }  

    // för att få allt att fungera krävs några globala variabler
    // har lagt dom i ett eget projektobjekt eftersom globala variabler
    // sägs vara "onda" :-)
    function myMode(){
        return MyProject.mode;
    }
    function myLayer(){
        return MyProject.layer;
    } 
    function myLayerCounter(){
        return MyProject.layercounter;
    } 

    // knappar för att spara färdigt collage som en enda bild
    // för att rensa hela sidan
    // och för att spara en arbetsfil med pågående arbete
     $('#more_buttons').on("click", function(event){	
        var button=event.target.id, tempid, temp_ctx, save_canvas, ctx_save, items, c_layers, blobdata, save={blobdata:''}, collages, previews, saveArray = [{0:'', 1:''}], imgData, filename, imgname, name;
        
        if(button === 'save'){
            imgname = document.getElementById('savename');
            if(imgname.value ===""){
                $('#output').html("<div class='output alert alert-danger'><strong>Du måste ge bilden ett namn.</strong></div>");
                return;
            }
            // lagren måste sorteras efter z-index så att de renderas 
            // i rätt ordning på bilden som sparas            
            items = $("#board canvas").toArray();
            c_layers = items.sort(function(a, b) {
                    return(Number(a.style.zIndex) - Number(b.style.zIndex));
            });
            save_canvas = document.getElementById('save_canvas'); 
            ctx_save = save_canvas.getContext('2d');
            ctx_save.clearRect(0,0,save_canvas.width,save_canvas.height);
            for(i=0; i < c_layers.length; i++){
                ctx_save.drawImage(c_layers[i],0,0);
            }
                $('#output').empty();
                $('#output').addClass('overlay');
                $('#board canvas').fadeOut('slow')
                transfer("image/png", imgname.value);

        }
        // sidan laddas om utan att skicka det senaste post-formuläret
        if(button === 'delete_all'){
            window.location.href = window.location.protocol +'//'+ window.location.host + window.location.pathname;
        }
        // spara en arbetsfil: hämta filnamnet som användaren skrivit
        if(button === 'save_current'){
            filename = document.getElementById('filename');
            if(filename.value ===""){
                $('#output').html("<div class='output alert alert-danger'><strong>Du måste ge arbetsfilen ett namn.</strong></div>");
                return;
            }
            // lägg in bilddata och parameterdata i imgData
            imgData = JSON.stringify({
                layers: getLayerData()
            });
        $('#output').empty();    
        $('#output').addClass('overlay');
        $('#board canvas').fadeOut('slow')
        // sanera det angivna filnamnet
        name = filename.value.replace(/[öÖ]/g,'o');
        name = name.replace(/[åäÅÄ]/g,'a');
        name = name.replace(/[^a-zA-Z0-9]/g,'_');
        setTimeout(function(){         
            //  Ajax för att spara arrayen på serversidan
            console.log('Data skickas till collage.php');
	        $.ajax({
	            type: 'post',
	            url: 'server.php',      
	            dataType: 'json',
	            data: {
	                type: '.json',
	                name: name,
	                data: imgData  
	            },
	            success: function(data){
	                $('#output').removeClass('overlay');
	                $('#board canvas').fadeIn('slow');
	                $('#output').html(data);
	                console.log('Ajax request returned successfully.');
	            },
	            error: function(data){
	                $('#output').removeClass('overlay');
	                $('#board canvas').fadeIn('slow');
	                $('#output').html(data);
	                console.log('Ajax request failed miserably.');	                
	                }            
	            });
	        }, 2000);
	
	    }
    });
          
     // lägg in bilddata från samtliga lager i objektet imgData
     // lägg in parameterdata för varje lager, via collage.instances[]
     // se rad 35/40
     function getLayerData() {
         var imgData = {};
         $("#HR canvas").each(function(i, el) {
                 imgData[i] = el.toDataURL("image/png"); // enbart "högupplöst" bilddata
                 imgData[boards[i]] = collage.instances[i]; // positioner, storlek, ramar
         });

         console.log('imgdata ' + imgData);
         return imgData;
     }
     
     

     // rita mindre preview-bilder i en rad under drop-rutan
     // rita en siffra på bilden så att det lätt syns vilken bild 
     // som hör till vilket lager
     function renderPreview(src){
         var image = new Image();
         drop++;
         image.onload = function(){
             var canvas = document.getElementById("image"+drop);
             if(image.width > MAX_WIDTH_PV) {
                 image.height *= MAX_WIDTH_PV / image.width;
                 image.width = MAX_WIDTH_PV;
             }
             var ctx1 = canvas.getContext("2d");
             ctx1.clearRect(0, 0, canvas.width, canvas.height);
             canvas.width = image.width;
             canvas.height = image.height;
             ctx1.drawImage(image, 0, 0, image.width, image.height);
             ctx1.font = "bold 40px Arial";		
             ctx1.strokeStyle = 'black';
             ctx1.lineWidth = 4;
             ctx1.strokeText(drop, 40, 40);
             ctx1.fillStyle = "white";
             ctx1.fillText(drop, 40, 40);
         };
         image.src = src;
         image.onload(function(){        
                 return;
         });

     }
     // rita bilder med högre upplösning, det är dessa som används i collaget
     // och som laddas upp till servern när användaren sparar en arbetsfil
     function renderHighres(src){
         var image = new Image();
         image.onload = function(){
             var canvas = document.getElementById("image_HR_"+drop);
             if(image.width > MAX_WIDTH_HR) {
                 image.height *= MAX_WIDTH_HR / image.width;
                 image.width = MAX_WIDTH_HR;
             }
             var ctx = canvas.getContext("2d");
             ctx.clearRect(0, 0, canvas.width, canvas.height);
             canvas.width = image.width;
             canvas.height = image.height;
             ctx.drawImage(image, 0, 0, image.width, image.height);
         };
         image.src = src;
         image.onload(function(){        
                 return;
         });

     }

     // kolla att användarens bild faktiskt är en bild
     function validateFileExtension(src){
         var flash = document.getElementById('flash'), output = document.getElementById('output'), ext, i, flag=0, extns = ['image/jpeg', 'image/png', 'image/gif'];

         ext = src.type;
         for(i=0;i<extns.length;i++)
         {
             if(ext==extns[i])
             {
                 flag=0;
                 break;
             }
             else
             {
                 flag=1;
             }
         }
         if(flag!=0)
         {
             console.log('Underkänd!');
             output.innerHTML = "<div class='output alert alert-danger'><strong>Fel filformat. Enbart jpg-, png. eller gif-bilder är tillåtna.</strong></div>";
             output.focus();
             return false;
         }
         else
         {
             console.log('Godkänd!');
             output.innerHTML = '';
             return true;
         }
     }

     function loadImage(src){
         var error;
         //	Skicka bilderna för typkontroll
         if(validateFileExtension(src)){
             console.log("Den droppade filen är en bild: ", src);

             var reader = new FileReader();
             reader.onload = function(e){
                 renderPreview(e.target.result);
                 renderHighres(e.target.result);
             };
             reader.readAsDataURL(src);
             return true;
         }
         return false;
     }


    target = document.getElementById("drop-target");
    // Normalt kan inte bilder droppas på andra element
    // för att ändå kunna göra det behövs preventDefault
    target.addEventListener("dragover", function(event) {
        event.stopPropagation();
        event.preventDefault();}, true);
        target.addEventListener("drop", function(event) {
            event.stopPropagation();
            event.preventDefault();
            src = event.dataTransfer.files[0];
            name = src.name.replace(/\.[^/.]+$/, "");
            if(loadImage(src) === true){
                console.log('loadImage === true');
            }
        }, true);


        // här laddas den färdiga collage-bilden upp till servern
        function transfer(type, name){
            console.log('Funktionen transfer anropas');
            setTimeout(function(){
            
	        //  Ajax för att skicka bilden till serversidan
	        $.ajax({
	            type: 'post',
	            url: 'img_handler.php',      
	            dataType: 'json',
	            data: {
	                imageType: type,
	                imageName: name,
	                imageData: document.getElementById("save_canvas").toDataURL("image/png")
	            },
	            success: function(data){
	            $('#output').removeClass('overlay');
                $('#board canvas').fadeIn('slow');
	                $('#output').html(data);
	                console.log('Ajax request returned successfully.');
	            },            
	            error: function(data){
	            $('#output').removeClass('overlay');
                $('#board canvas').fadeIn('slow');	                
	                $('#output').html(data);
	                console.log('Ajax request failed miserably.');	                
	            }     	            
	        });
	}, 2000);

	}
	
    
    window.onload = function() {          
        // visa lagermenyn direkt när sidan öppnas
        $('#layer_options').removeClass('hidden').fadeIn('slow');
    };	
    
  
});
