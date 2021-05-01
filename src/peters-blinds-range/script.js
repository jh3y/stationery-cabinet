import gsap from 'https://cdn.skypack.dev/gsap'

const SOUND = new Audio(
  'https://assets.codepen.io/605876/peter-griffin-alright.wav'
)

const LIMIT = 6
const UPDATE = ({ x }) => {
  const newX = gsap.utils.mapRange(0, window.innerWidth, -LIMIT, LIMIT, x)
  gsap.set(document.documentElement, {
    '--rotate-y': newX,
  })
}

const RANGE = document.querySelector('.window__cord')
RANGE.addEventListener('input', e => {
  const VAL = parseInt(e.target.value, 10)
  document.documentElement.style.setProperty('--open', VAL / 100)

  if (VAL > 40 && VAL < 50) {
    document.documentElement.style.setProperty('--peter', (VAL * 2) / 100)
  } else if (VAL >= 50) {
    document.documentElement.style.setProperty('--peter', 1)
  } else {
    document.documentElement.style.setProperty('--peter', 0)
  }

  if (VAL > 75 && VAL < 95) {
    document.documentElement.style.setProperty('--thug', VAL / 100)
  } else if (VAL >= 95) {
    document.documentElement.style.setProperty('--thug', 1)
  } else {
    document.documentElement.style.setProperty('--thug', 0)
  }

  if (VAL === 100) {
    SOUND.currentTime = 0
    SOUND.play()
  }
})
window.addEventListener('pointermove', UPDATE)
window.addEventListener('pointerdown', UPDATE)
