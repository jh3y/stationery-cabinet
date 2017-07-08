/**
  * Create alias for requestAnimationFrame
*/
const RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function (cb) { setTimeout(cb, 1000 / 60) }

/**
  * Generate a random color
*/
let grayscale = true
const generateColor = () => {
  let color
  if (grayscale) {
    const digit = Math.floor(Math.random() * 256)
    color = `rgb(${digit}, ${digit}, ${digit})`
  } else {
    color = `#${Math.floor(Math.random() * 16777216).toString(16)}`
    if (color.length !== 7) generateColor()
  }
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
  frameJump: 1,
}

class Circle {
  constructor({color, size, fillSize = 0, startingFrame = 0}) {
    const internalCanvas = document.createElement('canvas')
    internalCanvas.height = size
    internalCanvas.width  = size
    /**
      * Initialize with a starting SIZE and CANVAS reference
    */
    this.__RENDERSIZE = size
    this.__COLOR   = color
    this.__STARTFRAME = startingFrame
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
    if (!el || el.tagName !== 'CANVAS') throw Error('Booo!, I need a <canvas/>')
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
    const options = Object.assign({}, defaultOpts, opts)
    this.__REF = {
      el,
      cxt,
      size,
      options,
      INTERVALS: options.intervals,
      POOL: [],
      FRAME_COUNT: 0,
      X: (options.mouseTrack) ? 0 - (size * .25) : 0,
      Y: (options.mouseTrack) ? 0 - (size * .25) : 0,
    }
    if (options.prefill) {
      this.populatePool()
    }
    if (options.mouseTrack) {
      document.addEventListener('mousemove', this.updatePlay.bind(this))
    }
    this.start()
  }
  populatePool() {
    const {
      INTERVALS,
      size,
      POOL,
      options,
    }  = this.__REF
    /**
      * PREFILL MATH HAPPENING HERE
    */
    const startingFrames = []
    const prefillSizes = []
    // Work out the frames at which things should happen, should be
    // smallest interval + size
    const smallestInterval = Math.min.apply(Math, INTERVALS)
    const topLimit = size + smallestInterval
    let i = 0
    while (i < topLimit) {
      for (const interval of INTERVALS) {
        if ((i % interval === 0) && (startingFrames.indexOf(i) === -1)) {
          startingFrames.push(i)
        }
      }
      i++
    }
    for (const frame of startingFrames) {
      prefillSizes.push(Math.min(size, topLimit - frame))
    }
    for (const prefill of prefillSizes) {
      const newColor = generateColor()
      const circleOpts = {
        color: generateColor(),
        size: (options.mouseTrack) ? size * 1.5 : size,
        fillSize: prefill,
        startingFrame: 0,
      }
      POOL.push(new Circle(circleOpts))
    }
  }
  updatePlay(e) {
    const {
      innerHeight,
      innerWidth,
    } = window
    const {
      pageX: x,
      pageY: y,
    } = e
    const {
      size
    } = this.__REF

    this.__REF.X = (0 - (size * .25)) + (((x / innerWidth) - 0.5) * 2) * (((size * 1.5) * .3)  / 2)
    this.__REF.Y = (0 - (size * .25)) + (((y / innerHeight) - 0.5) * 2) * (((size * 1.5) * .3) / 2)

  }

  reset() {
    this.__REF.cxt.clearRect(0, 0, this.__REF.size, this.__REF.size)
    this.__REF = Object.assign({}, this.__REF, {
      FRAME_COUNT: 0,
      POOL: [],
    })
    if (this.__REF.options.prefill) {
      this.populatePool()
    }
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
      options,
      X,
      Y,
    } = this.__REF

    let {
      FRAME_COUNT,
    } = this.__REF

    const circleSize = (options.mouseTrack) ? size * 1.5 : size

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
          size: circleSize,
          startingFrame: FRAME_COUNT,
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
        CONTEXT.clearRect(0, 0 , circleSize, circleSize)
        CONTEXT.drawImage(circle.__CANVAS, X, Y)
      } else if (circle.__ACTIVE) {
        CONTEXT.drawImage(circle.update(), X, Y)
      }
    }

    CONTEXT.restore()
    FRAME_COUNT = FRAME_COUNT + options.frameJump
    this.__REF = Object.assign({}, this.__REF, {
      FRAME_COUNT,
    })
    RAF(this.render.bind(this))
  }
  start() {
    RAF(this.render.bind(this))
  }
}

const leftEye = new Hypno(document.querySelector('#left'), {
  prefill: true,
  mouseTrack: true,
})
const rightEye = new Hypno(document.querySelector('#right'), {
  prefill: true,
  mouseTrack: true,
  frameJump: 15,
})
const topFrequency = 600
const AudioContext = window.AudioContext || window.webkitAudioContext

if (AudioContext) {
  let source
  const cntxt = new AudioContext()

  const vol = cntxt.createGain()
  vol.connect(cntxt.destination)
  vol.gain.value = 0.025

  let osc

  const setUpOscillator = () => {
    osc = cntxt.createOscillator()
    osc.connect(vol)
    osc.start()
    osc.frequency.value = topFrequency
  }

  setUpOscillator()

  const updateFrequency = (e) => {
    const {
      pageX,
      pageY,
    } = e
    const width = window.innerWidth / 2
    const height = window.innerHeight / 2
    const X = 1 - Math.abs((pageX - width) / width)
    const Y = 1 - Math.abs((pageY - height) / height)
    const smallest = Math.min(X, Y)
    const biggest = Math.max(X, Y)
    const def = (biggest - smallest)
    const newFrequency = Math.floor((1 - def) * topFrequency)
    if (osc) {
      try {
        osc.start()
      } catch(err) {}
      osc.frequency.value = newFrequency
    }
  }

  const container = document.querySelector('.container')
  container.addEventListener('mousemove', updateFrequency)
  container.addEventListener('click', updateFrequency)
  const volumeRange = document.querySelector('#volume')
  const volumeShort = document.querySelector('.controls--volume')

  volumeRange.addEventListener('input', (e) => {
    vol.gain.value = e.target.value
  })

  volumeShort.addEventListener('click', (e) => {
    if (e.target.className.indexOf('volume') !== -1) {
      volumeRange.value = (e.target.className.indexOf('off') !== -1) ? 0 : 1
      vol.gain.value = (e.target.className.indexOf('off') !== -1) ? 0 : 1
    }
  })
}

const psychCheck = document.querySelector('#psych')
psychCheck.addEventListener('change', (e) => {
  grayscale = !e.target.checked
  leftEye.reset()
  rightEye.reset()
})
