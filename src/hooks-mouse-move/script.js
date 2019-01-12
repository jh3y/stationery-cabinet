const { React, ReactDOM } = window
const { useEffect, useState } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const App = () => {
  const [x, setX] = useState()
  const [y, setY] = useState()
  const update = e => {
    setX(e.x)
    setY(e.y)
  }
  useEffect(
    () => {
      window.addEventListener('mousemove', update)
      window.addEventListener('touchmove', update)
      return () => {
        window.removeEventListener('mousemove', update)
        window.removeEventListener('touchmove', update)
      }
    },
    [x, y]
  )
  return x && y ? <h1>{`x: ${x}; y: ${y};`}</h1> : null
}

render(<App />, rootNode)
