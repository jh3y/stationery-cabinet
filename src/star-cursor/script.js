const { gsap } = window
const INSTRUCTIONS = document.querySelector('h1')
const CONTAINER = document.querySelector('.star-container')
const MARKUP = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.229167 13.465516">
      <path d="M12.3837664 11.69785L7.733081 9.97923l-3.5253893 3.48628.1973643-4.95414L0 6.23584l4.7726631-1.34321L5.5755782 0l2.7523037 4.124 4.9012845-.74829-3.071646 3.89198z" fill="#520"/>
    </svg>
  `
const STATE = {
  BURSTING: false,
  X: null,
  Y: null,
  DEBOUNCE: null,
  REMOVE_DEBOUNCE: null,
}
const reset = () => {
  STATE.ANGLE = 0
  STATE.DEBOUNCE = null
  // CONTAINER.innerHTML = ''
}
const unburst = () => {
  STATE.BURSTING = false
  if (STATE.DEBOUNCE) {
    clearTimeout(STATE.DEBOUNCE)
    STATE.DEBOUNCE = setTimeout(reset, 100)
  } else {
    STATE.DEBOUNCE = setTimeout(reset, 100)
  }
  window.removeEventListener('pointermove', setCoordinates)
  window.removeEventListener('pointerup', unburst)
}
const setCoordinates = ({ x, y }) => {
  const DEG = Math.atan2(y - STATE.Y, x - STATE.X) * (180 / Math.PI)
  if (STATE.X && STATE.Y && DEG !== 0) STATE.ANGLE = DEG + 270
  STATE.X = x
  STATE.Y = y
}
const burst = () => {
  if (STATE.BURSTING) {
    const star = document.createElement('div')
    star.className = 'star'
    star.innerHTML = MARKUP
    star.style.setProperty('--x', STATE.X)
    star.style.setProperty('--y', STATE.Y)
    star.style.setProperty(
      '--r',
      STATE.ANGLE ? STATE.ANGLE : Math.floor(Math.random() * 360)
    )
    star.style.setProperty('--h', Math.floor(Math.random() * 360))
    star.style.setProperty('--d', Math.random())
    star.style.setProperty('--s', Math.floor(Math.random() * 50 - 5 + 1) + 5)
    gsap.fromTo(
      star.querySelector('svg'),
      { scale: 0.5 },
      {
        ease: 'power4.in',
        scale: 4,
        duration: 'random(0.5, 2.5)',
        y: '-100vmax',
        onComplete: () => star.remove(),
      }
    )
    CONTAINER.appendChild(star)
    requestAnimationFrame(burst)
  }
}

const start = event => {
  if (INSTRUCTIONS) INSTRUCTIONS.remove()
  STATE.BURSTING = true
  window.addEventListener('pointermove', setCoordinates)
  window.addEventListener('pointerup', unburst)
  burst()
}
window.addEventListener('pointerdown', setCoordinates)
window.addEventListener('pointerdown', start)
