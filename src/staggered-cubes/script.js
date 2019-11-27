const { Zdog, gsap, dat } = window
const { timeline, to } = gsap
const { Illustration, Anchor, Rect, TAU } = Zdog

const CONFIG = {
  AMOUNT: 25,
  SIZE: 15,
  SPEED: 1,
  STROKE: 1.5,
  STAGGER: 0.25,
  SCALE: 0.5,
  DELAY: 0,
  HUE: Math.floor(Math.random() * 360),
}

const CUBES = new Illustration({
  element: 'canvas',
  dragRotate: true,
  resize: 'fullscreen',
  rotate: {
    x: TAU * 0.098,
    y: TAU * 0.125,
  },
})

const CUBE = new Anchor({
  addTo: CUBES,
})

const FACE = new Rect({
  addTo: CUBE,
  width: CONFIG.SIZE,
  height: CONFIG.SIZE,
  stroke: CONFIG.STROKE,
  color: `hsl(${CONFIG.HUE}, 100%, 50%)`,
})

FACE.copy({
  translate: {
    z: CONFIG.SIZE / 2,
  },
})

FACE.copy({
  translate: {
    z: -CONFIG.SIZE / 2,
  },
})

FACE.copy({
  rotate: {
    y: TAU * 0.25,
  },
  translate: {
    x: CONFIG.SIZE / 2,
  },
})

FACE.copy({
  rotate: {
    y: TAU * 0.25,
  },
  translate: {
    x: -CONFIG.SIZE / 2,
  },
})

FACE.color = 'transparent'

const addCubes = () => {
  let scale = 1
  for (let c = 0; c < CONFIG.AMOUNT; c++) {
    CUBE.copyGraph({
      scale: scale += CONFIG.SCALE,
    })
  }
}
addCubes()
const TL = new timeline()
const addToTL = () => {
  const ROTATES = CUBES.children.map(child => child.rotate)
  TL.add(
    to(ROTATES, CONFIG.SPEED, {
      y: `+=${TAU}`,
      stagger: CONFIG.STAGGER,
      repeat: -1,
      repeatDelay: CONFIG.DELAY,
    })
  )
}

addToTL()

const updateFaces = (key, value) => {
  for (let c = 0; c < CUBES.children.length; c++) {
    for (let f = 1; f < CUBES.children[c].children.length; f++) {
      CUBES.children[c].children[f][key] = value
    }
  }
}

const updateScale = () => {
  for (let c = 0; c < CUBES.children.length; c++) {
    CUBES.children[c].scale = {
      x: c * CONFIG.SCALE,
      y: c * CONFIG.SCALE,
      z: c * CONFIG.SCALE,
    }
  }
}

const GUI = new dat.GUI({ closed: false })
const amountController = GUI.add(CONFIG, 'AMOUNT', 1, 100)
amountController.onFinishChange(value => {
  CONFIG.AMOUNT = value
  CUBES.children = []
  addCubes()
  TL.seek(0)
  TL.clear()
  addToTL()
})
const speedController = GUI.add(CONFIG, 'SPEED', 0.1, 10)
speedController.onFinishChange(value => {
  CONFIG.SPEED = value
  TL.seek(0)
  TL.clear()
  addToTL()
})
const staggerController = GUI.add(CONFIG, 'STAGGER', 0.01, 1)
staggerController.onFinishChange(value => {
  CONFIG.STAGGER = value
  TL.seek(0)
  TL.clear()
  addToTL()
})
const delayController = GUI.add(CONFIG, 'DELAY', 0, 5)
delayController.onFinishChange(value => {
  CONFIG.DELAY = value
  TL.seek(0)
  TL.clear()
  addToTL()
})
const strokeController = GUI.add(CONFIG, 'STROKE', 0.01, 4)
strokeController.onFinishChange(value => {
  CONFIG.STROKE = value
  updateFaces('stroke', value)
})
const scaleController = GUI.add(CONFIG, 'SCALE', 0.15, 3)
scaleController.onFinishChange(value => {
  CONFIG.SCALE = value
  updateScale()
})
const hueController = GUI.add(CONFIG, 'HUE', 0, 360)
hueController.onFinishChange(value => {
  CONFIG.HUE = value
  updateFaces('color', `hsl(${value}, 100%, 50%)`)
})

const draw = () => {
  CUBES.updateRenderGraph()
  requestAnimationFrame(draw)
}
draw()

const resetAngle = document.createElement('button')
resetAngle.innerText = 'Reset Rotation'
resetAngle.className = 'reset'
resetAngle.addEventListener('click', () => {
  CUBES.rotate = {
    x: TAU * 0.098,
    y: TAU * 0.125,
  }
})
const li = document.createElement('li')
li.className = 'cr button-holder'
li.appendChild(resetAngle)
GUI.__ul.appendChild(li)
