/**
  * Create alias for requestAnimationFrame
*/
const RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function (cb) { setTimeout(cb, 1000 / 60) }


/**
  * Use this in a later pen for mousemove tracking.
*/
//
// let PLAY = 0
// let X = -(PLAY / 2)
// let Y = -(PLAY / 2)

/**
  * Generate a random color
*/
const generateColor = () => {
  const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`
  if (color.length !== 7) generateColor()
  return color
}
/**
  * Generate a frame interval
*/

let intervals = []

const generateInterval = (t) => {
  const interval = Math.max(20, Math.floor(Math.random() * t))
  if (intervals.indexOf(interval) !== -1) return generateInterval(t)
  return interval
}

intervals.push(generateInterval(100))
intervals.push(generateInterval(40))
intervals.push(generateInterval(35))

const defaultOpts = {
  intervals,
}

class Circle {
  constructor({color, size, fillSize = 0}) {
    const internalCanvas = document.createElement('canvas')
    internalCanvas.height = size
    internalCanvas.width  = size
    /**
      * Initialize with a starting SIZE and CANVAS reference
    */
    this.__RENDERSIZE = size
    this.__COLOR   = color
    this.__SIZE    = fillSize
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

class Hypno {
  constructor(el, opts = defaultOpts) {
    if (el.tagName !== 'CANVAS') throw Error('Booo!, I need a <canvas/>')
    const {
      offsetHeight: height,
      offsetWidth: width,
    } = el
    if (height !== width) throw Error('I need an equally sized <canvas/>')
    const size = height
    el.height = size
    el.width  = size
    const cxt = el.getContext('2d')
    cxt.clearRect(0, 0, size, size)
    cxt.save()
    const options = Object.assign({}, opts, defaultOpts)
    this.__REF = {
      el,
      cxt,
      size,
      INTERVALS: options.intervals,
      POOL: [],
      FRAME_COUNT: 0,
    }
    if (options.prefill) {
      const prefillSizes = []
      let i = 1
      while (i < size / 2) {
        for (const interval of options.intervals) {
          if (i % interval === 0) prefillSizes.push(i)
        }
        i++
      }
      this.__PREFILLS = []
      const reductor = prefillSizes[0]
      for (const prefill of prefillSizes) {
        this.__PREFILLS.push((size / 2) - (prefill - reductor))
      }
      for (const fillSize of this.__PREFILLS) {
        const circleOpts = {
          color: generateColor(),
          size,
          fillSize,
        }
        this.__REF.POOL.push(new Circle(circleOpts))
      }
    }
    this.start()
  }

  reset() {
    this.__REF.cxt.clearRect(0, 0, this.__REF.size, this.__REF.size)
    this.__REF = Object.assign({}, this.__REF, {
      FRAME_COUNT: 0,
      POOL: [],
    })
  }

  isUpdate() {
    const {
      INTERVALS,
      FRAME_COUNT,
    } = this.__REF

    let update = false
    for (const interval of INTERVALS) {
      if (FRAME_COUNT % interval === 0) update = true
    }
    return update
  }

  render() {
    const {
      POOL,
      size,
      cxt: CONTEXT,
    } = this.__REF

    let {
      FRAME_COUNT,
    } = this.__REF

    if (this.isUpdate()) {
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
        const circleOpts = {
          color: generateColor(),
          size,
        }
        POOL.push(new Circle(circleOpts))
      } else {
        const available = POOL.shift()
        available.__ACTIVE = true
        POOL.push(available)
      }
    }

    for (let c = 0; c < POOL.length; c++) {
      const circle = POOL[c]
      const olderSiblingCircle = POOL[c + 1]
      if (circle.__ACTIVE && olderSiblingCircle && olderSiblingCircle.getSize() === circle.__RENDERSIZE) {
        circle.reset()
      } else if (circle.__ACTIVE && circle.getSize() === circle.__RENDERSIZE) {
        CONTEXT.drawImage(circle.__CANVAS, 0, 0)
      } else if (circle.__ACTIVE) {
        CONTEXT.drawImage(circle.update(), 0, 0)
      }
    }

    CONTEXT.restore()
    FRAME_COUNT = FRAME_COUNT + 1
    this.__REF = Object.assign({}, this.__REF, {
      FRAME_COUNT,
    })
    RAF(this.render.bind(this))
  }
  start() {
    RAF(this.render.bind(this))
  }
}

const myCanvas = document.querySelector('canvas')
const myHypno = new Hypno(myCanvas, {})

/**
  * Hook up refresh
*/
const btn = document.querySelector('button')
btn.addEventListener('click', () => myHypno.reset())
