const { _ } = window

const randomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min

const VELOCITY_BASE = 1
const VELOCITY_LIMIT = 2
const BASE_SIZE = 10
const BASE_SCALE = 0.1
const ALPHA_STEP = 0.02
const ALPHA_LIMIT = 1
const SCALE_STEP = 0.001
const STAR_PROBABILITY = 0.5
const PARTICLE_AMOUNT = 1000
const FLASH_COLORS = [[197, 239, 247], [25, 181, 254], [77, 5, 232]]

class Star {
  canvas = document.createElement('canvas')
  context = this.canvas.getContext('2d')
  STATE = {
    active: false,
    characteristics: {
      alpha: Math.random(),
      angle: randomInRange(0, 360) * (Math.PI / 180),
      size: BASE_SIZE,
      scale: BASE_SCALE,
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
    const velocity = VELOCITY_BASE
    const lower = start
      ? start
      : velocity === 0
        ? window.innerWidth * 0.25
        : Math.min(50, window.innerWidth * 0.1)
    const travelled = randomInRange(lower, window.innerWidth)
    const x = Math.floor(Math.sin(angle) * travelled) + innerWidth / 2
    const y = Math.floor(Math.cos(angle) * travelled) + innerHeight / 2
    const active =
      travelled > Math.min(50, window.innerWidth * 0.1) || velocity === 0
        ? true
        : false
    this.STATE = {
      active,
      characteristics: {
        ...this.STATE.characteristics,
        alpha,
        angle,
        scale: BASE_SCALE,
        velocity,
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
      innerHeight / 2
    const velocity = jumping
      ? VELOCITY_LIMIT
      : this.STATE.characteristics.velocity
    this.STATE = {
      ...this.STATE,
      characteristics: {
        ...this.STATE.characteristics,
        scale: velocity
          ? this.STATE.characteristics.scale + SCALE_STEP
          : this.STATE.characteristics.scale,
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

class HyperSpace {
  constructor(options) {
    this.options = options
    this.setup()
    document.body.appendChild(this.canvas)
    this.render()
    this.bindAction()
  }
  STATE = {
    jumping: false,
    starPool: [],
  }

  canvas = document.createElement('canvas')
  context = this.canvas.getContext('2d')
  render = () => {
    const { context } = this
    context.save()
    if (!this.STATE.jumping && !this.STATE.toBeCleared)
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)

    // Should we activate some items?
    if (!this.STATE.jumping && this.STATE.toBeCleared) {
      // Do something else instead of updating items
      if (this.STATE.blanketOpacity >= ALPHA_LIMIT) {
        this.STATE = {
          ...this.STATE,
          flashed: true,
          toBeCleared: false,
          jumping: false,
          starPool: this.generateStars(this.options.limit),
        }
      } else if (!this.STATE.flashed) {
        context.fillStyle = `rgba(255, 255, 255, ${(this.STATE.blanketOpacity +=
          ALPHA_STEP * 5)})`
        context.fillRect(0, 0, innerWidth, innerHeight)
      }
    } else {
      if (
        Math.random() > STAR_PROBABILITY &&
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
          star.reset(this.STATE.jumping ? undefined : 50)
        } else if (star.STATE.active) {
          star.update(this.STATE.jumping)
          context.drawImage(
            star.canvas,
            star.STATE.position.x - star.STATE.characteristics.size / 2,
            star.STATE.position.y - star.STATE.characteristics.size / 2,
            star.STATE.characteristics.size * star.STATE.characteristics.scale,
            star.STATE.characteristics.size * star.STATE.characteristics.scale
          )
        }
      }
      if (this.STATE.blanketOpacity >= 0) {
        const [r, g, b] = FLASH_COLORS[randomInRange(0, FLASH_COLORS.length)]
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${(this.STATE.blanketOpacity -= ALPHA_STEP)})`
        context.fillRect(0, 0, innerWidth, innerHeight)
      }
    }
    requestAnimationFrame(this.render)
  }
  jump = () => {
    this.STATE = {
      ...this.STATE,
      jumping: true,
      toBeCleared: true,
      flashed: false,
      blanketOpacity: 0,
      initiated: new Date().getTime(),
    }
  }
  slow = () => {
    // At this stage we need to clear the jets and then reset all the stars to new position
    const stop = new Date().getTime()
    if (stop - this.STATE.initiated >= 2000) {
      this.STATE.jumping = false
    } else {
      this.STATE = {
        ...this.STATE,
        jumping: false,
        toBeCleared: false,
      }
    }
  }
  bindAction = () => {
    this.canvas.addEventListener('mousedown', this.jump)
    this.canvas.addEventListener('touchstart', this.jump)
    this.canvas.addEventListener('mouseup', this.slow)
    this.canvas.addEventListener('touchend', this.slow)
  }
  generateStars = amount => {
    const result = []
    for (let s = 0; s < amount; s++) {
      result.push(new Star())
    }
    return result
  }
  reset = () => {
    this.STATE = {}
    this.setup()
  }
  setup = () => {
    this.canvas.height = innerHeight
    this.canvas.width = innerWidth
    this.STATE.starPool = this.generateStars(this.options.limit)
  }
}
const myHyperspace = new HyperSpace({
  limit: PARTICLE_AMOUNT,
})
window.addEventListener(
  'resize',
  _.debounce(() => {
    myHyperspace.reset()
  }, 250)
)
