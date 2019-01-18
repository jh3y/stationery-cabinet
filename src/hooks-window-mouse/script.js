const { React, ReactDOM } = window
const { useEffect, useState, Fragment } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const getDimensions = () => ({
  height: innerHeight,
  width: innerWidth,
})

const useMousePosition = () => {
  const [x, setX] = useState()
  const [y, setY] = useState()
  const update = e => {
    setX(e.x)
    setY(e.y)
  }
  useEffect(
    () => {
      window.addEventListener('mousemove', update)
      return () => {
        window.removeEventListener('mousemove', update)
      }
    },
    [x, y]
  )
  return { x, y }
}

const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState(getDimensions())
  const updateSize = () => setDimensions(getDimensions())
  useEffect(
    () => {
      window.addEventListener('resize', updateSize)
      return () => {
        window.removeEventListener('resize', updateSize)
      }
    },
    [dimensions]
  )
  return dimensions
}

const App = () => {
  const { x, y } = useMousePosition()
  const dimensions = useWindowDimensions()
  return (
    <Fragment>
      {x && y && <h1>{`x: ${x}; y: ${y};`}</h1>}
      <h1>{`Height: ${dimensions.height}; Width: ${dimensions.width};`}</h1>
    </Fragment>
  )
}

render(<App />, rootNode)
