import gsap from 'https://cdn.skypack.dev/gsap'

gsap.set('.party-set g:nth-of-type(2)', { yPercent: 100 })
gsap.set('.party-set', {
  rotate: -45,
  transformOrigin: '50% 50%',
  xPercent: 50,
})
gsap.to('.party-set g', {
  yPercent: '-=100',
  repeat: -1,
  duration: 2,
  ease: 'none',
})
// // Speech Recognition stuff

// window.SpeechRecognition =
//   window.SpeechRecognition || window.webkitSpeechRecognition

// const RECOG = new window.SpeechRecognition()
// RECOG.lang = 'en-US'
// // Continous results or not
// RECOG.continuous = true
// RECOG.interimResults = false

// const STATE = {
//   RUNNING: false,
//   ACTIVATED: false,
//   ROTATE: 0,
// }

// const START = () => {
//   if (!STATE.RUNNING) {
//     STATE.RUNNING = true
//     document.body.style.backgroundColor = 'hsl(210, 50%, 50%)'
//     RECOG.start()
//   }
// }

// const COMMANDS = {
//   PARTY: 'party',
// }
// const LISTEN_FOR_ACTIVATION = res => {
//   const TRANSCRIPT = res.results[res.results.length - 1][0].transcript
//     .toLowerCase()
//     .trim()
//   console.info(TRANSCRIPT)
//   if (STATE.ACTIVATED) {
//     if (TRANSCRIPT === COMMANDS.PARTY) {
//       PARTY.play()
//     }
//   }
//   // Listen for a keyword that we can do something with??
//   else if (TRANSCRIPT.trim() === KEYWORD) {
//     // Go into active mode
//     // On the fly change the listener???
//     STATE.ACTIVATED = true
//     document.body.style.backgroundColor = 'hsl(120, 50%, 50%)'
//     setTimeout(() => {
//       document.body.style.backgroundColor = 'hsl(210, 50%, 50%)'
//       STATE.ACTIVATED = false
//       PARTY.pause()
//     }, 10000)
//   }
// }

// const KEYWORD = 'corgi'
// RECOG.onresult = LISTEN_FOR_ACTIVATION
// RECOG.onend = () => {
//   console.info('restarting')
//   // Shouldn't end, restart.
//   // Only restart if state is still running.
//   if (STATE.RUNNING) RECOG.start()
// }
// START()
