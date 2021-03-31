import gsap from 'https://cdn.skypack.dev/gsap'

// Initial settings
gsap.set('.scene__shooter-hold', {
  x: 420,
  yPercent: 160,
  rotation: -40,
})

gsap.set('.sun__ray-holder', {
  transformOrigin: '50% 50%',
  rotation: index => (360 / 8) * index,
})

gsap.set('.sun__ray', {
  yPercent: -260,
})

gsap.set('.sun', {
  transformOrigin: '50% 50%',
})

gsap.set('.cockerel', {
  yPercent: 100,
  transformOrigin: '50% 50%',
})

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

// Check the theme, set the scene
if (window.__THEME === THEMES.DARK) {
  console.info('set the dark theme')
} else {
  console.info('set the light theme')
  gsap.set('.sun', { display: 'block' })
  gsap.set('.star', { opacity: 0 })
  gsap.set('.scene__moon', { transformOrigin: '50% 50%', yPercent: 50 })
}
gsap.set('button', {
  attr: {
    'aria-pressed': window.__THEME === THEMES.DARK ? false : true,
  },
})
gsap.set('html', {
  '--on': window.__THEME === THEMES.DARK ? 0 : 1,
})

gsap.set('.scene', {
  display: 'block',
})

const SUNSET_TL = gsap
  .timeline({
    paused: true,
  })
  .to('.scene__sun', {
    yPercent: 100,
  })
  .to(
    'html',
    {
      '--on': 0,
    },
    '<'
  )
  .to(
    '.sun__ray',
    {
      yPercent: 0,
    },
    '<'
  )
  .to('.scene__moon', {
    yPercent: 0,
  })
  .to(
    '.star--shower',
    {
      opacity: 1,
    },
    '<'
  )
  .to('.scene__shooter', {
    yPercent: -600,
  })

const SUNRISE_TL = gsap
  .timeline({
    paused: true,
  })
  .to('.scene__moon', {
    yPercent: 50,
  })
  .to(
    '.star',
    {
      opacity: 0,
    },
    '<'
  )
  .to(
    document.documentElement,
    {
      '--on': 1,
    },
    '>-0.25'
  )
  .to('.cockerel', {
    yPercent: 0,
  })
  .to('.cockerel', {
    yPercent: 100,
    delay: 0.1,
  })
  .to(
    '.sun',
    {
      yPercent: 0,
    },
    '<'
  )
  .to('.sun__ray', {
    stagger: 0.1,
    duration: 0.12,
    yPercent: -260,
  })
  .to(
    '.sun',
    {
      rotate: 360,
      duration: 1,
    },
    '<'
  )

const TOGGLE = () => {
  const NEW_THEME = window.__THEME === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
  window.__setTheme(NEW_THEME)
  gsap.set('button', {
    attr: {
      'aria-pressed': NEW_THEME === THEMES.DARK ? false : true,
    },
  })
  if (
    // Two timeline options: Sunrise and Sunset
    NEW_THEME === THEMES.DARK
  )
    SUNSET_TL.restart()
  else SUNRISE_TL.restart()
}

const BUTTON = document.querySelector('button')
BUTTON.addEventListener('click', TOGGLE)
