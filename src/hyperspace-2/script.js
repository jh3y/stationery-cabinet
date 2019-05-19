const { TweenMax } = window
/**
 * Utility function for returning a random integer in a given range
 * @param {Int} max
 * @param {Int} min
 */
const randomInRange = (max, min) =>
  Math.floor(Math.random() * (max - min + 1)) + min
const ACTIVE_PROBABILITY = 0
const BASE_SIZE = 1
const VELOCITY_INC = 1.01
const VELOCITY_INIT_INC = 1.025
const JUMP_VELOCITY_INC = 1.25
const JUMP_SIZE_INC = 1.05
const SIZE_INC = 1.001
const RAD = Math.PI / 180
const WARP_COLORS = [
  [197, 239, 247],
  [25, 181, 254],
  [77, 5, 232],
  [165, 55, 253],
  [255, 255, 255],
]
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
      iX: undefined,
      iY: undefined,
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

// Class for the actual app
// Not too much happens in here
// Initiate the drawing process and listen for user interactions 👍
class JumpToHyperspace {
  STATE = {
    stars: generateStarPool(1000),
  }
  canvas = document.createElement('canvas')
  context = this.canvas.getContext('2d')
  constructor() {
    this.bind()
    this.setup()
    document.body.appendChild(this.canvas)
    this.render()
  }
  render = () => {
    // Clear the canvas
    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    if (this.STATE.bgAlpha > 0) {
      this.context.fillStyle = `rgba(228, 241, 254, ${this.STATE.bgAlpha})`
      this.context.fillRect(0, 0, window.innerWidth, window.innerHeight)
    }
    // 1. Shall we add a new star
    const nonActive = this.STATE.stars.filter(s => !s.STATE.active)
    const INTRO_PROB = this.STATE.jumping
      ? true
      : Math.random() > ACTIVE_PROBABILITY
    if (!this.STATE.initiating && nonActive.length > 0 && INTRO_PROB) {
      // Introduce a star
      nonActive[0].STATE.active = true
    }
    // 2. Update the stars and draw them.
    for (const star of this.STATE.stars.filter(s => s.STATE.active)) {
      const { active, x, y, iX, iY, iVX, iVY } = star.STATE
      // Check if the star needs deactivating
      if (
        ((iX || x) < 0 ||
          (iX || x) > window.innerWidth ||
          (iY || y) < 0 ||
          (iY || y) > window.innerHeight) &&
        active &&
        !this.STATE.initiating
      ) {
        star.reset(true)
      } else if (star.STATE.active) {
        const size = this.STATE.jumping
          ? star.STATE.size * JUMP_SIZE_INC
          : star.STATE.size * SIZE_INC
        let V = VELOCITY_INC
        if (this.STATE.initiating) V = VELOCITY_INIT_INC
        if (this.STATE.jumping) V = JUMP_VELOCITY_INC
        const newIX = this.STATE.initiating ? iX : iX + iVX
        const newIY = this.STATE.initiating ? iY : iY + iVY
        const newX = star.STATE.x + star.STATE.vX
        const newY = star.STATE.y + star.STATE.vY
        // Just need to work out if it overtakes the original line that's all
        const caught =
          (star.STATE.vX < 0 && newIX < x) ||
          (star.STATE.vX > 0 && newIX > x) ||
          (star.STATE.vY < 0 && newIY < y) ||
          (star.STATE.vY > 0 && newIY > y)
        star.STATE = {
          ...star.STATE,
          iX: caught ? undefined : newIX,
          iY: caught ? undefined : newIY,
          iVX: caught ? undefined : iVX * V,
          iVY: caught ? undefined : iVY * V,
          x: newX,
          vX: star.STATE.vX * V,
          y: newY,
          vY: star.STATE.vY * V,
          size,
        }
        let color = `rgba(255, 255, 255, ${star.STATE.alpha})`
        if (this.STATE.jumping) {
          const [r, g, b] = WARP_COLORS[randomInRange(0, WARP_COLORS.length)]
          color = `rgba(${r}, ${g}, ${b}, ${star.STATE.alpha})`
        }
        this.context.strokeStyle = color
        this.context.lineWidth = star.STATE.size
        this.context.beginPath()
        this.context.moveTo(star.STATE.iX || x, star.STATE.iY || y)
        this.context.lineTo(star.STATE.x, star.STATE.y)
        this.context.stroke()
      }
    }
    requestAnimationFrame(this.render)
  }
  initiate = () => {
    if (this.STATE.jumping || this.STATE.initiating) return
    this.STATE = {
      ...this.STATE,
      initiating: true,
      initiateTimestamp: new Date().getTime(),
    }
    // When we initiate, stop the XY origin from moving so that we draw
    // longer lines until the jump
    for (const star of this.STATE.stars.filter(s => s.STATE.active)) {
      star.STATE = {
        ...star.STATE,
        iX: star.STATE.x,
        iY: star.STATE.y,
        iVX: star.STATE.vX,
        iVY: star.STATE.vY,
      }
    }
  }
  jump = () => {
    this.STATE = {
      ...this.STATE,
      bgAlpha: 0,
      jumping: true,
    }
    TweenMax.to(this.STATE, 1, { bgAlpha: 0.75 })
    setTimeout(() => {
      this.STATE = {
        ...this.STATE,
        jumping: false,
      }
      TweenMax.to(this.STATE, 0.5, { bgAlpha: 0 })
    }, 5000)
  }
  enter = () => {
    const { initiateTimestamp } = this.STATE
    this.STATE = {
      ...this.STATE,
      initiating: false,
      initiateTimestamp: undefined,
    }
    if (new Date().getTime() - initiateTimestamp > 500) this.jump()
  }
  bind = () => {
    this.canvas.addEventListener('mousedown', this.initiate)
    this.canvas.addEventListener('touchstart', this.initiate)
    this.canvas.addEventListener('mouseup', this.enter)
    this.canvas.addEventListener('touchend', this.enter)
  }
  setup = () => {
    this.context.lineCap = 'round'
    this.canvas.height = window.innerHeight
    this.canvas.width = window.innerWidth
  }
}
window.myJump = new JumpToHyperspace()
