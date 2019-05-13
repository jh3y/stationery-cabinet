const randomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min

const VELOCITY_BASE = 1
const VELOCITY_LIMIT = 3

class Star {
  canvas = document.createElement('canvas')
  context = this.canvas.getContext('2d')
  STATE = {
    active: false,
    characteristics: {
      alpha: Math.random(),
      angle: randomInRange(0, 360) * (Math.PI / 180),
      size: randomInRange(1, 4),
      velocity: VELOCITY_BASE,
    },
  }
  activate = () => {
    this.STATE = {
      ...this.STATE,
      active: true,
    }
  }
  reset = start => {
    const angle = randomInRange(0, 360) * (Math.PI / 180)
    const alpha = Math.random()
    // TODO:: Start with everything at the same size so you get a good scale and then start the scale at a small scale and add to the scale
    // This way you preserve the quality fof the circle whilst it scales up
    // TODO:: the scale needs to actually relate to the distance travelled not the set size. It would make more sense to be proportionate to distance travelled

    const size = randomInRange(10, 10)
    const travelled = randomInRange(15, start ? start : innerWidth)
    const active = travelled > 50 ? true : false
    const x = Math.floor(Math.sin(angle) * travelled) + innerWidth / 2
    const y = Math.floor(Math.cos(angle) * travelled) + innerWidth / 2
    this.STATE = {
      active,
      characteristics: {
        alpha,
        angle,
        size,
        velocity: VELOCITY_BASE,
      },
      position: {
        x,
        y,
      },
      distance: {
        travelled,
      },
    }
  }
  render = () => {
    const { alpha, size } = this.STATE.characteristics
    this.canvas.height = this.canvas.width = size
    this.context.globalAlpha = alpha
    this.context.fillStyle = '#eeeeee'
    this.context.beginPath()
    this.context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
    this.context.fill()
  }
  update = jumping => {
    const x =
      Math.floor(
        Math.sin(this.STATE.characteristics.angle) *
          this.STATE.distance.travelled
      ) +
      innerWidth / 2
    const y =
      Math.floor(
        Math.cos(this.STATE.characteristics.angle) *
          this.STATE.distance.travelled
      ) +
      innerWidth / 2
    const velocity = jumping ? VELOCITY_LIMIT : VELOCITY_BASE
    // const size = (this.STATE.characteristics.size += 0.025)
    this.STATE = {
      ...this.STATE,
      characteristics: {
        ...this.STATE.characteristics,
        // size,
        velocity,
      },
      position: {
        x,
        y,
      },
      distance: {
        ...this.STATE.distance,
        travelled: this.STATE.distance.travelled + velocity,
      },
    }
  }
  constructor() {
    this.reset()
    this.canvas.height = this.canvas.width = this.STATE.characteristics.size
    this.render()
  }
}
/**
 * Sprinkled
 * Dont clear
 * then fade to black
 * Resprinkle from opacity 0
 */
class HyperSpace {
  constructor(options) {
    this.options = options
    this.setup()
    document.body.appendChild(this.canvas)
    this.render()
  }
  STATE = {
    jumping: false,
    starPool: [],
  }
  // create canvas/context instance on creation
  canvas = document.createElement('canvas')
  context = this.canvas.getContext('2d')
  render = () => {
    const { context } = this
    context.save()
    if (!this.STATE.jumping)
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    // Should we activate some items?
    if (
      Math.random() > 0.95 &&
      this.STATE.starPool.filter(s => s.STATE.active === false).length > 0 &&
      !this.STATE.jumping
    ) {
      this.STATE.starPool.filter(s => s.STATE.active === false)[0].activate()
    }

    for (const star of this.STATE.starPool) {
      // Check if it's within the bounds. If it isn't then it needs to be reset and deactivated
      if (
        star.STATE.position.x < 0 ||
        star.STATE.position.x > innerWidth ||
        star.STATE.position.y < 0 ||
        (star.STATE.position.y > innerHeight && star.STATE.active)
      ) {
        star.reset(50)
      } else if (star.STATE.active) {
        star.update(this.STATE.jumping)
        context.drawImage(
          star.canvas,
          star.STATE.position.x - star.STATE.characteristics.size / 2,
          star.STATE.position.y - star.STATE.characteristics.size / 2,
          star.STATE.characteristics.size,
          star.STATE.characteristics.size
        )
      }
    }
    // Uncomment to see those FPS stats 👍
    // console.log(new Date().toUTCString())
    requestAnimationFrame(this.render)
  }
  bindAction = () => {
    this.canvas.addEventListener('mousedown', () => {
      this.STATE.jumping = true
    })
    this.canvas.addEventListener('mouseup', () => {
      this.STATE.jumping = false
    })
  }
  setup = () => {
    this.canvas.height = innerHeight
    this.canvas.width = innerWidth
    for (let s = 0; s < this.options.limit; s++) {
      // Generate a new star
      this.STATE.starPool.push(new Star())
    }
    this.bindAction()
  }
}
new HyperSpace({
  limit: 200,
})
