/**
 * Given some index for a cell in the grid, return the neighbours of that
 * cell that are visible in the grid
 * For example, the neighbours for 0, might be [1, 10, 11]
 * @param {Number} CELL - The cell index to calculate neighbours for
 * @param {Number} CELL_COUNT - The total number of cells available - assumes a grid
 */
const getNeighbours = (CELL, COLUMNS, ROWS) => {
  const column = Math.floor(CELL % COLUMNS)
  const row = Math.floor(CELL / COLUMNS)
  // Create an Array of all possible neighbours
  const neighbours = [
    // Top left
    row * COLUMNS + (column - 1) - COLUMNS,
    // Top center
    row * COLUMNS + column - COLUMNS,
    // Top right
    row * COLUMNS + (column + 1) - COLUMNS,
    // Left
    row * COLUMNS + (column - 1),
    // Right
    row * COLUMNS + (column + 1),
    // Bottom left
    row * COLUMNS + (column - 1) + COLUMNS,
    // Bottom center
    row * COLUMNS + column + COLUMNS,
    // Bottom right
    row * COLUMNS + (column + 1) + COLUMNS,
  ]
  // Filter those neighbours to remove cells outside the grid
  return neighbours.filter(value => {
    const row = Math.floor(value / COLUMNS)
    // A valid row is one that is greater than or equal to 0 or less than the total number of rows
    const validRow = row <= ROWS - 1 && row >= 0
    // A valid column is a little trickier. We need to account for being in the left most column
    // This requires filtering out values that would appear on a different row etc.
    const validColumn =
      (column === 0 && (value % COLUMNS === 0 || value % COLUMNS === 1)) ||
      (column === COLUMNS - 1 &&
        (value % COLUMNS === column - 1 || value % COLUMNS === COLUMNS - 1)) ||
      (column > 0 && column < COLUMNS - 1)
    return validRow && validColumn
  })
}

/**
 * Get Next State
 * Will flip the state of all the cells from either alive (1) or dead (0)
 *
 * THE RULES
 * 1. Alive cell - Fewer than 2 alive neighbours - dies (underpopulation).
 * 2. Alive cell - 2 or 3 alive neighbours - continues to live (perfect situation).
 * 3. Alive cell - More than 3 alive neighbours - dies (overpopulation).
 * 4. Dead cell - Exactly three alive neighbours - becomes alive (reproduction).
 */
const getNextState = (currentState, columns, rows) => {
  const state = new Array(currentState.length).fill().map((cell, index) => {
    const ALIVE = currentState[index] === 1
    const ALIVE_NEIGHBOURS = getNeighbours(index, columns, rows)
      .map(neighbour => currentState[neighbour] === 1)
      .filter(alive => alive).length
    if (ALIVE && ALIVE_NEIGHBOURS < 2) return 0
    if ((ALIVE && ALIVE_NEIGHBOURS === 2) || (ALIVE && ALIVE_NEIGHBOURS === 3))
      return 1
    if (ALIVE && ALIVE_NEIGHBOURS > 3) return 0
    if (!ALIVE && ALIVE_NEIGHBOURS === 3) return 1
    return currentState[index]
  })
  return state
}

const convertImageDataToSeed = imageData => {
  // Take the image data and read the 1s and 0s converting to a seed
  // Seed length should equal imageData.rows * imageData.height
  const seed = []
  for (let c = 0; c < imageData.width * imageData.height; c++) {
    // c is the index
    const column = c % imageData.width
    const row = Math.floor(c / imageData.width)
    const value = imageData.data[row * (imageData.width * 4) + column * 4 + 2]
    seed.push(value === 100 ? 0 : 1)
  }
  return seed
}
const WIDTH = 400
const HEIGHT = 200

// eslint-disable-next-line
;(async function() {
  // Grab an image source string from unsplash
  const BASE = `https://source.unsplash.com/random/${WIDTH}x${HEIGHT}`
  const SRC = await (await fetch(BASE)).url
  // Grab our canvas from the DOM
  const $IMG = document.querySelector('img')
  $IMG.src = SRC
  const $CANVAS = document.querySelector('canvas')
  const context = $CANVAS.getContext('2d')
  // This is where the magic happens
  const generateGame = () => {
    $CANVAS.style.height = $IMG.offsetHeight
    $CANVAS.style.width = $IMG.offsetWidth
    $CANVAS.width = $IMG.offsetWidth / 2
    $CANVAS.height = $IMG.offsetHeight / 2
    context.drawImage(img, 0, 0, $CANVAS.width, $CANVAS.height)
    // Iterate over it and set it back
    const data = context.getImageData(0, 0, $CANVAS.width, $CANVAS.height)
    const newData = context.createImageData($CANVAS.width, $CANVAS.height)
    const averages = []
    for (let s = 0; s < data.width * data.height; s++) {
      const [r, g, b] = data.data.slice(s * 4, s * 4 + 4)
      const average = (r + g + b) / 3
      averages.push(average)
    }
    const lowest = Math.min(...averages)
    const highest = Math.max(...averages)
    const midPoint = lowest + (highest - lowest) / 2
    // Now create the new data
    for (let s = 0; s < data.width * data.height; s++) {
      const [r, g, b, a] = data.data.slice(s * 4, s * 4 + 4)
      const value = (r + g + b) / 3 > midPoint ? 100 : 0
      newData.data[s * 4] = value
      newData.data[s * 4 + 1] = value
      newData.data[s * 4 + 2] = value
      newData.data[s * 4 + 3] = a
    }
    // We don't actually need to do this part as we can simply render squares to the canvas as cells
    // based on the width and height (columns and rows)
    const seed = convertImageDataToSeed(newData)
    // Take the seed and draw it onto the second canvas
    const output = document.querySelector('.output')
    output.width = $CANVAS.width
    output.height = $CANVAS.height
    output.style.width = $CANVAS.offsetWidth
    output.style.height = $CANVAS.offsetHeight
    const outputRender = output.getContext('2d')
    const renderState = state => {
      outputRender.clearRect(0, 0, $CANVAS.offsetWidth, $CANVAS.offsetHeight)
      for (let c = 0; c < state.length; c++) {
        if (state[c] === 1) {
          const column = c % $CANVAS.width
          const row = Math.floor(c / $CANVAS.width)
          outputRender.fillRect(column, row, 1, 1)
        }
      }
    }
    renderState(seed)
    context.putImageData(newData, 0, 0, 0, 0, newData.width, newData.height)
    // Cool. Now start the game of life with it!
    const STATE = {
      STATE: seed,
      FRAMES: null,
      FRAME: 0,
    }
    const CONFIG = {
      FRAME_SKIP: 1,
    }
    const draw = () => {
      const currentState = STATE.STATE
      const nextState = getNextState(STATE.STATE, output.width, output.height)
      STATE.FRAME = STATE.FRAME + 1
      if (STATE.FRAME % CONFIG.FRAME_SKIP !== 0)
        STATE.FRAMES = requestAnimationFrame(draw)
      else if (currentState.toString() !== nextState.toString()) {
        STATE.STATE = nextState
        renderState(nextState)
        STATE.FRAMES = requestAnimationFrame(draw)
      } else {
        STATE.FRAME = 0
        // BUTTON.name('REGENERATE')
        cancelAnimationFrame(STATE.FRAMES)
      }
    }
    setTimeout(draw, 2000)
    document.body.addEventListener('click', draw)
  }
  // Generate an image we can hook into to make sure it's loaded
  const img = new Image()
  // Set the cross origin so that we can use the image data on the canvas
  img.crossOrigin = 'Anonymous'
  // On image load generate a new game and start it
  img.onload = generateGame
  // Set the source string to trigger the loading
  img.src = SRC
})()
