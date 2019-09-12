const { React, ReactDOM } = window
const { useEffect, useState, useRef } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const ColorSlider = () => {
  const [hue, setHue] = useState(0)
  const [lightness, setLightness] = useState(50)
  const [saturation, setSaturation] = useState(100)
  const [saturationAngle, setSaturationAngle] = useState(90)
  const [lightnessAngle, setLightnessAngle] = useState(270)
  const handleRef = useRef(null)
  const trackRef = useRef(null)
  const lightnessHandleRef = useRef(null)
  const saturationHandleRef = useRef(null)

  const updateHue = ({ x }) => {
    const {
      left: trackLeft,
      width: trackWidth,
    } = trackRef.current.getBoundingClientRect()
    const newValue = (x - trackLeft) / trackWidth
    setHue(Math.max(0, Math.min(360, newValue * 360)))
  }

  // Set up event bindings on the handle
  const handleUp = () => {
    window.removeEventListener('pointermove', updateHue)
    window.removeEventListener('pointerup', handleUp)
  }
  const handleDown = () => {
    window.addEventListener('pointermove', updateHue)
    window.addEventListener('pointerup', handleUp)
    // Need a ref to the parent div bar, then calculate the distance covered at the pointer in relation to the whole thing 👍
  }
  const updateLightness = e => {
    const { x, y } = e
    const {
      x: handleX,
      y: handleY,
      width: handleWidth,
      height: handleHeight,
    } = handleRef.current.getBoundingClientRect()
    const handleCenterPoint = {
      x: handleX + handleWidth / 2,
      y: handleY + handleHeight / 2,
    }
    const angle =
      (Math.atan2(handleCenterPoint.y - y, handleCenterPoint.x - x) * 180) /
      Math.PI
    const START = 30
    const handleAngle = Math.max(START, Math.min(180 - START, Math.abs(angle)))
    const lightness = ((handleAngle - START) / (180 - START * 2)) * 100
    setLightnessAngle(180 + (180 - handleAngle))
    setLightness(lightness)
  }
  const handleLightnessUp = () => {
    window.removeEventListener('pointermove', updateLightness)
    window.removeEventListener('pointerup', handleLightnessUp)
  }
  const handleLightnessDown = e => {
    e.stopPropagation()
    window.addEventListener('pointermove', updateLightness)
    window.addEventListener('pointerup', handleLightnessUp)
  }
  const updateSaturation = e => {
    const { x, y } = e
    const {
      x: handleX,
      y: handleY,
      width: handleWidth,
      height: handleHeight,
    } = handleRef.current.getBoundingClientRect()
    const handleCenterPoint = {
      x: handleX + handleWidth / 2,
      y: handleY + handleHeight / 2,
    }
    const angle =
      (Math.atan2(handleCenterPoint.y - y, handleCenterPoint.x - x) * 180) /
      Math.PI
    const START = 30
    const handleAngle = Math.max(START, Math.min(180 - START, Math.abs(angle)))
    const saturation = ((handleAngle - START) / (180 - START * 2)) * 100
    setSaturation(saturation)
    setSaturationAngle(handleAngle)
  }
  const handleSaturationUp = () => {
    window.removeEventListener('pointermove', updateSaturation)
    window.removeEventListener('pointerup', handleSaturationUp)
  }
  const handleSaturationDown = e => {
    e.stopPropagation()
    window.addEventListener('pointermove', updateSaturation)
    window.addEventListener('pointerup', handleSaturationUp)
  }
  useEffect(() => {
    handleRef.current.addEventListener('pointerdown', handleDown)
    return () => {
      handleRef.current.removeEventListener('pointerdown', handleDown)
    }
  }, [])
  useEffect(() => {
    lightnessHandleRef.current.addEventListener(
      'pointerdown',
      handleLightnessDown
    )
    return () => {
      lightnessHandleRef.current.removeEventListener(
        'pointerdown',
        handleLightnessDown
      )
    }
  }, [])
  useEffect(() => {
    saturationHandleRef.current.addEventListener(
      'pointerdown',
      handleSaturationDown
    )
    return () => {
      saturationHandleRef.current.removeEventListener(
        'pointerdown',
        handleSaturationDown
      )
    }
  })
  return (
    <div
      ref={trackRef}
      className="color-slider"
      style={{
        '--lightness': lightness,
        '--saturation': saturation,
      }}>
      <div
        className="color-slider__handle"
        ref={handleRef}
        style={{
          '--value': Math.max(0, Math.min(100, (hue / 360) * 100)),
          '--hue': hue,
        }}>
        <div
          className="color-slider__handle color-slider__handle--saturation"
          ref={saturationHandleRef}
          style={{ '--angle': saturationAngle }}
        />
        <div
          className="color-slider__handle color-slider__handle--lightness"
          ref={lightnessHandleRef}
          style={{ '--angle': lightnessAngle }}
        />
      </div>
    </div>
  )
}
const App = () => {
  return <ColorSlider />
}
render(<App />, rootNode)
