const {
  THREE,
  gsap: { set, timeline, to },
  dat: { GUI },
} = window
const {
  Color,
  Group,
  Mesh,
  BoxGeometry,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  OrbitControls,
  PointLight,
  MeshPhongMaterial,
  PointLightHelper,
} = THREE

// START GAME OF LIFE SPECIFIC FUNCTIONS
/**
 * Generate a seed state given some size
 */
const generateSeed = SIZE =>
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

/**
 * Principles of threeJS are as follows.
 * 1. Set up a scene
 * 2. Set up a camera in order to see that scene
 * 3. Add lighting to the scene in order to see things. Some materials don't care about lighting (Mesh Basic Material?)
 * 4. Everything is a Mesh. A Mesh consists of a geometry and material combined.
 * 5. You can group meshes into a Group.
 * 6. Need a different shape or material? Check the docs.
 * 7. You can apply transforms to a mesh and declare position like you would in say ZDog
 * 8. Animate a scene using requestAnimationFrame as you would normally 👍
 *    If you don't keep rendering the scene within a requestAnimationFrame, drag controls etc. won't work
 * 9. Do this by having the renderer render the scene with the camera
 * 10. Before doing anything though, append the renderer's DOM element to the document.body
 *     or wherever it's going.
 */
const randomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min
const HUE_LOWER = Math.random() * 360
const HUE_HIGHER = randomInRange(HUE_LOWER, 360)

const CONFIG = {
  SIZE: 2,
  MARGIN: 0.1,
  FOV: 75,
  NEAR: 0.1,
  FAR: 1000,
  ROWS: 100,
  COLUMNS: 100,
  TWEEN_SPEED: 0.2,
  TWEEN_DELAY: 0.4,
  COLOR: {
    HUE_RANGE: {
      FROM: HUE_LOWER,
      TO: HUE_HIGHER,
    },
    SATURATION_RANGE: {
      FROM: 50,
      TO: 100,
    },
    LIGHTNESS_RANGE: {
      FROM: 40,
      TO: 60,
    },
  },
  LIGHTS: {
    POSITIONS: [
      [210, 20, 40],
      [0, 180, -220],
      [-160, 30, 110],
    ],
    COLOR: 0xffffff,
  },
  START: () => {},
  REGENERATE: () => {},
  RESET: () => {},
  SPIN: {
    X: 0.00005,
    Y: 0.0005,
    Z: 0.00005,
  },
}
const STATE = {
  GAME_LOOP: null,
  GAME_TIMELINE: null,
  GAME_SEED: generateSeed(CONFIG.COLUMNS * CONFIG.ROWS),
  ANIM_LOOP: null,
  // Keep an Array of created cells in memory for reuse
  CELLS: null,
  CELL_POOL: [],
}

// UTILITY FUNCTIONS
const setCellColor = cell => {
  // Generate a hue from range
  const HUE = randomInRange(
    CONFIG.COLOR.HUE_RANGE.FROM,
    CONFIG.COLOR.HUE_RANGE.TO
  )
  const SATURATION = randomInRange(
    CONFIG.COLOR.SATURATION_RANGE.FROM,
    CONFIG.COLOR.SATURATION_RANGE.TO
  )
  const LIGHTNESS = randomInRange(
    CONFIG.COLOR.LIGHTNESS_RANGE.FROM,
    CONFIG.COLOR.LIGHTNESS_RANGE.TO
  )
  // Set a random color for that cell
  cell.material.color.setHSL(HUE * (1 / 360), SATURATION / 100, LIGHTNESS / 100)
}
//

/**
 * Set up dat.GUI to play with different configurations
 */
const CONTROLS = new GUI({ closed: false })
// Create a Scene
const SCENE = new Scene()
// Set the background
SCENE.background = new Color(0x222222)
// Create a camera (Could use different types of camera if needs be, maybe try cube)
const CAMERA = new PerspectiveCamera(
  CONFIG.FOV,
  window.innerWidth / window.innerHeight,
  CONFIG.NEAR,
  CONFIG.FAR
)
CAMERA.position.x = -90
CAMERA.position.y = -20
CAMERA.position.z = 180
const CAMERA_CONTROLS = CONTROLS.addFolder('Camera')
const CAMERA_POS_CONTROLS = CAMERA_CONTROLS.addFolder('Position')
const CAMERA_X_CONTROL = CAMERA_POS_CONTROLS.add(
  CAMERA.position,
  'x',
  -1000,
  1000,
  1
)
const CAMERA_Y_CONTROL = CAMERA_POS_CONTROLS.add(
  CAMERA.position,
  'y',
  -1000,
  1000,
  1
)
const CAMERA_Z_CONTROL = CAMERA_POS_CONTROLS.add(
  CAMERA.position,
  'z',
  0,
  1000,
  1
)
// Create the renderer
const RENDERER = new WebGLRenderer({ alpha: false })
// Set the renderer to the size we want it to be. Usually window size but doesn't have to be.
RENDERER.setSize(window.innerWidth, window.innerHeight)
// Set the pixel ratio to match the device
RENDERER.setPixelRatio(window.devicePixelRatio)
// Set orbital controls so user can move things around.
// Are drag controls any good here also?
new OrbitControls(CAMERA, RENDERER.domElement)
// A cell is just a cube or a box so we can use the box geometry 👍
const CELL_GEOMETRY = new BoxGeometry(CONFIG.SIZE, CONFIG.SIZE, CONFIG.SIZE)
// Create a color for the brick material from HSL
const HUE =
  Math.floor(
    Math.random() * CONFIG.COLOR.HUE_RANGE.TO - CONFIG.COLOR.HUE_RANGE.FROM + 1
  ) + CONFIG.COLOR.HUE_RANGE.FROM
const COLOR = new Color(`hsl(${HUE}, 100%, ${Math.floor(Math.random() * 75)}%)`)
// Create a shared material that the different elements of a group can use
const CELL_MATERIAL = new MeshPhongMaterial({
  color: COLOR,
  wireframe: false,
  specular: 0xffffff,
  shininess: 30,
})
// Create a new group for our cells.
// Fill this and then translate the group to center it
const CELLS = new Group()
// Create a utility function for rendering the cells
const renderCells = SEED => {
  // Iterate over the game seed and create cells
  for (let c = 0; c < SEED.length; c++) {
    // Grab a cell from the CELL_POOL if we can. Else create a new one
    const NEW_CELL = STATE.CELL_POOL[c]
      ? STATE.CELL_POOL[c]
      : new Mesh(CELL_GEOMETRY, CELL_MATERIAL.clone())
    setCellColor(NEW_CELL)
    // If the SEED is 0, scale the cell down to 0.001
    if (SEED[c] === 0) NEW_CELL.scale.set(0.001, 0.001, 0.001)
    // Else set it to 1 just in case we are reusing a cell
    else NEW_CELL.scale.set(1, 1, 1)
    // Work out the column for that cell
    const COL = c % CONFIG.COLUMNS
    // Work out the row for that cell
    const ROW = Math.floor(c / CONFIG.COLUMNS)
    NEW_CELL.position.x = CONFIG.SIZE * COL + CONFIG.MARGIN * COL
    NEW_CELL.position.y = CONFIG.SIZE * -ROW - CONFIG.MARGIN * ROW
    CELLS.add(NEW_CELL)
  }
  // Now all the cells are added into the group, translate the group to center 👍
  // Take into account any applied margins
  CELLS.position.x =
    (-CONFIG.SIZE * CONFIG.COLUMNS) / 2 +
    CONFIG.SIZE / 2 -
    (CONFIG.MARGIN * CONFIG.COLUMNS) / 2 +
    CONFIG.MARGIN / 2
  CELLS.position.y =
    (CONFIG.SIZE * CONFIG.ROWS) / 2 -
    CONFIG.SIZE / 2 +
    (CONFIG.MARGIN * CONFIG.ROWS) / 2 -
    CONFIG.MARGIN / 2
}
// Render those cells into the Cells group with the utility
renderCells(STATE.GAME_SEED)
// Add the cells to the scene within a group
// This way we can rotate the Group and the translation won't affect it
const CELL_HOLDER = new Group()
CELL_HOLDER.add(CELLS)
SCENE.add(CELL_HOLDER)
/**
 * LIGHTING
 */
// Create a set of lights in an array
const LIGHTS = []
const LIGHT_HELPERS = []
// Create a controls folder that we can add to in our loop
const LIGHTS_CONTROL = CONTROLS.addFolder('Lights')
for (let l = 0; l < 3; l++) {
  LIGHTS.push(new PointLight(0xfafafa, 1, 0))
  LIGHTS[l].position.set(
    CONFIG.LIGHTS.POSITIONS[l][0],
    CONFIG.LIGHTS.POSITIONS[l][1],
    CONFIG.LIGHTS.POSITIONS[l][2]
  )
  SCENE.add(LIGHTS[l])
  LIGHT_HELPERS.push(new PointLightHelper(LIGHTS[l]))
  SCENE.add(LIGHT_HELPERS[l])
  LIGHT_HELPERS[l].visible = false
  const LIGHT_CONTROLS = LIGHTS_CONTROL.addFolder(l)
  LIGHT_CONTROLS.add(LIGHTS[l].position, 'x', -300, 300, 1)
  LIGHT_CONTROLS.add(LIGHTS[l].position, 'y', -300, 300, 1)
  LIGHT_CONTROLS.add(LIGHTS[l].position, 'z', -300, 300, 1)
  LIGHT_CONTROLS.add(LIGHT_HELPERS[l], 'visible').name('Show helper?')
}

/**
 * Set up renderer and scene
 */
document.body.appendChild(RENDERER.domElement)
const animate = () => {
  // Gently rotate the scene
  CELL_HOLDER.rotation.x += CONFIG.SPIN.X
  CELL_HOLDER.rotation.y += CONFIG.SPIN.Y
  CELL_HOLDER.rotation.z += CONFIG.SPIN.Z
  // Update the camera controls if user has zoomed
  CAMERA_X_CONTROL.updateDisplay()
  CAMERA_Y_CONTROL.updateDisplay()
  CAMERA_Z_CONTROL.updateDisplay()
  // Render the scene
  RENDERER.render(SCENE, CAMERA)
  STATE.ANIM_LOOP = requestAnimationFrame(animate)
}
animate()
// On window resize, update the aspect ratio and renderer dimensions
window.addEventListener('resize', () => {
  RENDERER.setSize(window.innerWidth, window.innerHeight)
  CAMERA.aspect = window.innerWidth / window.innerHeight
  CAMERA.updateProjectionMatrix()
})

/**
 * Game loop tween. A function that calculates what to tween
 * and then recursively calls itself until the seeds are the
 * same or the game is stopped. Can use timeline.pause()
 */
const tweenGame = () => {
  const NEXT_STATE = getNextState(STATE.GAME_STATE, CONFIG.COLUMNS, CONFIG.ROWS)
  if (NEXT_STATE.toString() === STATE.GAME_STATE.toString()) return
  const ON_CELLS = [
    ...CELLS.children.filter((cell, index) => NEXT_STATE[index] === 1),
  ]
  const ONS = [...ON_CELLS.map(cell => cell.scale)]
  const OFF_CELLS = [
    ...CELLS.children.filter((cell, index) => NEXT_STATE[index] === 0),
  ]
  const OFFS = [...OFF_CELLS.map(cell => cell.scale)]
  STATE.GAME_STATE = NEXT_STATE
  STATE.GAME_TIMELINE = new timeline({
    delay: CONFIG.TWEEN_DELAY,
    onStart: () => {
      set(ON_CELLS, { visible: true })
    },
    onComplete: () => {
      // Hide the OFFS
      set(OFF_CELLS, { visible: false })
      tweenGame()
    },
  })
    .add(
      to(ONS, {
        duration: CONFIG.TWEEN_SPEED,
        x: 1,
        y: 1,
        z: 1,
      })
    )
    .add(
      to(OFFS, {
        duration: CONFIG.TWEEN_SPEED,
        x: 0.001,
        y: 0.001,
        z: 0.001,
      }),
      0
    )
}

const KILL_TL = () => {
  // If playing pause and kill
  if (STATE.GAME_TIMELINE) {
    STATE.GAME_TIMELINE.kill()
    STATE.GAME_TIMELINE = null
    START_BUTTON.name('Play')
  }
  // Remove all the cells from the group but not the pool
  while (CELLS.children.length > 0) {
    CELLS.remove(CELLS.children[0])
  }
}

const onConfigChange = () => {
  KILL_TL()
  STATE.GAME_SEED = generateSeed(CONFIG.COLUMNS * CONFIG.ROWS)
  renderCells(STATE.GAME_SEED)
}

const CONFIG_CONTROLS = CONTROLS.addFolder('Board')
CONFIG_CONTROLS.add(CONFIG, 'COLUMNS', 5, 100, 1)
  .name('Columns')
  .onFinishChange(onConfigChange)
CONFIG_CONTROLS.add(CONFIG, 'ROWS', 5, 100, 1)
  .name('Rows')
  .onFinishChange(onConfigChange)

const ANIM_CONTROLS = CONTROLS.addFolder('Animation')
const TWEEN_CONTROLS = ANIM_CONTROLS.addFolder('Tween')
TWEEN_CONTROLS.add(CONFIG, 'TWEEN_SPEED', 0.05, 2, 0.01).name('Speed')
TWEEN_CONTROLS.add(CONFIG, 'TWEEN_DELAY', 0, 2, 0.01).name('Delay')
const SPIN_CONTROLS = ANIM_CONTROLS.addFolder('Spin')
SPIN_CONTROLS.add(CONFIG.SPIN, 'X', 0, 0.1, 0.0001)
SPIN_CONTROLS.add(CONFIG.SPIN, 'Y', 0, 0.1, 0.0001)
SPIN_CONTROLS.add(CONFIG.SPIN, 'Z', 0, 0.1, 0.0001)
const onColorChange = () => {
  for (const CELL of CELLS.children) {
    setCellColor(CELL)
  }
}
const COLOR_CONTROLS = CONTROLS.addFolder('Color')
const HUE_CONTROLS = COLOR_CONTROLS.addFolder('Hue Range')
HUE_CONTROLS.add(CONFIG.COLOR.HUE_RANGE, 'FROM', 0, 360, 1).onFinishChange(
  onColorChange
)
HUE_CONTROLS.add(CONFIG.COLOR.HUE_RANGE, 'TO', 0, 360, 1).onFinishChange(
  onColorChange
)
const SAT_CONTROLS = COLOR_CONTROLS.addFolder('Saturation Range')
SAT_CONTROLS.add(
  CONFIG.COLOR.SATURATION_RANGE,
  'FROM',
  0,
  100,
  1
).onFinishChange(onColorChange)
SAT_CONTROLS.add(CONFIG.COLOR.SATURATION_RANGE, 'TO', 0, 100, 1).onFinishChange(
  onColorChange
)
const LIGHT_CONTROLS = COLOR_CONTROLS.addFolder('Lightness Range')
LIGHT_CONTROLS.add(
  CONFIG.COLOR.LIGHTNESS_RANGE,
  'FROM',
  0,
  100,
  1
).onFinishChange(onColorChange)
LIGHT_CONTROLS.add(
  CONFIG.COLOR.LIGHTNESS_RANGE,
  'TO',
  0,
  100,
  1
).onFinishChange(onColorChange)

CONTROLS.add(CONFIG, 'REGENERATE')
  .name('Regenerate')
  .onChange(() => {
    KILL_TL()
    // Regenerate seed
    STATE.GAME_SEED = generateSeed(CONFIG.COLUMNS * CONFIG.ROWS)
    // Draw seed
    renderCells(STATE.GAME_SEED)
  })

CONTROLS.add(CONFIG, 'RESET')
  .name('Reset')
  .onChange(() => {
    KILL_TL()
    renderCells(STATE.GAME_SEED)
  })

const START_BUTTON = CONTROLS.add(CONFIG, 'START')
  .name('Play')
  .onChange(() => {
    if (STATE.GAME_TIMELINE && STATE.GAME_TIMELINE.isActive()) {
      STATE.GAME_TIMELINE.pause()
      START_BUTTON.name('Play')
    } else if (STATE.GAME_TIMELINE) {
      STATE.GAME_TIMELINE.play()
      // Set the start button to say pause
      START_BUTTON.name('Pause')
    } else {
      // Before starting the game set the seed
      STATE.GAME_STATE = STATE.GAME_SEED
      // Set the start button to say pause
      START_BUTTON.name('Pause')
      tweenGame()
    }
  })
