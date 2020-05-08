const {
  gsap: { set, timeline },
} = window

const HULK = document.querySelector('.hulk')
const HULK_BACK = document.querySelector('.hulk__back')
const LIKE_BUTTON = document.querySelector('button')
const CONTAINER = document.querySelector('.smash')

const SOUNDS = {
  GRUNT: new Audio(
    'https://freesound.org/data/previews/370/370036_4608521-lq.mp3'
  ),
  LAND: new Audio(
    'https://freesound.org/data/previews/315/315928_4557960-lq.mp3'
  ),
  // Baby roar
  JUMP: new Audio(
    'https://freesound.org/data/previews/261/261150_3296910-lq.mp3'
  ),
  // Adult?
  // JUMP: new Audio('https://freesound.org/data/previews/340/340162_4869949-lq.mp3')
  SMASHES: [
    new Audio('https://freesound.org/data/previews/135/135461_1206321-lq.mp3'),
    new Audio('https://freesound.org/data/previews/135/135465_1206321-lq.mp3'),
    new Audio('https://freesound.org/data/previews/135/135463_1206321-lq.mp3'),
  ],
}

const STATE = {
  READY: false,
}

set(HULK, { transformOrigin: '50% 50%', scale: 0 })
set(HULK_BACK, { display: 'none' })

const JUMP_SPEED = 0.5
const LAND_LOOP_SPEED = 0.05
const WALK_OUT_TIME = 5

let walkOut

const WALK_OUT = () => {
  return new timeline({
    onStart: () => {
      // console.info('walking out')
      LIKE_BUTTON.setAttribute('disabled', true)
      SOUNDS.GRUNT.play()
    },
    onComplete: () => {
      STATE.READY = false
      LIKE_BUTTON.removeAttribute('disabled')
    },
  })
    .set(HULK_BACK, { display: 'block' })
    .set(HULK, { transformOrigin: '50% 100%' })
    .to(HULK, { scale: 0, duration: 2 })
}

const startInactiveTimer = () => {
  if (walkOut) clearTimeout(walkOut)
  walkOut = setTimeout(WALK_OUT, WALK_OUT_TIME * 1000)
}

const LAND = () => {
  new timeline({
    repeat: 9,
    yoyo: true,
    onStart: () => SOUNDS.LAND.play(),
    onComplete: () => {
      LIKE_BUTTON.removeAttribute('disabled')
      STATE.READY = true
      startInactiveTimer()
    },
  })
    .to(CONTAINER, {
      duration: LAND_LOOP_SPEED,
      y: '+=4',
      x: '-=2',
    })
    .to(CONTAINER, {
      duration: LAND_LOOP_SPEED,
      y: '-=2',
      x: '+=4',
    })
    .to(CONTAINER, {
      duration: LAND_LOOP_SPEED,
      y: '+=3',
      x: '-=1',
    })
    .to(CONTAINER, {
      duration: LAND_LOOP_SPEED,
      y: 0,
      x: 0,
    })
}

const JUMP = () => {
  // Set the state, disable the button
  LIKE_BUTTON.setAttribute('disabled', true)
  set(HULK_BACK, { display: 'none' })
  return new timeline({
    onStart: () => SOUNDS.JUMP.play(),
    onComplete: LAND,
  })
    .to(HULK, { scale: 1, duration: JUMP_SPEED }, 0)
    .to(
      HULK,
      { y: '-25vh', repeat: 1, yoyo: true, duration: JUMP_SPEED / 2 },
      0
    )
}

const ACTION = () => {
  if (!STATE.READY) {
    JUMP()
  }
  if (STATE.READY) {
    // console.info('SMASHSSSSSSHHHH')
  }
}

LIKE_BUTTON.addEventListener('click', ACTION)
