/**
 * Conway's game of life in JavaScript
 */
const {
  dat: { GUI },
} = window
const GRID = document.querySelector('.grid')

// START GAME OF LIFE SPECIFIC FUNCTIONS
/**
 * Generate a seed state given some size
 */
const generateState = SIZE =>
  new Array(SIZE).fill().map(() => (Math.random() > 0.5 ? 1 : 0))

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

// END GAME OF LIFE SPECIFIC FUNCTIONS

// Config for dat.GUI. Not crucial to game of life mechanics
const CONFIG = {
  FRAME_SKIP: 5,
  START: () => {},
  COLUMNS: 15,
  ROWS: 10,
}

// Game state
const STATE = {
  PLAYING: false,
  // Initialise game state with a generated seed
  STATE: generateState(GRID.querySelectorAll('.grid__cell').length),
  // Frame count used for limiting updates per second
  FRAME: 0,
  // Keep a reference to the current grid cells in the DOM
  CELLS: GRID.querySelectorAll('.grid__cell'),
}

/**
 * For this demo, we use a CSS property to display whether a cell is active.
 * This function merely iterates through the DOM cells and sets this property.
 */
const renderState = state => {
  for (let s = 0; s < state.length; s++) {
    STATE.CELLS[s].style.setProperty('--active', state[s])
  }
}

// Set up dat.GUI
const options = new GUI()
options.add(CONFIG, 'FRAME_SKIP', 1, 100, 1).name('FPS')
const COLUMNS = options.add(CONFIG, 'COLUMNS', 5, 35, 1)
const ROWS = options.add(CONFIG, 'ROWS', 5, 35, 1)
const BUTTON = options.add(CONFIG, 'START')

/**
 * Draw function.
 * Gets the next state based on the current and if it differs, renders it.
 * Otherwise, break the loop and let the user regenerate the seed 👍
 */
const draw = () => {
  const currentState = STATE.STATE
  const nextState = getNextState(STATE.STATE, CONFIG.COLUMNS, CONFIG.ROWS)
  STATE.FRAME = STATE.FRAME + 1
  if (STATE.FRAME % CONFIG.FRAME_SKIP !== 0)
    STATE.FRAMES = requestAnimationFrame(draw)
  else if (currentState.toString() !== nextState.toString()) {
    STATE.STATE = nextState
    STATE.FRAMES = requestAnimationFrame(draw)
    renderState(nextState)
  } else {
    STATE.FRAME = 0
    BUTTON.name('REGENERATE')
    cancelAnimationFrame(STATE.FRAMES)
  }
}
/**
 * Resets the grid and cancels any loops
 * Sets a new cell hue so it's clear to the user there has been a reset
 */
const reset = () => {
  BUTTON.name('START')
  STATE.PLAYING = false
  STATE.FRAME = 0
  cancelAnimationFrame(STATE.FRAMES)
  GRID.style.setProperty('--hue', Math.random() * 360)
  STATE.STATE = generateState(STATE.CELLS.length)
  renderState(STATE.STATE)
}

/**
 * Flip the play state on click
 */
const start = () => {
  if (!STATE.PLAYING) {
    BUTTON.name('STOP')
    STATE.PLAYING = true
    draw()
  } else {
    reset()
  }
}

const onSizeChange = e => {
  GRID.innerHTML = ''
  let newChildren = ''
  for (let c = 0; c < CONFIG.COLUMNS * CONFIG.ROWS; c++) {
    newChildren += '<div class="grid__cell"></div>'
  }
  GRID.style.setProperty('--columns', CONFIG.COLUMNS)
  GRID.style.setProperty('--rows', CONFIG.ROWS)
  GRID.innerHTML = newChildren
  STATE.CELLS = GRID.querySelectorAll('.grid__cell')
  reset()
}

// Render an initial state
renderState(STATE.STATE)

// Bind event handlers
GRID.addEventListener('click', start)
BUTTON.onChange(start)
COLUMNS.onChange(onSizeChange)
ROWS.onChange(onSizeChange)

/**
 * Debug neighbours filtering with this 👍
 */
// const neighbours = getNeighbours(135, CONFIG.COLUMNS, CONFIG.ROWS)
// for (let n = 0; n < neighbours.length; n++) {
//   STATE.CELLS[neighbours[n]].style.setProperty('--active', 1)
// }
