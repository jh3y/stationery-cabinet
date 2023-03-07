import React, {
  Fragment,
  useRef,
  useState,
} from 'https://cdn.skypack.dev/react'
import T from 'https://cdn.skypack.dev/prop-types'
import { render } from 'https://cdn.skypack.dev/react-dom'
import { Range } from 'https://cdn.skypack.dev/react-range'

const ROOT_NODE = document.querySelector('#app')

const getCode = (hue, saturation, lightness, shades) => {
  document.documentElement.style.setProperty(
    '--hue',
    hue[1] - hue[0] + (hue[1] - hue[0]) / 2
  )
  const HUE_STEP = (hue[1] - hue[0]) / shades
  const LIGHT_STEP = (lightness[1] - lightness[0]) / shades
  const SAT_STEP = (saturation[1] - saturation[0]) / shades
  let RESULT = `:root {\n`
  for (let s = 0; s < shades + 1; s++) {
    const HUE = Math.floor(hue[1] - s * HUE_STEP)
    const LIGHTNESS = Math.floor(lightness[1] - s * LIGHT_STEP)
    const SATURATION = Math.floor(saturation[1] - s * SAT_STEP)
    RESULT += `  --color-${s +
      1}: hsl(${HUE}, ${SATURATION}%, ${LIGHTNESS}%);\n`
  }
  return (RESULT += '}')
}

const Slider = ({ min = 0, max, values, onChange }) => (
  <Range
    step={1}
    min={min}
    max={max}
    values={values}
    onChange={onChange}
    renderTrack={({ props, children }) => (
      <div
        {...props}
        className="slider-track"
        style={{
          ...props.style,
        }}>
        {children}
      </div>
    )}
    renderThumb={({ props }) => (
      <div
        {...props}
        className="slider-thumb"
        style={{
          ...props.style,
          borderRadius: '50%',
          outline: 'transparent',
          height: '44px',
          width: '44px',
        }}
      />
    )}
  />
)
Slider.propTypes = {
  style: T.object,
  min: T.number,
  max: T.number,
  values: T.Array,
  onChange: T.func,
}

const getCodeMarkup = code => {
  return Prism.highlight(code, Prism.languages.css, 'css')
}

const App = () => {
  const [hue, setHue] = useState([0, Math.floor(Math.random() * 360)])
  const [saturation, setSaturation] = useState([0, 100])
  const [lightness, setLightness] = useState([0, 100])
  const [shades, setShades] = useState([7])
  const styleRef = useRef(getCode(hue, saturation, lightness, shades[0]))
  const cssRef = useRef(getCodeMarkup(styleRef.current))

  return (
    <Fragment>
      <div className="scene">
        <div className="result">
          <pre>
            <code
              className="language-css"
              dangerouslySetInnerHTML={{ __html: cssRef.current }}
            />
          </pre>
          <div
            className="palette"
            style={{
              '--shades': shades[0] + 1,
              '--bg': `var(--color-${shades[0] + 1})`,
            }}>
            {new Array(shades[0] + 1).fill().map((shade, index) => (
              <div
                key={index}
                className="palette__shade"
                style={{
                  '--color': `var(--color-${index + 1})`,
                }}></div>
            ))}
          </div>
        </div>
        <div className="controls">
          <label>Hue</label>
          <Slider
            max={360}
            values={hue}
            onChange={values => {
              styleRef.current = getCode(
                values,
                saturation,
                lightness,
                shades[0]
              )
              cssRef.current = getCodeMarkup(styleRef.current)
              setHue(values)
            }}
          />
          <label>Saturation</label>
          <Slider
            max={100}
            values={saturation}
            onChange={values => {
              styleRef.current = getCode(hue, values, lightness, shades[0])
              cssRef.current = getCodeMarkup(styleRef.current)
              setSaturation(values)
            }}
          />
          <label>Lightness</label>
          <Slider
            max={100}
            values={lightness}
            onChange={values => {
              styleRef.current = getCode(hue, saturation, values, shades[0])
              cssRef.current = getCodeMarkup(styleRef.current)
              setLightness(values)
            }}
          />
          <label>Colors</label>
          <Slider
            min={2}
            max={49}
            values={shades}
            onChange={values => {
              styleRef.current = getCode(hue, saturation, lightness, values[0])
              cssRef.current = getCodeMarkup(styleRef.current)
              setShades(values)
            }}
          />
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: styleRef.current }} />
    </Fragment>
  )
}

render(<App />, ROOT_NODE)
