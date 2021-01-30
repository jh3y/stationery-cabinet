import gsap from 'https://cdn.skypack.dev/gsap'

const {
  set,
  utils: { mapRange },
} = gsap

const BUTTON = document.querySelector('.button')
const CONTENT = document.querySelector('.button__content')
// CONTENT.addEventListener('pointermove', ({ x, y }) => {
// })

const LIMIT = 5

const UPDATE = ({ x, y }) => {
  const BOUNDS = CONTENT.getBoundingClientRect()

  const POS_X = (x - BOUNDS.x) / BOUNDS.width
  const POS_Y = (y - BOUNDS.y) / BOUNDS.height

  set(CONTENT, {
    '--x': 100 * POS_X,
    '--y': 100 * POS_Y,
  })
  const xPercent = mapRange(
    window.innerWidth * 0.25,
    window.innerWidth * 0.75,
    -LIMIT,
    LIMIT,
    x
  )
  const yPercent = mapRange(
    window.innerHeight * 0.25,
    window.innerHeight * 0.75,
    -LIMIT,
    LIMIT,
    y
  )
  set(BUTTON, {
    xPercent,
    yPercent,
  })
}

document.addEventListener('pointermove', UPDATE)
document.addEventListener('pointerdown', UPDATE)
