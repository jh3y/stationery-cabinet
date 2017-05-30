/**
  * Grab a shorthand for requestAnimationFrame
*/

const RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function (cb) { setTimeout(cb, 1000 / 60) }


const BLOCK_SIZE = 10

class Block {
  constructor({X, Y}) {
    this.__CANVAS = document.createElement('canvas')
    this.__CANVAS.height = BLOCK_SIZE
    this.__CANVAS.width = BLOCK_SIZE
    this.__POSITION = {
      X,
      Y
    }
    this.__COLOR = '#FFF'
    this.render()
  }
  render() {
    const context = this.__CANVAS.getContext('2d')
    context.clearRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
    context.fillStyle = this.__COLOR
    context.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
  }
  update() {
    this.__COLOR = `#${Math.floor(Math.random() * 16777215).toString(16)}`
    this.render()
  }
}

class ColorWall {
  constructor({height, width}) {
    this.__CANVAS = document.createElement('canvas')
    this.__CANVAS.height = height
    this.__CANVAS.width = width
    this.__POOL = []
  }
  generateImage() {
    const {
      __CANVAS
    } = this

    const {
      height,
      width,
    } = __CANVAS

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
      if (Math.random() > 0.98) {
        block.update()
      }
      CONTEXT.drawImage(block.__CANVAS, block.__POSITION.X, block.__POSITION.Y)
    }

    return __CANVAS
  }
}


const render = () => {
  /**
    * This is the actual canvas.
  */
  const $canvas = document.querySelector('canvas')
  $canvas.height = 250
  $canvas.width = 250
  const $context = $canvas.getContext('2d')
  $context.save()
  $context.clearRect(0, 0, $canvas.width, $canvas.height)

  if (!$canvas.__COLORWALL) {
    $canvas.__COLORWALL = new ColorWall({height: 250, width: 250})
  }

  $context.drawImage($canvas.__COLORWALL.generateImage(), 0, 0)

  $context.restore()

  RAF(render)
}

RAF(() => render())
