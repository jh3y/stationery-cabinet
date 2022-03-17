const { Prism } = window

console.info(Prism)

// Get started!
const RANGE = document.querySelector('input')
const CONTAINER = document.querySelector('.boppin-bears')
const TITLES = [...document.querySelectorAll('h1')]
const BLURBS = [...document.querySelectorAll('p')]
const CODES = [...document.querySelectorAll('pre')]

// Each config reps delay, duration, stagger, coefficient, offset
const DURATION = 0.4
const STAGGER = DURATION / 5
const STEP_CONFIGS = [
  [0, DURATION, 0, 1, 0],
  [1, DURATION, 0, 1, 0],
  [-DURATION, DURATION, 0, 1, 0],
  [1, DURATION, STAGGER, 1, 0],
  [1, DURATION, STAGGER, 1, -5],
  [1, DURATION, STAGGER, 1, 0],
  [1, DURATION, STAGGER, -1, 0],
  [1, DURATION, STAGGER, 0, 0],
]

const update = () => {
  // Show/Hide elements
  for (let e = 0; e < TITLES.length; e++) {
    TITLES[e].style.display = BLURBS[e].style.display = CODES[e].style.display =
      e === parseInt(RANGE.value, 10) ? 'block' : 'none'
  }
  // Running the step function
  const CONFIG = STEP_CONFIGS[parseInt(RANGE.value, 10)]
  document.documentElement.style.setProperty('--delay', CONFIG[0])
  document.documentElement.style.setProperty('--duration', CONFIG[1])
  document.documentElement.style.setProperty('--stagger-step', CONFIG[2])
  document.documentElement.style.setProperty('--coefficient', CONFIG[3])
  document.documentElement.style.setProperty('--offset', CONFIG[4])
  document.documentElement.style.setProperty('--selection', RANGE.value)
  
  if (parseInt(RANGE.value, 10) === 5 || parseInt(RANGE.value, 10) === 6) {
    CONTAINER.classList.add('reversed')
  } else {
    CONTAINER.classList.remove('reversed')
  }
  if (parseInt(RANGE.value, 10) === 7) {
    CONTAINER.classList.add('defined')
  } else {
    CONTAINER.classList.remove('defined')
  }
  // Retrigger the animation
  CONTAINER.hidden = true
  requestAnimationFrame(() => (CONTAINER.hidden = false))
}

RANGE.addEventListener('change', update)
RANGE.addEventListener('input', update)
// Run the first time to show step 0 👍
update()
