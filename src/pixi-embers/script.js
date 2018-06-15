const { Application, Graphics } = PIXI

var app = new Application({
  antialias: true,
  transparent: true,
})
document.body.appendChild(app.view)

const UPPER_LIMIT = 20
const LOWER_LIMIT = 1
const MAX_SIZE = 10
const MIN_SIZE = 2
const AMOUNT = 250
const COLOR = 0x59abe3

const floored = v => Math.floor(Math.random() * v)
const update = p =>
  Math.random() > 0.5
    ? Math.max(LOWER_LIMIT, p - 1)
    : Math.min(p + 1, UPPER_LIMIT)
const reset = p => {
  p.x = p.startX
  p.y = p.startY
}
const genParticles = () => new Array(AMOUNT).fill().map(p => {
  const START_X_AXIS = Math.random() > 0.5
  const SIZE = floored(MAX_SIZE) + MIN_SIZE
  p = new Graphics()
  p.beginFill(COLOR, Math.random())
  p.drawCircle(0, 0, SIZE)
  p.endFill()
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
    if (particle.y < app.renderer.height || particle.startX < 0)
      particle.x += particle.vx
    if (particle.x > 0 || particle.startY > app.renderer.height)
      particle.y -= particle.vy

    if (Math.random() > 0.9) particle.vx = update(particle.vx)
    if (Math.random() > 0.9) particle.vy = update(particle.vy)

    if (particle.x > app.renderer.width || particle.y < -particle.size)
      reset(particle)
  }
})
