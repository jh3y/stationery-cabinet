/**
 * Utility function for returning a random integer in a given range
 * @param {Int} max
 * @param {Int} min
 */
const randomInRange = (max, min) =>
  Math.floor(Math.random() * (max - min + 1)) + min
const ACTIVE_PROBABILITY = 0.85
const BASE_SIZE = 1
const VELOCITY_INC = 1.000000001
const SIZE_INC = 1.001
const RAD = Math.PI / 180
/**
 * Class for storing the particle metadata
 * position, size, length, speed etc.
 */
class Star {
  STATE = {
    alpha: Math.random(),
    angle: randomInRange(0, 360) * RAD,
  }
  reset = restarting => {
    const angle = randomInRange(0, 360) * (Math.PI / 180)
    const vX = Math.cos(angle)
    const vY = Math.sin(angle)
    const travelled =
      Math.random() > 0.5 && !restarting
        ? Math.random() * Math.max(window.innerWidth, window.innerHeight)
        : 0
    this.STATE = {
      ...this.STATE,
      active: travelled ? true : false,
      x: Math.floor(vX * travelled) + window.innerWidth / 2,
      vX,
      y: Math.floor(vY * travelled) + window.innerHeight / 2,
      vY,
      size: BASE_SIZE,
    }
  }
  constructor() {
    this.reset()
  }
}

const generateStarPool = size => new Array(size).fill().map(() => new Star())
/**
 * Class for drawing all of the stars off canvas as lines
 * Doing this means we only need clear the canvas once
 * and majority of drawing is handled off canvas
 */
class StarSheet {
  STATE = {
    stars: [],
  }

  // create a canvas and context for drawing
  canvas = document.createElement('canvas')
  context = this.canvas.getContext('2d')

  constructor(size) {
    this.STATE = {
      ...this.STATE,
      stars: generateStarPool(size),
    }
    this.setup()
  }
  // On set up set the canvas size to the current window height/width
  setup = () => {
    this.canvas.height = window.innerHeight
    this.canvas.width = window.innerWidth
    this.context.lineCap = 'round'
  }
  /**
   * On render, render all the stars correctly, updating before we draw.
   * Update characteristics are based on the Object passed in. Jumping, entering, initiating jump etc.
   */
  render = () => {
    // Clear the canvas
    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    // 1. Shall we add a new star
    const nonActive = this.STATE.stars.filter(s => !s.STATE.active)
    if (nonActive.length > 0 && Math.random() > ACTIVE_PROBABILITY) {
      // Introduce a star
      nonActive[0].STATE.active = true
    }
    // 2. Update the stars and draw them.
    for (const star of this.STATE.stars) {
      const { active, x, y } = star.STATE
      // Check if the star needs deactivating
      if (
        (x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight) &&
        active
      ) {
        star.reset(true)
      } else if (star.STATE.active) {
        const size = star.STATE.size * SIZE_INC
        star.STATE = {
          ...star.STATE,
          x: star.STATE.x + star.STATE.vX,
          vX: star.STATE.vX * VELOCITY_INC,
          y: star.STATE.y + star.STATE.vY,
          vY: star.STATE.vY * VELOCITY_INC,
          size,
        }
        this.context.strokeStyle = `rgba(255, 255, 255, ${star.STATE.alpha})`
        this.context.lineWidth = star.STATE.size
        this.context.beginPath()
        this.context.moveTo(x, y)
        this.context.lineTo(star.STATE.x, star.STATE.y)
        this.context.stroke()
      }
    }
  }
}
// Class for the actual app
// Not too much happens in here
// Initiate the drawing process and listen for user interactions 👍
class JumpToHyperspace {
  STATE = {
    stars: new StarSheet(300),
  }
  canvas = document.createElement('canvas')
  context = this.canvas.getContext('2d')
  constructor() {
    this.setup()
    document.body.appendChild(this.canvas)
    this.render()
    this.bind()
  }
  render = () => {
    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    this.STATE.stars.render()
    this.context.drawImage(this.STATE.stars.canvas, 0, 0)
    requestAnimationFrame(this.render)
  }
  initiate = () => {
    this.STATE = {
      ...this.STATE,
      initiating: true,
    }
  }
  jump = () => {}
  enter = () => {
    this.STATE = {
      ...this.STATE,
      initiating: false,
    }
  }
  bind = () => {
    this.canvas.addEventListener('mousedown', this.initiate)
    this.canvas.addEventListener('touchstart', this.initiate)
    this.canvas.addEventListener('mouseup', this.slow)
    this.canvas.addEventListener('touchend', this.slow)
  }
  setup = () => {
    this.canvas.height = window.innerHeight
    this.canvas.width = window.innerWidth
  }
}
window.myJump = new JumpToHyperspace()
