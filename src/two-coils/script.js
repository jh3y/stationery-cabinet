const { React, ReactDOM } = window
const { useEffect, useRef, Fragment } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

const FIELD = 65
const BLUR = 25
const WIDTH = 5
const COLOR = '#19b5fe'
// const COLOR = '#f62459'
const getGap = () => Math.max(innerWidth * 0.25, 150)

const generateSegments = (startX, startY, endX, endY) => {
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
    const angle = randomInRange(lowerAngle, upperAngle) * (Math.PI / 180)
    const distance = getDistance(refX, refY)
    const radius = randomInRange(10, Math.min(60, distance))
    const x = refX + radius * Math.cos(angle)
    const y = refY + radius * Math.sin(angle)
    refX = x
    refY = y
    result.push([x, y])
    if (getDistance(x, y) > 30) {
      addSegment(x, y)
    }
  }
  addSegment(refX, refY)
  return result
}

const App = () => {
  const x1 = useRef(null)
  const x2 = useRef(null)
  const y1 = useRef(null)
  const y2 = useRef(null)
  const gap = useRef(null)
  const canvas = useRef(null)
  const context = useRef(null)
  const draw = useRef(null)

  const drawLine = () => {
    context.current.beginPath()
    context.current.moveTo(x1.current, y1.current)
    const segments = generateSegments(
      x1.current,
      y1.current,
      x2.current,
      y2.current
    )
    for (const segment of segments)
      context.current.lineTo(segment[0], segment[1])
    context.current.lineTo(x2.current, y2.current)
    context.current.stroke()
  }

  const startDraw = () => {
    context.current.clearRect(0, 0, innerWidth, innerHeight)
    drawLine()
    draw.current = requestAnimationFrame(startDraw)
  }

  const setCanvasProperties = () => {
    canvas.current.width = canvas.current.style.width = innerWidth
    canvas.current.height = canvas.current.style.height = innerHeight
    context.current = canvas.current.getContext('2d')
    context.current.lineWidth = WIDTH
    context.current.lineCap = 'round'
    context.current.lineJoin = 'round'
    context.current.strokeStyle = COLOR
    context.current.shadowColor = COLOR
    context.current.shadowBlur = BLUR
    gap.current = getGap()
    document.documentElement.style.setProperty('--gap', gap.current)
    x1.current = innerWidth / 2 - gap.current / 2
    x2.current = innerWidth / 2 + gap.current / 2
    y1.current = y2.current = innerHeight / 2
  }

  useEffect(() => {
    setCanvasProperties()
    draw.current = requestAnimationFrame(startDraw)
    window.addEventListener('resize', setCanvasProperties)

    return () => {
      window.removeEventListener('resize', setCanvasProperties)
      cancelAnimationFrame(draw.current)
    }
  }, [])

  return (
    <Fragment>
      <canvas ref={canvas} />
      <div className="tesla-coil" />
      <div className="tesla-coil" />
    </Fragment>
  )
}

render(<App />, rootNode)
