const {
  PIXI: {
    Application,
    particles: { ParticleContainer },
    Sprite,
  },
  innerHeight,
  innerWidth,
} = window
const PARTICLE_CONTAINER_OPTS = {
  scale: true,
  position: true,
  alpha: true,
}

const view = document.querySelector('canvas')
const AMOUNT = 10
const onTick = () => {
  if (
    App.renderer.width !== innerWidth ||
    App.renderer.height !== innerHeight
  ) {
    App.renderer.resize(innerWidth, innerHeight)
    Fours.removeChildren()
    Ohhhs.removeChildren()
  }
}

const App = new Application({
  antialias: true,
  height: innerHeight,
  transparent: true,
  view,
  width: innerWidth,
})

const addParticles = (amount, container, text) => {
  new Array(amount).fill().map(p => {
    p = new Sprite.from(text)
    p.x = Math.floor(Math.random() * innerWidth)
    p.y = Math.floor(Math.random() * innerHeight)
    container.addChild(p)
  })
}

const Fours = new ParticleContainer(AMOUNT, PARTICLE_CONTAINER_OPTS)
const Ohhhs = new ParticleContainer(AMOUNT, PARTICLE_CONTAINER_OPTS)
addParticles(AMOUNT, Fours, '4')

App.stage.addChild(Fours)
App.stage.addChild(Ohhhs)
App.ticker.add(onTick)
