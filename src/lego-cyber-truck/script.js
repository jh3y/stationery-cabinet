const { Zdog } = window
const { Illustration, Anchor, Group, Cylinder, Box, TAU } = Zdog

const UNIT = 6
const HEIGHT = 9 * UNIT
const WIDTH = 15 * UNIT
const DEPTH = 30 * UNIT
const DIAMETER = 5 * UNIT

const COLORS = {
  BASE: 'hsl(209, 20%, 50%)',
  DARK: 'hsl(209, 20%, 25%)',
  DARKING: 'hsl(209, 20%, 30%)',
  LIGHT: 'hsl(209, 20%, 65%)',
  LIGHTER: 'hsl(209, 20%, 70%)',
}

const ILLO = new Illustration({
  element: 'canvas',
  dragRotate: true,
  resize: 'fullscreen',
  rotate: {
    x: TAU * -0.065,
    y: TAU * 0.125,
  },
})

const SCENE = new Anchor({
  addTo: ILLO,
})

new Box({
  addTo: SCENE,
  height: HEIGHT,
  width: WIDTH,
  depth: DEPTH,
  color: COLORS.BASE,
  rightFace: COLORS.LIGHT,
  leftFace: COLORS.LIGHT,
  rearFace: COLORS.DARK,
  topFace: COLORS.BASE,
  bottomFace: COLORS.DARK,
  frontFace: COLORS.DARK,
})

const POINTS = new Group({
  addTo: SCENE,
})

const POINT = new Anchor({
  addTo: POINTS,
  height: WIDTH / 2,
  width: WIDTH / 2,
  translate: {
    x: -WIDTH / 4,
    y: -(HEIGHT / 2 + DIAMETER / 4),
    z: WIDTH * 0.75,
  },
  rotate: {
    x: TAU * 0.25,
  },
})

new Cylinder({
  addTo: POINT,
  length: DIAMETER / 2,
  diameter: DIAMETER,
  stroke: false,
  color: COLORS.DARK,
  frontFace: COLORS.LIGHT,
})

POINT.copyGraph({
  translate: {
    ...POINT.translate,
    x: WIDTH / 4,
  },
})
POINT.copyGraph({
  visible: false,
  translate: {
    ...POINT.translate,
    x: WIDTH / 4,
  },
})

POINT.copyGraph({
  translate: {
    ...POINT.translate,
    z: WIDTH / 4,
    x: WIDTH / 4,
  },
})

POINT.copyGraph({
  translate: {
    ...POINT.translate,
    z: WIDTH / 4,
    x: -WIDTH / 4,
  },
})

POINT.copyGraph({
  translate: {
    ...POINT.translate,
    z: -WIDTH / 4,
  },
})

POINT.copyGraph({
  translate: {
    ...POINT.translate,
    z: -WIDTH / 4,
    x: WIDTH / 4,
  },
})

POINT.copyGraph({
  translate: {
    ...POINT.translate,
    z: -WIDTH * 0.75,
    x: WIDTH / 4,
  },
})

POINT.copyGraph({
  translate: {
    ...POINT.translate,
    z: -WIDTH * 0.75,
    x: -WIDTH / 4,
  },
})

const WHEELSET = new Anchor({
  addTo: SCENE,
  translate: {
    y: HEIGHT * 0.5 + UNIT * 2,
    z: WIDTH / 2,
  },
  rotate: {
    x: TAU * 0.25,
  },
})

const WHEELBASE = new Anchor({
  addTo: WHEELSET,
  height: WIDTH,
  width: WIDTH,
  color: 'red',
})
const HUBSET = new Anchor({
  addTo: WHEELBASE,
})

const AXLE = new Cylinder({
  addTo: HUBSET,
  color: 'black',
  length: WIDTH * 1.1,
  diameter: UNIT * 2,
  rotate: {
    x: TAU * 0.25,
    y: TAU * 0.25,
  },
  translate: {
    z: -UNIT * 0.5,
  },
})
new Box({
  addTo: HUBSET,
  color: COLORS.LIGHTER,
  height: WIDTH,
  // rightFace: 'red',
  // leftFace: 'red',
  // rearFace: 'red',
  // topFace: 'red',
  bottomFace: COLORS.DARKING,
  // frontFace: 'red',
  width: WIDTH,
  depth: UNIT * 2,
  translate: {
    z: UNIT,
  },
})

const WHEEL = new Cylinder({
  addTo: AXLE,
  diameter: UNIT * 5,
  length: UNIT * 2,
  color: 'hsl(0, 0%, 15%)',
  frontface: 'hsl(0, 0%, 5%)',
  backface: 'hsl(0, 0%, 10%)',
  translate: {
    z: WIDTH * 0.5 + UNIT,
  },
})

WHEEL.copyGraph({
  translate: {
    z: -(WIDTH * 0.5 + UNIT),
  },
})

WHEELSET.copyGraph({
  translate: {
    ...WHEELSET.translate,
    z: -WIDTH / 2,
  },
})

const LIGHTBAR = new Box({
  addTo: SCENE,
  color: 'white',
  height: UNIT / 5,
  width: UNIT / 5,
  depth: WIDTH,
  translate: {
    y: -HEIGHT / 2,
    z: WIDTH,
  },
  rotate: {
    y: TAU * 0.25,
  },
})
LIGHTBAR.copyGraph({
  color: 'red',
  translate: {
    ...LIGHTBAR.translate,
    z: -WIDTH,
  },
})

const draw = () => {
  ILLO.updateRenderGraph()
  requestAnimationFrame(draw)
}
draw()
