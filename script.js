/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

//Global Variables

var guessCounter = 0;
const clueHoldTime = 500;
const cluePauseTime = 100; //how long to pause in between clues
const nextClueWaitTime = 500; //how long to wait before starting playback of the clue sequence
const order = new Set();
var pattern = [1,2,3,4,5,6,7,8];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var userLives = 3;


// swap the Start and Stop buttons


function startGame(){
    //initialize game variables
    timer();
    userLives = 3;
    document.getElementById("Lives").innerHTML = "Lives : " + userLives;
    while(order.size < 8){
    order.add(Math.floor(Math.random() *8)+1);
    }
    //order.toArray(pattern);
    pattern = Array.from(order); 
    console.log(pattern);
    
    guessCounter = 0;
    progress = 0;
    gamePlaying = true;
    document.getElementById("stopBtn").classList.remove("hidden");
    document.getElementById("startBtn").classList.add("hidden");
    
    playClueSequence()
}
function stopGame(){
    //initialize game variables
    gamePlaying = false;
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 280.2,
  6: 230.9,
  7: 129.2,
  8: 158.6
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}


function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
  
}
function winGame(){
  stopGame();
  alert("Game Over. You Won.");
}

function guess(btn){
  console.log("user guessed: " + btn);
  
  if(!gamePlaying){
    return;
  }
  
  if(pattern[guessCounter] == btn){
    //Guess was correct!
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        //GAME OVER: WIN!
        winGame();
      }else{
        //Pattern correct. Add next segment
        progress++;
        playClueSequence();
      }
    }else{
      //so far so good... check the next guess
      guessCounter++;
    }
  }else{
    if(userLives <= 1){
      loseGame();
    }else{
      userLives--;
      document.getElementById("Lives").innerHTML = "Lives : " + userLives;
    }
  }
}


function timer(){
    var sec = 120;
    var timer = setInterval(function(){
        document.getElementById('time').innerHTML="Time Left : " +  sec;
        sec--;
        if (sec < 0) {
            clearInterval(timer);
            loseGame()
        }
    }, 1000);
}