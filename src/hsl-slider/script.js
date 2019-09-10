const { React, ReactDOM } = window
const { useEffect, useState, useRef } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const ColorSlider = () => {
  const [value, setValue] = useState(0)
  const [lightness, setLightness] = useState(50)
  const handleRef = useRef(null)
  const trackRef = useRef(null)
  const lightnessHandleRef = useRef(null)

  const updateValue = ({ x }) => {
    const {
      left: trackLeft,
      width: trackWidth,
    } = trackRef.current.getBoundingClientRect()
    // work out the current value and update it
    const newValue = (x - trackLeft) / trackWidth
    // console.info(newValue * 360, newValue * 100)
    setValue(Math.max(0, Math.min(360, newValue * 360)))
  }

  // Set up event bindings on the handle
  const handleUp = () => {
    window.removeEventListener('pointermove', updateValue)
    window.removeEventListener('pointerup', handleUp)
  }
  const handleDown = () => {
    window.addEventListener('pointermove', updateValue)
    window.addEventListener('pointerup', handleUp)
    // Need a ref to the parent div bar, then calculate the distance covered at the pointer in relation to the whole thing 👍
  }
  useEffect(() => {
    // console.info(handleRef.current)
    handleRef.current.addEventListener('pointerdown', handleDown)
    return () => {
      handleRef.current.removeEventListener('pointerdown', handleDown)
    }
  }, [])
  useEffect(() => {
    lightnessHandleRef.current.addEventListener('pointerdown', e =>
      e.stopPropagation()
    )
    lightnessHandleRef.current.addEventListener('input', e => {
      e.stopPropagation()
      setLightness(e.target.value)
    })
  }, [])
  return (
    <div
      ref={trackRef}
      className="color-slider"
      style={{
        '--lightness': lightness,
      }}>
      <div
        className="color-slider__handle"
        ref={handleRef}
        style={{
          '--value': Math.max(0, Math.min(100, (value / 360) * 100)),
          '--hue': value,
        }}>
        <input
          ref={lightnessHandleRef}
          type="range"
          step="1"
          min="0"
          max="100"
        />
      </div>
    </div>
  )
}
const App = () => {
  return <ColorSlider />
}
render(<App />, rootNode)
