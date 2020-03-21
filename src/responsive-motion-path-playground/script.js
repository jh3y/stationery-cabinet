const {
  d3,
  React: { Fragment, useEffect, useReducer, useRef },
  ReactDOM: { render },
} = window

/**
 * Meanderer class. Accepts a path, container, height, width, and change handler.
 * Although it doesn't need a handler. We can just call get path and let it do that.
 * The checks can be handled outside. We don't need to do it inside.
 */
class Meanderer {
  container
  height
  path
  threshold
  width
  constructor({ height, path, threshold = 0.2, width }) {
    this.height = height
    this.path = path
    this.threshold = threshold
    this.width = width
    // With what we are given create internal references
    this.aspect_ratio = width / height
    // Convert the path into a data set
    this.path_data = this.convertPathToData(path)
    this.maximums = this.getMaximums(this.path_data)
    this.range_ratios = this.getRatios(this.maximums, width, height)
  }
  // This is relevant for when we want to interpolate points to
  // the container scale. We need the minimum and maximum for both X and Y
  getMaximums = data => {
    const X_POINTS = data.map(point => point[0])
    const Y_POINTS = data.map(point => point[1])
    return [
      Math.max(...X_POINTS), // x2
      Math.max(...Y_POINTS), // y2
    ]
  }
  // Generate some ratios based on the data points and the path width and height
  getRatios = (maxs, width, height) => [maxs[0] / width, maxs[1] / height]

  /**
   * Initially convert the path to data. Should only be required
   * once as we are simply scaling it up and down. Only issue could be upscaling??
   * Create high quality paths initially
   */
  convertPathToData = path => {
    // To convert the path data to points, we need an SVG path element.
    const svgContainer = document.createElement('div')
    // To create one though, a quick way is to use innerHTML
    svgContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">
                              <path d="${path}"/>
                            </svg>`
    const pathElement = svgContainer.querySelector('path')
    // Now to gather up the path points using the SVGGeometryElement API 👍
    const DATA = []
    // Iterate over the total length of the path pushing the x and y into
    // a data set for d3 to handle 👍
    for (let p = 0; p < pathElement.getTotalLength(); p++) {
      const { x, y } = pathElement.getPointAtLength(p)
      DATA.push([x, y])
    }
    return DATA
  }

  /**
   * This is where the magic happens.
   * Use ratios etc. to interpolate our data set against our container bounds.
   */
  generatePath = (containerWidth, containerHeight) => {
    const {
      height,
      width,
      aspect_ratio: aspectRatio,
      path_data: data,
      maximums: [maxWidth, maxHeight],
      range_ratios: [widthRatio, heightRatio],
      threshold,
    } = this
    const OFFSETS = [0, 0]
    // Get the aspect ratio defined by the container
    const newAspectRatio = containerWidth / containerHeight
    // We only need to start applying offsets if the aspect ratio of the container is off 👍
    // In here we need to work out which side needs the offset. It's whichever one is smallest in order to centralize.
    // What if the container matches the aspect ratio...
    if (Math.abs(newAspectRatio - aspectRatio) > threshold) {
      // We know the tolerance is off so we need to work out a ratio
      // This works flawlessly. Now we need to check for when the height is less than the width
      if (width < height) {
        const ratio = (height - width) / height
        OFFSETS[0] = (ratio * containerWidth) / 2
      } else {
        const ratio = (width - height) / width
        OFFSETS[1] = (ratio * containerHeight) / 2
      }
    }
    // Create two d3 scales for X and Y
    const xScale = d3
      .scaleLinear()
      .domain([0, maxWidth])
      .range([OFFSETS[0], containerWidth * widthRatio - OFFSETS[0]])
    const yScale = d3
      .scaleLinear()
      .domain([0, maxHeight])
      .range([OFFSETS[1], containerHeight * heightRatio - OFFSETS[1]])
    // Map our data points using the scales
    const SCALED_POINTS = data.map(POINT => [
      xScale(POINT[0]),
      yScale(POINT[1]),
    ])
    return d3.line()(SCALED_POINTS)
  }
}

const PATH =
  'M10.362 18.996s-6.046 21.453 1.47 25.329c10.158 5.238 18.033-21.308 29.039-18.23 13.125 3.672 18.325 36.55 18.325 36.55l12.031-47.544'

const INITIAL_STATE = {
  alternate: false,
  path: PATH,
  svg: true,
  height: 79.375,
  width: 79.375,
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
  const { alternate, path, svg, threeD, width, height } = state

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
          dispatch({
            type: 'DROP',
            data: {
              path: pathString,
              width: viewBox[2],
              height: viewBox[3],
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
          const newPath = motionPathRef.current.generatePath(
            containerRef.current.offsetWidth,
            containerRef.current.offsetHeight
          )
          containerRef.current.style.setProperty('--path', `"${newPath}"`)
          pathRef.current.setAttribute('d', newPath)
        }
      })
      containerRefObserver.observe(containerRef.current)
    }
  }, [])

  useEffect(() => {
    if (containerRef.current && elementRef.current) {
      // Set up the initial responsive motion path
      motionPathRef.current = new Meanderer({
        path,
        height,
        width,
      })
      const newPath = motionPathRef.current.generatePath(
        containerRef.current.offsetWidth,
        containerRef.current.offsetHeight
      )
      containerRef.current.style.setProperty('--path', `"${newPath}"`)
      pathRef.current.setAttribute('d', newPath)
    }
  }, [path, width, height])

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
            <label htmlFor="width">Initial Width (viewBox x2)</label>
            <input
              id="with"
              type="number"
              name="width"
              value={width}
              onChange={updateField}
            />
          </section>
          <section className="form-field">
            <label htmlFor="height">Initial Height (viewBox y2)</label>
            <input
              id="height"
              type="number"
              name="height"
              value={height}
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
