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
  STATE.TIMER += 1000
  TIMER_LABEL.innerText = STATE.TIMER
  if (STATE.TIMEOUT) clearTimeout(STATE.TIMEOUT)
  STATE.TIMEOUT = setTimeout(shutOff, STATE.TIMER)
  if (!STATE.REDUCER) STATE.REDUCER = setInterval(UPDATE, 10)
  // window.PLAYER[`${STATE.PLAYING ? 'pause' : 'play'}Video`]()
}

const onReady = () => {
  // Mute the player by default/for streaming
  // TODO: Remove!
  window.PLAYER.mute()
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
window.onYouTubeIframeAPIReady = () => {
  window.PLAYER = new window.YT.Player('player', {
    height: 200,
    width: 200,
    videoId,
    events: {
      onReady,
      onStateChange,
    },
  })
}
