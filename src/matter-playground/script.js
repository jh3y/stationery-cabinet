// Let's make something cool!
const {
  _: { debounce },
  Matter: { Body, Render, Engine, World, Bodies, Events },
  gsap: {
    utils: { random },
    to,
  },
} = window
// eslint-disable-next-line
console.clear()

const ORIGINAL_SIZE = 76
const TEXTURES = [
  'https://assets.codepen.io/605876/bear--default-badge-large.png',
  'https://assets.codepen.io/605876/bear--gold-badge--large.png',
  'https://assets.codepen.io/605876/bear--silver-badge--large.png',
  'https://assets.codepen.io/605876/bear-bronze-badge-large.png',
  'https://assets.codepen.io/605876/bear-emerald-badge-large.png',
  'https://assets.codepen.io/605876/bear-purple-badge-large.png',
]

const canvas = document.querySelector('canvas')

const engine = Engine.create({
  enableSleeping: true,
})

const render = Render.create({
  element: document.body,
  canvas,
  engine: engine,
  options: {
    background: 'transparent',
    wireframeBackground: 'transparent',
    wireframes: false,
    width: window.innerWidth,
    height: window.innerHeight,
  },
})

// Create the ground
const ground = Bodies.rectangle(0, window.innerHeight - 10, 10000, 1, {
  isStatic: true,
  render: {
    opacity: 0,
  },
})

// add all of the bodies to the world
World.add(engine.world, [ground])

// run the engine
Engine.run(engine)

// run the renderer
Render.run(render)

const addBear = textureIndex => {
  const HEADS = []
  const amount = Math.floor(random(1, 10))
  for (let h = 0; h < amount; h++) {
    const SIZE = random(25, 76)
    const HEAD = Bodies.rectangle(
      random(0, window.innerWidth),
      -100,
      SIZE,
      SIZE,
      {
        angle: random(0, 360) * (Math.PI / 180),
        render: {
          strokeStyle: '#ffffff',
          sprite: {
            texture:
              TEXTURES[
                textureIndex !== undefined
                  ? textureIndex
                  : Math.floor(random(0, TEXTURES.length))
              ],
            xScale: SIZE / ORIGINAL_SIZE,
            yScale: SIZE / ORIGINAL_SIZE,
          },
        },
      }
    )
    if (Math.random() > 0.5)
      to(HEAD, {
        angle: `${Math.random() > 0.5 ? '-' : '+'}=${(360 * Math.PI) / 180}`,
        repeat: -1,
        duration: random(0.2, 2),
      })
    Events.on(HEAD, 'sleepStart', () => {
      World.remove(engine.world, HEAD)
    })
    HEADS.push(HEAD)
  }
  World.add(engine.world, HEADS)
}

const mixed = () => addBear()
// const bear = () => addBear(0)
// const golden = () => addBear(1)
// const silver = () => addBear(2)
// const bronze = () => addBear(3)
// const green = () => addBear(4)
// const purpleRain = () => addBear(5)
// const clear = () => World.clear(engine.world, true)

document.body.addEventListener('click', mixed)
window.addEventListener(
  'resize',
  debounce(() => {
    World.clear(engine.world, true)
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    Body.setPosition(ground, {
      x: 0,
      y: window.innerHeight - 10,
    })
  }, 500)
)
