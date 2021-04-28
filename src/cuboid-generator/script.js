import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
} from 'https://cdn.skypack.dev/react'
import T from 'https://cdn.skypack.dev/prop-types'
import { render } from 'https://cdn.skypack.dev/react-dom'
import gsap from 'https://cdn.skypack.dev/gsap'
import { Range } from 'https://cdn.skypack.dev/react-range'

const ROOT_NODE = document.querySelector('#app')

const Cuboid = ({ width, height, depth, hue, innerRef }) => (
  <div
    className="cuboid"
    ref={innerRef}
    style={{
      '--width': width,
      '--height': height,
      '--depth': depth,
      '--hue': hue,
    }}>
    <div className="cuboid__side"></div>
    <div className="cuboid__side"></div>
    <div className="cuboid__side"></div>
    <div className="cuboid__side"></div>
    <div className="cuboid__side"></div>
    <div className="cuboid__side"></div>
  </div>
)

const getCode = (hue, width, height, depth) => {
  let RESULT = `* {\n  transform-style: preserve-3d;\n}\n.cuboid {\n`
  // RESULT += `  --height: ${height};\n  --width: ${width};\n  --depth: ${depth};\n`
  RESULT += `  height: calc(var(--height) * 1vmin);\n  width: calc(var(--width) * 1vmin);\n`
  RESULT += '}\n'
  // Generic Cuboid
  RESULT += `.cuboid__side {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  height: 100%;\n  width: 100%;\n}\n`
  // First side
  RESULT += `.cuboid__side:nth-of-type(1) {
  transform:\n    translate3d(-50%, -50%, calc(var(--depth) * 0.5vmin));\n}\n`
  // Second side
  RESULT += `.cuboid__side:nth-of-type(2) {
  transform:\n    translate3d(-50%, -50%, calc(var(--depth) * -0.5vmin))\n    rotateY(180deg);\n}\n`
  // Third side
  RESULT += `.cuboid__side:nth-of-type(3) {
  width: calc(var(--depth) * 1vmin);
  transform:\n    translate(-50%, -50%)\n    rotateY(90deg)\n    translate3d(0, 0, calc(var(--width) * 0.5vmin));\n}\n`
  // Fourth side
  RESULT += `.cuboid__side:nth-of-type(4) {
  width: calc(var(--depth) * 1vmin);
  transform:\n    translate(-50%, -50%)\n    rotateY(-90deg)\n    translate3d(0, 0, calc(var(--width) * 0.5vmin));\n}\n`
  // Fifth side
  RESULT += `.cuboid__side:nth-of-type(5) {
  height: calc(var(--depth) * 1vmin);
  transform:\n    translate(-50%, -50%)\n    rotateX(90deg)\n    translate3d(0, 0, calc(var(--height) * 0.5vmin));\n}\n`
  // Sixth side
  RESULT += `.cuboid__side:nth-of-type(6) {
  height: calc(var(--depth) * 1vmin);
  transform:\n    translate(-50%, -50%)\n    rotateX(90deg)\n    translate3d(0, 0, calc(var(--height) * 0.5vmin));\n}\n`

  return RESULT
}

const getHTMLCode = (hue, width, height, depth) => {
  let RESULT = `<div\n  class="cuboid"\n  style="\n  --height: ${height};\n  --width: ${width};\n  --depth: ${depth};\n">\n`
  RESULT += `  <div class="cuboid__side"></div>\n`
  RESULT += `  <div class="cuboid__side"></div>\n`
  RESULT += `  <div class="cuboid__side"></div>\n`
  RESULT += `  <div class="cuboid__side"></div>\n`
  RESULT += `  <div class="cuboid__side"></div>\n`
  RESULT += `  <div class="cuboid__side"></div>\n`
  RESULT += `</div>`

  return RESULT
}

const getCodeMarkup = code => {
  return Prism.highlight(code, Prism.languages.css, 'css')
}
const getHTMLMarkup = code => {
  return Prism.highlight(code, Prism.languages.html, 'html')
}
const BOUNDS = 180
const App = () => {
  const [hue, setHue] = useState(Math.floor(Math.random() * 359))
  const [width, setWidth] = useState(Math.floor(Math.random() * 10) + 5)
  const [height, setHeight] = useState(Math.floor(Math.random() * 10) + 5)
  const [depth, setDepth] = useState(Math.floor(Math.random() * 10) + 5)
  const [showCSS, setShowCSS] = useState(false)
  const styleRef = useRef(getCode(hue, width, height, depth))
  const markupRef = useRef(getHTMLCode(hue, width, height, depth))
  const cssRef = useRef(getCodeMarkup(styleRef.current))
  const htmlRef = useRef(getHTMLMarkup(markupRef.current))
  const cubeRef = useRef(null)

  useEffect(() => {
    const UPDATE = ({ x, y }) => {
      const xRotate = gsap.utils.mapRange(
        0,
        window.innerWidth,
        -BOUNDS,
        BOUNDS,
        x
      )
      const yRotate = gsap.utils.mapRange(
        0,
        window.innerHeight,
        -BOUNDS,
        BOUNDS,
        y
      )
      gsap.set(cubeRef.current, {
        '--rotate-cuboid-x': yRotate,
        '--rotate-cuboid-y': xRotate,
      })
    }
    window.addEventListener('pointermove', UPDATE)
    return () => {
      window.removeEventListener('pointermove', UPDATE)
    }
  }, [])

  return (
    <Fragment>
      <div className="scene">
        <div className="result">
          {showCSS && (
            <pre>
              <code
                className="language-css"
                dangerouslySetInnerHTML={{ __html: cssRef.current }}
              />
            </pre>
          )}
          {!showCSS && (
            <pre>
              <code
                className="language-html"
                dangerouslySetInnerHTML={{ __html: htmlRef.current }}
              />
            </pre>
          )}
          <div className="result__result">
            <Cuboid
              innerRef={cubeRef}
              height={height}
              width={width}
              depth={depth}
              hue={hue}
            />
          </div>
        </div>
        <div className="controls">
          <label htmlFor="height">Height(vmin)</label>
          <input
            type="range"
            min="1"
            max="25"
            step="1"
            id="height"
            value={height}
            onChange={e => setHeight(e.target.value)}
          />
          <label htmlFor="width">Width(vmin)</label>
          <input
            type="range"
            min="1"
            max="25"
            step="1"
            id="width"
            value={width}
            onChange={e => setWidth(e.target.value)}
          />
          <label htmlFor="depth">Depth(vmin)</label>
          <input
            type="range"
            min="1"
            max="25"
            step="1"
            id="depth"
            value={depth}
            onChange={e => setDepth(e.target.value)}
          />
          <label htmlFor="hue">Hue</label>
          <input
            type="range"
            min="1"
            max="359"
            step="1"
            id="hue"
            value={hue}
            onChange={e => setHue(e.target.value)}
          />
        </div>
      </div>
    </Fragment>
  )
}

render(<App />, ROOT_NODE)
