const {
  d3,
  React: { Fragment, useEffect, useReducer, useRef },
  ReactDOM: { render },
} = window

// Given some path and a container, make the path scale with the container when we need it to 👍
class ResponsiveMotionPath {
  constructor({ container, onChange, path, strokeWidth, viewBox }) {
    const { height, width } = container.getBoundingClientRect()
    this.STATE = {
      CONTAINER_HEIGHT: height,
      CONTAINER_WIDTH: width,
    }
    this.CONTAINER = container
    this.ON_CHANGE = onChange
    this.PATH = path
    this.VIEWBOX = viewBox
    // Convert the path string into a data set for d3 to use
    this.DATA = this.convertPathToData(path, strokeWidth)
    this.MIN_MAX = this.getMinMax(this.DATA)
    // Generate range ratios based on the original path viewbox
    this.RATIOS = this.generateRatios(this.MIN_MAX, viewBox)
    const initialPath = this.generatePath(
      this.DATA,
      this.RATIOS[3],
      this.RATIOS[2],
      this.MIN_MAX[3],
      this.MIN_MAX[2]
    )
    // Set the initial path on the element
    onChange(initialPath)
  }
  getMinMax = data => {
    const X_POINTS = data.map(point => point[0])
    const Y_POINTS = data.map(point => point[1])
    const MIN_X = Math.min(...X_POINTS)
    const MAX_X = Math.max(...X_POINTS)
    const MIN_Y = Math.min(...Y_POINTS)
    const MAX_Y = Math.max(...Y_POINTS)

    return [MIN_X, MIN_Y, MAX_X, MAX_Y]
  }
  generateRatios = (minMax, viewBox) => {
    const [, , x2, y2] = viewBox
    return [0, 0, minMax[2] / x2, minMax[3] / y2]
  }

  /**
   * Initially convert the path to data. Should only be required
   * once as we are simply scaling it up and down. Only issue could be upscaling??
   * Create high quality paths initially
   */
  convertPathToData = (path, strokeWidth) => {
    // To convert the path data to points, we need an SVG path element.
    const svgContainer = document.createElement('div')
    // To create one though, a quick way is to use innerHTML
    svgContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">
                              <path d="${path}" stroke-width="${strokeWidth}"/>
                            </svg>`
    const pathElement = svgContainer.querySelector('path')
    // Now to gather up the path points.
    const DATA = []
    // Iterate over the total length of the path pushing the x and y into
    // a data set for d3 to handle 👍
    for (let p = 0; p < pathElement.getTotalLength(); p++) {
      const { x, y } = pathElement.getPointAtLength(p)
      DATA.push([x, y])
    }
    return DATA
  }
  // Whenever there is a change in the container size, reference the data points
  // and generate a new path 👍
  scale = () => {
    const { offsetHeight, offsetWidth } = this.CONTAINER
    // Inline style takes precedence. In cases where there's a rotation, bounding box won't be correct.
    const height = parseFloat(this.CONTAINER.style.height, 10) || offsetHeight
    const width = parseFloat(this.CONTAINER.style.width, 10) || offsetWidth
    if (
      height !== this.STATE.CONTAINER_HEIGHT ||
      width !== this.STATE.CONTAINER_WIDTH
    ) {
      const newPath = this.generatePath(
        this.DATA,
        this.RATIOS[3],
        this.RATIOS[2],
        this.MIN_MAX[3],
        this.MIN_MAX[2]
      )
      this.ON_CHANGE(newPath)
    }
  }
  // Utility to draw path
  generatePath = (data, heightRatio, widthRatio, maxHeight, maxWidth) => {
    const { offsetHeight, offsetWidth } = this.CONTAINER
    // Inline style takes precedence. In cases where there's a rotation, bounding box won't be correct.
    const height = parseFloat(this.CONTAINER.style.height, 10) || offsetHeight
    const width = parseFloat(this.CONTAINER.style.width, 10) || offsetWidth
    // Create two d3 scales for X and Y
    const xScale = d3
      .scaleLinear()
      .domain([0, maxWidth])
      .range([0, width * widthRatio])
    const yScale = d3
      .scaleLinear()
      .domain([0, maxHeight])
      .range([0, height * heightRatio])
    // Map our data points using the scales
    const SCALED_POINTS = data.map(POINT => [
      xScale(POINT[0]),
      yScale(POINT[1]),
    ])
    this.STATE.CONTAINER_HEIGHT = height
    this.STATE.CONTAINER_WIDTH = width
    return d3.line()(SCALED_POINTS)
  }
}

const PATH =
  'M10.362 18.996s-6.046 21.453 1.47 25.329c10.158 5.238 18.033-21.308 29.039-18.23 13.125 3.672 18.325 36.55 18.325 36.55l12.031-47.544'

const INITIAL_STATE = {
  alternate: false,
  path: PATH,
  strokeWidth: 0.265,
  svg: true,
  x2: 79.375,
  y2: 79.375,
  threeD: false,
}

const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE':
      return { ...state, [action.name]: action.value }
    case 'DROP':
      return { ...state, ...action.data }
    default:
      return state
  }
}

const App = () => {
  const containerRef = useRef(null)
  const elementRef = useRef(null)
  const pathRef = useRef(null)
  const svgRef = useRef(null)
  const motionPathRef = useRef(null)
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE)
  const { alternate, path, strokeWidth, svg, threeD, x2, y2 } = state

  const onMotionPathChange = path => {
    elementRef.current.style.setProperty('--path', `"${path}"`)
    pathRef.current.setAttribute('d', path)
  }

  const onFileDrop = e => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (
      file.type === 'image/svg+xml' ||
      file.name.slice(file.name.length - 4) === '.svg'
    ) {
      // process the file.
      const reader = new FileReader()
      reader.onloadend = response => {
        try {
          // file.target.result is the SVG markup we want to use.
          const wrapper = document.createElement('div')
          wrapper.innerHTML = response.target.result
          const svg = wrapper.querySelector('svg')
          const path = wrapper.querySelector('path')
          const viewBox = svg.getAttribute('viewBox').split(' ') // 0 0 x2 y2
          const pathString = path.getAttribute('d')
          let strokeWidth = path.getAttribute('stroke-width')
          if (!strokeWidth && path.getAttribute('style')) {
            for (const style of path.getAttribute('style').split(';')) {
              if (style.includes('stroke-width')) {
                strokeWidth = parseFloat(
                  style.slice(style.indexOf(':') + 1),
                  10
                )
              }
            }
          }
          dispatch({
            type: 'DROP',
            data: {
              path: pathString,
              strokeWidth,
              x2: viewBox[2],
              y2: viewBox[3],
            },
          })
        } catch (e) {
          throw Error('Something went wrong', e)
        }
      }
      reader.readAsText(file)
    }
  }

  const prevent = e => e.preventDefault()

  const updateField = e =>
    dispatch({
      type: 'UPDATE',
      name: e.target.name,
      value: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    })

  useEffect(() => {
    if (containerRef.current) {
      const containerRefObserver = new ResizeObserver(entries => {
        if (motionPathRef.current) {
          motionPathRef.current.scale()
        }
      })
      containerRefObserver.observe(containerRef.current)
    }
  }, [])

  useEffect(() => {
    if (containerRef.current && elementRef.current) {
      // Set up the initial responsive motion path
      motionPathRef.current = new ResponsiveMotionPath({
        container: containerRef.current,
        onChange: onMotionPathChange,
        path: path,
        strokeWidth: strokeWidth,
        viewBox: [0, 0, parseInt(x2, 10), parseInt(y2, 0)],
      })
    }
  }, [path, strokeWidth, x2, y2])

  useEffect(() => {
    document.body.addEventListener('dragover', prevent)
    document.body.addEventListener('drop', onFileDrop)
    return () => {
      document.body.removeEventListener('dragover', prevent)
      document.body.removeEventListener('drop', onFileDrop)
    }
  }, [])

  const hue = Math.random() * 360

  return (
    <Fragment>
      <div
        ref={containerRef}
        className="container"
        style={{
          '--rotation': threeD ? 75 : 0,
          overflow: threeD ? 'visible' : 'hidden',
        }}>
        <svg
          {...(!svg && { hidden: true })}
          ref={svgRef}
          style={{
            '--hue': hue,
          }}>
          <path ref={pathRef}></path>
        </svg>
        <div
          ref={elementRef}
          style={{
            '--animation-direction': alternate ? 'alternate' : 'normal',
            '--transform-style': threeD ? 'preserve-3d' : 'none',
          }}
          className="motion-element">
          <div className="motion-element__side"></div>
          <div className="motion-element__side"></div>
          <div className="motion-element__side"></div>
          <div className="motion-element__side"></div>
          <div className="motion-element__side"></div>
          <div className="motion-element__side"></div>
        </div>
      </div>
      <p
        style={{
          '--hue': hue,
        }}>
        Drag and drop an optimized SVG file onto the page that contains a path.
        Clean up your SVG first with{' '}
        <a
          href="https://jakearchibald.github.io/svgomg/"
          target="_blank"
          rel="noreferrer noopener">
          SVGOMG
        </a>
        . Alternatively, manually enter path info into the configuration form
        below.
      </p>
      <p>
        Resize the viewport and see your motion path scale!{' '}
        <span aria-label="TADA!" role="img">
          🎉
        </span>
      </p>
      <details>
        <summary>Path configuration</summary>
        <form onDrop={onFileDrop}>
          <section className="form-field">
            <label htmlFor="path">Path</label>
            <input
              id="path"
              type="text"
              name="path"
              value={path}
              onChange={updateField}
            />
          </section>
          <section className="form-field">
            <label htmlFor="x2">Initial Width (viewBox x2)</label>
            <input
              id="x2"
              type="number"
              name="x2"
              value={x2}
              onChange={updateField}
            />
          </section>
          <section className="form-field">
            <label htmlFor="y2">Initial Height (viewBox y2)</label>
            <input
              id="y2"
              type="number"
              name="y2"
              value={y2}
              onChange={updateField}
            />
          </section>
          <section className="form-field">
            <label htmlFor="strokeWidth">Stroke Width</label>
            <input
              id="strokeWidth"
              type="number"
              name="strokeWidth"
              value={strokeWidth}
              onChange={updateField}
            />
          </section>
          <section className="form-field form-field--grid">
            <label htmlFor="svg">Show SVG path?</label>
            <input
              id="svg"
              type="checkbox"
              name="svg"
              checked={svg}
              onChange={updateField}
            />
            <label htmlFor="alternate">Alternate direction?</label>
            <input
              id="alternate"
              type="checkbox"
              name="alternate"
              checked={alternate}
              onChange={updateField}
            />
            <label htmlFor="threeD">See path in 3D?</label>
            <input
              id="threeD"
              type="checkbox"
              name="threeD"
              checked={threeD}
              onChange={updateField}
            />
          </section>
          <section className="form-field form-field--grid">
            <button
              onClick={e => {
                e.preventDefault()
                containerRef.current.removeAttribute('style')
              }}>
              Reset container size
            </button>
          </section>
        </form>
      </details>
    </Fragment>
  )
}

render(<App />, document.getElementById('app'))
