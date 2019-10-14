const MIN_LIGHTNESS = 0
const MAX_LIGHTNESS = 70
const MAX_SEA_LIGHTNESS = 50
const BOTTOM_BUFFER = 0.1
const SEA_HEIGHT = 0.3
const SUN_HEIGHT = 0.2
const RIPPLE_BOUNDARY = 1 - SEA_HEIGHT - SUN_HEIGHT / 2
const updatePosition = e => {
  const { clientX: x, clientY: y } =
    e.touches && e.touches.length ? e.touches[0] : e
  // Set the sun/moon/ripple position
  const positionX = x / window.innerWidth
  const positionY = y / window.innerHeight
  document.documentElement.style.setProperty('--x', positionX)
  document.documentElement.style.setProperty('--y', positionY)
  /**
   * On change calculate the following things
   * 1. Darkness of sea and sky
   * 2. Spread and blur of the sun
   * 3. Ripple scale
   * 4. Ripple speed
   * 5. Whether sun brings out his shades
   * 6. Moon position?
   */
  /**
   * Calculate the darkness of the sea and sky
   * We say the lightness can go between 10% and 70%
   */
  let lightness = MIN_LIGHTNESS
  let seaLightness = MIN_LIGHTNESS
  if (positionY < 1 - BOTTOM_BUFFER) {
    lightness =
      (1 - positionY / (1 - BOTTOM_BUFFER)) * (MAX_LIGHTNESS - MIN_LIGHTNESS) +
      MIN_LIGHTNESS
    seaLightness =
      (1 - positionY / (1 - BOTTOM_BUFFER)) *
        (MAX_SEA_LIGHTNESS - MIN_LIGHTNESS) +
      MIN_LIGHTNESS
  }
  document.documentElement.style.setProperty('--lightness', lightness)
  document.documentElement.style.setProperty('--sea-lightness', seaLightness)
  /**
   * Spread and blur of the sun
   * Shouldn't start growing until we at sea height plus half the sun height
   *
   */
  let radius = 0
  const boundary = 1 - SEA_HEIGHT + SUN_HEIGHT / 2
  if (positionY <= boundary) radius = 1 - positionY / boundary
  document.documentElement.style.setProperty('--sun-spread', radius)
  /**
   * Calculate the ripple scale and opacity
   * To start out with it's not seen and the scaleX is 0
   */
  let opacity = 0
  let scale = 0
  if (positionY <= RIPPLE_BOUNDARY) {
    opacity = scale = Math.min(
      1,
      1 - (positionY - 0.3) / (RIPPLE_BOUNDARY - 0.3)
    )
  }
  document.documentElement.style.setProperty('--ripple-opacity', opacity)
  document.documentElement.style.setProperty('--ripple-scale', scale)
  /**
   * Gently open eyes and mouth
   * Use scaleX on both. Eyes can always be in blinking mode?
   */
  /**
   * If y position is above 0.9 bring the moon out
   * Else put him away
   */
  let moonOffset = 0
  if (positionY > 0.9) moonOffset = 15
  document.documentElement.style.setProperty('--moon-offset', moonOffset)
  /**
   * Figure out mouth translation
   * Start at 0.3, translate down to 0
   */
  let mouthOpening = 0.2
  if (positionY <= RIPPLE_BOUNDARY) {
    mouthOpening = Math.min(
      0.2,
      Math.max(0, (positionY - 0.3) / (RIPPLE_BOUNDARY - 0.3))
    )
  }
  document.documentElement.style.setProperty('--mouth-opening', mouthOpening)
  /**
   * Control the shades
   * If y is above 0.4 put them away else
   * show them
   */
  let shadePosition = -200
  if (positionY > 0.4) {
    shadePosition = -200
  } else {
    shadePosition = 0
  }
  document.documentElement.style.setProperty('--shade-position', shadePosition)
  /**
   * Flip the faces if the xPosition is aove 0.5
   */
  let flipY = 0
  if (positionX <= 0.5) {
    flipY = 1
  }
  document.documentElement.style.setProperty('--flip', flipY)
}
window.addEventListener('touchmove', updatePosition)
window.addEventListener('mousemove', updatePosition)

updatePosition({
  clientX: window.innerWidth / 2,
  clientY: window.innerHeight / 2,
})
