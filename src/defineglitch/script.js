/**
  * Grab a shorthand for requestAnimationFrame
*/

const RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function (cb) { setTimeout(cb, 1000 / 60) }
const CANVAS_HEIGHT = 70
const CANVAS_WIDTH = 490
const BLOCK_SIZE = 10
let RATE_OF_CHANGE = 0.5

class Block {
  constructor({X, Y}, finalColor = '#111') {
    this.__CANVAS = document.createElement('canvas')
    this.__CANVAS.height = BLOCK_SIZE
    this.__CANVAS.width = BLOCK_SIZE
    this.__POSITION = {
      X,
      Y
    }
    this.__FINAL_COLOR = finalColor
    this.__COLOR = '#111'
    this.render()
  }
  render() {
    const context = this.__CANVAS.getContext('2d')
    context.clearRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
    context.fillStyle = this.__COLOR
    context.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
  }
  update(lastUpdate) {
    if (lastUpdate) {
      this.__UPDATED = true
      this.__COLOR = this.__FINAL_COLOR
    } else {
      this.__COLOR = `#${Math.floor(Math.random() * 16777215).toString(16)}`
    }
    this.render()
  }
}

class ColorWall {
  constructor({height, width, matrix}) {
    this.__CANVAS = document.createElement('canvas')
    this.__CANVAS.height = height
    this.__CANVAS.width = width
    this.__MATRIX = matrix
    this.__POOL = []
    this.__FRAME_COUNT = 0
  }
  generateImage() {
    const {
      __CANVAS
    } = this

    const {
      height,
      width,
    } = __CANVAS

    this.__FRAME_COUNT = this.__FRAME_COUNT + 1

    const CONTEXT = __CANVAS.getContext('2d')

    const HEIGHT_LIMIT = Math.floor(height / BLOCK_SIZE)
    const WIDTH_LIMIT = Math.floor(width / BLOCK_SIZE)
    const TOTAL = HEIGHT_LIMIT * WIDTH_LIMIT

    const generateCoordinates = (i) => {
      const X = (i % WIDTH_LIMIT) * BLOCK_SIZE
      const Y = Math.floor((i / WIDTH_LIMIT)) * BLOCK_SIZE
      /* For the debugzzz */
      // console.info(`I: ${i} , X: ${X} , Y: ${Y}`)
      return {
        X,
        Y,
      }
    }

    if (this.__POOL.length === 0) {
      for (let i = 0; i < TOTAL; i++) {
        const coordinates = generateCoordinates(i)
        const myBlock = new Block(coordinates)
        this.__POOL.push(myBlock)
      }
    }

    for (const idx in this.__POOL) {
      const block = this.__POOL[idx]
      if (!block.__UPDATED && this.__FRAME_COUNT > 0 && this.__FRAME_COUNT === parseInt(this.__MATRIX[idx], 10)) {
        block.update(true)
      } else if (!block.__UPDATED && Math.random() > RATE_OF_CHANGE) {
        block.update()
      }
      CONTEXT.drawImage(block.__CANVAS, block.__POSITION.X, block.__POSITION.Y)
    }

    return __CANVAS
  }
}

/**
  * This is the actual canvas.
*/
const $canvas = document.querySelector('canvas')
$canvas.height = CANVAS_HEIGHT
$canvas.width = CANVAS_WIDTH
const $context = $canvas.getContext('2d')
$context.save()

/**
  * As blocks have a delay on being drawn in, make the frame delay greater
  * the total frames to draw the wall. (6 * 42). Say start at 300?
*/

let FRAME_MATRIX = [
  [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 54, 53, 52, 51, 50, 0],
    [0, 55, 0, 0, 0, 0, 0],
    [0, 56, 0, 0, 0, 0, 0],
    [0, 57, 0, 0, 0, 0, 0],
    [0, 58, 59, 60, 61, 62, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 68, 67, 66, 65, 64, 0],
    [0, 69, 0, 0, 0, 79, 0],
    [0, 70, 0, 0, 0, 78, 0],
    [0, 71, 0, 0, 0, 77, 0],
    [0, 72, 73, 74, 75, 76, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 80, 81, 82, 83, 84, 0],
    [0, 0, 93, 0, 0, 85, 0],
    [0, 0, 94, 0, 0, 86, 0],
    [0, 0, 95, 0, 0, 87, 0],
    [0, 92, 91, 90, 89, 88, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 100, 99, 98, 97, 96, 0],
    [0, 101, 0, 0, 0, 0, 0],
    [0, 102, 109, 110, 111, 0, 0],
    [0, 103, 0, 0, 0, 0, 0],
    [0, 104, 105, 106, 107, 108, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 112, 113, 114, 115, 116, 0],
    [0, 123, 0, 0, 0, 117, 0],
    [0, 122, 121, 120, 119, 118, 0],
    [0, 124, 0, 0, 0, 0, 0],
    [0, 125, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 130, 129, 128, 127, 126, 0],
    [0, 131, 0, 0, 0, 0, 0],
    [0, 132, 139, 140, 141, 0, 0],
    [0, 133, 0, 0, 0, 0, 0],
    [0, 134, 135, 136, 137, 138, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 146, 0, 0, 0, 154, 0],
    [0, 145, 147, 0, 0, 153, 0],
    [0, 144, 0, 148, 0, 152, 0],
    [0, 143, 0, 0, 149, 151, 0],
    [0, 142, 0, 0, 0, 150, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ],
]

/**
* Resort and flatten the array to feed into the color wall
*/
let sorted = []
for(let i = 0; i < FRAME_MATRIX.length; i++) {
  for (let b = 0; b < FRAME_MATRIX[i].length; b++) {
    if (!sorted[b]) sorted[b] = []
    sorted[b].push(FRAME_MATRIX[i][b])
  }
}
sorted = sorted.join().split(',')

const render = () => {
  $context.clearRect(0, 0, $canvas.width, $canvas.height)

  if (!$canvas.__COLORWALL) {
    $canvas.__COLORWALL = new ColorWall({
      height: CANVAS_HEIGHT,
      width: CANVAS_WIDTH,
      matrix: sorted
    })
  }

  $context.drawImage($canvas.__COLORWALL.generateImage(), 0, 0)

  /**
    * Uncomment to get an idea of the current FPS
  */
  // console.info(new Date().toUTCString())

  $context.restore()

  RAF(render)
}

RAF(render)
