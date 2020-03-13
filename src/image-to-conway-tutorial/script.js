/**
 * Image to Game of Life HOW TO
 */

const INSTRUCTIONS = [...document.querySelectorAll('.instruction')]
const RANGE = document.querySelector('[type="range"]')
const SCALER = document.querySelector('[type="range"].scale')
const FRAMER = document.querySelector('[type="range"].fps')
const IMG = document.querySelector('img')
const COPY_CANVAS = document.querySelector('canvas')
const COPY_CANVAS_CONTEXT = COPY_CANVAS.getContext('2d')
const START_BUTTON = document.querySelector('button.start')
const GRAB_BUTTON = document.querySelector('button.grab')

/**
 * Maintain a global state for things like the image
 * source, seed, game state, etc.
 */
const STATE = {
  IMAGE_BOUNDS: null,
  IMAGE_SOURCE: null,
  FRAME: 0,
  GAME_LOOP: null,
  GAME_SEED: null,
  GAME_STATE: null,
  SCALED_HEIGHT: null,
  SCALED_WIDTH: null,
}
/**
 * Maintain some form of config to limit
 * renders per second etc.
 */
const CONFIG = {
  FRAME_SKIP: 61 - parseInt(FRAMER.getAttribute('value'), 10),
  SCALING: parseInt(SCALER.getAttribute('value'), 10),
}

// UTILITY FUNCTIONS START
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
/**
 * Convert image data to seed
 * Returns a seed array of dead and alive cells
 * Wipes out cells that are dead on the original image data
 * modifying it in order to show what has happened to the user.
 */
const convertImageDataToSeed = imageData => {
  // Take the image data and read the 1s and 0s converting to a seed
  // Seed length should equal imageData.rows * imageData.height
  const seed = []
  // c is the cell index in our seed data
  for (let c = 0; c < imageData.width * imageData.height; c++) {
    // Grab the pixel average value.
    // Doesn't matter if it's red, green, or blue as they are the same.
    const value = imageData.data[c * 4]
    // Calculate whether it's alive
    const ALIVE = value > STATE.AVERAGES_MIDPOINT
    // Push the values into the seed.
    // If it's higher than the midpoint, it's dead. If it's lower, it's alive.
    seed.push(ALIVE ? 0 : 1)
    // If the pixel is dead, make it opaque
    imageData.data[c * 4 + 3] = ALIVE ? 255 : 0
  }
  return seed
}
/**
 * Render the game state.
 * We need to upscale the image if there has been any downscaling
 * This ensures that the image will be crisp on the canvas
 */
const renderState = gameState => {
  const {
    IMAGE_BOUNDS: { height, width },
    SCALED_WIDTH,
  } = STATE
  const { SCALING } = CONFIG
  // Clear the canvas before we begin
  COPY_CANVAS_CONTEXT.clearRect(0, 0, Math.floor(width), Math.floor(height))
  // Iterate over the game state and render it onto the canvas
  for (let c = 0; c < gameState.length; c++) {
    if (gameState[c] === 1) {
      // Work out the correct "column" position based on scaling
      const column = (c % Math.floor(SCALED_WIDTH)) * SCALING
      // Work out the correct "row" position based on scaling
      const row = Math.floor(c / Math.floor(SCALED_WIDTH)) * SCALING
      // Set the fill style for the cell
      COPY_CANVAS_CONTEXT.fillStyle = `hsl(${STATE.HUE}, ${Math.floor(
        Math.random() * 50 - 1
      ) + 50}%, ${Math.floor(Math.random() * 75 - 1) + 25}%)`
      COPY_CANVAS_CONTEXT.fillRect(column, row, SCALING, SCALING)
    }
  }
}
/**
 * Start the game
 */
const startGame = () => {
  const { SCALED_HEIGHT: height, SCALED_WIDTH: width } = STATE
  const CURRENT = STATE.GAME_STATE
  const NEXT = getNextState(CURRENT, Math.floor(width), Math.floor(height))
  STATE.FRAME = STATE.FRAME + 1
  if (STATE.FRAME % CONFIG.FRAME_SKIP !== 0)
    STATE.GAME_LOOP = requestAnimationFrame(startGame)
  else if (CURRENT.toString() !== NEXT.toString()) {
    STATE.GAME_STATE = NEXT
    renderState(NEXT)
    STATE.GAME_LOOP = requestAnimationFrame(startGame)
  } else {
    STATE.FRAME = 0
    cancelAnimationFrame(STATE.GAME_LOOP)
  }
}
// UTILITY FUNCTIONS END

/**
 * Step 1
 * Grab an Image and display it to the end user
 */
const one = async () => {
  // Show the image element
  IMG.style.display = 'flex'
  // Get it's dimensions to make an image query and store in state
  STATE.IMAGE_BOUNDS = IMG.getBoundingClientRect()
  // Grab the height and width for the image query
  const { width, height } = STATE.IMAGE_BOUNDS
  // Grab an image source string from unsplash using the image bounds
  const BASE = `https://source.unsplash.com/random/${Math.floor(
    width
  )}x${Math.floor(height)}`
  // Disable our range input whilst we grab an image
  RANGE.setAttribute('disabled', true)
  // Disable the image grab button
  GRAB_BUTTON.setAttribute('disabled', true)
  // Grab the image source
  const SRC = await (await fetch(BASE)).url
  // Set the image source
  IMG.src = SRC
  // Store the image source in state
  STATE.IMAGE_SOURCE = SRC
  // Re enable the range slider
  RANGE.removeAttribute('disabled')
  // Re enable the grab button
  GRAB_BUTTON.removeAttribute('disabled')
}

/**
 * Step 2
 * Take that image and draw it onto a canvas element
 */
const two = async () => {
  // Grab the image bounds from state
  const { width, height } = STATE.IMAGE_BOUNDS
  // Hide the image
  IMG.style.display = 'none'
  // Draw the image onto a canvas
  COPY_CANVAS.height = height
  COPY_CANVAS.width = width
  COPY_CANVAS_CONTEXT.clearRect(0, 0, width, height)
  COPY_CANVAS_CONTEXT.drawImage(IMG, 0, 0, width, height)
}

/**
 * Step 3
 * Downscale that image to our liking. Higher downscaling means
 * larger cells!
 */
const three = () => {
  const { height, width } = STATE.IMAGE_BOUNDS
  // Draw our image onto the canvas in case we come back from step 3 👍
  COPY_CANVAS_CONTEXT.clearRect(0, 0, width, height)
  // To downscale an image, we draw it onto the canvas but using fewer pixels.
  // For example, draw a 200x200 image onto a 100x100 canvas
  // Create new scaled height and width values and store them in state
  STATE.SCALED_HEIGHT = height / CONFIG.SCALING
  STATE.SCALED_WIDTH = width / CONFIG.SCALING
  // Apply those new scaled dimensions to our canvas
  COPY_CANVAS.height = STATE.SCALED_HEIGHT
  COPY_CANVAS.width = STATE.SCALED_WIDTH
  // Draw our image onto the canvas with the desired scaling 👍
  COPY_CANVAS_CONTEXT.drawImage(
    IMG,
    0,
    0,
    STATE.SCALED_WIDTH,
    STATE.SCALED_HEIGHT
  )
}

/**
 * Step 4
 * Convert that downscaled image to grayscale by averaging out the
 * image data and writing that image data back onto the
 * canvas
 */
const four = () => {
  // Grab our height and width from state. Need to use the scaled values
  const { SCALED_HEIGHT: height, SCALED_WIDTH: width } = STATE
  // Draw our image onto the canvas in case we come back from step 3 👍
  COPY_CANVAS_CONTEXT.clearRect(0, 0, width, height)
  COPY_CANVAS_CONTEXT.drawImage(IMG, 0, 0, width, height)
  // Grab the image data from the canvas context
  const IMAGE_DATA = COPY_CANVAS_CONTEXT.getImageData(0, 0, width, height)
  // Create an averages reference so we can calculate the midpoint of averages
  // This needs to be a single reference as Math.min won't work on huge arrays
  let LOWEST = 0
  let HIGHEST = 0
  // Iterate over that image data average out the RGB values
  for (let p = 0; p < IMAGE_DATA.height * IMAGE_DATA.width; p++) {
    // Grab the RGBA for a pixel
    // Each pixel is represented by 4 values in the data array
    const [r, g, b, a] = IMAGE_DATA.data.slice(p * 4, p * 4 + 4)
    // Calculate the average across those RGB values
    const AVG = (r + g + b) / 3
    // Update those average references
    if (p === 0) {
      LOWEST = AVG
      HIGHEST = AVG
    } else {
      if (AVG < LOWEST) LOWEST = AVG
      if (AVG > HIGHEST) HIGHEST = AVG
    }
    // Set the image data values for that pixel so that RGB are all equal
    // Red === p * 4
    // Green === P * 4 + 1
    // Blue === P * 4 + 2
    // Alpha === P * 4 + 3
    IMAGE_DATA.data[p * 4] = IMAGE_DATA.data[p * 4 + 1] = IMAGE_DATA.data[
      p * 4 + 2
    ] = AVG
    IMAGE_DATA.data[p * 4 + 3] = a
  }
  // Clear the canvas
  COPY_CANVAS_CONTEXT.clearRect(0, 0, width, height)
  // Put the new grayscale image data into the canvas
  COPY_CANVAS_CONTEXT.putImageData(IMAGE_DATA, 0, 0, 0, 0, width, height)
  // Store the midpoint of averages in state
  STATE.AVERAGES_MIDPOINT = LOWEST + (HIGHEST - LOWEST) / 2
}

/**
 * Step 5
 * Convert the image to black and white pixels by iterating
 * over the image data and calculating whether a cell is alive
 * referenced against the midpoint
 */
const five = () => {
  // Run four quick in order to restore the canvas to where it was before
  // showing the change over 👍
  three()
  four()
  // Grab our canvas' scaled width and height
  const { SCALED_HEIGHT: height, SCALED_WIDTH: width } = STATE
  // Grab our image data from the canvas
  const IMAGE_DATA = COPY_CANVAS_CONTEXT.getImageData(0, 0, width, height)
  // Convert that image data into a game seed. Essentially 1s and 0s based on
  // the averages midpoint we mentioned earlier
  // NOTE:: This function also manipulates the image data making dead cells transparent
  const SEED = convertImageDataToSeed(IMAGE_DATA)
  // Store that seed in the game state
  STATE.GAME_SEED = SEED
  // Clear the canvas
  COPY_CANVAS_CONTEXT.clearRect(0, 0, width, height)
  // Put the new image data onto the canvas showing the dead cells removed
  COPY_CANVAS_CONTEXT.putImageData(IMAGE_DATA, 0, 0, 0, 0, width, height)
}

/**
 * Step 6
 * Take the seed data and draw it onto the canvas as a series of
 * rectangles 👍
 */
const six = () => {
  // Grab the original image bounds
  const { height, width } = STATE.IMAGE_BOUNDS
  // Upscale the canvas back to the image size.
  // When we render the game seed, we can scale up the rectangles by the
  // scaling factor!
  COPY_CANVAS.height = height
  COPY_CANVAS.width = width
  // Grab the game seed from state
  const SEED = STATE.GAME_SEED
  // Set a cool hue for style points. Store it in state so we can do variations.
  STATE.HUE = Math.random() * 360
  // Render the seed in upscaled form
  renderState(SEED)
}

/**
 * Step 7
 * Start the game of life!
 */
const seven = () => {
  const { height, width } = STATE.IMAGE_BOUNDS
  COPY_CANVAS_CONTEXT.clearRect(0, 0, width, height)
  // Clear the animation frames if there are any in place
  cancelAnimationFrame(STATE.GAME_LOOP)
  // Draw the canvas seed.
  renderState(STATE.GAME_SEED)
  // In order to start the game set the game state.
  // This is handy if we want to reset
  STATE.GAME_STATE = STATE.GAME_SEED
  // Reset the frame state
  STATE.FRAME = 0
}

const STEPS = [one, two, three, four, five, six, seven]

RANGE.addEventListener('input', e => {
  // Clear any animation frames that are happening
  cancelAnimationFrame(STATE.GAME_LOOP)
  // Remove the game loop
  STATE.GAME_LOOP = null
  // Reset the start button
  START_BUTTON.innerHTML = 'Start!'
  // Show the correct instruction
  for (let [index, instruction] of INSTRUCTIONS.entries()) {
    instruction.style.display =
      index + 1 === parseInt(e.target.value, 10) ? 'block' : 'none'
  }
  // Run the right step
  STEPS[parseInt(e.target.value, 10) - 1]()
})

SCALER.addEventListener('input', e => {
  CONFIG.SCALING = e.target.value
  three()
})

FRAMER.addEventListener('input', e => {
  CONFIG.FRAME_SKIP = 61 - e.target.value
})

START_BUTTON.addEventListener('click', () => {
  if (STATE.GAME_LOOP) {
    cancelAnimationFrame(STATE.GAME_LOOP)
    STATE.GAME_LOOP = null
    STATE.GAME_STATE = STATE.GAME_SEED
    // Draw the game seed
    renderState(STATE.GAME_SEED)
    START_BUTTON.innerHTML = 'Start!'
  } else {
    START_BUTTON.innerHTML = 'Reset'
    startGame()
  }
})

GRAB_BUTTON.addEventListener('click', one)

// Start the first step by default
STEPS[0]()
