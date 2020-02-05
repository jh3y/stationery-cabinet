const CANVAS = document.querySelector('canvas')
const CONTEXT = CANVAS.getContext('2d')
const SIZE = 600
const UNIT = SIZE / 3
CANVAS.width = CANVAS.height = SIZE

class Dial {
  constructor(options) {
    this.ROTATION = 90
    this.SPEED = options.speed
    this.RADIUS = options.radius
    this.CLOCKWISE = options.clockwise
    this.CANVAS = document.createElement('canvas')
    this.CANVAS.width = this.CANVAS.height = UNIT
    this.CONTEXT = this.CANVAS.getContext('2d')
    return this
  }
  update = () => {
    this.CONTEXT.save()
    this.CONTEXT.clearRect(0, 0, UNIT, UNIT)
    this.CONTEXT.strokeStyle = 'hsla(0, 0%, 100%, 0.1)'
    this.CONTEXT.lineWidth = 10
    this.CONTEXT.translate(UNIT / 2, UNIT / 2)
    this.CONTEXT.rotate((this.ROTATION * Math.PI) / 180)
    this.CONTEXT.translate(-UNIT / 2, -UNIT / 2)
    this.CONTEXT.beginPath()
    this.CONTEXT.arc(UNIT / 2, UNIT / 2, this.RADIUS, 0, (360 * Math.PI) / 180)
    this.CONTEXT.stroke()
    this.CONTEXT.beginPath()
    this.CONTEXT.fillStyle = 'hsla(0, 100%, 50%, 1)'
    this.CONTEXT.arc(
      UNIT / 2,
      UNIT / 2 - this.RADIUS,
      10,
      0,
      (360 * Math.PI) / 180
    )
    this.CONTEXT.fill()
    this.CONTEXT.restore()
    this.ROTATION = this.ROTATION + this.SPEED
    return this.CANVAS
  }
  getXY = () => {
    // know the radius is 25 and the size is 60
    // x is 25cos(current rotation)
    // y is 25sin(current rotation)
    // That's from the center point also so normalize with 30 👍
    const x = Math.round(
      UNIT / 2 + this.RADIUS * Math.sin((this.ROTATION * Math.PI) / 180)
    )
    const y = Math.round(
      UNIT / 2 - this.RADIUS * Math.cos((this.ROTATION * Math.PI) / 180)
    )
    return { x, y }
  }
}

/**
 * TODO: Put a pause feature in. Configure all the things 😎
 */

const LEFT_DIAL = new Dial({ speed: 3, radius: 90 })
const RIGHT_DIAL = new Dial({ speed: 3.75, radius: 90 })
const POINTS = []
const draw = () => {
  const { x: x1, y: y1 } = LEFT_DIAL.getXY()
  const { x: x2, y: y2 } = RIGHT_DIAL.getXY()
  CONTEXT.clearRect(0, 0, SIZE, SIZE)
  CONTEXT.drawImage(LEFT_DIAL.update(), 0, SIZE / 2)
  CONTEXT.drawImage(RIGHT_DIAL.update(), SIZE / 2, 0)
  CONTEXT.strokeStyle = 'hsla(0, 100%, 100%, 0.25)'
  CONTEXT.lineWidth = 5
  CONTEXT.beginPath()
  CONTEXT.moveTo(x1, y1 + SIZE / 2)
  CONTEXT.lineTo(SIZE, y1 + SIZE / 2)
  CONTEXT.stroke()
  CONTEXT.beginPath()
  CONTEXT.moveTo(x2 + SIZE / 2, y2)
  CONTEXT.lineTo(x2 + SIZE / 2, SIZE)
  CONTEXT.stroke()
  POINTS.push([x2, y1])
  CONTEXT.fillStyle = 'hsl(225, 50%, 75%)'
  for (const POINT of POINTS) {
    CONTEXT.beginPath()
    CONTEXT.arc(
      SIZE / 2 + POINT[0],
      SIZE / 2 + POINT[1],
      4,
      0,
      (360 * Math.PI) / 180
    )
    CONTEXT.fill()
  }
  requestAnimationFrame(draw)
}

draw()
