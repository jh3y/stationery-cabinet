CSS.registerProperty({
  name: '--noise',
  syntax: '<number>',
  inherits: false,
  initialValue: 0,
})

const worklet = `
const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}


if (typeof registerPaint !== 'undefined') {
  const PROPS = [
    '--tesla', // Trick here is to listen something being animated so it triggers repaint
    '--tesla-x1',
    '--tesla-x2',
    '--tesla-y1',
    '--tesla-y2',
    '--tesla-hue',
  ]
  class TeslaCoil {
    static get inputProperties() {
      return PROPS
    }

    parseProps(props) {
      return PROPS.map(
        prop =>
          props
            .get(prop)
            .toString()
            .trim()
      )
    }

    generateSegments(startX, endX, startY, endY) {
      const FIELD = startY * 0.75
      const result = []
      let refX = startX
      let refY = startY
      const getDistance = (x, y) => {
        const xLength = endX - x
        const yLength = endY - y
        const distance = Math.sqrt(xLength * xLength + yLength * yLength)
        return distance
      }
      const addSegment = (refX, refY) => {
        let angleToCenter = Math.atan2(endY - refY, endX - refX) * (180 / Math.PI)
        const lowerAngle = angleToCenter - FIELD
        const upperAngle = angleToCenter + FIELD
        const angle = getRandom(lowerAngle, upperAngle) * (Math.PI / 180)
        const distance = getDistance(refX, refY)
        const radius = getRandom(10, Math.min(60, distance))
        const x = refX + radius * Math.cos(angle)
        const y = refY + radius * Math.sin(angle)
        refX = x
        refY = y
        result.push([x, y])
        if (getDistance(x, y) > 5) {
          addSegment(x, y)
        }
      }
      addSegment(refX, refY)
      return result
    }

    drawLine(ctx, x1, x2, y1, y2) {
      const SEGMENTS = this.generateSegments(x1, x2, y1, y2)
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      for (const SEGMENT of SEGMENTS)
        ctx.lineTo(SEGMENT[0], SEGMENT[1])
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    paint(ctx, size, properties) {
      this.__ctx = ctx
      const COLOR = '#19b5fe'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = COLOR
      ctx.shadowColor = COLOR
      ctx.shadowBlur = 10
      const [x1, x2, y1, y2, hue] = this.parseProps(properties)
      this.drawLine(ctx, 0, size.width, size.height * 0.5, size.height * 0.5)
    }
  }

  registerPaint('tesla-coil', TeslaCoil)
}`

const workletBlob = URL.createObjectURL(
  new Blob([worklet], { type: 'application/javascript' })
)

window.CSS.paintWorklet.addModule(workletBlob)
