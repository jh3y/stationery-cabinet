const { React, ReactDOM } = window
const { useEffect, useState, useRef, Fragment } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

const FIELD = 65
const BLUR = 25
const WIDTH = 5
const COLOR = '#a537fd'

const generateSegments = (startX, startY) => {
  const result = []
  let refX = startX
  let refY = startY
  const getDistance = (x, y) => {
    const xLength = innerWidth / 2 - x
    const yLength = innerHeight / 2 - y
    const distance = Math.sqrt(xLength * xLength + yLength * yLength)
    return distance
  }
  const addSegment = (refX, refY) => {
    let angleToCenter =
      Math.atan2(innerHeight / 2 - refY, innerWidth / 2 - refX) *
      (180 / Math.PI)
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
    if (getDistance(x, y) > 100) {
      addSegment(x, y)
    }
  }
  addSegment(refX, refY)
  return result
}

const App = () => {
  const [active, setActive] = useState(false)
  const x = useRef(0)
  const y = useRef(0)
  const canvas = useRef(null)
  const context = useRef(null)
  const draw = useRef(null)

  const drawLine = (x, y) => {
    context.current.beginPath()
    context.current.moveTo(x, y)
    const segments = generateSegments(x, y, 10)
    for (const segment of segments)
      context.current.lineTo(segment[0], segment[1])
    context.current.lineTo(innerWidth / 2, innerHeight / 2)
    context.current.stroke()
  }

  const startDraw = () => {
    context.current.clearRect(0, 0, innerWidth, innerHeight)
    drawLine(x.current, y.current)
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
  }
  const updateXY = e => {
    x.current = e.touches && e.touches.length ? e.touches[0].pageX : e.pageX
    y.current = e.touches && e.touches.length ? e.touches[0].pageY : e.pageY
  }
  const updateAndStart = e => {
    activate()
    updateXY(e)
  }
  const activate = () => setActive(true)
  const deactivate = () => setActive(false)

  useEffect(
    () => {
      if (active) {
        draw.current = requestAnimationFrame(startDraw)
      } else {
        if (context.current)
          context.current.clearRect(0, 0, innerWidth, innerHeight)
        cancelAnimationFrame(draw.current)
        draw.current = null
      }
    },
    [active]
  )

  useEffect(() => {
    setCanvasProperties()
    document.body.addEventListener('mousedown', updateAndStart)
    document.body.addEventListener('mousemove', updateXY)
    document.body.addEventListener('mouseup', deactivate)
    document.body.addEventListener('touchstart', updateAndStart)
    document.body.addEventListener('touchmove', updateXY)
    document.body.addEventListener('touchend', deactivate)
    window.addEventListener('resize', setCanvasProperties)

    return () => {
      document.body.removeEventListener('mousedown', updateAndStart)
      document.body.removeEventListener('mousemove', updateXY)
      document.body.removeEventListener('mouseup', deactivate)
      document.body.removeEventListener('touchstart', updateAndStart)
      document.body.removeEventListener('touchmove', updateXY)
      document.body.removeEventListener('touchend', deactivate)
      window.removeEventListener('resize', setCanvasProperties)
    }
  }, [])

  return (
    <Fragment>
      <canvas ref={canvas} />
      <div
        className={`tesla-coil__head ${active && 'tesla-coil__head--active'}`}
      />
      <div className="tesla-coil__body">
        <div className="tesla-coil__ring" />
        <div className="tesla-coil__ring" />
        <div className="tesla-coil__ring" />
        <div className="tesla-coil__base">
          <div />
          <div />
          <div />
        </div>
      </div>
    </Fragment>
  )
}

render(<App />, rootNode)
