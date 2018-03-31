const getNumberInRange = (upper, lower = 0, negate = false) => {
  let result = Math.random() * upper + lower
  if (negate) {
    return (result *= Math.random() > 0.5 ? 1 : -1)
  } else {
    return result
  }
}

class Particle {
  DEFAULTS = {
    fillColor: '#22a7f0',
  }

  STATE = {
    active: false,
    life: 0,
    velocityX: getNumberInRange(1),
    velocityY: getNumberInRange(1),
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
      canvas,
      context,
    })
    this.initCanvas()
  }
  initCanvas = () => {
    const { fillColor, size, rotation } = this.OPTIONS
    const { canvas, context, opacity } = this.STATE
    canvas.width = size
    context.save()
    context.drawImage(IMG, 0, 0)
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
      x: getNumberInRange(window.innerWidth),
      y: getNumberInRange(window.innerHeight),
      velocityX: getNumberInRange(1, 0, true),
      velocityY: getNumberInRange(1, 0, true),
      rotation: getNumberInRange(360),
    })
  }
  update = () => {
    let { OPTIONS, STATE } = this
    const { death } = OPTIONS
    const { life, velocityX, velocityY, x, y } = STATE

    let newVelocityX = velocityX * 1.075
    let newVelocityY = velocityY * 1.075

    this.STATE = Object.assign({}, STATE, {
      x: x + velocityX,
      y: y + velocityY,
      life: life + 1,
      velocityX: newVelocityX,
      velocityY: newVelocityY,
    })
  }

  render = parent => {
    const { STATE } = this
    const { canvas, x, y } = STATE
    parent.drawImage(canvas, x, y)
  }
}

class ShootingSVG {
  DEFAULTS = {
    particleLife: 300,
    particleRenderProbability: 0.95,
    amount: 5,
    trippy: false,
  }

  PARTICLES = []

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
    const { CONTEXT, OPTIONS } = this
    const { amount, particleLife } = OPTIONS
    for (let i = 0; i < amount; i++) {
      const size = getNumberInRange(50, 10)
      const rotation = getNumberInRange(360)
      const x = getNumberInRange(window.innerWidth)
      const y = getNumberInRange(window.innerHeight)
      const death = getNumberInRange(particleLife, particleLife / 2)
      this.PARTICLES.push(
        new Particle({
          id: i,
          size,
          rotation,
          x,
          y,
          death,
          canvas: this,
        })
      )
    }
  }
  render = () => {
    const { CANVAS, CONTEXT, PARTICLE_POOL, PARTICLES, OPTIONS } = this
    CONTEXT.save()
    const activeParticles = PARTICLES.filter(p => p.STATE.active)
    const inactiveParticles = PARTICLES.filter(p => !p.STATE.active)
    if (
      Math.random() > OPTIONS.particleRenderProbability &&
      activeParticles < OPTIONS.amount
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
const SVG = document.querySelector('svg')
const IMG = document.createElement('img')
IMG.onload = function() {
  SVG.remove()
  const myParticles = new ShootingSVG({ id: 'app', amount: 10 })
  window.addEventListener('resize', _.debounce(() => {
    myParticles.reset()
  }, 250))
}
IMG.src = `data:image/svg+xml,${encodeURIComponent(SVG.outerHTML)}`
