const { React, ReactDOM } = window
const { useEffect, useState, useRef } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const ColorSlider = () => {
  const [value, setValue] = useState(0)
  const handleRef = useRef(null)
  const trackRef = useRef(null)

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
  const handleDown = () => {
    window.addEventListener('pointermove', updateValue)
    // Need a ref to the parent div bar, then calculate the distance covered at the pointer in relation to the whole thing 👍
  }
  const handleUp = () => {
    window.removeEventListener('pointermove', updateValue)
  }
  useEffect(() => {
    // console.info(handleRef.current)
    handleRef.current.addEventListener('pointerdown', handleDown)
    handleRef.current.addEventListener('pointerup', handleUp)
    return () => {
      handleRef.current.removeEventListener('pointerdown', handleDown)
      handleRef.current.removeEventListener('pointerup', handleUp)
    }
  }, [])
  return (
    <div ref={trackRef} className="color-slider">
      <div
        className="color-slider__handle"
        ref={handleRef}
        style={{
          '--value': Math.max(0, Math.min(100, (value / 360) * 100)),
          '--hue': value,
        }}
      />
    </div>
  )
}
const App = () => {
  return <ColorSlider />
}
render(<App />, rootNode)
