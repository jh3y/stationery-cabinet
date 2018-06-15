const { Application, Graphics } = PIXI

var app = new Application({
  antialias: true,
  transparent: true,
})
document.body.appendChild(app.view)

const UPPER_LIMIT_Y = 20
const UPPER_LIMIT_X = 2
const LOWER_LIMIT_X = -2
const MAX_SIZE = 6
const MIN_SIZE = 2
const AMOUNT = 250
const COLOR = 0xffffff

const floored = v => Math.floor(Math.random() * v)
const update = p =>
  Math.random() > 0.5
    ? Math.max(LOWER_LIMIT_X, p - 1)
    : Math.min(p + 1, UPPER_LIMIT_X)

const reset = p => {
  p.x = floored(app.renderer.width)
  p.y = -(p.size + floored(app.renderer.height))
}

const genParticles = () => new Array(AMOUNT).fill().map(p => {
  const START_X_AXIS = Math.random() > 0.5
  const SIZE = floored(MAX_SIZE) + MIN_SIZE
  p = new Graphics()
  p.beginFill(COLOR, Math.random())
  p.drawCircle(0, 0, SIZE)
  p.endFill()
  p.size = SIZE
  p.vx = floored(UPPER_LIMIT_X) - UPPER_LIMIT_X
  p.vy = floored(UPPER_LIMIT_Y)
  p.x = p.startX = floored(app.renderer.width)
  p.y = p.startY = -(SIZE + floored(app.renderer.height))
  app.stage.addChild(p)
  return p
})

let particles = genParticles()

app.stage.filters = [new PIXI.filters.BlurFilter(3)]
app.ticker.add(i => {
  if (app.renderer.height !== innerHeight || app.renderer.width !== innerWidth) {
    app.renderer.resize(innerWidth, innerHeight)
    app.stage.removeChildren()
    app.renderer.clear()
    particles = genParticles()
  }
  for (let particle of particles) {
    if (particle.y > 0)
      particle.x += particle.vx
    particle.y += particle.vy

    if (Math.random() > 0.9) particle.vx = update(particle.vx)
    if (Math.random() > 0.9) particle.vy = Math.min(particle.vy + 1, UPPER_LIMIT_Y)

    if (particle.x > app.renderer.width || particle.x < 0 || particle.y > app.renderer.height)
      reset(particle)
  }
})
