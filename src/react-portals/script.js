const { React, ReactDOM, Draggable, PropTypes } = window
const { useEffect, useRef, useState, Fragment } = React
const { createPortal, render } = ReactDOM

const outsideEl = document.getElementById('outside')
const rootNode = document.getElementById('app')

const getXY = e => {
  let { pageX: x, pageY: y, touches } = e
  if (touches && touches.length === 1) {
    x = touches[0].pageX
    y = touches[0].pageY
  }
  return {
    x,
    y,
  }
}

const Man = ({ bounds, outside, onRelease }) => {
  const manRef = useRef(null)
  useEffect(() => {
    if (manRef.current) {
      new Draggable(manRef.current, {
        allowContextMenu: true,
        throwProps: true,
        onRelease,
        bounds,
      })
    }
  }, [manRef, bounds])

  return outside ? (
    createPortal(
      <div className="man" ref={manRef} role="img">
        🏃
      </div>,
      bounds
    )
  ) : (
    <div className="man" ref={manRef} role="img">
      🏃
    </div>
  )
}
Man.propTypes = {
  bounds: PropTypes.element,
  onRelease: PropTypes.func,
  outside: PropTypes.bool,
}
const App = () => {
  const [outside, setOutside] = useState(false)
  const innerPortalRef = useRef(null)
  const outerPortalRef = useRef(null)
  const isDroppedOn = (e, el) => {
    const { x, y } = getXY(e)
    const { left, top, width, height } = el.getBoundingClientRect()
    if (x > left && x < left + width && y > top && y < top + height) return true
    return false
  }
  const onRelease = e => {
    if (
      isDroppedOn(e, innerPortalRef.current) ||
      isDroppedOn(e, outerPortalRef.current)
    ) {
      setOutside(!outside)
    }
  }
  return (
    <Fragment>
      <Man
        bounds={outside ? outsideEl : rootNode}
        onRelease={onRelease}
        outside={outside}
      />
      <div className="portal portal--in" ref={innerPortalRef} />
      {createPortal(
        <div ref={outerPortalRef} className="portal portal--out" />,
        outsideEl
      )}
    </Fragment>
  )
}
render(<App />, rootNode)
