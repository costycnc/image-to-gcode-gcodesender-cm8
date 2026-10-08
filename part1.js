	   var contourx=0; //23/11/2022

var svgcode = d3.select("#svgcode");

      var myArr = [];

      var port;

      var value1,stopx=false;

      var writer;

      var linenr = 0;

      var reader;

	  var translatex=1,translatey=1,scalez=1;

	  dragElement(document.getElementById("mydiv"));

function dragElement(elmnt) {

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  if (document.getElementById(elmnt.id + "header")) {

    /* if present, the header is where you move the DIV from:*/

    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;

    document.getElementById(elmnt.id + "header").ontouchstart = dragMouseDown;

  } else {

    /* otherwise, move the DIV from anywhere inside the DIV:*/

    elmnt.onmousedown = dragMouseDown;

    elmnt.ontouchstart = dragMouseDown;

  }

  function dragMouseDown(e) {

    e = e || window.event;

    e.preventDefault();

    // get the mouse cursor position at startup:

    pos3 = e.clientX;

    pos4 = e.clientY;

    document.onmouseup = closeDragElement;

    document.ontouchend = closeDragElement;

    // call a function whenever the cursor moves:

    document.onmousemove = elementDrag;	

    document.ontouchmove = elementDrag;	

  }

  function elementDrag(e) {

    e = e || window.event;

    e.preventDefault();

    // calculate the new cursor position:

    pos1 = pos3 - e.clientX;

    pos2 = pos4 - e.clientY;

    pos3 = e.clientX;

    pos4 = e.clientY;

    // set the element's new position:

    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";

    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

  }

  function closeDragElement() {

    /* stop moving when mouse button is released:*/

    document.onmouseup = null;

    document.onmousemove = null;

    document.ontouchend = null;

    document.ontouchmove = null;

  }

}

      var openFile1 = function(event) {

        var input = event.target;

        var reader = new FileReader();

        reader.onload = function() {

          var text = reader.result;

          gcode.value = text;

          document.getElementById('gcode').value = gcode.value;

          costycncdesign(gcode.value);

        };

        reader.readAsText(input.files[0]);

      };

      

      

      

      function costycncdesign(gcode) {

        val3 = 0;

        val4 = 0;

        svgcode.selectAll('*').remove();

        myArr = gcode.split("\n");

        for (let i = 0; i < myArr.length; i++) {

          val1 = myArr[i].split(" ");

          if (val1[0] == "G01") {

            if (val1[1]) {

              val5 = val1[1].substring(1)

            } else {

              val5 = val3

            }

            if (val1[2]) {

              val6 = val1[2].substring(1)

            } else {

              val6 = val4

            }

            svgcode.append("line").attr("x1", val3).attr("y1", val4).attr("x2", val5).attr("y2", val6).attr("stroke", "white").attr("stroke-width", "1");

            val3 = val5;

            val4 = val6;

          }

        }

      }

      //https://yiddishe-kop.com/articles/web-serial-api

      function connect() {

        if (navigator.serial) {

          connectSerial();

          document.getElementById("write").disabled = false;

          document.getElementById("writea").disabled = false;

          var x = document.getElementById("frecce");

          x.style.display = "block";

        } else {

          alert('Please update to the latest Chrome');

        }

      }

      async function connectSerial() {

        port = await navigator.serial.requestPort();

        baud = document.getElementById("baud").value;

        await port.open({

          baudRate: baud

        });

        const textEncoder = new TextEncoderStream();

        const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

        writer = textEncoder.writable.getWriter();

        const textDecoder = new TextDecoderStream();

        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);

        reader = textDecoder.readable.getReader();

        val3 = 0;

        val4 = 0;

        while (true) {

		    
		      if (stopx) {
    document.getElementById("lname").value = "CNC STOPPING";

    // Try flushing the buffer (if supported by your GRBL version)
    await writer.write("$F\r");

    await writer.write("$X\r");
    break;
  }

          const {

            value,

            done

          } = await reader.read();
          
          

          document.getElementById("lname").value = value;

          console.log(value);

          if (value.indexOf("k") !=-1) {

            if (myArr[linenr]) {

              await writer.write(myArr[linenr] + "\r");

              linenr++;

              val = myArr[linenr] + "\r";

              document.getElementById("lname").value = val;

              //console.log("val"+val);

              //console.log("value"+value);

              val1 = val.split(" ");

              if (val1[0] == "G01") {

                if (val1[1]) {

                  val5 = val1[1].substring(1)

                } else {

                  val5 = val3

                }

                if (val1[2]) {

                  val6 = val1[2].substring(1)

                } else {

                  val6 = val4

                }

                svgcode.append("line").attr("x1", val3).attr("y1", val4).attr("x2", val5).attr("y2", val6).attr("stroke", "red").attr("stroke-width", "1");

                val3 = val5;

                val4 = val6;

              }

            }

          }

          if (done) {

            // Allow the serial port to be closed later.

            reader.releaseLock();

            break;

          }

        }

      }

      /*

      setInterval(function () {

      if (writer){

      	    WriteSerial1();

      	  }

      }, 1000);

      async function ReadSerial() {

        const { value, done } = await reader.read();

        	console.log(value);

              if (value) {

              console.log(value);

            }

        if (done) {

          // Allow the serial port to be closed later.

      	console.log("done");

          reader.releaseLock();

        }

       }

      */

      async function WriteSerial() {

        linenr = 0;

        var text = "F500\n";

        text += document.getElementById('gcode').value;

        myArr = text.split("\n");

        //var len=myArr[0].length;

        await writer.write(myArr[linenr] + "\r");

        linenr++;

        console.log(myArr[linenr] + "\r");

      }

      async function vaistg(value) {

        await writer.write("G91 F500\rG01 X-"+value+"\r");

        linenr=-1;

      }

      async function vaidr(value) {

        await writer.write("G91 F500\rG01 X+"+value+"\r");

        linenr=-1;

      }

      async function vaisus(value) {

        await writer.write("G91 F500\rG01 Y+"+value+"\r");

        linenr=-1;

      }

      async function vaijos(value) {

        await writer.write("G91 F500\rG01 Y-"+value+"\r");

        linenr=-1;

      }
                    
        async function hotwireon(value) {

        await writer.write("M03 S"+value+"\r");

        linenr=-1;

      }   
      
      async function hotwireoff() {

        await writer.write("M05\r");

        linenr=-1;

      }

      async function turn() {

        var stepr = document.getElementById('stepr').value;

        await writer.write("G91 F500\rG01 Z"+stepr+"\nG92 Z0\n");

        linenr=-1;

      }

      //insert 14.11.2022

      	  function sleep(ms) {

  return new Promise(

    resolve => setTimeout(resolve, ms)

  );

}

      		async function simulate(){

	svgcode.selectAll("#redline").remove();

			console.log(myArr.length);

			var linenr=0;

			while (true) {

				if (myArr[linenr]) {

					linenr++;

					await sleep(5);

					val = myArr[linenr] + "\r";

					document.getElementById("lname").value = val;

					val1 = val.split(" ");

					if (val1[0] == "G01") {

						if (val1[1]) {

						val5 = val1[1].substring(1)

						} else {

						val5 = val3

						}

					if (val1[2]) {

					  val6 = val1[2].substring(1)

						} else {

						val6 = val4

						}

					svgcode.append("line").attr("id", "redline").attr("x1", val3).attr("y1", val4).attr("x2", val5).attr("y2", val6).attr("stroke", "red").attr("stroke-width", "1");

					val3 = val5;

					val4 = val6;

					}

				}else{break;}

			}

		}