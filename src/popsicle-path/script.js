const { d3, Splitting } = window

// Given some path and a container, make the path scale with the container when we need it to 👍
class ResponsiveMotionPath {
  constructor({
    container,
    height,
    onChange,
    path,
    strokeWidth,
    viewBox,
    width,
  }) {
    const {
      height: boundingHeight,
      width: boundingWidth,
    } = container.getBoundingClientRect()
    this.STATE = {
      CONTAINER_HEIGHT: boundingHeight,
      CONTAINER_WIDTH: boundingWidth,
    }
    this.CONTAINER = container
    this.ON_CHANGE = onChange
    this.PATH = path
    this.VIEWBOX = viewBox
    this.HEIGHT = height
    this.WIDTH = width
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
    if (onChange) onChange(initialPath)
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
    const OFFSET_RATIO =
      (Math.max(this.HEIGHT, this.WIDTH) - Math.min(this.HEIGHT, this.WIDTH)) /
      Math.max(this.HEIGHT, this.WIDTH)
    // TODO:: Work out how to apply an offset if the container doesn't match the aspect ratio of the path
    const OFFSET = (OFFSET_RATIO * width) / 2
    // In here we need to work out which side needs the offset. It's whichever one is smallest in order to centralize.
    // What if the container matches the aspect ratio...
    const xScale = d3
      .scaleLinear()
      .domain([0, maxWidth])
      .range([OFFSET, width * widthRatio + OFFSET])
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
  'M56.374 0C25.143 0 0 23.65 0 53.028v126.43c0 4.793 4.102 8.652 9.198 8.652h35.604v44.654c0 4.684 5.16 8.456 11.571 8.456 6.41 0 11.572-3.772 11.572-8.456V188.11h35.605c5.095 0 9.198-3.86 9.198-8.652V53.028C112.748 23.651 87.605 0 56.374 0z'
const VIEWBOX = [0, 0, 241.22, 241.22]
const WIDTH = 112.748
const HEIGHT = 241.22

Splitting()

const CONTAINER = document.querySelector('.container')
const onChange = path => {
  CONTAINER.style.display = 'block'
  CONTAINER.style.setProperty('--path', `"${path}"`)
}

const responsive = new ResponsiveMotionPath({
  container: document.querySelector('.container'),
  onChange,
  path: PATH,
  height: HEIGHT,
  width: WIDTH,
  viewBox: VIEWBOX,
})
const SizeObserver = new ResizeObserver(entries => {
  responsive.scale()
})
SizeObserver.observe(CONTAINER)
