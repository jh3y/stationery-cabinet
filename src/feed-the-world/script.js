import gsap from 'https://cdn.skypack.dev/gsap'

const CHUNK = 1000

gsap.set(['.globe__mouth', '.globe__eyes'], { transformOrigin: '50% 50%' })
const UPDATE_FEATURES = ({ x, y }) => {
  const newX = gsap.utils.mapRange(0, window.innerWidth, -5, 5, x)
  const newY = gsap.utils.mapRange(0, window.innerHeight, -5, 5, y)
  gsap.set('.globe__face', {
    x: newX,
    y: newY,
  })
}

const BLINK = () => {
  const delay = gsap.utils.random(1, 5)
  gsap.to('.globe__eyes', {
    delay,
    scaleY: 0.1,
    repeat: 3,
    yoyo: true,
    duration: 0.05,
    onComplete: () => {
      BLINK()
    },
  })
}
BLINK()
window.addEventListener('pointermove', UPDATE_FEATURES)

const POPULATE_FOOD = () => {
  const ITEM = document.createElement('div')
  ITEM.className = 'food'
  ITEM.style.setProperty(
    '--x',
    gsap.utils.random(window.innerWidth * 0.25, window.innerWidth * 0.75)
  )
  ITEM.style.setProperty(
    '--y',
    gsap.utils.random(window.innerHeight * 0.25, window.innerHeight * 0.75)
  )
  document.body.appendChild(ITEM)
}
for (let i = 0; i < 5; i++) {
  POPULATE_FOOD()
}
// Start YouTube Embed Code

// YouTube Video ID
const videoId = '8NLLAeNhH3k'

const TIMER_LABEL = document.querySelector('h1')
const REDUCER_LABEL = document.querySelector('h2')

const STATE = {
  PLAYING: false,
  TIMER: 0,
  TIMEOUT: null,
  REDUCER: null,
}

const shutOff = () => {
  window.PLAYER.pauseVideo()
  STATE.PLAYING = false
  STATE.TIMER = 0
  STATE.TIMEOUT = null
  TIMER_LABEL.innerText = REDUCER_LABEL.innerText = 0
  if (STATE.REDUCER) clearInterval(STATE.REDUCER)
  STATE.REDUCER = null
}

const UPDATE = () => {
  STATE.TIMER -= 10
  REDUCER_LABEL.innerText = STATE.TIMER
}
const topUp = () => {
  STATE.PLAYING = true
  window.PLAYER.playVideo()
  STATE.TIMER += CHUNK
  TIMER_LABEL.innerText = STATE.TIMER
  if (STATE.TIMEOUT) clearTimeout(STATE.TIMEOUT)
  STATE.TIMEOUT = setTimeout(shutOff, STATE.TIMER)
  if (!STATE.REDUCER) STATE.REDUCER = setInterval(UPDATE, 10)
  // window.PLAYER[`${STATE.PLAYING ? 'pause' : 'play'}Video`]()
}

const onReady = () => {
  // Mute the player by default/for streaming
  // TODO: Remove!
  // window.PLAYER.mute()
  // seekTo can skip to miss the gap at the start
  window.PLAYER.seekTo(10)
  // Pause it as seek starts playing
  window.PLAYER.pauseVideo()
  // Bind event listeners
  window.addEventListener('click', topUp)
}
const onStateChange = e => {
  // Track has ended
  if (e.data === 0) {
    window.PLAYER.seekTo(10)
    window.PLAYER.pauseVideo()
    STATE.PLAYING = false
  }
}
// console.info(YT)
// window.onYouTubeIframeAPIReady = () => {
// console.info('hello')
window.PLAYER = new window.YT.Player('player', {
  height: 200,
  width: 200,
  videoId,
  events: {
    onReady,
    onStateChange,
  },
})
// }
