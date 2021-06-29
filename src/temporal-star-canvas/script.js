import gsap from 'https://cdn.skypack.dev/gsap'

let stars

const PROXIMITY = 100
const STAR_COUNT = 1000
const CANVAS = document.querySelector('canvas')
const CONTEXT = CANVAS.getContext('2d')

const SCALE_RANGER = gsap.utils.mapRange(0, PROXIMITY, 4, 1)
const ALPHA_RANGER = gsap.utils.mapRange(0, PROXIMITY, 1, 0.25)
const LOAD = () => {
  CANVAS.width = window.innerWidth
  CANVAS.height = window.innerHeight
  stars = new Array(STAR_COUNT).fill().map(() => ({
    x: gsap.utils.random(0, window.innerWidth),
    y: gsap.utils.random(0, window.innerHeight),
    size: gsap.utils.random(1, 3),
    hue: gsap.utils.random(0, 359),
    scale: 1,
    alpha: 0.3,
  }))
}

document.addEventListener('pointermove', ({ x, y }) => {
  for (const STAR of stars) {
    const DISTANCE = Math.sqrt(
      Math.pow(STAR.x - x, 2) + Math.pow(STAR.y - y, 2)
    )
    gsap.to(STAR, {
      scale: SCALE_RANGER(Math.min(DISTANCE, PROXIMITY)),
      alpha: ALPHA_RANGER(Math.min(DISTANCE, PROXIMITY)),
    })
  }
})

const renderer = () => {
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)
  for (const STAR of stars) {
    CONTEXT.fillStyle = `hsla(${STAR.hue}, 80%, 50%, ${STAR.alpha})`
    CONTEXT.beginPath()
    CONTEXT.arc(STAR.x, STAR.y, STAR.size * STAR.scale, 0, 2 * Math.PI)
    CONTEXT.fill()
  }
}

gsap.ticker.add(renderer)
gsap.ticker.fps(24)

LOAD()

window.addEventListener('resize', () => {
  LOAD()
})
