const { d3 } = window
const BUTTON = document.querySelector('button')

const BOUNDS = 600
// const MAX_MOUNTAIN_POINTS = 10
// const MIN_MOUNTAIN_POINTS = 3
const randomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min
/**
 * Generate a mountain
 * Points can be between 3 (bottom, peak, bottom) and max POINTS
 * First and last y must be around the same center point
 */
const generateMountainPoints = () => {
  const POINTS = 10
  return new Array(POINTS).fill().reduce((a, c, i) => {
    let x
    let y
    if (i === 0 || i === POINTS - 1) {
      y = BOUNDS / 2
    } else {
      y = randomInRange(0, 300)
    }
    let prevX = a[i - 1] ? a[i - 1][0] : 0
    // console.info(i, a, a[i - 1])
    x = randomInRange(prevX, 600)
    return [...a, [x, y]]
  }, [])
}

const generateScene = () => {
  const LINE = d3.line()(generateMountainPoints())
  d3.select('path').attr('d', LINE)
}

BUTTON.addEventListener('click', generateScene)
