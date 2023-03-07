import React, {
  useRef,
  useEffect,
  Fragment,
  useState,
} from 'https://cdn.skypack.dev/react'
import Prism from 'https://cdn.skypack.dev/prismjs'
import { Range } from 'https://cdn.skypack.dev/react-range'
import { render } from 'https://cdn.skypack.dev/react-dom'

// const { Prism } = window

const ROOT_NODE = document.querySelector('#app')

const getCode = (checked, values, sibling) => {
  let RESULT = `/* CSS */\n`
  RESULT += `:checked ${sibling} .box${
    checked ? `:nth-of-type(${values})` : ''
  } {\n`
  RESULT += `  --hue: 280;\n`
  RESULT += `  animation: jump 1s infinite;\n`
  return (RESULT += '}')
}

const getCodeMarkup = code => {
  return Prism.highlight(code, Prism.languages.css, 'css')
}

const MARKUP = `
<!-- HTML -->
<input id="check" type="checkbox"/>
<div class="box"/>
<div class="box"/>
<div class="box"/>
<label for="check">Label</label>
`

const HTML = Prism.highlight(MARKUP, Prism.languages.html, 'html')

const App = () => {
  const [values, setValues] = useState([1])
  const [checked, setChecked] = useState(false)
  const [sibling, setSibling] = useState('+')
  const cssString = useRef(getCode(checked, values, sibling))
  const cssRef = useRef(getCodeMarkup(cssString.current))

  // useEffect(() => {
  //   cssRef.current = getCode(checked, values, sibling)
  // }, [checked, sibling, values])

  return (
    <div className="scene">
      <div className="result">
        <pre>
          <code
            className="language-css"
            dangerouslySetInnerHTML={{ __html: cssRef.current }}
          />
          <code
            className="language-html"
            dangerouslySetInnerHTML={{ __html: HTML }}
          />
        </pre>
        <div className="result__render">
          <input id="check" type="checkbox" />
          {new Array(3).fill().map((box, index) => (
            <div className="box" key={index} />
          ))}
          <label className="label-button" htmlFor="check">
            Label
          </label>
        </div>
      </div>
      <div className="controls">
        <label htmlFor="sibling">Sibling Combinator</label>
        <select
          id="sibling"
          onChange={e => {
            cssString.current = getCode(checked, values, e.target.value)
            cssRef.current = getCodeMarkup(cssString.current)
            setSibling(e.target.value)
          }}
          value={sibling}>
          <option value="+">Adjacent (+)</option>
          <option value="~">Sibling (~)</option>
        </select>
        <label htmlFor="select">Select Sibling?</label>
        <input
          type="checkbox"
          id="select"
          checked={checked}
          onChange={e => {
            cssString.current = getCode(e.target.checked, values, sibling)
            cssRef.current = getCodeMarkup(cssString.current)
            setChecked(e.target.checked)
          }}
        />
        {checked && (
          <Fragment>
            <label htmlFor="which">Which Sibling?</label>
            <Range
              step={1}
              min={1}
              max={3}
              id="which"
              values={values}
              onChange={values => {
                cssString.current = getCode(checked, values, sibling)
                cssRef.current = getCodeMarkup(cssString.current)
                setValues(values)
              }}
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
          </Fragment>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: cssString.current }} />
    </div>
  )
}

render(<App />, ROOT_NODE)
