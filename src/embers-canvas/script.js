const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
context.globalCompositeOperation = 'soft-light'
canvas.width = window.innerWidth
canvas.height = window.innerHeight

requestAnimationFrame = requestAnimationFrame || webkitRequestAnimationFrame

const menu = document.querySelector('.menu')
const modify = e => {
  OPTIONS[e.target.id] = parseInt(e.target.value, 10)
  if (e.target.id === 'AMOUNT') {
    context.clearRect(0, 0, canvas.width, canvas.height)
    particles = genParticles()
  }
  if (e.target.id === 'BLUR') {
    document.documentElement.style.setProperty(
      '--blur',
      parseInt(e.target.value, 10)
    )
  }
}
menu.addEventListener('change', modify)

const button = document.querySelector('button')
const handleClick = e => menu.classList.toggle('menu--open')
button.addEventListener('click', handleClick)

const OPTIONS = {
  AMOUNT: 100,
  UPPER_LIMIT: 20,
  LOWER_LIMIT: 1,
}

const UPPER_SIZE = 10
const LOWER_SIZE = 4

const doIt = () => Math.random() > 0.5
const update = p =>
  doIt()
    ? Math.max(OPTIONS.LOWER_LIMIT, p - 1)
    : Math.min(p + 1, OPTIONS.UPPER_LIMIT)
const reset = p => {
  p.x = p.startX
  p.y = p.startY
}
const floored = r => Math.floor(Math.random() * r)
const genParticles = () =>
  new Array(OPTIONS.AMOUNT).fill().map(p => {
    const size = floored(UPPER_SIZE) + LOWER_SIZE
    const c = document.createElement('canvas')
    const ctx = c.getContext('2d')
    const r = (Math.PI / 180) * floored(360)
    const color = `rgba(255,${100 +
      Math.floor(Math.random() * 70)}, 0, ${Math.random()})`
    const xDelayed = doIt()
    const startX = xDelayed
      ? -(size + floored(canvas.width))
      : floored(canvas.width * 0.25)
    const startY = xDelayed
      ? size + floored(canvas.height * 0.25) + Math.floor(canvas.height * 0.75)
      : canvas.height + size + floored(canvas.height)
    c.height = size
    c.width = size
    // ctx.filter = `blur(${Math.random() * size}px)`
    ctx.translate(size / 2, size / 2)
    ctx.rotate(r)
    ctx.translate(-(size / 2), -(size / 2))
    ctx.fillStyle = color
    ctx.fillRect(0, 0, size, size)
    return {
      x: startX,
      y: startY,
      startY,
      startX,
      c,
      r,
      vx: floored(OPTIONS.UPPER_LIMIT / 4),
      vy: floored(OPTIONS.UPPER_LIMIT / 4),
      size,
    }
  })

let particles = genParticles()
let FRAME_COUNT = 0

const draw = () => {
  if (
    canvas.width !== window.innerWidth ||
    canvas.height !== window.innerHeight
  ) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    particles = genParticles()
  }
  // context.restore()
  FRAME_COUNT++
  for (const particle of particles) {
    context.clearRect(particle.x, particle.y, particle.size, particle.size)
    if (particle.y < canvas.height || particle.startX < 0)
      particle.x += particle.vx
    if (particle.x > 0 || particle.startY > canvas.height)
      particle.y -= particle.vy
    if (FRAME_COUNT % 11 === 0 && doIt()) particle.vx = update(particle.vx)
    if (FRAME_COUNT % 13 === 0 && doIt()) particle.vy = update(particle.vy)
    context.drawImage(particle.c, particle.x, particle.y)
    // context.save()
    if (particle.x > canvas.width || particle.y < -particle.size)
      reset(particle)
  }
  requestAnimationFrame(draw)
}
requestAnimationFrame(draw)
