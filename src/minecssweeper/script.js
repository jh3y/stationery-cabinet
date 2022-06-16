console.clear()

const GET_RANDOM = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min))
const COLUMNS = 9
const ROWS = 9
const CELL_COUNT = COLUMNS * ROWS
const MINE_COUNT = 8
const MINE_INDEXES = []

const ADD_INDEX = () => {
  const INDEX = GET_RANDOM(0, CELL_COUNT)
  if (MINE_INDEXES.indexOf(INDEX) === -1) {
    return INDEX
  } else return ADD_INDEX()
}

for (let m = 0; m < MINE_COUNT; m++) {
  MINE_INDEXES[m] = ADD_INDEX()
}

const GET_SURROUNDINGS = INDEX => {
  const COLUMN = INDEX % COLUMNS
  const TL = INDEX - (COLUMNS + 1)
  const TC = INDEX - COLUMNS
  const TR = INDEX - (COLUMNS - 1)
  const L = INDEX - 1
  const R = INDEX + 1
  const BL = INDEX + (COLUMNS - 1)
  const BC = INDEX + COLUMNS
  const BR = INDEX + (COLUMNS + 1)

  let SURROUNDINGS = [
    TC, BC
  ]
  
  if (COLUMN !== 0) SURROUNDINGS.push(TL, L, BL)
  if (COLUMN !== COLUMNS - 1) SURROUNDINGS.push(TR, R, BR)
  
  return SURROUNDINGS.filter(s => s >= 0)
}


const GET_BOMB_COUNT = index => {
  // On this get the coordinates of the surrounding blocks
  let count = 0

  for (const SURROUNDING of GET_SURROUNDINGS(index)) {
    if (MINE_INDEXES.indexOf(SURROUNDING) !== -1) count++
  }
  
  return count
}

const ZEROS = []

const GAME_BOARD = new Array(CELL_COUNT).fill(0).map((_,i) => {
  const COUNT = MINE_INDEXES.indexOf(i) !== -1 ? 'X' : GET_BOMB_COUNT(i)
  // Need to work out the zero groups... But, how?
  if (COUNT === 0) ZEROS.push(i)
  return COUNT
})

// console.info(GAME_BOARD, ZEROS)

// const BOARD = document.querySelector('.board')
// BOARD.innerHTML = ''

// for (const SCORE of GAME_BOARD) {
//   const CELL = document.createElement('div')
//   CELL.className = 'board__cell'
//   if (SCORE === 0) CELL.style.color = 'transparent'
//   CELL.innerText = SCORE
//   BOARD.appendChild(CELL)
// }

const PUSH_TO_GROUP = (INDEX, GROUP, ZEROS) => {
  // Guarded up above...
  GROUP.push(INDEX)
  // Get surroundings and run it on them...
  for (const SURROUNDING of GET_SURROUNDINGS(INDEX)) {
    // Recursively add the Zero
    if (ZEROS.indexOf(SURROUNDING) !== -1 && GROUP.indexOf(SURROUNDING) === -1) PUSH_TO_GROUP(SURROUNDING, GROUP, ZEROS)
  }
}

const PAD_GROUPS = GROUPS => {
  // For each group, add the surroundings
  for (const GROUP of GROUPS) {
    for (const POS of [...GROUP]) {
      for (const SURROUNDING of GET_SURROUNDINGS(POS)) {
        if (GROUP.indexOf(SURROUNDING) === -1 && GAME_BOARD[SURROUNDING] !== 'X') GROUP.push(SURROUNDING)
      }
    }
  }
}

const ZERO_GROUPS = []
const GROUP_ZEROS = () => {
  // Work out the groups of zeros...
  // Need to start a group and when one isn't pushed, you know that's the end of the group?   
  for (let o = 0; o < ZEROS.length; o++) {
    if (ZERO_GROUPS.filter(group => group.indexOf(ZEROS[o]) !== -1).length === 0) {
      const ZERO_GROUP = []
      // create a new group??
      PUSH_TO_GROUP(ZEROS[o], ZERO_GROUP, ZEROS)
      // Then push the group into the groups
      ZERO_GROUPS.push(ZERO_GROUP)
    }
    //  else {
    //   console.info('already in a group')
    // }
  }
  // console.info({ ZERO_GROUPS: JSON.parse(JSON.stringify(ZERO_GROUPS)) })
  // Now you have the groups, you need to pad them back out with the surrounding things...
  PAD_GROUPS(ZERO_GROUPS)
  // console.info({ ZERO_GROUPS })
}

GROUP_ZEROS()