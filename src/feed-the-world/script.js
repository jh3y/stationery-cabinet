// const IFRAME = document.querySelector('iframe')
const ID = '8NLLAeNhH3k'
// let time = 13
// const CHUNK = 5000
// let timer
// window.addEventListener('click', () => {
//   // console.info(timer, time)
//   if (!timer)
//     IFRAME.setAttribute(
//       'src',
//       `https://www.youtube.com/embed/8NLLAeNhH3k?start=${time}&autoplay=1`
//     )
//   clearTimeout(timer)
//   timer = null
//   time += 1
//   timer = setTimeout(() => {
//     IFRAME.removeAttribute('src')
//     timer = null
//     time += (CHUNK / 1000)
//   }, CHUNK)
// })

// console.info(YT)

const STATE = {
  PLAYING: false,
}
const onReady = () => {
  // console.info(window.PLAYER, 'READY')
  // console.info(player.playVideo)
  // window.PLAYER.playVideo()
  // seekTo can skip to miss the gap at the start
  window.PLAYER.seekTo(10)
  window.PLAYER.pauseVideo()
}
const onStateChange = e => {
  // console.info(window.PLAYER, e, 'change')
  if (e.data === 0) {
    // Track has ended
    window.PLAYER.seekTo(10)
    window.PLAYER.pauseVideo()
    STATE.PLAYING = false
  }
}
window.onYouTubeIframeAPIReady = () => {
  // console.info('RUN THIS')
  window.PLAYER = new window.YT.Player('player', {
    height: 200,
    width: 200,
    videoId: ID,
    startSeconds: 5,
    loop: true,
    events: {
      onReady,
      onStateChange,
    },
  })
  window.addEventListener('click', () => {
    STATE.PLAYING = !STATE.PLAYING
    if (STATE.PLAYING) window.PLAYER.playVideo()
    else window.PLAYER.pauseVideo()
  })
}
