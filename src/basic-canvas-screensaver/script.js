const CANVAS = document.querySelector('canvas')
const CONTEXT = CANVAS.getContext('2d')
let RUN = false
let PARTICLES

const DRAW = () => {
  if (RUN) {
    CONTEXT.clearRect(0, 0, window.innerWidth, window.innerHeight)
    PARTICLES.forEach(p => {
      CONTEXT.fillStyle = `hsla(0, 0%, 100%, ${p.o})`
      p.x += Math.cos(p.a) + p.s
      p.y += Math.sin(p.a) + p.s
      if (p.x > window.innerWidth) p.x = 0
      if (p.x < 0) p.x = window.innerWidth
      if (p.y > window.innerHeight) p.y = 0
      if (p.y < 0) p.y = window.innerHeight
      CONTEXT.fillRect(p.x, p.y, p.d, p.d)
    })
    requestAnimationFrame(DRAW)
  }
}

const BUTTON = document.querySelector('button')
BUTTON.addEventListener('click', () => CANVAS.requestFullscreen())

document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    setTimeout(() => {
      CANVAS.width = CONTEXT.width = window.innerWidth
      CANVAS.height = CONTEXT.height = window.innerHeight
      PARTICLES = new Array(150).fill().map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        a: Math.random() * (Math.PI * 2),
        s: Math.random() * 10,
        d: Math.random() * 5,
        o: Math.random(),
      }))
      document.addEventListener('pointermove', document.exitFullscreen)
      RUN = true
      DRAW()
    }, 1000)
  } else {
    document.removeEventListener('pointermove', document.exitFullscreen)
    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.width)
    RUN = false
  }
})
