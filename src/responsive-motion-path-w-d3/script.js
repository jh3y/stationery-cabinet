const { d3 } = window

// Given some path and a container, make the path scale with the container when we need it to 👍
class ResponsiveMotionPath {
  constructor({ container, element, path, strokeWidth, viewbBox }) {
    const { height, width } = container.getBoundingClientRect()
    this.STATE = {
      CONTAINER_HEIGHT: height,
      CONTAINER_WIDTH: width,
    }
    this.CONTAINER = container
    this.ELEMENT = element
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
    this.ON_CHANGE(initialPath)
    window.addEventListener('resize', this.scale)
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
    const { height, width } = this.CONTAINER.getBoundingClientRect()
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
    const { height, width } = this.CONTAINER.getBoundingClientRect()
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

const path =
  'M10.362 18.996s-6.046 21.453 1.47 25.329c10.158 5.238 18.033-21.308 29.039-18.23 13.125 3.672 18.325 36.55 18.325 36.55l12.031-47.544'
const viewBox = [0, 0, 79.375, 79.375]
const strokeWidth = 0.265
const container = document.querySelector('.result')
const element = document.querySelector('.result .element')
const onChange = newPath => {
  element.style.setProperty('--path', `"${newPath}"`)
  d3.select('.result path').attr('d', newPath)
}
new ResponsiveMotionPath({
  container,
  onChange,
  path,
  strokeWidth,
  viewBox,
})
