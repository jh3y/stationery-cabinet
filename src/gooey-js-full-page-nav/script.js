const randomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min
const TOGGLE = document.querySelector('.menu__toggle')
const ITEMS = [...document.querySelectorAll('.menu__item')]
const SIZE_MULTIPLIER = 30
const OVERLAP_THRESHOLD = 0.25

const generateBounds = () => {
  // WANT HALF OF THE SIZE MULTIPLIER IN VMIN AROUND THE EDGES RIGHT?
  const VMIN = Math.min(window.innerHeight, window.innerWidth) / 100
  const PADDING = VMIN * SIZE_MULTIPLIER
  const x = randomInRange(PADDING, window.innerWidth - PADDING)
  const y = randomInRange(PADDING, window.innerHeight - PADDING)
  const SIZE =
    (SIZE_MULTIPLIER * Math.min(window.innerHeight, window.innerWidth)) / 100
  return {
    x: x,
    y: y,
    height: SIZE,
    width: SIZE,
    top: y,
    bottom: y + SIZE,
    left: x,
    right: x + SIZE,
  }
}

const generatePositions = () => {
  const POSITIONS = []
  ITEMS.forEach(item => {
    const bounds = item.getBoundingClientRect()
    const { height, width } = bounds
    if (POSITIONS.length === 0) {
      // First item so can set to wherever
      POSITIONS.push(generateBounds(height, width))
    } else {
      const generatePotentialPosition = () => {
        const SIZE =
          (SIZE_MULTIPLIER * Math.min(window.innerHeight, window.innerWidth)) /
          100
        const POTENTIAL = generateBounds()
        // Check if there's some vertical overlapping
        for (let p = 0; p < POSITIONS.length; p++) {
          const position = POSITIONS[p]
          const { top, bottom, left, right } = position
          let OVERLAP_Y = 0
          let OVERLAP_X = 0
          // Got a top line overlap
          if (POTENTIAL.top > top && POTENTIAL.top < bottom) {
            OVERLAP_Y = Math.abs(Math.abs(bottom - POTENTIAL.top) / SIZE)
          }
          // Got a bottom line overlap
          if (POTENTIAL.bottom > top && POTENTIAL.bottom < bottom) {
            OVERLAP_Y = Math.abs((POTENTIAL.bottom - top) / SIZE)
          }
          // Got a left line overlap
          if (POTENTIAL.left > left && POTENTIAL.left < right) {
            OVERLAP_X = Math.abs((right - POTENTIAL.left) / SIZE)
          }
          // Got a right line overlap
          if (POTENTIAL.right > left && POTENTIAL.right < right) {
            OVERLAP_X = Math.abs((POTENTIAL.right - left) / SIZE)
          }
          if (POTENTIAL.left === left || POTENTIAL.right === right) {
            OVERLAP_X = 1
          }
          if (POTENTIAL.bottom === bottom || POTENTIAL.top === top) {
            OVERLAP_Y = 1
          }
          if (OVERLAP_X > OVERLAP_THRESHOLD && OVERLAP_Y > OVERLAP_THRESHOLD) {
            return false
          }
        }
        return POTENTIAL
      }
      let POTENTIAL
      let count = 0
      while (!POTENTIAL || count < 10) {
        POTENTIAL = generatePotentialPosition()
        count++
      }
      POSITIONS.push(POTENTIAL)
    }
  })
  return POSITIONS
}

TOGGLE.addEventListener('input', () => {
  if (TOGGLE.checked) {
    const POSITIONS = (window.POSITIONS = generatePositions())
    ITEMS.forEach((item, index) => {
      if (POSITIONS[index]) {
        item.style.setProperty('--x', POSITIONS[index].x)
        item.style.setProperty('--y', POSITIONS[index].y)
        item.style.setProperty('--delay', index * 0.1)
      }
    })
  }
})
