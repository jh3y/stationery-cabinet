const MIN_LIGHTNESS = 0
const MAX_LIGHTNESS = 70
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
  if (positionY < 1 - BOTTOM_BUFFER)
    lightness =
      (1 - positionY / (1 - BOTTOM_BUFFER)) * (MAX_LIGHTNESS - MIN_LIGHTNESS) +
      MIN_LIGHTNESS
  document.documentElement.style.setProperty('--lightness', lightness)
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
   * If y position is above 0.9 bring the moon out
   * Else put him away
   */
  let moonOffset = 0
  if (positionY > 0.9) moonOffset = 15
  document.documentElement.style.setProperty('--moon-offset', moonOffset)
}
window.addEventListener('touchmove', updatePosition)
window.addEventListener('mousemove', updatePosition)

updatePosition({
  clientX: window.innerWidth / 2,
  clientY: window.innerHeight / 2,
})
