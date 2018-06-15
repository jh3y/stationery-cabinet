const { Application, Graphics } = PIXI
// App constraints
const UPPER_LIMIT_Y = 10
const UPPER_LIMIT_X = 2
const LOWER_LIMIT_X = -2
const MAX_SIZE = 6
const MIN_SIZE = 2
const AMOUNT = 1000
const COLOR = 0xffffff

const getRandomColor = () =>
  [0xf22613, 0xf9690e, 0xf9bf3b, 0x2ecc71, 0x19b5fe, 0x663399, 0x947cb0][
    Math.floor(Math.random() * 7)
  ]
const floored = v => Math.floor(Math.random() * v)
// Update value by either subtracting to adding
const update = p =>
  Math.random() > 0.5
    ? Math.max(LOWER_LIMIT_X, p - 1)
    : Math.min(p + 1, UPPER_LIMIT_X)
// Reset particle start points based on screen
const reset = p => {
  p.x = floored(app.renderer.width)
  p.y = -(p.size + floored(app.renderer.height))
  p.vy = floored(UPPER_LIMIT_Y) + 2
}
// Generate a particle set based on a given texture
const genParticles = (t) =>
  new Array(AMOUNT).fill().map(p => {
    const SIZE = floored(MAX_SIZE) + MIN_SIZE
    p = new PIXI.Sprite(t)
    p.size = SIZE
    p.vx = floored(UPPER_LIMIT_X) - UPPER_LIMIT_X
    p.vy = floored(UPPER_LIMIT_Y) + 2
    p.alpha = Math.random()
    p.x = p.startX = floored(app.renderer.width)
    p.y = p.startY = -(SIZE + floored(app.renderer.height))
    p.width = p.height = SIZE
    // p.scale.x = 5
    p.tint = getRandomColor()
    drops.addChild(p)
    return p
  })


// Create app instance
const app = new Application({
  antialias: true,
  transparent: true,
})

// Create particle container
const drops = new PIXI.particles.ParticleContainer(AMOUNT, {
  scale: true,
  position: true,
  rotation: true,
  alpha: true,
})
// Add container to app stage
app.stage.addChild(drops)
// Create a base graphic for our sprites
const p = new Graphics()
p.beginFill(COLOR)
p.drawCircle(0, 0, 100)
p.endFill()
// Generate a base texture from the base graphic
const baseTexture = app.renderer.generateTexture(p)
let particles = genParticles(baseTexture)
app.ticker.add(i => {
  if (
    app.renderer.height !== innerHeight ||
    app.renderer.width !== innerWidth
  ) {
    app.renderer.resize(innerWidth, innerHeight)
    drops.removeChildren()
    particles = genParticles(baseTexture)
  }
  for (let particle of particles) {
    if (particle.y > 0) particle.x += particle.vx
    particle.y += particle.vy

    if (Math.random() > 0.9) particle.vx = update(particle.vx)
    // if (Math.random() > 0.9) particle.vy = Math.min(particle.vy + 1, UPPER_LIMIT_Y)
    if (
      particle.x > app.renderer.width ||
      particle.x < 0 ||
      particle.y > app.renderer.height
    )
      reset(particle)
  }
  app.renderer.render(drops)
})
document.body.appendChild(app.view)

// Hook up blur modifier
const input = document.querySelector('input')
input.addEventListener('change', e => {
  document.documentElement.style.setProperty('--blur', e.target.value)
})
