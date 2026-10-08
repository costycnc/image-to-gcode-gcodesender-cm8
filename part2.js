   /*

			25.09.2021 adaugat daca text/plain base64 send direct to base64  >> ramane sa testez daca text contine base64 o no

			*/

      var initialx = 0;

      var dataURL;

      var initialy = 0;

      var rapx = 1;

      var rapy = 1;

      var scaledpi = 96;

      var gcode_value = "";
      
      
              // Evita il comportamento predefinito per gli eventi di drag
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            window.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
       
        
window.addEventListener('drop', function(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) { // Verifica che ci siano file
        const file = files[0]; // Ottieni l'oggetto File
        if (file.type.match('^image/')) {
            const reader = new FileReader();
            reader.onload = (e) => myFunction(e.target.result);
            reader.readAsDataURL(file); // Passa l'oggetto File corretto
        }
    }
});	
	  

      //inspired from 

      //https://ourcodeworld.com/articles/read/491/how-to-retrieve-images-from-the-clipboard-with-javascript-in-the-browser	

      function retrieveImageFromClipboardAsBlob(pasteEvent, callback) {

        if (pasteEvent.clipboardData == false) {

          if (typeof(callback) == "function") {

            callback(undefined);

          }

        };

        var items = pasteEvent.clipboardData.items;

        if (items == undefined) {

          if (typeof(callback) == "function") {

            callback(undefined);

          }

        };

        for (var i = 0; i < items.length; i++) {

          console.log("type=" + items[i].type);

          // Skip content if not image

          if (items[i].type.indexOf("image") == -1) continue;

          // Retrieve image on clipboard as blob

          var blob = items[i].getAsFile();

          if (typeof(callback) == "function") {

            callback(blob);

          }

        }

      }

      window.addEventListener("paste", function(e) {

        //25.09.2021 1

        var items = e.clipboardData.items;

        var file = items[0].type;

        if (file == "text/plain") {

          console.log("este text plain");

          const dT = e.clipboardData;

          const html = dT.getData('text/plain');

          myFunction(html);

        } else {

          // Handle the event

          retrieveImageFromClipboardAsBlob(e, function(imageBlob) {

            // If there's an image, display it in the canvas

            console.log(imageBlob);

            if (imageBlob) {

              console.log("imageblob=" + imageBlob);

              var reader = new FileReader();

              reader.onload = function() {

                dataURL = reader.result;

                //console.log("dataURL="+dataURL);

              };

              reader.readAsDataURL(imageBlob);

              setTimeout(function() {

                myFunction(dataURL);

              }, 500);

            }

          });

        }

      });

      ///////////	

      var openFile = function(event) {

        var input = event.target;

        var reader = new FileReader();

        reader.onload = function() {

          dataURL = reader.result;

        };

        reader.readAsDataURL(input.files[0]);

		

        setTimeout(function() {

          myFunction(dataURL);

        }, 500);

      }

      function myFunction(dataurl) {

        Potrace.loadImageFromUrl(dataurl,contourx);//23/11/2022 contourx

        Potrace.process(function() {

          display(); //solo prima volta	

          initialx = Potrace.getdimx();

          initialy = Potrace.getdimy();

        });

      }

      function display() {

        //questa funzie ogni volta quando cambia valore

		if(document.getElementById('custom-dpi').value==0){scaledpi = document.getElementById('scaledpi').value;}else{scaledpi = document.getElementById('custom-dpi').value;}

        

        //scaledpi = document.getElementById('scaledpi').value;

        var rotate = document.getElementById('rotate').value;

        var rotate = document.getElementById('rotate').value;

        var stepr = document.getElementById('stepr').value;

		var rot=stepr/rotate

        //var svgdiv = document.getElementById('svgdiv');

        //svgdiv.style.display = 'inline-block';

        //svgdiv.innerHTML = "< p > Result: < /p>" + Potrace.getSVG(rapx /5, rapy / 5);

      //var gcode = document.getElementById('gcode');

      var var_tmpx = 2.54 * rapx * 10;

      var var_tmpy = 2.54 * rapy * 10;

      gcode_value = "";

      //var gcodegcode = Potrace.getSVG1(var_tmpx / scaledpi, var_tmpy / scaledpi);

var gcodegcode = Potrace.getSVG1(var_tmpx / scaledpi, var_tmpy / scaledpi,document.getElementById('feedrate').value,document.getElementById('hotwire').value);

      //(scaledpi/2.54)*rapx,(scaledpi/2.54)*rapy

      //var gcodegcode = Potrace.getSVG1(var_tmpx/scaledpi,var_tmpy/scaledpi);

      if (document.getElementById("pr").checked) {

        for (let i = 0; i < rotate; i++) {

          var strd = "G01 Z"+rot+"\nG92 Z0\n";

          gcode_value += gcodegcode;

          gcode_value += strd;

        }

        document.getElementById('gcode').value = gcode_value;
        

      } else {

        gcode_value = gcodegcode;

        document.getElementById('gcode').value = gcode_value;
    

        costycncdesign(gcode_value);

      }

      //scrie calcx cu dimx in mm lo deve dividere cu 10 per cm

      document.getElementById("calcx").value = (Potrace.getdimx() / 10).toFixed(1);

      document.getElementById("calcy").value = (Potrace.getdimy() / 10).toFixed(1);

      }

	     function contoura() {//23/11/2022 add function contoura

		 

	    document.getElementById('flvalue').value = '';//23/11/2022 clear cache file per poter caricare stessa file

		if (document.getElementById("contour").checked) {

			contourx=1;

        } else {

            contourx=0;

        }

		}

      function check() {

        if (document.getElementById("due").checked) {

          document.getElementById("calcy").disabled = true;

          document.getElementById("raport2").disabled = true;

        } else {

          document.getElementById("calcy").disabled = false;

          document.getElementById("raport2").disabled = false;

        }

        calculeaza();

      }

      function calculeaza1() {

        rapx = document.getElementById("raport1").value;

        rapy = document.getElementById("raport2").value;

        if (document.getElementById("due").checked) rapy = rapx;

        document.getElementById("raport2").value = rapy;

        display();

      }

      function calculeaza() {

        //citeste calcx che in cm ... risposta deve esssere in mm cioe *10

        var valo = document.getElementById("calcx").value * 10;

        rapx = valo / initialx;

        console.log("rap=" + rapx);

        var valo = document.getElementById("calcy").value * 10;

        rapy = valo / initialy;

        if (document.getElementById("due").checked) rapy = rapx;

        document.getElementById("raport1").value = rapx;

        document.getElementById("raport2").value = rapy;

        display();

      }

      function saveTextAsFile() {

        //var gcode = document.getElementById('gcode').value;

        gcode_value = document.getElementById('gcode').value;

        var textToSaveAsBlob = new Blob([gcode_value], {

          type: "text/plain"

        });

        var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);

        var fileNameToSaveAs = "costycnc.nc";

        var downloadLink = document.createElement("a");

        downloadLink.download = fileNameToSaveAs;

        downloadLink.innerHTML = "Download File";

        downloadLink.href = textToSaveAsURL;

        downloadLink.onclick = destroyClickedElement;

        downloadLink.style.display = "none";

        document.body.appendChild(downloadLink);

        downloadLink.click();

      }

      function destroyClickedElement(event) {

        document.body.removeChild(event.target);

      }

	  

	  

var svg1=document.getElementById("svg");

var svg2=document.getElementById("svgcode");

var nome=document.getElementById("nome");

var contourz=document.getElementById("contourz");

function my(){

var fonth=document.getElementById("myRanges").value;

var value=document.getElementById("litera").value;

var font=document.getElementById("textarea").value;

var propr ="@font-face {";

propr +="font-family: 'Roboto';";

propr +="font-style: normal;";

propr +="font-weight: 400;";

propr +="src: url(";

propr +=font;

propr +=") format('woff');}" ;

svg1.innerHTML="";	

var st = document.createElementNS("http://www.w3.org/2000/svg", 'style'); //Create a path in SVG's namespace 

st.innerHTML = propr;

svg1.appendChild(st);

var txt = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace 

txt.innerHTML = value;

txt.setAttribute("font-size",fonth);

txt.setAttribute("x",50);

txt.setAttribute("y",fonth);

if (nome.checked && contourz.checked) {

    txt.setAttribute("fill","white");

    txt.setAttribute("stroke","black");

} else {

    if(nome.checked){

    txt.setAttribute("fill","black");

    txt.setAttribute("stroke","white");}

	else{

	

    txt.setAttribute("fill","black");

    txt.setAttribute("stroke","black");}

}

txt.setAttribute("stroke-width","40px");

txt.setAttribute("font-family","Roboto");

txt.setAttribute("paint-order","stroke");

svg1.appendChild(txt);

var s = new XMLSerializer().serializeToString(svg1);

var encodedData = "data:image/svg+xml;base64,"+window.btoa(s);

myFunction(encodedData);

}