import gsap from 'https://cdn.skypack.dev/gsap'

const CANVAS = document.querySelector('canvas')
const CONTEXT = CANVAS.getContext('2d')

CANVAS.width = 300
CANVAS.height = 300

class Firework {
  constructor() {

  }
}

let fireworks = []

const RENDER = (firework) => {
  CONTEXT.fillStyle = 'red'
  CONTEXT.fillRect(firework.x, firework.y, 10, 10)
}

const DRAW = () => {
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)
  fireworks.forEach(RENDER)
}

gsap.ticker.add(DRAW)

const FIRE = () => {
  const newFirework = {
    alive: true,
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
      newFirework.alive = false
      fireworks.splice(fireworks.indexOf(newFirework), 1)
    },
    duration: 1,
  })
}

document.addEventListener('click', FIRE)