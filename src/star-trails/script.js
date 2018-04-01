const getNumberInRange = (upper, lower = 0, negate = false) => {
  let result = Math.floor(Math.random() * upper + lower)
  if (negate) {
    return (result *= Math.random() > 0.5 ? 1 : -1)
  } else {
    return result
  }
}

class Star {
  DEFAULTS = {
    fillColor: '#22a7f0',
  }

  STATE = {
    active: false,
    life: 0,
    velocityX: getNumberInRange(3, 1, true),
    velocityY: getNumberInRange(3, 1, true),
  }

  constructor(options) {
    const { x, y } = options
    let { STATE } = this
    this.OPTIONS = Object.assign({}, this.DEFAULTS, options)
    this.STATE = Object.assign({}, this.STATE, {
      x,
      y,
      scale: 0,
      opacity: 0,
    })
  }
  activate = () => {
    this.STATE = Object.assign({}, this.STATE, {
      active: true,
    })
  }
  reset = () => {
    this.STATE = Object.assign({}, this.STATE, {
      active: false,
      life: 0,
      scale: 0,
      opacity: 0,
      x: Math.floor(getNumberInRange(window.innerWidth, 1)),
      y: Math.floor(getNumberInRange(window.innerHeight, 1)),
      velocityX: getNumberInRange(3, 1, true),
      velocityY: getNumberInRange(3, 1, true),
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
    const { opacity, scale, rotation, x, y } = STATE
    const { size, fillColor } = OPTIONS
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')
    context.save()
    context.fillStyle = fillColor
    context.globalAlpha = opacity
    context.translate(size / 2, size / 2)
    context.rotate(rotation * (Math.PI / 180))
    context.translate(size / -2, size / -2)
    context.scale(scale, scale)
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
    context.stroke()
    context.restore()
    parent.drawImage(canvas, x, y)
  }
}

class StarTrail {
  DEFAULTS = {
    particleLife: 300,
    particleRenderProbability: 0.95,
    amount: 5,
    trippy: false,
    starColor: '#663399'
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
    this.PARTICLES = []
    this.CANVAS.width = window.innerWidth
    this.CANVAS.height = window.innerHeight
    this.flush()
  }
  flush = () => {
    const { OPTIONS } = this
    const { particleLife } = OPTIONS
    for (let i = 0; i < OPTIONS.amount; i++) {
      const size = getNumberInRange(50, 20)
      const rotation = getNumberInRange(360)
      const x = getNumberInRange(window.innerWidth)
      const y = getNumberInRange(window.innerHeight)
      const death = getNumberInRange(particleLife, particleLife / 2)
      const fillColor = OPTIONS.starColor === 'random' ? `rgb(${Math.floor(getNumberInRange(255))}, ${Math.floor(getNumberInRange(255))}, ${Math.floor(getNumberInRange(255))})` : OPTIONS.starColor
      this.PARTICLES.push(
        new Star({
          size,
          rotation,
          x,
          y,
          death,
          fillColor,
        })
      )
    }
  }
  render = () => {
    const { CANVAS, CONTEXT, PARTICLES, OPTIONS } = this
    CONTEXT.save()
    const activeParticles = PARTICLES.filter(p => p.STATE.active)
    const inactiveParticles = PARTICLES.filter(p => !p.STATE.active)
    if (
      Math.random() > OPTIONS.particleRenderProbability &&
      activeParticles.length < OPTIONS.amount
    ) {
      inactiveParticles[0].activate()
    }
    for (let p = 0; p < PARTICLES.length; p++) {
      const PARTICLE = PARTICLES[p]
      if (PARTICLE) {
        if (
          PARTICLE.STATE.life === PARTICLE.OPTIONS.death ||
          PARTICLE.STATE.x > window.innerWidth ||
          PARTICLE.STATE.x < -PARTICLE.OPTIONS.size ||
          PARTICLE.STATE.y > window.innerHeight ||
          PARTICLE.STATE.y < -PARTICLE.OPTIONS.size
        ) {
          PARTICLE.reset()
        } else if (PARTICLE.STATE.active) {
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
const myStars = new StarTrail({ id: 'app', amount: 20, starColor: 'random' })
window.addEventListener(
  'resize',
  _.debounce(() => {
    myStars.reset()
  }, 250)
)
