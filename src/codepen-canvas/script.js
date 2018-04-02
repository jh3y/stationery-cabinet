const getLogo = (canvas, size = 50, color = 'red', rotation = 45) => {
  const canvasWidth = size
  const canvasHeight = size
  const margin = canvasWidth * 0.05
  const lineWidth = canvasWidth * 0.08
  const lineColor = color
  const logoHeight = canvasHeight - margin * 2
  const logoWidth = canvasWidth - margin * 2
  const fractionHeight = logoHeight / 3
  const fractionWidth = logoWidth / 2

  const context = canvas.getContext('2d')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  context.lineCap = 'round'
  context.strokeStyle = lineColor
  context.lineWidth = lineWidth

  const arrPointsTop = [
    [canvasWidth / 2, margin],
    [logoWidth + margin, fractionHeight + margin],
    [fractionWidth + margin, fractionHeight * 2 + margin],
    [margin, fractionHeight + margin],
    [canvasWidth / 2, margin],
  ]

  const arrPointsBottom = [
    [canvasWidth / 2, fractionHeight + margin],
    [logoWidth + margin, fractionHeight * 2 + margin],
    [fractionWidth + margin, fractionHeight * 3 + margin],
    [margin, fractionHeight * 2 + margin],
    [canvasWidth / 2, margin + fractionHeight],
  ]

  const processPoints = points => {
    for (let p = 1; p < points.length; p++) {
      context.beginPath()
      context.strokeStyle = color
      context.moveTo(points[p - 1][0], points[p - 1][1])
      context.lineTo(points[p][0], points[p][1])
      context.stroke()
    }
  }

  // If we want to create a little background color clip
  context.beginPath()
  context.moveTo(canvasWidth / 2, margin)
  context.lineTo(margin + logoWidth, fractionHeight + margin)
  context.lineTo(margin + logoWidth, (fractionHeight * 2) + margin)
  context.lineTo(canvasWidth / 2, margin + logoHeight)
  context.lineTo(margin, (fractionHeight * 2) + margin)
  context.lineTo(margin, fractionHeight + margin)
  context.lineTo(canvasWidth / 2, margin)
  context.fillStyle = '#111'
  context.fill()
  context.closePath()


  context.rotate(rotation * Math.PI / 180)
  context.setTransform(1, 0, 0, 1, 0, 0);
  processPoints(arrPointsTop)
  processPoints(arrPointsBottom)

  context.beginPath()
  context.strokeStyle = color
  context.moveTo(canvasWidth / 2, margin)
  context.lineTo(canvasWidth / 2, fractionHeight + margin)
  context.moveTo(canvasWidth / 2, margin + fractionHeight * 2)
  context.lineTo(canvasWidth / 2, fractionHeight * 3 + margin)
  context.stroke()
  context.beginPath()
  context.moveTo(margin, margin + fractionHeight)
  context.lineTo(margin, fractionHeight * 2 + margin)
  context.stroke()

  context.beginPath()
  context.moveTo(logoWidth + margin, margin + fractionHeight)
  context.lineTo(logoWidth + margin, fractionHeight * 2 + margin)
  context.stroke()
  return canvas
}

const getNumberInRange = (upper, lower = 0, negate = false) => {
  let result = Math.floor(Math.random() * upper + lower)
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
    velocityX: getNumberInRange(3, 1, true),
    velocityY: getNumberInRange(3, 1, true),
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
    getLogo(canvas, size, fillColor, rotation)
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
      velocityX: getNumberInRange(3, 1, true),
      velocityY: getNumberInRange(3, 1, true),
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
      const size = getNumberInRange(100, 10)
      const rotation = getNumberInRange(360)
      const x = getNumberInRange(window.innerWidth)
      const y = getNumberInRange(window.innerHeight)
      const death = getNumberInRange(particleLife, particleLife / 2)
      const fillColor = `rgb(${Math.floor(getNumberInRange(255))}, ${Math.floor(
              getNumberInRange(255)
            )}, ${Math.floor(getNumberInRange(255))})`
      this.PARTICLES.push(
        new Particle({
          id: i,
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
const myParticles = new ShootingSVG({ id: 'app', amount: 10 })
window.addEventListener(
'resize',
_.debounce(() => {
    myParticles.reset()
  }, 250)
)

// getLogo(document.querySelector('canvas'))