/**
  * Create alias for requestAnimationFrame
*/
const RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function (cb) { setTimeout(cb, 1000 / 60) }

/**
  * Initialize a canvas
*/
const BODY   = document.body
const HEIGHT = window.innerHeight / 1
const WIDTH = window.innerWidth / 1
const TOTAL = HEIGHT * WIDTH

const CANVAS = document.createElement('canvas')
CANVAS.height = HEIGHT
CANVAS.width = WIDTH
const CONTEXT = CANVAS.getContext('2d')

/**
  * Start rendering some stuff.
*/
for (let pixel = 0; pixel < TOTAL; pixel++) {
  const X = pixel % WIDTH
  const Y = Math.floor(pixel / WIDTH)
  const generateColor = () => {
    let base = Math.floor(Math.random() * 255).toString(16)
    return `#${base}${base}${base}`
  }
  const color = generateColor()
  // CONTEXT.fillStyle = `#${Math.floor(Math.random() * 16777215).toString(16)}`
  CONTEXT.fillStyle = color
  CONTEXT.fillRect(X, Y, 1, 1)
}

BODY.style.background = `url(${CANVAS.toDataURL()})`

const update = () => {
  const X = Math.floor(Math.random() * WIDTH)
  const Y = Math.floor(Math.random() * HEIGHT)
  BODY.style.backgroundPosition = `${X}px ${Y}px`
  RAF(update)
}
RAF(update)


const root = document.documentElement

const move = (e) => {
  if (e.acceleration && e.acceleration.x !== null) {
    root.style.setProperty('--translateX', e.acceleration.x)
    root.style.setProperty('--translateY', e.acceleration.y)
  } else {
    root.style.setProperty('--translateX', (e.pageX / innerWidth) - 0.5)
    root.style.setProperty('--translateY', (e.pageY / innerHeight) - 0.5)
  }
}

BODY.addEventListener('mousemove', move)
window.ondevicemotion = move
