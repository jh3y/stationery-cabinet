const { TimelineMax } = window
const $pan = document.querySelector('.pan')
const $wrap = document.querySelector('.pancake__wrapper')
const $cake = document.querySelector('.pancake')

let timeout
let flipping
let rotation = 0
// A little function for toggling the pancake face
const cook = () => {
  timeout = setTimeout(() => {
    let op = 'add'
    if ($cake.classList.contains('pancake--cooking')) op = 'remove'
    $cake.classList[op]('pancake--cooking')
    cook()
  }, Math.random() * 4000)
}

const getShake = (el, isPan) => {
  const SHAKE = 0.075
  const PLACE = 5
  const timeline = new TimelineMax({ repeat: 3 })
  timeline
    .to(el, SHAKE, { x: isPan ? -PLACE : PLACE, y: isPan ? PLACE : -PLACE })
    .to(el, SHAKE, { x: isPan ? PLACE : -PLACE, y: isPan ? -PLACE : PLACE })
    .to(el, SHAKE, { x: 0, y: 0 })
  return timeline
}

const DRAW = 0.2
const START = 0.1
const FLIP = 0.5
const SET = 0.1

const drawBackAndTilt = () => {
  const timeline = new TimelineMax()
  timeline
    .to($pan, DRAW, { x: 10, y: -10, rotationX: -15 })
    .to($pan, START, { x: -10, y: 10, rotationX: 20, z: 255 })
    .to($pan, SET, { x: 0, y: 0, rotationX: 0, z: 0, delay: FLIP })
  return timeline
}

const cakeFlip = () => {
  const timeline = new TimelineMax({
    onComplete: () => (rotation = rotation + 360),
  })
  timeline
    .to($wrap, DRAW, { x: 10, y: -10, rotationX: rotation - 15 })
    .to($wrap, START, { x: -10, y: 10, rotationX: rotation + 20, z: 255 })
    .to($wrap, FLIP, {
      x: -10,
      y: 10,
      z: 500,
      rotationX: rotation + 360,
      onStart: () => $cake.classList.add('pancake--flipping'),
      onComplete: () => $cake.classList.remove('pancake--flipping'),
    })
    .to($wrap, SET, { x: 0, y: 0, rotationX: rotation + 360, z: 5 })
  return timeline
}

const flip = () => {
  if (flipping) return
  const flipTl = new TimelineMax({
    onStart: () => {
      flipping = true
      clearTimeout(timeout)
    },
    onComplete: () => {
      flipping = false
      cook()
    },
  })
  flipTl
    .add(getShake($pan, true), 'shake')
    .add(getShake($wrap, false), 'shake')
    .add(drawBackAndTilt(), 'flip')
    .add(cakeFlip(), 'flip')
}
cook()
document.body.addEventListener('click', flip)
