const scene = document.querySelector('.scene')
const actions = document.querySelector('.panda__actions')
const paws = {
  left: document.querySelector('.panda__paw--left'),
  right: document.querySelector('.panda__paw--right'),
  downLeft: document.querySelector('.panda__paw--left-down'),
  downRight: document.querySelector('.panda__paw--right-down'),
}
const b1 = new Audio(
  'https://freesound.org/data/previews/99/99751_29308-lq.mp3'
)
const b2 = new Audio(
  'https://freesound.org/data/previews/99/99752_29308-lq.mp3'
)

const movePaws = movements => {
  for (let i = 0; i < movements.length; i++) {
    if (movements[i]) {
      Object.entries(paws)[i][1].classList.remove('panda__paw--hidden')
    } else {
      Object.entries(paws)[i][1].classList.add('panda__paw--hidden')
    }
  }
}

const tap = e => {
  e.stopPropagation()
  const clicked = [...actions.children].indexOf(e.target)
  const actionIndex = clicked !== -1 ? clicked : e.keyCode
  switch (actionIndex) {
    case 0:
    case 37:
    case 65:
      // Tap left paw
      movePaws([false, true, true, false])
      b1.play()
      break
    case 1:
      // Tap both paws
      movePaws([false, false, true, true])
      b1.play()
      b2.play()
      break
    case 2:
    case 39:
    case 68:
      // Tap right paw
      movePaws([true, false, false, true])
      b2.play()
      break
    default:
      // Tap both paws
      movePaws([false, false, true, true])
      b1.play()
      b2.play()
  }
}

const unTap = e => {
  e.stopPropagation()
  movePaws([true, true, false, false])
  b1.pause()
  b1.currentTime = 0
  b2.pause()
  b2.currentTime = 0
}

const click = e => {
  if (!e.button) {
    movePaws([false, false, true, true])
    b1.play()
    b2.play()
  }
  if (e.button === 0) {
    movePaws([false, true, true, false])
    b1.play()
  }
  if (e.button === 2) {
    movePaws([true, false, false, true])
    b2.play()
  }
}
const unClick = () => {
  movePaws([true, true, false, false])
  b1.pause()
  b1.currentTime = 0
  b2.pause()
  b2.currentTime = 0
}

actions.addEventListener('mousedown', tap)
actions.addEventListener('mouseup', unTap)
actions.addEventListener('touchstart', tap)
actions.addEventListener('touchend', unTap)
scene.addEventListener('mousedown', click)
scene.addEventListener('mouseup', unClick)
scene.addEventListener('touchstart', click)
scene.addEventListener('touchend', unClick)
document.body.addEventListener('keydown', tap)
document.body.addEventListener('keyup', unTap)
scene.addEventListener('contextmenu', e => {
  e.preventDefault()
  return false
})
