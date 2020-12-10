import gsap from 'https://cdn.skypack.dev/gsap'

const {
  timeline,
  set,
  utils: { mapRange },
} = gsap

const BOUND = 10

const moveEyes = ({ x, y }) => {
  const newX = mapRange(0, window.innerWidth, -BOUND, BOUND, x)
  const newY = mapRange(0, window.innerHeight, -BOUND, BOUND, y)
  set('.peep__eyes', { x: newX, y: newY })
}

set('.peep__party', {
  xPercent: -50,
  rotate: -45,
  yPercent: 20,
})

set('.peep', { display: 'block' })

const PARTY = timeline({ paused: true }).to('#lines', {
  yPercent: -100,
  repeat: -1,
  duration: 0.5,
  ease: 'none',
})

window.addEventListener('pointermove', moveEyes)

// Speech Recognition stuff

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
    document.body.style.backgroundColor = 'hsl(210, 50%, 50%)'
    RECOG.start()
  }
}

const COMMANDS = {
  PARTY: 'party',
}
const LISTEN_FOR_ACTIVATION = res => {
  const TRANSCRIPT = res.results[res.results.length - 1][0].transcript
    .toLowerCase()
    .trim()
  // console.info(TRANSCRIPT)
  if (STATE.ACTIVATED) {
    if (TRANSCRIPT === COMMANDS.PARTY) {
      PARTY.play()
    }
  }
  // Listen for a keyword that we can do something with??
  else if (TRANSCRIPT.trim() === KEYWORD) {
    // Go into active mode
    // On the fly change the listener???
    STATE.ACTIVATED = true
    document.body.style.backgroundColor = 'hsl(120, 50%, 50%)'
    setTimeout(() => {
      document.body.style.backgroundColor = 'hsl(210, 50%, 50%)'
      STATE.ACTIVATED = false
      PARTY.pause()
    }, 10000)
  }
}

const KEYWORD = 'corgi'
RECOG.onresult = LISTEN_FOR_ACTIVATION
RECOG.onend = () => {
  // console.info('restarting')
  // Shouldn't end, restart.
  // Only restart if state is still running.
  if (STATE.RUNNING) RECOG.start()
}
START()
