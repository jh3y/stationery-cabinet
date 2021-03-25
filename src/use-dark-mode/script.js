import React, {
  Fragment,
  useRef,
  useState,
  useEffect,
} from 'https://cdn.skypack.dev/react'
import { render, createPortal } from 'https://cdn.skypack.dev/react-dom'

const ROOT_NODE = document.querySelector('#app')

const useDarkSide = container => {
  const [darkSide, setDarkSide] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const rendererRef = useRef(null)

  useEffect(() => {
    if (transitioning) {
      setTimeout(() => {
        setDarkSide(!darkSide)
        setTransitioning(false)
      }, 5000)
    } else {
      rendererRef.current = null
    }
  }, [darkSide, transitioning])

  const toggle = () => {
    if (!transitioning)
      rendererRef.current = () =>
        createPortal(<div>{new Date().toUTCString()}</div>, document.body)
    setTransitioning(!transitioning)
  }
  return {
    darkSide,
    transitioning,
    toggle,
    DarkSide: rendererRef.current || null,
  }
}

const App = () => {
  const containerRef = useRef(null)
  const { darkSide, toggle, transitioning, DarkSide } = useDarkSide(
    containerRef
  )

  return (
    <div ref={containerRef}>
      {transitioning && DarkSide && <DarkSide />}
      {!transitioning && (
        <Fragment>
          <h1>Hey!</h1>
          <h2>Welcome to the darkside</h2>
          <button onClick={toggle}>Toggle</button>
        </Fragment>
      )}
    </div>
  )
}

render(<App />, ROOT_NODE)
