import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
} from 'https://cdn.skypack.dev/react'
import T from 'https://cdn.skypack.dev/prop-types'
import { render } from 'https://cdn.skypack.dev/react-dom'
import gsap from 'https://cdn.skypack.dev/gsap'

const ROOT_NODE = document.querySelector('#app')

const Cuboid = ({ width, height, depth, hue, innerRef, wireframe }) => (
  <div
    className="cuboid"
    ref={innerRef}
    style={{
      '--width': width,
      '--height': height,
      '--depth': depth,
      '--hue': hue,
      '--wireframe': wireframe ? 1 : 0,
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
  let RESULT = `.cuboid {\n`
  // RESULT += `  --height: ${height};\n  --width: ${width};\n  --depth: ${depth};\n`
  RESULT += `  height: calc(var(--height) * 1vmin);\n  width: calc(var(--width) * 1vmin);\n`
  RESULT += '}\n'
  // Generic Cuboid
  RESULT += `.cuboid__side {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  height: 100%;\n  width: 100%;\n}\n`
  // First side
  RESULT += `.cuboid__side:nth-of-type(1) {
  transform:\n    translate3d(\n      -50%,\n      -50%,\n      calc(var(--depth) * 0.5vmin)\n    );
  background: hsl(var(--hue), 60%, 50%);\n}\n`
  // Second side
  RESULT += `.cuboid__side:nth-of-type(2) {
  transform:\n    translate3d(\n      -50%,\n      -50%,\n      calc(var(--depth) * -0.5vmin)\n    )\n    rotateY(180deg);
  background: hsl(var(--hue), 60%, 35%);\n}\n`
  // Third side
  RESULT += `.cuboid__side:nth-of-type(3) {
  width: calc(var(--depth) * 1vmin);
  transform:\n    translate(-50%, -50%)\n    rotateY(90deg)\n    translate3d(\n      0,\n      0,\n      calc(var(--width) * 0.5vmin)\n    );
  background: hsl(var(--hue), 60%, 40%);\n}\n`
  // Fourth side
  RESULT += `.cuboid__side:nth-of-type(4) {
  width: calc(var(--depth) * 1vmin);
  transform:\n    translate(-50%, -50%)\n    rotateY(-90deg)\n    translate3d(\n      0,\n      0,\n      calc(var(--width) * 0.5vmin)\n    );
  background: hsl(var(--hue), 60%, 60%);\n}\n`
  // Fifth side
  RESULT += `.cuboid__side:nth-of-type(5) {
  height: calc(var(--depth) * 1vmin);
  transform:\n    translate(-50%, -50%)\n    rotateX(90deg)\n    translate3d(\n      0,\n      0,\n      calc(var(--height) * 0.5vmin)\n    );
  background: hsl(var(--hue), 60%, 70%);\n}\n`
  // Sixth side
  RESULT += `.cuboid__side:nth-of-type(6) {
  height: calc(var(--depth) * 1vmin);
  transform:\n    translate(-50%, -50%)\n    rotateX(-90deg)\n    translate3d(\n      0,\n      0,\n      calc(var(--height) * 0.5vmin)\n    );
  background: hsl(var(--hue), 60%, 20%);\n}\n`

  // Extras
  RESULT += `/* Set the scene */\n`
  RESULT += `* {\n  transform-style: preserve-3d;\n}\n`
  RESULT += `body {\n  display: grid;\n  place-items: center;\n  min-height: 100vh;\n}\n`
  RESULT += `.scene {\n  transform:\n    rotateX(-24deg)\n    rotateY(-32deg);\n}\n`

  return RESULT
}

const getHTMLCode = (hue, width, height, depth) => {
  let RESULT = `<div class="scene">\n`
  RESULT += `  <div\n    class="cuboid"\n    style="\n      --height: ${height};\n      --width: ${width};\n      --depth: ${depth};\n      --hue: ${hue};\n  ">\n`
  RESULT += `    <div class="cuboid__side"></div>\n`
  RESULT += `    <div class="cuboid__side"></div>\n`
  RESULT += `    <div class="cuboid__side"></div>\n`
  RESULT += `    <div class="cuboid__side"></div>\n`
  RESULT += `    <div class="cuboid__side"></div>\n`
  RESULT += `    <div class="cuboid__side"></div>\n`
  RESULT += `  </div>\n`
  RESULT += `</div>`

  return RESULT
}

const getCodeMarkup = code => {
  return Prism.highlight(code, Prism.languages.css, 'css')
}
const getHTMLMarkup = code => {
  return Prism.highlight(code, Prism.languages.markup, 'markup')
}
const BOUNDS = 180
const App = () => {
  const RENDER = useState()[1]
  const [wireframe, setWireframe] = useState(false)
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
        '--rotate-cuboid-x': -yRotate,
        '--rotate-cuboid-y': xRotate,
      })
    }
    window.addEventListener('pointermove', UPDATE)

    return () => {
      window.removeEventListener('pointermove', UPDATE)
    }
  }, [])

  useEffect(() => {
    // Reset the Prism markup and re-render.
    styleRef.current = getCode(hue, width, height, depth)
    markupRef.current = getHTMLCode(hue, width, height, depth)
    cssRef.current = getCodeMarkup(styleRef.current)
    htmlRef.current = getHTMLMarkup(markupRef.current)
    document.documentElement.style.setProperty('--hue', hue)
    RENDER()
  }, [hue, depth, width, height, RENDER])

  return (
    <Fragment>
      <div className="scene">
        <div className="result">
          <div className="result__code">
            <button
              className="toggle-button"
              onClick={() => setShowCSS(!showCSS)}>{`Show ${
              showCSS ? 'HTML' : 'CSS'
            }`}</button>
            <div className="code-blocks">
              <pre className={`language-${showCSS ? 'css' : 'markup'}`}>
                <code
                  dangerouslySetInnerHTML={{
                    __html: showCSS ? cssRef.current : htmlRef.current,
                  }}
                />
              </pre>
            </div>
          </div>
          <div className="result__result">
            <form
              action="https://codepen.io/pen/define"
              method="POST"
              target="_blank">
              <input
                type="hidden"
                name="data"
                value={JSON.stringify({
                  title: 'My Cuboid',
                  html: markupRef.current,
                  css: styleRef.current,
                  css_pre_processor: 'none',
                  html_pre_processor: 'none',
                })}
              />
              <button type="submit" className="codepen-button">
                <span className="sr-only">Edit on CodePen</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M18.144 13.067v-2.134L16.55 12zm1.276 1.194a.628.628 0 01-.006.083l-.005.028-.011.053-.01.031a.443.443 0 01-.017.047l-.014.03a.78.78 0 01-.021.043l-.019.03a.57.57 0 01-.08.1l-.026.025a.602.602 0 01-.036.03l-.029.022-.01.008-6.782 4.522a.637.637 0 01-.708 0L4.864 14.79l-.01-.008a.599.599 0 01-.065-.052l-.026-.025-.032-.034-.021-.028a.588.588 0 01-.067-.11l-.014-.031a.644.644 0 01-.017-.047l-.01-.03c-.004-.018-.008-.036-.01-.054l-.006-.028a.628.628 0 01-.006-.083V9.739a.58.58 0 01.006-.083l.005-.027.011-.054.01-.03a.574.574 0 01.12-.217l.031-.034.026-.025a.62.62 0 01.065-.052l.01-.008 6.782-4.521a.638.638 0 01.708 0l6.782 4.521.01.008.03.022.035.03c.01.008.017.016.026.025a.545.545 0 01.08.1l.019.03a.633.633 0 01.021.043l.014.03c.007.016.012.032.017.047l.01.031c.004.018.008.036.01.054l.006.027a.619.619 0 01.006.083zM12 0C5.373 0 0 5.372 0 12c0 6.627 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12m0 10.492L9.745 12 12 13.51 14.255 12zm.638 4.124v2.975l4.996-3.33-2.232-1.493zm-6.272-.356l4.996 3.33v-2.974l-2.764-1.849zm11.268-4.52l-4.996-3.33v2.974l2.764 1.85zm-6.272-.356V6.41L6.366 9.74l2.232 1.493zm-5.506 1.549v2.134L7.45 12z"></path>
                </svg>
              </button>
            </form>
            <Cuboid
              innerRef={cubeRef}
              height={height}
              width={width}
              depth={depth}
              hue={hue}
              wireframe={wireframe}
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
          <label htmlFor="wireframe">Wireframe</label>
          <input
            id="wireframe"
            type="checkbox"
            value={wireframe}
            onChange={() => setWireframe(!wireframe)}
          />
        </div>
      </div>
    </Fragment>
  )
}

render(<App />, ROOT_NODE)
