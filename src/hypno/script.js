/**
  * Create alias for requestAnimationFrame
*/
const RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function (cb) { setTimeout(cb, 1000 / 60) }


/**
  * Create some sizing variables
*/
const DEFAULT_SIZE = 300
const WINDOW_LIMIT = Math.min(window.innerWidth - 20, window.innerHeight - 20)
const SIZE = Math.min(WINDOW_LIMIT, DEFAULT_SIZE)
let PLAY = 150
let X = -(PLAY / 2)
let Y = -(PLAY / 2)
/**
  * Initialise a canvas
*/
const CANVAS = document.querySelector('canvas')
CANVAS.style.background = '#111'
CANVAS.style.height = SIZE
CANVAS.style.width  = SIZE
CANVAS.style.borderRadius = SIZE / 2
CANVAS.height       = SIZE
CANVAS.width        = SIZE

const CONTEXT       = CANVAS.getContext('2d')
CONTEXT.save()

class Circle {
  constructor(color = '#FFF') {
    const internalCanvas = document.createElement('canvas')
    internalCanvas.height = SIZE + PLAY
    internalCanvas.width  = SIZE + PLAY
    /**
      * Initialize with a starting SIZE and CANVAS reference
    */
    this.__RENDERSIZE = SIZE + PLAY
    this.__COLOR   = color
    this.__SIZE    = 0
    this.__CANVAS  = internalCanvas
    this.__CONTEXT = internalCanvas.getContext('2d')
    this.__ACTIVE  = true
  }
  getSize() {
    return this.__SIZE
  }
  reset() {
    this.__SIZE   = 0
    this.__ACTIVE = false
  }
  update() {
    this.__ACTIVE = true
    this.__CONTEXT.clearRect(0, 0, this.__RENDERSIZE, this.__RENDERSIZE)
    this.__CONTEXT.save()
    this.__CONTEXT.fillStyle = this.__COLOR
    this.__CONTEXT.beginPath()
    this.__CONTEXT.arc(this.__RENDERSIZE / 2, this.__RENDERSIZE / 2, this.__SIZE, 0, 360)
    this.__CONTEXT.fill()
    this.__CONTEXT.closePath()
    this.__CONTEXT.restore()
    this.__SIZE = this.__SIZE + 1
    return this.__CANVAS
  }
}

let circle
let FRAME_COUNT = 0
const generateInterval = (t) => Math.max(20, Math.floor(Math.random() * t))
let INTERVALS = [generateInterval(100), generateInterval(20), generateInterval(35)]
let POOL

const generateColor = () => {
  const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`
  if (color.length !== 7) generateColor()
  return color
}

const isUpdate = () => {
  let update = false
  for (const interval of INTERVALS) {
    if (FRAME_COUNT % interval === 0) update = true
  }
  return update
}

const render = () => {
  /**
    * Generate a red circle and then scale it out as you go.
  */
  CONTEXT.clearRect(0, 0, SIZE, SIZE)
  if (!POOL) POOL = []
  // if (FRAME_COUNT % INTERVALS[0] ===  0 || FRAME_COUNT % INTERVALS[1] === 0) {
  if (isUpdate()) {
    const checkAvailability = () => {
      if (POOL.length === 0) return false
      let availability = false
      for (const c of POOL) {
        if (c.getSize() === 0) {
          availability = true
        }
      }
      return availability
    }
    /**
      * If there are no available circles, add one.
    */
    const availability = checkAvailability()
    if (!availability) {
      const newColor = generateColor()
      POOL.push(new Circle(newColor))
    } else {
      const available = POOL.shift()
      available.__ACTIVE = true
      POOL.push(available)
    }
  }

  for (let c = 0; c < POOL.length; c++) {
    const circle = POOL[c]
    const olderSiblingCircle = POOL[c + 1]
    if (circle.__ACTIVE && olderSiblingCircle && olderSiblingCircle.getSize() === (circle.__RENDERSIZE / 2)) {
      circle.reset()
    } else if (circle.__ACTIVE && circle.getSize() === (circle.__RENDERSIZE / 2)) {
      CONTEXT.drawImage(circle.__CANVAS, X, Y)
    } else if (circle.__ACTIVE) {
      CONTEXT.drawImage(circle.update(), X, Y)
    }
  }

  CONTEXT.restore()
  FRAME_COUNT++
  RAF(render)
}


RAF(render)

const offset = (e) => {
  X = ((PLAY / window.innerWidth) * e.pageX) - (PLAY)
  Y = ((PLAY / window.innerHeight) * e.pageY) - (PLAY)
}

document.addEventListener('mousemove', offset)
