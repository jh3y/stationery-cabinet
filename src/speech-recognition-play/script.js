/* eslint-disable */
const CLEAR = document.querySelector('.clear')
const STARTER = document.querySelector('.start')
const BOX = document.querySelector('.box')
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition

const RECOG = new window.SpeechRecognition()
RECOG.lang = 'en-US'
// Continous results or not
RECOG.continuous = true
RECOG.interimResults = false

const STATE = {
  RUNNING: false,
  ACTIVATED: false,
  ROTATE: 0,
}

const START = () => {
  if (!STATE.RUNNING) {
    STATE.RUNNING = true
    document.body.style.backgroundColor = 'blue'
    RECOG.start()
  }
}

const STOP = () => {
  STATE.RUNNING = false
  const RESULTS = RECOG.stop()
  console.info(RESULTS)
  document.body.style.backgroundColor = 'white'
}

const COMMANDS = {
  SPIN: 'spin',
  COLOR: 'color',
  COLOUR: 'colour',
}
const LISTEN_FOR_ACTIVATION = res => {
  const TRANSCRIPT = res.results[res.results.length - 1][0].transcript
    .toLowerCase()
    .trim()
  console.info(TRANSCRIPT.trim(), KEYWORD)
  if (STATE.ACTIVATED) {
    if (TRANSCRIPT === COMMANDS.SPIN) {
      console.info('spin it')
      STATE.ROTATE = STATE.ROTATE + 360
      BOX.style.setProperty('--rotate', STATE.ROTATE)
    } else if (
      TRANSCRIPT.split(' ')[0] === COMMANDS.COLOR ||
      TRANSCRIPT.split(' ')[0] === COMMANDS.COLOUR
    ) {
      console.info(TRANSCRIPT.split(' '), 'COLOR')
      BOX.style.backgroundColor = TRANSCRIPT.split(' ')
        .slice(1)
        .join(' ')
    } else {
      console.info('hello', TRANSCRIPT)
    }
  }
  // Listen for a keyword that we can do something with??
  else if (TRANSCRIPT.trim() === KEYWORD) {
    // Go into active mode
    // On the fly change the listener???
    STATE.ACTIVATED = true
    document.body.style.backgroundColor = 'red'
    setTimeout(() => {
      document.body.style.backgroundColor = 'blue'
      STATE.ACTIVATED = false
    }, 5000)
  }
}

const KEYWORD = 'smithers'
RECOG.onresult = LISTEN_FOR_ACTIVATION
RECOG.onend = () => {
  console.info('restarting')
  // Shouldn't end, restart.
  // Only restart if state is still running.
  if (STATE.RUNNING) RECOG.start()
}
STARTER.addEventListener('click', START)
CLEAR.addEventListener('click', STOP)
