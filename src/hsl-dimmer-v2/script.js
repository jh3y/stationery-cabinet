/**
 * Poached from HSL Slider: https://codepen.io/jh3y/details/dybjLpa
 */
/**
 * Grab the angle between two points
 * @param {Object} event - pointer event for current coords
 * @param {Object} element - element to use as center point
 * @param {Number} buffer - buffer so that angle doesn't allow handle + track overlap
 */
const getAngle = (event, element) => {
  const { clientX: x, clientY: y } =
    event.touches && event.touches.length ? event.touches[0] : event
  const {
    x: handleX,
    y: handleY,
    width: handleWidth,
    height: handleHeight,
  } = element.getBoundingClientRect()
  const handleCenterPoint = {
    x: handleX + handleWidth / 2,
    y: handleY + handleHeight / 2,
  }
  const angle =
    (Math.atan2(handleCenterPoint.y - y, handleCenterPoint.x - x) * 180) /
    Math.PI
  return angle
}

const button = document.querySelector('.switch__button')
const dimmer = document.querySelector('.switch__button-dim-marker')

let DOWN_EVENT = 'mousedown'
let MOVE_EVENT = 'mousemove'
let UP_EVENT = 'mouseup'

const AUDIO = {
  ON: new Audio('https://assets.codepen.io/605876/switch-on.mp3'),
  OFF: new Audio('https://assets.codepen.io/605876/switch-off.mp3'),
}
if (window.PointerEvent) {
  // PointerEvent, Chrome
  DOWN_EVENT = 'pointerdown'
  MOVE_EVENT = 'pointermove'
  UP_EVENT = 'pointerup'
} else if ('ontouchstart' in window) {
  // Touch Events, iOS Safari
  DOWN_EVENT = 'touchstart'
  MOVE_EVENT = 'touchmove'
  UP_EVENT = 'touchend'
}

let ON = true
const BUFFER = 45
const VARIANTS = {
  ON: 60,
  OFF: 10,
  LOWER: 15,
  UPPER: 60,
  DIMMED: 0.5,
}

const setLight = () => {
  document.documentElement.style.setProperty(
    '--light',
    ON
      ? VARIANTS.LOWER + (VARIANTS.UPPER - VARIANTS.LOWER) * VARIANTS.DIMMED
      : VARIANTS.OFF
  )
}

const dim = e => {
  let rotation
  const angle = getAngle(e, button)
  if (angle > 0) {
    rotation = angle - 90
  } else {
    rotation = 270 + angle
    if (angle > -(90 + BUFFER) && angle < -(90 - BUFFER) && angle < -90) {
      rotation = 270 - (90 + BUFFER)
      VARIANTS.DIMMED = 1
    }
    if (angle > -(90 + BUFFER) && angle < -(90 - BUFFER) && angle > -90) {
      rotation = 270 - (90 - BUFFER)
      VARIANTS.DIMMED = 0
    }
  }
  // console.info(rotation)

  // Lets work out the dimming here
  // If angle is rotation is greater than 0 and less than 180 - BUFFER
  // Dim is 0.5 + (angle / 135deg) * 0.5
  if (rotation > 0 && rotation < 180 - BUFFER) {
    VARIANTS.DIMMED = 0.5 + (rotation / (180 - BUFFER)) * 0.5
  } else if (rotation < 0) {
    // There's 180 - BUFFER degrees to play with but we know we have 90 degrees here.
    VARIANTS.DIMMED = 0.5 - Math.abs(rotation / (180 - BUFFER)) * 0.5
  } else if (rotation > 180 + BUFFER && rotation < 270) {
    VARIANTS.DIMMED =
      ((rotation - (180 + BUFFER)) / (180 - (90 + BUFFER))) *
      ((BUFFER / (180 - BUFFER)) * 0.5)
  }
  button.style.setProperty('--rotation', rotation)
  setLight()
}

const endDim = () => {
  document.documentElement.style.setProperty('--cursor', 'initial')
  dimmer.style.setProperty('--cursor', 'grab')
  document.body.removeEventListener(MOVE_EVENT, dim)
  document.body.removeEventListener(UP_EVENT, endDim)
}

const execute = e => {
  ON = !ON
  button.style.setProperty('--pressed', 0)
  setLight()
  if (e.target !== dimmer && ON) {
    document.documentElement.style.setProperty('--hue', Math.random() * 360)
  }
  AUDIO.OFF.play()
  document.body.removeEventListener(UP_EVENT, execute)
}
const toggleLight = () => {
  AUDIO.ON.play()
  button.style.setProperty('--pressed', 1)
  document.body.addEventListener(UP_EVENT, execute)
}

const initDim = e => {
  e.stopPropagation()
  document.documentElement.style.setProperty('--cursor', 'grabbing')
  dimmer.style.setProperty('--cursor', 'grabbing')
  document.body.addEventListener(MOVE_EVENT, dim)
  document.body.addEventListener(UP_EVENT, endDim)
}

dimmer.addEventListener(DOWN_EVENT, initDim)
button.addEventListener(DOWN_EVENT, toggleLight)
setLight()
