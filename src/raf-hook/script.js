const { React, ReactDOM } = window
const { useEffect, useState } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const useRAF = callback => {
  const [handler, setHandler] = useState()
  useEffect(() => {
    let rafId
    setHandler(() => {
      let active = false
      return e => {
        if (active) {
          return false
        } else {
          active = true
          const onFrame = () => {
            callback(e)
            active = false
          }
          rafId = requestAnimationFrame(onFrame)
        }
      }
    })
    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [])
  return handler
}

const App = () => {
  const [x, setX] = useState(Date.now())
  const [y, setY] = useState(Date.now())
  const handler = useRAF(e => {
    setX(e.x)
    setY(e.y)
  })
  useEffect(() => {
    window.addEventListener('mousemove', handler)
    return () => {
      window.removeEventListener('mousemove', handler)
    }
  })
  return <h1>{`x: ${x}; y: ${y}`}</h1>
}

render(<App />, rootNode)
