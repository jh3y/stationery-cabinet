const getNumberInRange = (upper, lower = 0, negate = false) => {
  let result = Math.random() * upper + lower
  if (negate) {
    return (result *= Math.random() > 0.5 ? 1 : -1)
  } else {
    return result
  }
}

class Star {
  DEFAULTS = {
    fillColor: '#663399'
  }

  STATE = {
    life: 0,
    velocityX: getNumberInRange(1, 0, true),
    velocityY: getNumberInRange(1, 0, true),
  }

  constructor(options) {
    const { x, y } = options
    let { STATE } = this
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    this.OPTIONS = Object.assign({}, this.DEFAULTS, options)
    this.STATE = Object.assign({}, this.STATE, {
      x,
      y,
      scale: 0,
      opacity: 0,
      canvas,
      context,
    })
    this.initCanvas()
  }
  initCanvas = () => {
    const { fillColor, size, rotation } = this.OPTIONS
    const { canvas, context, opacity } = this.STATE
    canvas.width = size
    canvas.height = size
    context.save()
    context.fillStyle = fillColor
    context.translate(size / 2, size / 2)
    context.rotate(rotation * (Math.PI / 180))
    context.translate(size / -2, size / -2)
    context.beginPath()
    let p = 0
    while (p <= 10) {
      let rotation = p * Math.PI / 5
      let radius = p % 2 === 0 ? size / 2 : size / 4
      context.lineTo(
        size / 2 + radius * Math.cos(rotation),
        size / 2 + radius * Math.sin(rotation)
      )
      p++
    }
    context.fill()
  }
  reset = () => {
    this.STATE = Object.assign({}, this.STATE, {
      life: 0,
      scale: 0,
      opacity: 0,
      x: Math.floor(getNumberInRange(window.innerWidth, 1)),
      y: Math.floor(getNumberInRange(window.innerHeight, 1)),
      velocityX: getNumberInRange(1, 0, true),
      velocityY: getNumberInRange(1, 0, true),
      rotation: Math.floor(getNumberInRange(360)),
    })
  }
  update = () => {
    let { OPTIONS, STATE } = this
    const { death } = OPTIONS
    const { life, opacity, scale, velocityX, velocityY, x, y } = STATE

    const ENTRY_STAGE = death * 0.25
    const EXIT_STAGE = death * 0.75

    let newOpacity = opacity
    let newScale = scale
    let newVelocityX = velocityX
    let newVelocityY = velocityY

    if (opacity < 1 && life < ENTRY_STAGE) {
      newOpacity = Math.min(1, opacity + 100 / ENTRY_STAGE / 100)
      newScale = Math.min(1, scale + 100 / ENTRY_STAGE / 100)
    } else if (life >= EXIT_STAGE) {
      newVelocityX *= 1.075
      newVelocityY *= 1.075
      newOpacity = Math.max(0, this.opacity - 100 / EXIT_STAGE / 100)
      newScale = Math.max(0, this.opacity - 100 / EXIT_STAGE / 100)
    }

    this.STATE = Object.assign({}, STATE, {
      x: x + velocityX,
      y: y + velocityY,
      life: life + 1,
      velocityX: newVelocityX,
      velocityY: newVelocityY,
      scale: newScale,
      opacity: newOpacity,
    })
  }

  render = parent => {
    const { OPTIONS, STATE } = this
    const { opacity, scale, rotation, x, y, canvas, context } = STATE
    const { size, fillColor } = OPTIONS
    context.rotate(Math.random() * 360 * (Math.PI / 180))
    parent.drawImage(canvas, x, y)
  }
}

class SeeingStars {
  DEFAULTS = {
    particleLife: 300,
    particleRenderProbability: 0.5,
    amount: 5,
    trippy: false,
  }

  PARTICLES = []

  PARTICLE_POOL = []

  constructor(config) {
    this.ID = config.id
    this.OPTIONS = Object.assign({}, this.DEFAULTS, config)
    this.CANVAS = document.getElementById(this.ID)
    this.CANVAS.width = window.innerWidth
    this.CANVAS.height = window.innerHeight
    this.CONTEXT = this.CANVAS.getContext('2d')
    this.flush()
    this.render()
  }
  reset = () => {
    this.PARTICLE_POOL = []
    this.PARTICLES = []
    this.CANVAS.width = window.innerWidth
    this.CANVAS.height = window.innerHeight
    this.flush()
  }
  flush = () => {
    const { PARTICLE_POOL, OPTIONS } = this
    const { particleLife } = OPTIONS
    for (let i = 0; i < OPTIONS.amount; i++) {
      const size = getNumberInRange(50, 20)
      const rotation = getNumberInRange(360)
      const x = getNumberInRange(window.innerWidth)
      const y = getNumberInRange(window.innerHeight)
      const death = getNumberInRange(particleLife, particleLife / 2)
      const colors = ['#e74c3c', '#22a7f0', '#663399', '#2eec71']
      PARTICLE_POOL.push(
        new Star({
          size,
          rotation,
          x,
          y,
          death,
          fillColor: colors[Math.floor(Math.random() * (colors.length + 1))]
        })
      )
    }
  }
  render = () => {
    const { CANVAS, CONTEXT, PARTICLE_POOL, PARTICLES, OPTIONS } = this
    CONTEXT.save()
    this.PARTICLE_POOL = []
    this.PARTICLES = []
    this.flush()
    CONTEXT.clearRect(0, 0, window.innerWidth, window.innerHeight)
    if (
      Math.random() > OPTIONS.particleRenderProbability &&
      PARTICLES.length < OPTIONS.amount
    ) {
      PARTICLES.push(PARTICLE_POOL.shift())
    }
    CONTEXT.clearRect(0, 0, window.innerWidth, window.innerHeight)
    for (let p = 0; p < PARTICLES.length; p++) {
      const PARTICLE = PARTICLES[p]
      if (PARTICLE) {
        if (
          PARTICLE.STATE.life === PARTICLE.OPTIONS.death ||
          PARTICLE.STATE.x > window.innerWidth ||
          PARTICLE.STATE.x < 0 ||
          PARTICLE.STATE.y > window.innerHeight ||
          PARTICLE.STATE.y < 0
        ) {
          // PARTICLES.splice(p, 1)
          // PARTICLE_POOL.push(PARTICLE)
          PARTICLE.reset()
        } else {
          PARTICLE.update()
          PARTICLE.render(CONTEXT)
        }
      }
    }
    CONTEXT.restore()
    // Uncomment to see those FPS stats 👍
    // console.log(new Date().toUTCString())
    requestAnimationFrame(() => this.render())
  }
}
const myStars = new SeeingStars({ id: 'app', amount: 20 })
window.addEventListener(
  'resize',
  _.debounce(() => {
    myStars.reset()
  }, 250)
)
