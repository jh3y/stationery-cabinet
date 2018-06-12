const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const floored = (r) => Math.floor(Math.random() * r)
const UPPER_LIMIT = 5
const particles = new Array(20).fill().map((p) => {
  let y = floored(canvas.height)
  return {
    x: -10,
    y,
    vx: floored(UPPER_LIMIT) + 1,
    vy: -(floored(UPPER_LIMIT) + 1),
    travel: 100,
    size: (floored(Math.random() * (window.innerHeight * 0.01))) + 10,
    start: y,
    color: `rgba(${floored(255)},${floored(255)}, ${floored(255)}, ${Math.random()})`
  }
})
let FRAME_COUNT = 0
const draw = () => {
  if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  // context.fillStyle = 'black'
  // context.fillRect(0, 0, canvas.width, canvas.height)
  for (const particle of particles) {
    context.fillStyle = particle.color
    particle.x += particle.vx
    particle.y += particle.vy
    FRAME_COUNT++
    if (FRAME_COUNT % 11 === 0 && Math.random() > 0.5) {
      particle.vx = Math.random() > 0.5 ? Math.max(1, particle.vx - 1) : Math.min(particle.vx + 1, 5)
    }
    if (FRAME_COUNT % 13 === 0 && Math.random() > 0.5) {
      particle.vy = Math.random() > 0.5 ? Math.max(-5, particle.vy - 1) : Math.min(particle.vy + 1, -1)
    }
    if (particle.x > canvas.width) particle.x = 0
    if (particle.y < 0) particle.y = canvas.height + 10
    context.fillRect(particle.x, particle.y, particle.size, particle.size)
  }
  requestAnimationFrame(draw)
}
requestAnimationFrame(draw)