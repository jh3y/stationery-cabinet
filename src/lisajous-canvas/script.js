const {
  dat: { GUI },
} = window
const CANVAS = document.querySelector('canvas')
const CONTEXT = CANVAS.getContext('2d')
const SIZE = 600
const UNIT = SIZE / 3
const CONTROLLER = new GUI()
const CONFIG = {
  PAUSED: false,
  CENTERED: true,
  HIDE_GUIDES_ON_PAUSE: true,
  STROKE: {
    COLOR: {
      HUE: Math.random() * 360,
      SATURATION: 100,
      LIGHTNESS: 50,
      ALPHA: 1,
    },
    WIDTH: 5,
  },
  DOTS: {
    COLOR: {
      HUE: Math.random() * 360,
      SATURATION: 100,
      LIGHTNESS: 50,
      ALPHA: 1,
    },
  },
  GUIDES: {
    WIDTH: 5,
    COLOR: {
      HUE: Math.random() * 360,
      SATURATION: 0,
      LIGHTNESS: 50,
      ALPHA: 0.5,
    },
  },
}

CANVAS.width = CANVAS.height = SIZE
class Dial {
  constructor(options) {
    this.ROTATION = 90
    this.SPEED = options.speed
    this.RADIUS = options.radius
    this.CLOCKWISE = options.clockwise
    this.CANVAS = document.createElement('canvas')
    this.CANVAS.width = this.CANVAS.height = UNIT
    this.CONTEXT = this.CANVAS.getContext('2d')
    return this
  }
  update = () => {
    this.CONTEXT.save()
    this.CONTEXT.clearRect(0, 0, UNIT, UNIT)
    this.CONTEXT.strokeStyle = `hsla(${CONFIG.GUIDES.COLOR.HUE}, ${CONFIG.GUIDES.COLOR.SATURATION}%, ${CONFIG.GUIDES.COLOR.LIGHTNESS}%, ${CONFIG.GUIDES.COLOR.ALPHA})`
    this.CONTEXT.lineWidth = 10
    this.CONTEXT.translate(UNIT / 2, UNIT / 2)
    this.CONTEXT.rotate((this.ROTATION * Math.PI) / 180)
    this.CONTEXT.translate(-UNIT / 2, -UNIT / 2)
    this.CONTEXT.beginPath()
    this.CONTEXT.arc(UNIT / 2, UNIT / 2, this.RADIUS, 0, (360 * Math.PI) / 180)
    this.CONTEXT.stroke()
    this.CONTEXT.beginPath()
    this.CONTEXT.fillStyle = `hsla(${CONFIG.DOTS.COLOR.HUE}, ${CONFIG.DOTS.COLOR.SATURATION}%, ${CONFIG.DOTS.COLOR.LIGHTNESS}%, ${CONFIG.DOTS.COLOR.ALPHA})`
    this.CONTEXT.arc(
      UNIT / 2,
      UNIT / 2 - this.RADIUS,
      10,
      0,
      (360 * Math.PI) / 180
    )
    this.CONTEXT.fill()
    this.CONTEXT.restore()
    this.ROTATION = this.ROTATION + this.SPEED
    return this.CANVAS
  }
  getXY = () => {
    // know the radius is 25 and the size is 60
    // x is 25cos(current rotation)
    // y is 25sin(current rotation)
    // That's from the center point also so normalize with 30 👍
    const x = Math.round(
      UNIT / 2 + this.RADIUS * Math.sin((this.ROTATION * Math.PI) / 180)
    )
    const y = Math.round(
      UNIT / 2 - this.RADIUS * Math.cos((this.ROTATION * Math.PI) / 180)
    )
    return { x, y }
  }
}

/**
 * TODO: Put a pause feature in. Configure all the things 😎
 */
let POINTS = []
const onChange = () => {
  POINTS = []
}
const LEFT_DIAL = new Dial({ speed: 3, radius: 90 })
const RIGHT_DIAL = new Dial({ speed: 3.75, radius: 90 })

const SPEED = CONTROLLER.addFolder('SPEED')
SPEED.add(LEFT_DIAL, 'SPEED', 0, 10, 0.001)
  .name('Left dial')
  .onChange(onChange)
SPEED.add(RIGHT_DIAL, 'SPEED', 0, 10, 0.001)
  .name('Right dial')
  .onChange(onChange)
const STROKE = CONTROLLER.addFolder('STROKE')
STROKE.add(CONFIG.STROKE, 'WIDTH', 1, 10, 0.1)
const COLOR = STROKE.addFolder('COLOR')
COLOR.add(CONFIG.STROKE.COLOR, 'HUE', 0, 360)
COLOR.add(CONFIG.STROKE.COLOR, 'SATURATION', 0, 100, 1)
COLOR.add(CONFIG.STROKE.COLOR, 'LIGHTNESS', 0, 100, 1)
COLOR.add(CONFIG.STROKE.COLOR, 'ALPHA', 0, 1, 0.01)
const GUIDES = CONTROLLER.addFolder('GUIDES')
GUIDES.add(CONFIG.GUIDES, 'WIDTH', 1, 10, 0.1)
const GUIDE_COLOR = GUIDES.addFolder('COLOR')
GUIDE_COLOR.add(CONFIG.GUIDES.COLOR, 'HUE', 0, 360)
GUIDE_COLOR.add(CONFIG.GUIDES.COLOR, 'SATURATION', 0, 100, 1)
GUIDE_COLOR.add(CONFIG.GUIDES.COLOR, 'LIGHTNESS', 0, 100, 1)
GUIDE_COLOR.add(CONFIG.GUIDES.COLOR, 'ALPHA', 0, 1, 0.01)
const DOTS = CONTROLLER.addFolder('DOTS')
const DOTS_COLOR = DOTS.addFolder('COLOR')
DOTS_COLOR.add(CONFIG.DOTS.COLOR, 'HUE', 0, 360)
DOTS_COLOR.add(CONFIG.DOTS.COLOR, 'SATURATION', 0, 100, 1)
DOTS_COLOR.add(CONFIG.DOTS.COLOR, 'LIGHTNESS', 0, 100, 1)
DOTS_COLOR.add(CONFIG.DOTS.COLOR, 'ALPHA', 0, 1, 0.01)
CONTROLLER.add(CONFIG, 'PAUSED').name('Pause?')
CONTROLLER.add(CONFIG, 'CENTERED')
  .name('Centered?')
  .onChange(() => {
    document.querySelector('canvas').classList.toggle('showcase')
  })
CONTROLLER.add(CONFIG, 'HIDE_GUIDES_ON_PAUSE').name('Hide on pause?')

const draw = () => {
  const { x: x1, y: y1 } = LEFT_DIAL.getXY()
  const { x: x2, y: y2 } = RIGHT_DIAL.getXY()
  CONTEXT.clearRect(0, 0, SIZE, SIZE)
  if (!CONFIG.PAUSED || (CONFIG.PAUSED && !CONFIG.HIDE_GUIDES_ON_PAUSE)) {
    CONTEXT.drawImage(
      CONFIG.PAUSED ? LEFT_DIAL.CANVAS : LEFT_DIAL.update(),
      0,
      SIZE / 2
    )
    CONTEXT.drawImage(
      CONFIG.PAUSED ? RIGHT_DIAL.CANVAS : RIGHT_DIAL.update(),
      SIZE / 2,
      0
    )
    CONTEXT.strokeStyle = `hsla(${CONFIG.GUIDES.COLOR.HUE}, ${CONFIG.GUIDES.COLOR.SATURATION}%, ${CONFIG.GUIDES.COLOR.LIGHTNESS}%, ${CONFIG.GUIDES.COLOR.ALPHA})`
    CONTEXT.lineWidth = CONFIG.GUIDES.WIDTH
    CONTEXT.beginPath()
    CONTEXT.moveTo(x1, y1 + SIZE / 2)
    CONTEXT.lineTo(SIZE, y1 + SIZE / 2)
    CONTEXT.moveTo(x2 + SIZE / 2, y2)
    CONTEXT.lineTo(x2 + SIZE / 2, SIZE)
    CONTEXT.stroke()
  }
  if (POINTS.filter(POINT => POINT[0] === x2 && POINT[1] === y1).length === 0)
    POINTS.push([x2, y1])
  CONTEXT.fillStyle = `hsla(${CONFIG.STROKE.COLOR.HUE}, ${CONFIG.STROKE.COLOR.SATURATION}%, ${CONFIG.STROKE.COLOR.LIGHTNESS}%, ${CONFIG.STROKE.COLOR.ALPHA})`
  for (const POINT of POINTS) {
    CONTEXT.beginPath()
    CONTEXT.arc(
      SIZE / 2 + POINT[0],
      SIZE / 2 + POINT[1],
      CONFIG.STROKE.WIDTH,
      0,
      (360 * Math.PI) / 180
    )
    CONTEXT.fill()
  }
  requestAnimationFrame(draw)
}

draw()
