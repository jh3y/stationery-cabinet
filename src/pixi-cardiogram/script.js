const { Application, Graphics } = PIXI
const app = new Application({
  antialias: true,
  transparent: true,
})
const cardio = new PIXI.particles.ParticleContainer(innerWidth, {
  scale: true,
  position: true,
  alpha: true,
})
app.stage.addChild(cardio)
const p = new Graphics()
p.beginFill(0xffffff)
p.drawCircle(0, 5, 5)
p.endFill()
const baseTexture = app.renderer.generateTexture(p)
const initParticles = (ps) => {
  for (let particle of ps) {
    particle.x = 0
    particle.y = innerHeight / 2
  }
}
let particles = new Array(innerWidth * 1.5).fill().map((p, i) => {
  p = new PIXI.Sprite(baseTexture)
  p.tint = i === 0 ? 0xffffff : 0xff0000
  cardio.addChild(p)
  return p
})
initParticles(particles)

// const leader = new Graphics()
// leader.beginFill(0xffffff)
// leader.drawCircle(0, 5, 5)
// leader.endFill()
// leader.x = 0
// leader.y = innerHeight / 2
// leader.filters = [new PIXI.filters.DropShadowFilter({
//   color: 0xffffff,
//   alpha: 0.75,
//   distance: 0,
//   rotation: 45,
// })]
// app.stage.addChild(leader)
app.ticker.add(i => {
  if (
    app.renderer.height !== innerHeight ||
    app.renderer.width !== innerWidth
  ) {
    app.renderer.resize(innerWidth, innerHeight)
    // app.renderer.clear()
  }
  particles[0].x += 1
  if (particles[0].x > innerWidth) particles[0].x = 0
  // leader.x +=1
  // particles[leader.x].x = leader.x - 10
  // for (let particle of particles) {
  //   if (particle.x < (leader.x - 200)) particle.x = 0
  //   if (particle.x < ((leader.x - 100))) particle.alpha = 0.5
  // }
  // if (leader.x > innerWidth) leader.x = 0
})

document.body.appendChild(app.view)