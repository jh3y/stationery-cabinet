const {
  Zdog: { Cylinder, Anchor, Illustration, TAU, Shape, Ellipse, Hemisphere },
  TweenMax,
  Power0,
} = window

const LOW = 2
const HIGH = 8
const STAR_COUNT = 50
const DIAMETER = 70
const SHIP_COLOR = '#fafafa'
const LENGTH = 150
const Scene = new Illustration({
  element: 'canvas',
  dragRotate: true,
  resize: 'fullscreen',
  rotate: {
    y: TAU * 0.05,
    x: TAU * 0.05,
  },
})

const randomInRange = (max, min) =>
  Math.floor(Math.random() * (max - min)) + min

const startStar = (STAR, reset) => {
  if (reset) TweenMax.set(STAR.translate, { y: -window.innerHeight * 0.75 })
  TweenMax.to(STAR.translate, randomInRange(LOW, HIGH), {
    y: window.innerHeight,
    onComplete: () => startStar(STAR, true),
    ease: Power0.easeNone,
  })
}

new Array(STAR_COUNT).fill().map(() => {
  startStar(
    new Shape({
      addTo: Scene,
      stroke: randomInRange(2, 10),
      color: `rgba(255, 255, 255, ${Math.random()})`,
      translate: {
        x: randomInRange(window.innerWidth * -0.5, window.innerWidth * 0.5),
        y: randomInRange(-window.innerHeight * 0.75, window.innerHeight * 0.5),
        z: randomInRange(window.innerWidth * -0.5, window.innerWidth * 0.5),
      },
    }),
    false
  )
})

const update = () => {
  Scene.rotate.y += 0.001
  Scene.updateRenderGraph()
  requestAnimationFrame(update)
}

const main = new Cylinder({
  addTo: Scene,
  length: LENGTH,
  diameter: DIAMETER,
  rotate: {
    x: TAU / 4,
  },
  stroke: false,
  color: SHIP_COLOR,
})

new Shape({
  addTo: main,
  color: 'silver',
  stroke: 5,
  fill: true,
  path: [
    {
      z: 20,
      y: 0,
    },
    {
      y: DIAMETER * 0.5,
      z: -30,
    },
    {
      y: 0,
      z: -30,
    },
  ],
  translate: {
    z: -40,
    y: DIAMETER / 2,
  },
})

new Ellipse({
  addTo: main,
  width: DIAMETER,
  height: DIAMETER,
  color: 'dodgerblue',
  quarters: 1,
  stroke: 10,
  translate: {
    z: 60,
    y: 5,
  },
  rotate: {
    z: TAU / 2.65,
  },
})

new Hemisphere({
  addTo: main,
  diameter: DIAMETER,
  color: '#333',
  translate: {
    x: 0,
    y: 0,
    z: LENGTH / 2,
  },
})

const RADIUS = 20
const ROCKET_DIAMETER = DIAMETER * 0.75
const bottomAnchor = new Anchor({
  addTo: Scene,
  translate: {
    x: -RADIUS,
    y: 90,
    z: RADIUS,
  },
})
new Cylinder({
  addTo: bottomAnchor,
  diameter: ROCKET_DIAMETER,
  length: LENGTH * 0.15,
  stroke: false,
  color: '#333',
  rotate: {
    x: TAU / 4,
  },
})
new Hemisphere({
  addTo: bottomAnchor,
  diameter: ROCKET_DIAMETER,
  color: SHIP_COLOR,
  rotate: {
    x: TAU / 4,
  },
  translate: {
    y: -DIAMETER * 0.15,
  },
})

new Ellipse({
  addTo: bottomAnchor,
  diameter: ROCKET_DIAMETER * 0.5,
  stroke: 5,
  fill: true,
  color: 'orange',
  rotate: {
    x: TAU / 4,
  },
  translate: {
    y: 15,
  },
})

bottomAnchor.copyGraph({
  translate: {
    ...bottomAnchor.translate,
    x: RADIUS,
  },
})

bottomAnchor.copyGraph({
  translate: {
    ...bottomAnchor.translate,
    z: -RADIUS,
  },
})

bottomAnchor.copyGraph({
  translate: {
    ...bottomAnchor.translate,
    x: RADIUS,
    z: -RADIUS,
  },
})

const wings = new Shape({
  addTo: Scene,
  stroke: 10,
  color: 'silver',
  fill: true,
  translate: {
    z: DIAMETER / -2 - 5,
  },
  path: [
    {
      x: DIAMETER * 0.25,
      y: -60,
    },
    {
      x: DIAMETER * -0.25,
      y: -60,
    },
    {
      x: DIAMETER * -0.75,
      y: 20,
    },
    {
      x: -100,
      y: LENGTH / 2 - 10,
    },
    {
      x: 100,
      y: LENGTH / 2 - 10,
    },
    {
      x: DIAMETER * 0.75,
      y: 20,
    },
  ],
})

new Ellipse({
  addTo: wings,
  diameter: 15,
  fill: true,
  stroke: 2,
  color: '#e74c3c',
  backface: 'silver',
  translate: {
    x: 50,
    y: 50,
    z: 4,
  },
})

update()
