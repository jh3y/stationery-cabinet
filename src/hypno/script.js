/**
  * Create alias for requestAnimationFrame
*/
const RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function (cb) { setTimeout(cb, 1000 / 60) }


/**
  * Create some sizing variables
*/
const HEIGHT = 100
const WIDTH  = 100

/**
  * Initialise a canvas
*/
const CANVAS = document.querySelector('canvas')
CANVAS.style.background = '#111'
CANVAS.style.height = HEIGHT
CANVAS.style.width  = WIDTH
CANVAS.height       = HEIGHT
CANVAS.width        = WIDTH

const CONTEXT       = CANVAS.getContext('2d')
CONTEXT.save()

class Circle {
  constructor() {
    const internalCanvas = document.createElement('canvas')
    internalCanvas.height = HEIGHT
    internalCanvas.width  = WIDTH
    /**
      * Initialize with a starting SIZE and CANVAS reference
    */
    this.__SIZE   = 0
    this.__CANVAS = internalCanvas
  }
  getSize() {
    return this.__SIZE
  }
  update() {
    const context = this.__CANVAS.getContext('2d')
    context.fillStyle = '#FFF'
    context.arc(HEIGHT / 2, HEIGHT / 2, this.__SIZE, 0, 360)
    context.fill()
    this.__SIZE = this.__SIZE + 1
    return this.__CANVAS
  }
}

let circle
const render = () => {
  /**
    * Generate a red circle and then scale it out as you go.
  */
  CONTEXT.clearRect(0, 0, HEIGHT, HEIGHT)
  if (!circle) circle = new Circle()
  /**
    * Need to try and pool the circles here. Only update until size and then
    * release as the next makes it to size.
  */
  if (circle.getSize() === (HEIGHT / 2)) {
    CONTEXT.drawImage(circle.__CANVAS, 0, 0)
  } else {
    CONTEXT.drawImage(circle.update(), 0, 0)
  }
  CONTEXT.restore()

  RAF(render)
}


RAF(render)
