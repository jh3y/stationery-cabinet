import gsap from 'https://cdn.skypack.dev/gsap'

const SIRENS = new Audio('https://assets.codepen.io/605876/sirens.mp3')
SIRENS.loop = true

const BOUNDS = 50
document.addEventListener('pointermove', ({ x, y }) => {
  const newX = gsap.utils.mapRange(
    0,
    window.innerWidth,
    -BOUNDS * 1.5,
    BOUNDS * 1.5,
    x
  )
  const newY = gsap.utils.mapRange(
    0,
    window.innerHeight,
    BOUNDS * 0.5,
    -BOUNDS * 0.5,
    y
  )
  gsap.set(document.documentElement, {
    '--rotate-x': newY,
    '--rotate-y': newX,
  })
})

document.addEventListener('pointerdown', () => {
  SIRENS.play()
  gsap.set(document.documentElement, {
    '--speed': '0.1s',
    '--bob-speed': 0,
    '--shift-speed': '1.5s',
    '--siren': '0.5s',
  })
})
document.addEventListener('pointerup', () => {
  SIRENS.pause()
  SIRENS.currentTime = 0
  gsap.set(document.documentElement, {
    '--speed': '0.4s',
    '--bob-speed': '2s',
    '--shift-speed': '5s',
    '--siren': '0s',
  })
})

// Purely for debugging purposes
// import { GUI } from 'https://cdn.skypack.dev/dat.gui'
// const CONTROLLER = new GUI()
// const CONFIG = {
//   'rotate-x': -360,
//   'rotate-y': -360,
// }
// const UPDATE = () => {
//   Object.entries(CONFIG).forEach(([key, value]) => {
//     document.documentElement.style.setProperty(`--${key}`, value)
//   })
// }
// const PLANE_FOLDER = CONTROLLER.addFolder('Plane')
// PLANE_FOLDER.add(CONFIG, 'rotate-x', -360, 360, 1)
//   .name('Rotate X (deg)')
//   .onChange(UPDATE)
// PLANE_FOLDER.add(CONFIG, 'rotate-y', -360, 360, 1)
//   .name('Rotate Y (deg)')
//   .onChange(UPDATE)
// UPDATE()

// Dark Mode
const THEMES = (window.THEMES = {
  LIGHT: 'LIGHT',
  DARK: 'DARK',
  KEY: 'THEME',
})

window.LIGHT_QUERY = window.matchMedia('(prefers-color-scheme: light)') // Mode enums

window.__setTheme = theme => {
  window.__THEME = theme
  window.localStorage.setItem(THEMES.KEY, theme)
} // Need to check the box based on different criteria.
// Check if mode is Light and preference is dark or no preference.

const stored = localStorage.getItem(THEMES.KEY)

if (stored) {
  window.__THEME = stored
  window.__setTheme(stored)
} else {
  if (window.LIGHT_QUERY.matches) {
    window.__THEME = THEMES.LIGHT
  } else {
    window.__THEME = THEMES.DARK
  }

  window.__setTheme(window.__THEME)
}

window.INITIAL_THEME =
  (window.__THEME && window.__THEME === THEMES.LIGHT) ||
  (window.localStorage.getItem(THEMES.KEY) &&
    window.localStorage.getItem(THEMES.KEY) === THEMES.LIGHT)

const THEME_TOGGLE = document.querySelector('.theme-toggle')

gsap.set(THEME_TOGGLE, {
  attr: {
    'aria-pressed': window.__THEME === THEMES.DARK ? 'false' : 'true',
  },
})
gsap.set('html', {
  '--on': window.__THEME === THEMES.DARK ? 0 : 1,
})

THEME_TOGGLE.addEventListener('click', () => {
  const NEW_THEME = window.__THEME === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
  window.__setTheme(NEW_THEME)
  gsap.set(THEME_TOGGLE, {
    attr: {
      'aria-pressed': NEW_THEME === THEMES.DARK ? 'false' : 'true',
    },
  })
  gsap.set('html', {
    '--on': window.__THEME === THEMES.DARK ? 0 : 1,
  })
})

const AUDIO_TOGGLE = document.querySelector('.audio-toggle')
window.AUDIO_MUTED =
  (window.localStorage.getItem('3d-squad-audio') &&
    window.localStorage.getItem('3d-squad-audio') === 'true') ||
  false

SIRENS.muted = !window.AUDIO_MUTED

gsap.set('.audio-toggle', {
  attr: {
    'aria-pressed': SIRENS.muted ? 'true' : 'false',
  },
})

AUDIO_TOGGLE.addEventListener('click', () => {
  window.AUDIO_MUTED = !window.AUDIO_MUTED
  window.localStorage.setItem('3d-squad-audio', window.AUDIO_MUTED)
  SIRENS.muted = !SIRENS.muted
  gsap.set(AUDIO_TOGGLE, {
    attr: {
      'aria-pressed': SIRENS.muted ? 'true' : 'false',
    },
  })
})
