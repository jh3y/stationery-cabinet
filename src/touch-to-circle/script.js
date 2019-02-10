const { React, ReactDOM } = window
const { useEffect, useState, useRef, Fragment } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

/**
 * A hook to communicate when an element is being held
 * Great for detecting when buttons are held etc.
 * @param {Object} el - the element to bind hold event to, defaults to window
 */
const useHold = (el = window) => {
  let setHold
  let unsetHold
  const runner = useRef(null)
  const [holding, setHolding] = useState(false)
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (el.current) {
      let ticker = 0
      const loop = () => {
        // When held, increment an internal ticker
        // using requestAnimationFrame
        ticker++
        setCount(ticker)
        runner.current = requestAnimationFrame(loop)
      }
      setHold = () => {
        setHolding(true)
        runner.current = requestAnimationFrame(loop)
      }
      unsetHold = () => {
        // When the hold comes off cancel the loop
        // and reset the counters 👍
        ticker = 0
        cancelAnimationFrame(runner.current)
        runner.current = undefined
        setHolding(false)
        setCount(0)
      }
      el.current.addEventListener('mousedown', setHold)
      el.current.addEventListener('mouseup', unsetHold)
      el.current.addEventListener('mousedown', setHold)
      el.current.addEventListener('mouseup', unsetHold)
    }
    return () => {
      el.current.removeEventListener('mousemove', setHold)
      el.current.removeEventListener('mouseup', unsetHold)
      el.current.removeEventListener('touchstart', setHold)
      el.current.removeEventListener('touchend', unsetHold)
    }
  }, [])
  return { count, holding }
}
const App = () => {
  const held = useRef(null)
  const { count: tick } = useHold(held)
  const [count, setCount] = useState(0)
  useEffect(
    () => {
      setCount(count + tick)
    },
    [tick]
  )
  return (
    <Fragment>
      <h1>{count}</h1>
      <button ref={held}>Hold</button>
    </Fragment>
  )
}
render(<App />, rootNode)
