const IMG = document.querySelector('.zoomer__img')
const VIEWFINDER = document.querySelector('.zoomer__viewfinder')
const VIEWFINDER_IMG = document.querySelector('.zoomer__viewfinder-img')
const setImageSource = async (size = 1200) => {
  const BASE = `https://source.unsplash.com/random/${size}x${size}`
  const SRC = await (await fetch(BASE)).url
  IMG.src = VIEWFINDER_IMG.src = SRC
}
setImageSource()

const CONFIG = {
  SCALE_MIN: 2,
  SCALE_MAX: 30,
  SCALE_STEP: 1,
}

const STATE = {
  ACTIVE: false,
  SCALE: parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      '--viewfinder-scale',
      10
    )
  ),
}

const updateScale = e => {
  const { wheelDeltaY: wheeled } = e
  if (wheeled > 0) {
    STATE.SCALE = Math.max(CONFIG.SCALE_MIN, STATE.SCALE - CONFIG.SCALE_STEP)
  } else if (wheeled < 0) {
    STATE.SCALE = Math.min(CONFIG.SCALE_MAX, STATE.SCALE + CONFIG.SCALE_STEP)
  }
  document.documentElement.style.setProperty('--viewfinder-scale', STATE.SCALE)
}

const stop = () => {
  STATE.ACTIVE = false
  VIEWFINDER.style.setProperty('--show', 0)
  window.removeEventListener('pointermove', update)
  window.removeEventListener('wheel', updateScale)
}

const update = e => {
  const { x, y } = e
  const { top, left, width, height } = IMG.getBoundingClientRect()
  // Calculate the X/Y percentage that we're hovering on
  const xPercent = ((x - left) / width) * 100
  const yPercent = ((y - top) / height) * 100

  if (xPercent < -1 || xPercent > 101 || yPercent < -1 || yPercent > 101) {
    return stop()
  }
  // Apply some logic to convert that value to a translation
  const xTranslation = (xPercent - 50) * -1
  const yTranslation = (yPercent - 50) * -1

  // Basically, if you don't want the white gaps you need to use
  // Math.min/max on the values to provide thresholds(?)
  // For example, if the scale is 2 then -25 < Y < 25
  // And that is because 25 === 50 / scale
  const threshold = 50 - 50 / STATE.SCALE
  const setX = Math.min(Math.max(-threshold, xTranslation), threshold)
  const setY = Math.min(Math.max(-threshold, yTranslation), threshold)

  // // Set the viewfinder position
  // // This is based on the width of the IMG bounds
  // // Offset percentage / 100 * dimension
  // const xPos = ((xPercent - 50) / 100) * width
  // const yPos = ((yPercent - 50) / 100) * height
  // Set the translation CSS variables
  VIEWFINDER_IMG.style.setProperty('--x', setX)
  VIEWFINDER_IMG.style.setProperty('--y', setY)
  VIEWFINDER.style.setProperty('--x', xPercent)
  VIEWFINDER.style.setProperty('--y', yPercent)
}

const start = () => {
  if (STATE.ACTIVE) return
  STATE.ACTIVE = true
  VIEWFINDER.style.setProperty('--show', 1)
  window.addEventListener('pointermove', update)
  window.addEventListener('wheel', updateScale)
}
IMG.addEventListener('pointermove', start)
VIEWFINDER.addEventListener('click', setImageSource)
