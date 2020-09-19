const filler = document.getElementById('filler')
const start = document.getElementById('play')

const comeOn = (audio) => {
    const audioCtx = new AudioContext()
    let analyser = audioCtx.createAnalyser()
    const source = audioCtx.createMediaElementSource(audio)
    source.connect(audioCtx.destination) 
    source.connect(analyser)      
    
    analyser.fftSize = 256;
    let bufferLengthAlt = analyser.frequencyBinCount;
    let dataArrayAlt = new Uint8Array(bufferLengthAlt);
    analyser.getByteTimeDomainData(dataArrayAlt);

    const drawAlt = function() {
      drawVisual = requestAnimationFrame(drawAlt);
  
      analyser.getByteFrequencyData(dataArrayAlt);
  
      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.clearRect(0,0, WIDTH, HEIGHT)
      var barWidth = (WIDTH / bufferLengthAlt) * 2.5;
      var barHeight;
      var x = 0;
      for(var i = 0; i < bufferLengthAlt; i++) {
        barHeight = dataArrayAlt[i];
  
        canvasCtx.fillStyle = `rgba(${69+barHeight/3.72},${162+barHeight/1.36},${158+barHeight/1.48}, ${barHeight/150})`;
        canvasCtx.fillRect(x+i*10,100,barWidth,barHeight/4)      
        canvasCtx.fillRect(x+i*10,100,barWidth,-barHeight/4)
        x += barWidth + 1;
      }
    }
    drawAlt()
  }



// Get a canvas defined with ID "oscilloscope"
var canvas = document.getElementById("oscilloscope");
var canvasCtx = canvas.getContext("2d");

// draw an oscilloscope of the current audio source
canvas.width = 600
canvas.height = 200

var   WIDTH = canvas.width;
var   HEIGHT = canvas.height;



const src = 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview118/v4/94/25/9c/94259c23-84ee-129d-709c-577186cbe211/mzaf_5653537699505456197.plus.aac.p.m4a'
function play(src){
  let audio = new Audio()
  audio.crossOrigin = "anonymous"
  audio.src = src
  audio.play()
  audio.preload = 'auto'
  audio.volume = 0.2
  comeOn(audio)
  playerAnimation(Date.now() + 30000)
}

start.onclick = () => {
  play(src)
}

function playerAnimation(endTime) {
  const step = () => {
      let milLeft = endTime - Date.now()
      console.log(milLeft)
      let secLeft = milLeft / 1000
      if(milLeft<50) {
        return clearInterval(timer)
      }
      let width = (30000-milLeft)/30000*100
      filler.style.width = width + '%'
  }
  
  timer = setInterval(step, 50)
}

