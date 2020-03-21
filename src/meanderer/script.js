const { d3, Splitting } = window
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

const CONTAINER = document.querySelector('.container')
const PATH =
  'M32.074 13.446s-2.706-2.965-4.158-4.349c-2.003-1.908-3.941-3.942-6.268-5.437C19.33 2.173 16.838.747 14.132.24 13.01.028 11.818.152 10.71.43 8.61.96 6.534 1.85 4.826 3.18a11.59 11.59 0 00-3.262 3.998C.624 9.104.186 11.304.136 13.446c-.04 1.678.287 3.389.884 4.957.602 1.579 1.477 3.106 2.655 4.318 1.545 1.59 3.456 2.957 5.564 3.645 1.786.583 3.783.636 5.629.288 1.861-.35 3.56-1.354 5.18-2.334 1.82-1.1 3.429-2.525 5.021-3.934 3.71-3.281 6.94-7.07 10.522-10.49 1.692-1.614 3.369-3.253 5.18-4.732 1.614-1.318 3.155-2.82 5.054-3.678C47.606.68 49.595.147 51.549.206c2.04.062 4.1.705 5.884 1.696 1.492.827 2.796 2.047 3.806 3.421 1.138 1.55 1.896 3.39 2.399 5.245.361 1.334.547 2.75.415 4.126-.155 1.628-.675 3.238-1.407 4.7-.754 1.507-1.775 2.913-3.006 4.062-1.202 1.122-2.603 2.12-4.157 2.655-1.701.585-3.583.692-5.373.511-1.819-.183-3.611-.78-5.245-1.599-1.833-.92-3.405-2.304-4.957-3.645-2.811-2.43-7.834-7.932-7.834-7.932z'
const WIDTH = 64.228
const HEIGHT = 27.004

const responsivePath = new Meanderer({
  path: PATH,
  width: WIDTH,
  height: HEIGHT,
})

const setPath = () => {
  const scaledPath = responsivePath.generatePath(
    CONTAINER.offsetWidth,
    CONTAINER.offsetHeight
  )
  CONTAINER.style.setProperty('--path', `"${scaledPath}"`)
}
Splitting()

const SizeObserver = new ResizeObserver(setPath)
SizeObserver.observe(CONTAINER)
