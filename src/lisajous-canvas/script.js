const CANVAS = document.querySelector('canvas')
const CONTEXT = CANVAS.getContext('2d')
const SIZE = 220
// const UNIT = 220 / 5
CANVAS.width = CANVAS.height = SIZE

class Dial {
  constructor(options) {
    this.ROTATION = 90
    this.SPEED = options.speed
    this.RADIUS = options.radius
    this.CLOCKWISE = options.clockwise
    this.CANVAS = document.createElement('canvas')
    this.CANVAS.width = this.CANVAS.height = 60
    this.CONTEXT = this.CANVAS.getContext('2d')
    return this
  }
  update = () => {
    this.CONTEXT.save()
    this.CONTEXT.clearRect(0, 0, 60, 60)
    this.CONTEXT.strokeStyle = 'hsla(0, 0%, 100%, 0.1)'
    this.CONTEXT.translate(30, 30)
    this.CONTEXT.rotate((this.ROTATION * Math.PI) / 180)
    this.CONTEXT.translate(-30, -30)
    this.CONTEXT.beginPath()
    this.CONTEXT.arc(30, 30, this.RADIUS, 0, (360 * Math.PI) / 180)
    this.CONTEXT.stroke()
    this.CONTEXT.beginPath()
    this.CONTEXT.fillStyle = 'hsla(0, 100%, 50%, 1)'
    this.CONTEXT.arc(30, 30 - this.RADIUS, 2, 0, (360 * Math.PI) / 180)
    this.CONTEXT.fill()
    this.CONTEXT.restore()
    this.ROTATION = this.CLOCKWISE
      ? this.ROTATION + this.SPEED
      : this.ROTATION - this.SPEED
    return this.CANVAS
  }
  getXY = () => {
    // know the radius is 25 and the size is 60
    // x is 25cos(current rotation)
    // y is 25sin(current rotation)
    // That's from the center point also so normalize with 30 👍
    const x = Math.round(
      30 + this.RADIUS * Math.sin((this.ROTATION * Math.PI) / 180)
    )
    const y = Math.round(
      30 - this.RADIUS * Math.cos((this.ROTATION * Math.PI) / 180)
    )
    return { x, y }
  }
}

const LEFT_DIAL = new Dial({ speed: 3, clockwise: true, radius: 28 })
const RIGHT_DIAL = new Dial({ speed: 2.5, clockwise: true, radius: 28 })
const POINTS = []
const draw = () => {
  const { x: x1, y: y1 } = LEFT_DIAL.getXY()
  const { x: x2, y: y2 } = RIGHT_DIAL.getXY()
  CONTEXT.clearRect(0, 0, 220, 220)
  CONTEXT.drawImage(LEFT_DIAL.update(), 0, 80)
  CONTEXT.drawImage(RIGHT_DIAL.update(), 80, 0)
  CONTEXT.strokeStyle = 'hsla(0, 100%, 100%, 0.25)'
  CONTEXT.beginPath()
  CONTEXT.moveTo(x1, y1 + 80)
  CONTEXT.lineTo(220, y1 + 80)
  CONTEXT.stroke()
  CONTEXT.beginPath()
  CONTEXT.moveTo(x2 + 80, y2)
  CONTEXT.lineTo(x2 + 80, 220)
  CONTEXT.stroke()
  POINTS.push([x2, y1])
  CONTEXT.fillStyle = 'hsl(225, 50%, 75%)'
  for (const POINT of POINTS) {
    CONTEXT.beginPath()
    CONTEXT.arc(80 + POINT[0], 80 + POINT[1], 1, 0, (360 * Math.PI) / 180)
    CONTEXT.fill()
  }
  requestAnimationFrame(draw)
}

draw()
