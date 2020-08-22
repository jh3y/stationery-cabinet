let updater
const SCRUBBER = document.querySelector('input')
const SPINNER = document.querySelector('.spinner')
const LABEL = document.querySelector('label')

SCRUBBER.addEventListener('input', () => {
  // Get the styles for the spinner, if it's animating, remove those styles.
  // And reapply them after updating the root.
  const STYLES = getComputedStyle(SPINNER)
  clearInterval(updater)
  if (STYLES.animationPlayState === 'running') {
    const ANIMATION = STYLES.animationName
    SPINNER.style.animationName = 'none'
    document.documentElement.style.setProperty('--state', 'paused')
    requestAnimationFrame(() => {
      SPINNER.style.animationName = ANIMATION
    })
  }
  const SCRUB =
    (SCRUBBER.value / (100 / parseInt(STYLES.animationDuration, 10))) * -1
  LABEL.innerHTML = `animation-delay: ${SCRUB.toFixed(2)}s;`
  document.documentElement.style.setProperty('--scrub', SCRUB)
})

const initiateUpdates = () => {
  updater = setInterval(() => {
    // Update the range input
    if (parseInt(SCRUBBER.value, 10) === 100) {
      return clearInterval(updater)
    }
    SCRUBBER.value = parseInt(SCRUBBER.value, 10) + 1
  }, (parseInt(getComputedStyle(SPINNER).animationDuration, 10) * 1000) / 100)
}

SCRUBBER.addEventListener('mousedown', () => {
  clearInterval(updater)
})

SCRUBBER.addEventListener('mouseup', () => {
  document.documentElement.style.setProperty('--state', 'running')
  initiateUpdates()
})

SPINNER.addEventListener('animationend', () => {
  // Potential here for a stop and restart?
})

SPINNER.addEventListener('animationstart', initiateUpdates)
