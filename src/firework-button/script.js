import gsap from 'https://cdn.skypack.dev/gsap'

window.__GSAP = gsap

let fireworks = []

const RENDER = CONTEXT => firework => {
  CONTEXT.fillStyle = 'red'
  CONTEXT.fillRect(firework.x, firework.y, 10, 10)
}

const DRAW = ({ CONTEXT, CANVAS, RENDER }) => () => {
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)
  fireworks.forEach(RENDER(CONTEXT))
}

const DEFAULT_CONFIG = {
  // Spread, sizes, colors, how many there are, etc.
  // Callbacks. On Fire, on Burst, on End?
}

// Click this button... And then...
const FIRE = (CONFIG) => {
  /**
   * 1. Create a canvas. And it needs to be full screen.
   * But, it needs to be position absolute.
   */
  const CANVAS = document.createElement('canvas')
  const CONTEXT = CANVAS.getContext('2d')
  CANVAS.height = CANVAS.style.offsetHeight = window.innerHeight
  CANVAS.width = CANVAS.style.offsetWidth = window.innerWidth
  CANVAS.style.top = document.body.scrollTop
  document.body.appendChild(CANVAS)

  /**
   * 2. Kick off the ticker that handles drawing.
   */
  const RENDERER = DRAW({ CANVAS, CONTEXT, RENDER })
  gsap.ticker.add(RENDERER)

  const newFirework = {
    alive: true,
    // This position needs to calculate either from config
    // Or where element is clicked? Account for page scroll.
    x: CANVAS.width / 2 - 5,
    y: CANVAS.height,
  }
  fireworks.push(newFirework)
  // Update values with GreenSock here.
  gsap.to(newFirework, {
    x: CANVAS.width / 2 - 5,
    y: CANVAS.height / 2,
    ease: 'power4.out',
    onComplete: () => {
      CANVAS.remove()
      gsap.ticker.remove(RENDERER)
      newFirework.alive = false
      fireworks.splice(fireworks.indexOf(newFirework), 1)
    },
    duration: 10,
  })
}

document.addEventListener('click', () => FIRE(DEFAULT_CONFIG))
