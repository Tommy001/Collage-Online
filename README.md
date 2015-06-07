# Collage Online

Collage Online är en funktion skriven i Javascript, som är till för att skapa bildcollage på webben.

Collage Online använder sig av HTML5 Canvas och tillåter användaren att ladda upp bilder med **Drag & Drop**. Det är bara att dra över dem från den egna datorn till webbsidan.

Det finns en del att tänka på när man hanterar HTML5 Canvas-element. Det finns inbyggda skyddsfunktioner som innebär att det inte går att använda vissa bilder som hämtats från andra webbplatser på "localhost". Av säkerhetsskäl anses din lokala disk vara "en annan domän" och kommer att utlösa skyddet. Det beror på att dina mest känsliga data troligen finns just på din lokala disk. Om du vill forska vidare i ämnet kan du [läsa mer här](http://stackoverflow.com/questions/22710627/tainted-canvases-may-not-be-exported).

Det som kan hända är att det inte går att ladda upp en arbetsfil eller en färdig collage-bild till servern. 

Testa därför inte Collage Online lokalt på din dator med WAMP- eller XAMP-server eller liknande. Klona i stället repot från Github till din webbserver eller prova demot på den här webbplatsen. (Klicka på Demo ovan).

Med det sagt, gör så här:

Gå till önskad mapp på din webbserver och klona mitt repo från Github:
> git clone https://github.com/Tommy001/Collage-Online.git

Skapa följande tomma mappar på samma nivå som index.php:
*collage*
*collage_img*
*tmp*

**Klart!**

Peka din webbläsare på filen index.php och provkör.
