const { d3 } = window
const BUTTON = document.querySelector('button')

// const BOUNDS = 600
// const MAX_MOUNTAIN_POINTS = 10
// const MIN_MOUNTAIN_POINTS = 3
const randomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min
/**
 * Generate a mountain
 * Points can be between 3 (bottom, peak, bottom) and max POINTS
 * First and last y must be around the same center point
 */
// const generateMountainPoints = () => {
//   const POINTS = 10
//   return new Array(POINTS).fill().reduce((a, c, i) => {
//     let x
//     let y
//     if (i === 0 || i === POINTS - 1) {
//       y = BOUNDS / 2
//     } else {
//       y = randomInRange(0, 300)
//     }
//     let prevX = a[i - 1] ? a[i - 1][0] : 0
//     // console.info(i, a, a[i - 1])
//     x = randomInRange(prevX, 600)
//     return [...a, [x, y]]
//   }, [])
// }
// const SVG = document.querySelector('svg')
const TRAIN = document.querySelector('.train')
const DOMAIN = [0, 10]
const NUM_POINTS = 10
const PADDING = 10
const MIN_SIZE = 300
const MIN_RADIUS = MIN_SIZE / 3
const angleScale = d3
  .scaleLinear()
  .domain(DOMAIN)
  .range([0, 2 * Math.PI])

const generateStaticPoints = () => {
  const POINTS = []
  /**
   * How about we always have the same number of POINTS? But if we want to skip one, we duplicate?
   * We know the number of points and the domain. So we can calculate a step point at which it should be used right?
   *  */
  const STEP = DOMAIN[1] / NUM_POINTS
  for (let p = 0; p < NUM_POINTS; p++) {
    const X = randomInRange(p * STEP, p + 1 * STEP)
    POINTS.push([X, Math.random() * 10])
  }
  return POINTS
}

let POINTS
const generatePoints = () => {
  POINTS = generateStaticPoints()
}

const generateScene = () => {
  const { height } = document.querySelector('svg').getBoundingClientRect()
  const SIZE = Math.max(MIN_SIZE, height)
  const radiusScale = d3
    .scaleLinear()
    .domain(DOMAIN)
    .range([MIN_RADIUS, Math.max(MIN_SIZE, height) / 2 - PADDING])
  const LINE = d3.lineRadial().curve(d3.curveBasisClosed)(
    POINTS.map(POINT => [angleScale(POINT[0]), radiusScale(POINT[1])])
  )
  d3.select('svg')
    .attr('viewBox', `0 0 ${SIZE} ${SIZE}`)
    .attr('height', SIZE)
    .attr('width', SIZE)
  d3.select('path')
    .attr('d', `${LINE}`)
    .attr('transform', `translate(${SIZE / 2}, ${SIZE / 2})`)
  TRAIN.style.setProperty('--path', `"${LINE}"`)
}
const generate = () => {
  generatePoints()
  generateScene()
}
generate()
BUTTON.addEventListener('click', generate)
window.addEventListener('resize', generateScene)
