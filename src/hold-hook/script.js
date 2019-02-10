const { React, ReactDOM } = window
const { useEffect, useState, useRef, Fragment } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const useHold = (el = window) => {
  let setHold
  let unsetHold
  const [holding, setHolding] = useState(false)
  useEffect(() => {
    if (el.current) {
      setHold = () => setHolding(true)
      unsetHold = () => setHolding(false)
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
  return holding
}

const App = () => {
  const runner = useRef(null)
  const held = useRef(null)
  const holding = useHold(held)
  const [count, setCount] = useState(0)
  useEffect(() => {
    let ticker = count
    const loop = () => {
      ticker++
      setCount(ticker)
      runner.current = requestAnimationFrame(loop)
    }
    if (holding && !runner.current) {
      runner.current = requestAnimationFrame(loop)
    } else if (!holding && runner.current) {
      cancelAnimationFrame(runner.current)
      runner.current = undefined
    }
  })
  return (
    <Fragment>
      <h1>{count}</h1>
      <button ref={held}>Hold</button>
    </Fragment>
  )
}

render(<App />, rootNode)
