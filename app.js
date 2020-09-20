const filler = document.getElementById('filler')
const start = document.getElementById('play')
const defaultTrackUrl = "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview113/v4/5e/2f/80/5e2f8029-d77b-d097-08f5-b7ee25c57ff3/mzaf_2579071016942610640.plus.aac.p.m4a"
const srcInput = document.getElementById('src__input')


const testUrl = 'https://itunes.apple.com/search?term=billie_eilish'

function getRequestUrl(text) {
  text.split(' ').join('_')
  return 'https://itunes.apple.com/search?term='+text
}

function sendRequest(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest
    
    xhr.open('GET', url)

    xhr.responseType = 'json'

    xhr.onload = () => {
      if(xhr.status >=400) {
        reject(xhr.response)
      } else {
        resolve(xhr.response)
      }
    }

    xhr.send()
  })
}

const getTrackPreviewUrl = data => {
  return data.results[0].previewUrl
}

start.onclick = () => {
  if(srcInput.value!=''){
    console.log(srcInput.value)
    const url = getRequestUrl(srcInput.value)
    srcInput.value = ''
    sendRequest(url).then(data => {
      const src = getTrackPreviewUrl(data)
      play(src)
    }).catch(e => {
      console.log(e)
      play(defaultTrackUrl)
    })
  }  
}

const comeOn = (audio) => {
    const audioCtx = new AudioContext()
    let analyser = audioCtx.createAnalyser()
    const source = audioCtx.createMediaElementSource(audio)
    source.connect(audioCtx.destination) 
    source.connect(analyser)      
    console.log(audioCtx.getOutputTimestamp())
    analyser.fftSize = 256;
    let bufferLengthAlt = analyser.frequencyBinCount;
    let dataArrayAlt = new Uint8Array(bufferLengthAlt);
    analyser.getByteTimeDomainData(dataArrayAlt);
    console.log(dataArrayAlt)
    const startTime = Date.now()
    const drawAlt = function() {     
      drawVisual = requestAnimationFrame(drawAlt);
      if(Date.now() - startTime > 31000) {
        cancelAnimationFrame(drawVisual)
      }
      analyser.getByteFrequencyData(dataArrayAlt);
      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.clearRect(0,0, WIDTH, HEIGHT);
      var barWidth = (WIDTH / bufferLengthAlt)-4;
      var barHeight;
      var x = 0;
      console.log('there')
      for(var i = 0; i < bufferLengthAlt; i++) {
        
        barHeight = dataArrayAlt[i];
        canvasCtx.shadowBlur = barHeight*0.2;
        canvasCtx.shadowColor = `rgb(${69+barHeight/5},${162+barHeight/2},${158+barHeight/2})`;
        canvasCtx.fillStyle = `rgba(${69+barHeight/5},${162+barHeight/2},${158+barHeight/2}, ${barHeight/150})`;
        canvasCtx.fillRect(x,100,barWidth,barHeight/5-70/(i+1))      
        canvasCtx.fillRect(x,100,barWidth,-barHeight/5+70/(i+1))
        x += barWidth + 1;
      }
    }
    drawAlt()
  }



// Get a canvas defined with ID "oscilloscope"
var canvas = document.getElementById("oscilloscope");
var canvasCtx = canvas.getContext("2d");

// draw an oscilloscope of the current audio source
canvas.width = 1000
canvas.height = 300

var   WIDTH = canvas.width;
var   HEIGHT = canvas.height;

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

function playerAnimation(endTime) {
  const step = () => {
      let milLeft = endTime - Date.now()
      if(milLeft<50) {
        return clearInterval(timer)
      }
      let width = (30000-milLeft)/30000*100
      filler.style.width = width + '%'
  }
  
  timer = setInterval(step, 50)
}

