const { React, ReactDOM, PropTypes, w3color } = window
const { useEffect, useState, useRef } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

/**
 * Grab the angle between two points
 * @param {Object} event - pointer event for current coords
 * @param {Object} element - element to use as center point
 * @param {Number} buffer - buffer so that angle doesn't allow handle + track overlap
 */
const getAngle = (event, element, buffer) => {
  const { x, y } = event
  const {
    x: handleX,
    y: handleY,
    width: handleWidth,
    height: handleHeight,
  } = element.getBoundingClientRect()
  const handleCenterPoint = {
    x: handleX + handleWidth / 2,
    y: handleY + handleHeight / 2,
  }
  const angle =
    (Math.atan2(handleCenterPoint.y - y, handleCenterPoint.x - x) * 180) /
    Math.PI
  return Math.max(buffer, Math.min(180 - buffer, Math.abs(angle)))
}

const getInitialAngle = (value, buffer) => {
  return ((180 - buffer * 2) / 100) * value + buffer
}

const HslSlider = ({
  hue: propsHue = 180,
  saturation: propsSaturation = 100,
  lightness: propsLightness = 50,
  BUFFER = 40,
  onChange,
}) => {
  const [hue, setHue] = useState(propsHue)
  const [cursor, setCursor] = useState('grab')
  const [lightness, setLightness] = useState(propsLightness)
  const [saturation, setSaturation] = useState(propsSaturation)
  const [saturationAngle, setSaturationAngle] = useState(
    getInitialAngle(saturation, BUFFER)
  )
  const [lightnessAngle, setLightnessAngle] = useState(
    180 + (180 - getInitialAngle(lightness, BUFFER))
  )
  const handleRef = useRef(null)
  const trackRef = useRef(null)
  const lightnessHandleRef = useRef(null)
  const saturationHandleRef = useRef(null)

  /**
   * Updates the hue based on the pointer position
   * @param {Number} x - Where pointer is in relation to hue track
   */
  const updateHue = ({ x }) => {
    const {
      left: trackLeft,
      width: trackWidth,
    } = trackRef.current.getBoundingClientRect()
    const newValue = (x - trackLeft) / trackWidth
    setHue(Math.max(0, Math.min(360, newValue * 360)))
  }

  /**
   *
   * @param {Object} event - pointer event
   */
  const updateLightness = event => {
    const angle = getAngle(event, handleRef.current, BUFFER)
    const lightness = ((angle - BUFFER) / (180 - BUFFER * 2)) * 100
    setLightnessAngle(180 + (180 - angle))
    setLightness(lightness)
  }

  const updateSaturation = event => {
    const angle = getAngle(event, handleRef.current, BUFFER)
    const saturation = ((angle - BUFFER) / (180 - BUFFER * 2)) * 100
    setSaturation(saturation)
    setSaturationAngle(angle)
  }

  /**
   * Convenience method to handle event listening on handles
   * This will remove the event listeners on pointerUp
   * @param {Function} onMove - onMove handler for handle
   */
  const handleUp = onMove => {
    const up = () => {
      setCursor('grab')
      document.documentElement.style.setProperty('--cursor', 'initial')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', up)
    }
    return up
  }

  /**
   * Convenience method to assign event listening for handles
   * @param {Function} onMove - onMove handler for handle
   * @param {Bool} stopPropagation - defines whether to stop event propagation
   */
  const handleDown = (onMove, stopPropagation) => e => {
    if (stopPropagation) e.stopPropagation()
    setCursor('grabbing')
    document.documentElement.style.setProperty('--cursor', 'grabbing')
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', handleUp(onMove))
  }

  useEffect(() => {
    if (onChange) onChange({ hue, saturation, lightness })
  }, [hue, saturation, lightness])

  return (
    <div
      ref={trackRef}
      className="hsl-slider"
      style={{
        '--lightness': lightness,
        '--saturation': saturation,
      }}>
      <div
        className="hsl-slider__handle"
        ref={handleRef}
        style={{
          '--cursor': cursor,
          '--value': Math.max(0, Math.min(100, (hue / 360) * 100)),
          '--hue': hue,
        }}
        onPointerDown={handleDown(updateHue)}
        title="Set hue">
        <div
          className="hsl-slider__handle hsl-slider__handle--saturation"
          onPointerDown={handleDown(updateSaturation, true)}
          ref={saturationHandleRef}
          style={{ '--angle': saturationAngle }}
          title="Set saturation"
        />
        <div
          className="hsl-slider__handle hsl-slider__handle--lightness"
          onPointerDown={handleDown(updateLightness, true)}
          ref={lightnessHandleRef}
          style={{ '--angle': lightnessAngle }}
          title="Set lightness"
        />
      </div>
    </div>
  )
}
HslSlider.propTypes = {
  hue: PropTypes.number,
  saturation: PropTypes.number,
  lightness: PropTypes.number,
  BUFFER: PropTypes.number,
  onChange: PropTypes.func,
}
const App = () => {
  const [color, setColor] = useState(new w3color('hsl(180, 100%, 50%'))
  const onChange = ({ hue, saturation, lightness }) => {
    setColor(new w3color(`hsl(${hue}, ${saturation}%), ${lightness}%`))
  }
  return (
    <div className="container" style={{ '--color': color.toHslString() }}>
      <HslSlider
        hue={color.hue}
        saturation={color.sat * 100}
        lightness={color.lightness * 100}
        onChange={onChange}
      />
      <div className="values">
        <h1>{color.toHslString()}</h1>
        <h1>{color.toHexString()}</h1>
        <h1>{color.toRgbString()}</h1>
      </div>
    </div>
  )
}
render(<App />, rootNode)
