const UPPER_LIMIT = 20
const LOWER_LIMIT = 1
const MAX_SIZE = 10
const MIN_SIZE = 2
const AMOUNT = 250
const COLOR = 0x59abe3

const { Application, Graphics } = PIXI

const floored = v => Math.floor(Math.random() * v)
const update = p =>
  Math.random() > 0.5
    ? Math.max(LOWER_LIMIT, p - 1)
    : Math.min(p + 1, UPPER_LIMIT)
const reset = p => {
  p.x = p.startX
  p.y = p.startY
}
const genParticles = t =>
  new Array(AMOUNT).fill().map(p => {
    const START_X_AXIS = Math.random() > 0.5
    const SIZE = floored(MAX_SIZE) + MIN_SIZE
    p = new PIXI.Sprite(t)
    p.vx = floored(UPPER_LIMIT / 4)
    p.vy = floored(UPPER_LIMIT / 4)
    p.x = p.startX = START_X_AXIS
      ? -(SIZE + floored(app.renderer.width))
      : floored(app.renderer.width * 0.25)
    p.y = p.startY = START_X_AXIS
      ? SIZE +
        floored(app.renderer.height * 0.25) +
        Math.floor(app.renderer.height * 0.75)
      : app.renderer.height + SIZE + floored(app.renderer.height)
    p.scale.x = (floored(MAX_SIZE) + MIN_SIZE) / 100
    p.scale.y = (floored(MAX_SIZE) + MIN_SIZE) / 100
    p.alpha = Math.random()
    p.rotation = (Math.PI / 180) * Math.floor(Math.random() * 360)
    embers.addChild(p)
    return p
  })

const app = new Application({
  antialias: true,
  transparent: true,
})

const embers = new PIXI.particles.ParticleContainer(AMOUNT, {
  scale: true,
  position: true,
  rotation: true,
  alpha: true,
})
app.stage.addChild(embers)
const p = new Graphics()
p.beginFill(COLOR)
p.drawRect(0, 0, 99, 99)
p.endFill()
const baseTexture = app.renderer.generateTexture(p)
let particles = genParticles(baseTexture)

app.ticker.add(i => {
  if (
    app.renderer.height !== innerHeight ||
    app.renderer.width !== innerWidth
  ) {
    app.renderer.resize(innerWidth, innerHeight)
    embers.removeChildren()
    particles = genParticles(baseTexture)
  }
  for (let particle of particles) {
    if (particle.y < app.renderer.height || particle.startX < 0)
      particle.x += particle.vx
    if (particle.x > 0 || particle.startY > app.renderer.height)
      particle.y -= particle.vy

    if (Math.random() > 0.9) particle.vx = update(particle.vx)
    if (Math.random() > 0.9) particle.vy = update(particle.vy)
    if (Math.random() > 0.9) particle.rotation += (Math.PI / 180) * 10

    if (particle.x > app.renderer.width || particle.y < -particle.size)
      reset(particle)
  }
})

document.body.appendChild(app.view)
