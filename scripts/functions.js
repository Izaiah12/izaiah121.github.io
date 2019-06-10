var sound_prefix = "/sounds/";


var drums = document.getElementsByClassName("drum");

var recording = false;

var tunePadCode = document.getElementById("tunepad-code");
var context = new AudioContext();

var startTime = 0; 
console.log("start time: ", startTime)

var recordingArray = []; 
var drumSound = [];

var drumBuffers = {};


//play Sound Function 

function playSound(name, time) {
  var start = context.currentTime;
  var buffer = drumBuffers[name]; 
  var source = context.createBufferSource(); // creates a sound source
  source.buffer = buffer;                    // tell the source which sound to play
  source.connect(context.destination);       // connect the source to the context's       	  destination (the speakers)
  source.start(start + time);  // play the source now
}

//load drum sound
function loadDrumSound(name) {
  var url = sound_prefix + name;
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
        drumBuffers[name] = buffer; 
    }, function () { console.log("error loading audio")});
  }
  request.send();
}


function printTunePadCode() {
    var output= [];
    var lastTime = 0.0; 
    for (let hit of recordingArray){
        var rest = hit[1] - lastTime;
        output.push("rest(" + rest + ")" ); 
        output.push(`playNote(${hit[2]}, beats=0.25)\n`);
        lastTime = hit[1]; 
    }
 tunePadCode.innerHTML = output.join("\n");    
}
  


for (let drum of drums) {
   loadDrumSound(drum.dataset.sound); 
   
   drum.onmousedown = function(e) {
        playSound(drum.dataset.sound, 0); 
   		if (recording){
         
				 //var DrumSoundBuffer = null;
      	 //var recordingArray = []; 
         //tunePadCode.innerHTML += `playNote(${drum.dataset.note}, beats=0.25)\n`; 
         
         //Loading code*********************************************
         //console.log("note: ", note, "Time: ", DrumSoundTime)
         var DrumSoundTime = context.currentTime;
         var offset = DrumSoundTime - startTime; 
         console.log("currentTime = ", context.currentTime); 
         console.log("offest: ", offset); 
         
         //drumSound = loadDrumSound(audio.src);
         drumSound = drum.dataset.sound;
            
         var tuple = [ drumSound, offset, drum.dataset.note ]; 
         recordingArray.push(tuple);
         
         console.log("recording array: ", recordingArray);        
         console.log("array len = ", recordingArray.length); 
         printTunePadCode(); 
         
     }
   }
}




var rec_button = document.getElementById("record-button");
var timer = null;
rec_button.onclick = function(e){
   if (context == null) context = new AudioContext();
   if (timer) {
     console.log("Timer = ", timer)
     console.log("STOPPED RECORDING")
     //context.currentTime = null; 
     clearInterval(timer);
     timer = null;
     rec_button.classList.remove("tick");
     recording = false; 
   } else {
     console.log("timer = ", timer)
     console.log("RECORDING")
     //For recording sounds from drum 
     
     //context.currentTime = 0; 
     startTime = context.currentTime; 
     console.log("start time from Recorder = ", startTime); 
     //context.currentTime = 0; 
     ///*********************************
     timer = setInterval(function() {
        rec_button.classList.toggle("tick");     
     }, 500);
     recording = true;
     recordingArray = [];
   }
}

var play_button = document.getElementById("play-button");

play_button.onclick = function(e){

 //let startTime = context.CurrentTime; 
 console.log("about to play sounds");
 console.log("test");
 //playSound(drumSound);
 //playSound(startTime, recordingArray[1].drumSound, recordingArray[1].Time);
 //playSound(startTime, recordingArray[2].drumSound, recordingArray[2].Time);

//get buffer list 
  for (let i = 0; i < recordingArray.length; i++) {
    let startTime = recordingArray[i][1];
    let soundName = recordingArray[i][0];
    console.log(startTime, soundName);
    playSound(soundName, startTime); 
      
  }

  

   
   //playSound(startTime, recordingArray[i].drumSound, recordingArray[i].Time);

}



