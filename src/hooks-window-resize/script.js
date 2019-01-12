const { React, ReactDOM } = window
const { useEffect, useState } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const getDimensions = () => ({
  height: innerHeight,
  width: innerWidth,
})

const App = () => {
  const [dimensions, setDimensions] = useState(getDimensions())
  const update = () => setDimensions(getDimensions())

  useEffect(
    () => {
      window.addEventListener('resize', update)
      return () => {
        window.removeEventListener('resize', update)
      }
    },
    [dimensions]
  )
  return <h1>{`Height: ${dimensions.height}; Width: ${dimensions.width};`}</h1>
}

render(<App />, rootNode)
