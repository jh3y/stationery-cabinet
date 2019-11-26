const { React, ReactDOM, PropTypes, w3color } = window
const { useEffect, useState, useRef, useReducer } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const ACTIONS = {
  UPDATE: 'UPDATE_VALUES',
}
const PROPS = {
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue',
  ALPHA: 'alpha',
}
const INITIAL_STATE = {
  red: 200,
  green: 100,
  blue: 140,
  alpha: 0.75,
  cursor: 'grab',
}
const RgbaReducer = (state, action) => {
  const { type, ...updates } = action
  switch (type) {
    case ACTIONS.UPDATE:
      return { ...state, ...updates }
    default:
      return state
  }
}

const RgbaSlider = ({
  red: propsRed = 180,
  green: propsGreen = 50,
  blue: propsBlue = 100,
  alpha: propsAlpha = 1,
  handleSize = 50,
  onChange,
}) => {
  const [state, dispatch] = useReducer(RgbaReducer, {
    ...INITIAL_STATE,
    ...{
      red: propsRed,
      green: propsGreen,
      blue: propsBlue,
      alpha: propsAlpha,
    },
  })
  const { red, green, blue, alpha, cursor } = state
  const currentColor = useRef(null)
  const trackRef = useRef(null)

  /**
   * Updates the value based on the pointer position
   * @param {Number} x - Where pointer is in relation to hue track
   */
  const updateValue = e => {
    let max = 255
    let div = 1
    if (currentColor.current === PROPS.ALPHA) {
      max = 100
      div = 100
    }
    const { clientX: x } = e.touches && e.touches.length ? e.touches[0] : e
    const {
      left: trackLeft,
      width: trackWidth,
    } = trackRef.current.getBoundingClientRect()
    const newValue = (x - trackLeft) / trackWidth
    const setValue = Math.max(0, Math.min(max, newValue * max)) / div
    dispatch({ type: ACTIONS.UPDATE, [currentColor.current]: setValue })
  }

  /**
   * Convenience method to handle event listening on handles
   * This will remove the event listeners on pointerUp
   * @param {Function} onMove - onMove handler for handle
   */
  const handleUp = onMove => {
    const up = () => {
      dispatch({ type: ACTIONS.UPDATE, cursor: 'grab' })
      currentColor.current = null
      document.documentElement.style.setProperty('--cursor', 'initial')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchend', up)
    }
    return up
  }

  /**
   * Calculate the most accurate handle to use based on
   * center to center diffing between the handles and x.
   * Even if we tap a handle, we might be tapping the center
   * of a handle blighted by z-indexing
   * @param {number} x - current cursor/touch position
   */
  const getCurrentColor = ({ x: pointX, y: pointY }) => {
    const { children } = trackRef.current
    let color = null
    for (let i = 0; i < children.length; i++) {
      const { x, width, height, y } = children[i].getBoundingClientRect()
      const diffX = Math.abs(pointX - (x + width / 2))
      const diffY = Math.abs(pointY - (y + height / 2))
      if (!color || diffX + diffY < color.diff)
        color = {
          diff: diffX + diffY,
          color: children[i].dataset.rgbaSliderProp,
        }
    }
    return color.color
  }
  /**
   * Convenience method to assign event listening for handles
   * @param {Function} onMove - onMove handler for handle
   * @param {Bool} stopPropagation - defines whether to stop event propagation
   */
  const handleDown = (onMove, stopPropagation) => e => {
    const { clientX: x, clientY: y } =
      e.touches && e.touches.length ? e.touches[0] : e
    if (stopPropagation) e.stopPropagation()
    dispatch({ type: ACTIONS.UPDATE, cursor: 'grabbing' })
    currentColor.current = getCurrentColor({ x, y })
    document.documentElement.style.setProperty('--cursor', 'grabbing')
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove)
    window.addEventListener('mouseup', handleUp(onMove))
    window.addEventListener('touchend', handleUp(onMove))
  }

  useEffect(() => {
    if (onChange) onChange({ red, green, blue, alpha })
  }, [red, green, blue, alpha])

  return (
    <div
      ref={trackRef}
      className="rgba-slider"
      style={{
        '--handle-size': handleSize,
        '--red': red,
        '--green': green,
        '--blue': blue,
        '--alpha': alpha,
      }}>
      {Object.values(PROPS).map(color => {
        return (
          <div
            key={`rgba-slider--${color}`}
            className={`rgba-slider__handle`}
            style={{
              '--cursor': cursor,
              '--color': color,
              '--value': state[color],
              '--z': currentColor.current === color ? 2 : 1,
            }}
            data-rgba-slider-prop={color}
            onMouseDown={handleDown(updateValue)}
            onTouchStart={handleDown(updateValue)}
            title={`Set ${color.charAt(0).toUpperCase()}${color.slice(
              1
            )}`}></div>
        )
      })}
    </div>
  )
}
RgbaSlider.propTypes = {
  handleSize: PropTypes.number,
  onChange: PropTypes.func,
  red: PropTypes.number,
  green: PropTypes.number,
  blue: PropTypes.number,
  alpha: PropTypes.number,
}
const App = () => {
  const [color, setColor] = useState(new w3color('rgba(70, 45, 120, 0.8)'))
  const onChange = ({ alpha, red, green, blue }) => {
    setColor(new w3color(`rgba(${red}, ${green}, ${blue}, ${alpha})`))
  }
  return (
    <div className="container" style={{ '--color': color.toHslString() }}>
      <RgbaSlider
        red={color.red}
        green={color.green}
        blue={color.blue}
        alpha={color.opacity}
        onChange={onChange}
        handleSize={40}
      />
      <div className="values">
        <h1>{color.toRgbaString()}</h1>
        <h1>{color.toHslString()}</h1>
        <h1>{color.toHexString().toUpperCase()}</h1>
      </div>
    </div>
  )
}
render(<App />, rootNode)
