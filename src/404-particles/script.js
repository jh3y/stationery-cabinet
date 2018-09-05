const {
  PIXI: {
    Application,
    particles: { ParticleContainer },
    Sprite,
  },
} = window
let FONT_SIZE = innerHeight / 10
const FRACTION = 0.3
const PARTICLE_CONTAINER_OPTS = {
  scale: true,
  position: true,
  alpha: true,
}
const getHeight = () => Math.floor(innerHeight * FRACTION)
const view = document.querySelector('canvas')
const AMOUNT = 50
const onTick = () => {
  if (
    App.renderer.width !== innerWidth ||
    App.renderer.height !== getHeight()
  ) {
    App.renderer.resize(innerWidth, getHeight())
    Fours.removeChildren()
    Ohhhs.removeChildren()
    Page.removeChildren()
    FONT_SIZE = innerHeight / 10
    bootstrapLayers()
  }
  for (const p of [...Fours.children, ...Ohhhs.children, ...Page.children]) {
    p.x -= p.vx
    if (p.x < -(p.width)) {
      p.x = p.startingX
    }
  }
}

const App = new Application({
  antialias: true,
  height: getHeight(),
  transparent: true,
  view,
  width: innerWidth,
})

const createText = (text, opts = {height: FONT_SIZE * 2, width: FONT_SIZE * 2}) => {
  const canvas = document.createElement('canvas')
  canvas.width = opts.width
  canvas.height = opts.height
  const context = canvas.getContext('2d')
  context.font = `${Math.floor(innerHeight / 10)}px Roboto`
  context.fillStyle = '#ffffff'
  context.fillText(text, FONT_SIZE, FONT_SIZE)
  return canvas
}

const addParticles = (amount, container, text) => {
  new Array(amount).fill().map(p => {
    p = new Sprite.from(text)
    p.vx = (Math.random() * 4) + 1
    // p.x = p.startingX = -(Math.floor(Math.random() * ((innerWidth * 2) - (text.width * 2))) + (text.width * 2))
    p.x = p.startingX = innerWidth + (Math.floor(Math.random() * ((innerWidth * 2) - (text.width * 2))) + (text.width * 2))
    p.y = Math.floor(Math.random() * (getHeight() - FONT_SIZE))
    p.scale.x = p.scale.y = (Math.random() * (50) + 50) / 100
    p.alpha = (Math.random() * 50) / 100
    container.addChild(p)
  })
}

const bootstrapLayers = () => {
  addParticles(Math.floor(innerWidth / 10), Fours, createText('4'))
  addParticles(Math.floor(innerWidth / 10), Ohhhs, createText('0'))
  addParticles(Math.floor(innerWidth / 50), Page, createText('Page not found', {height: FONT_SIZE * 2, width: 650}))
}

const Fours = new ParticleContainer(Math.floor(innerWidth / 10), PARTICLE_CONTAINER_OPTS)
const Ohhhs = new ParticleContainer(Math.floor(innerWidth / 10), PARTICLE_CONTAINER_OPTS)
const Page = new ParticleContainer(Math.floor(innerWidth / 50), PARTICLE_CONTAINER_OPTS)
bootstrapLayers()

App.stage.addChild(Fours)
App.stage.addChild(Ohhhs)
App.stage.addChild(Page)
App.ticker.add(onTick)
