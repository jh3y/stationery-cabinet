const { React, ReactDOM } = window
const { useEffect, useRef, useState } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')
/**
 * In house debounce
 * @param {function} func - callback to be fired
 * @param {number} delay - delay in ms
 */
const debounce = (func, delay) => {
  let inDebounce
  return function() {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}
/**
 * A hook for wrapping callbacks inside requestAnimationFrame for performance
 * @param {function} callback - a callback to use inside the raf handler
 */
const useRAF = (callback, reset = 500) => {
  const [handler, setHandler] = useState()
  const rafId = useRef(0)
  const event = useRef(null)
  let tick = useRef(0)
  const resetInternal = () => {
    tick.current = 0
    callback(event.current, 0)
  }
  useEffect(() => {
    const onFinish = debounce(resetInternal, reset)
    setHandler(() => {
      let active = false
      return e => {
        if (active) {
          return false
        } else {
          active = true
          const onFrame = () => {
            callback(e, tick.current)
            active = false
            onFinish()
          }
          event.current = e
          tick.current++
          rafId.current = requestAnimationFrame(onFrame)
        }
      }
    })
    return () => {
      cancelAnimationFrame(rafId.current)
      rafId.current = undefined
    }
  }, [])
  return handler
}

const App = () => {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [frame, setFrame] = useState(0)
  const handler = useRAF((e, frame) => {
    setX(e.x)
    setY(e.y)
    setFrame(frame)
  })
  useEffect(() => {
    window.addEventListener('mousemove', handler)
    return () => {
      window.removeEventListener('mousemove', handler)
    }
  })
  return <h1>{`x: ${x}; y: ${y}; frame: ${frame}`}</h1>
}

render(<App />, rootNode)
