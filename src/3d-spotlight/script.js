import gsap from 'https://cdn.skypack.dev/gsap'

const PEEPS = document.querySelectorAll('.emoji')
const SPOTLIGHT = document.querySelector('.spotlight')
const ADJ = 10

let on = true

const UPDATE = ({ x, y }) => {
  document.documentElement.style.setProperty('--x', x)
  document.documentElement.style.setProperty('--y', y)

  document.documentElement.style.setProperty(
    '--tilt-x',
    gsap.utils.mapRange(0, window.innerWidth, -ADJ, ADJ, x)
  )
  document.documentElement.style.setProperty(
    '--tilt-y',
    gsap.utils.mapRange(0, window.innerHeight, ADJ, -ADJ, y)
  )

  const {
    top: spotTop,
    right: spotRight,
    bottom: spotBottom,
    left: spotLeft,
  } = SPOTLIGHT.getBoundingClientRect()

  PEEPS.forEach(PEEP => {
    const { top, right, bottom, left } = PEEP.getBoundingClientRect()
    PEEP.classList.remove('emoji--chosen')
    if (
      right < spotRight &&
      left > spotLeft &&
      top > spotTop &&
      bottom < spotBottom
    ) {
      PEEP.classList.add('emoji--chosen')
    }
  })
}

const TOGGLE = e => {
  if (e.key === 'Alt') {
    on = !on
    document.documentElement.style.setProperty('--light', on ? 1 : 0)
  }
}

window.addEventListener('pointermove', UPDATE)
window.addEventListener('keyup', TOGGLE)
