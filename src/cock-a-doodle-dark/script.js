import gsap from 'https://cdn.skypack.dev/gsap'
const { CustomEase } = window
gsap.registerPlugin(CustomEase)

const AUDIO = {
  DAYTIME: new Audio('https://assets.codepen.io/605876/daytime-ambience.mp3'),
  CRICKETS: new Audio('https://assets.codepen.io/605876/crickets-night.mp3'),
  DOODLE: new Audio('https://assets.codepen.io/605876/cock-a-doodle-doo.mp3'),
}

AUDIO.DAYTIME.muted = AUDIO.CRICKETS.muted = AUDIO.DOODLE.muted = true

const toggleAudio = () => {
  AUDIO.DAYTIME.muted = AUDIO.CRICKETS.muted = AUDIO.DOODLE.muted = !AUDIO
    .DOODLE.muted
}

document.querySelector('#volume').addEventListener('input', toggleAudio)

AUDIO.DAYTIME.volume = AUDIO.CRICKETS.volume = 0
AUDIO.DAYTIME.loop = AUDIO.CRICKETS.loop = true
const RAYS = gsap.utils.toArray('.sun__ray')
let ANIMATING = false
const CONFIG = {
  EASE: CustomEase.create(
    'custom',
    'M0,0 C0.126,0.382 0.018,1.246 0.172,1.246 0.268,1.246 0.2,0.956 0.282,0.956 0.346,0.956 0.316,1.117 0.382,1.118 0.452,1.118 0.428,0.944 0.498,0.944 0.574,0.944 0.56,1.098 0.616,1.098 0.678,1.098 0.668,0.946 0.72,0.946 0.782,0.946 0.738,1.094 0.814,1.094 0.874,1.094 0.975,1 1,1 '
  ),
  DOODLE_DURATION: 1.1,
  DOODLE_DELAY: 0,
  DOODLE_GAP: 0.1,
  COCKEREL_START: 80,
  COCKEREL_END: 12,
  BEAK_ROTATE: 25,
}

// Initial settings
gsap.set('.scene__shooter-hold', {
  x: 420,
  yPercent: 160,
  rotation: -40,
})

gsap.set('.cockerel__eye', {
  transformOrigin: '50% 50%',
  rotation: 35,
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
gsap.set('.scene__sun', {
  transformOrigin: '-40% 100%',
})
gsap.set('.scene__moon', {
  transformOrigin: '150% 100%',
})

gsap.set('.scene__cockerel', {
  yPercent: CONFIG.COCKEREL_START,
  transformOrigin: '50% 50%',
})

gsap.set('.scene__shout', {
  display: 'none',
  yPercent: -55,
  xPercent: -15,
})

gsap.set('.cockerel__beak--left', {
  rotation: CONFIG.BEAK_ROTATE,
  transformOrigin: '50% 75%',
})
gsap.set('.cockerel__beak--right', {
  rotation: -CONFIG.BEAK_ROTATE,
  transformOrigin: '50% 75%',
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
  gsap.set('.scene__sun', {
    yPercent: 100,
    scale: 0,
  })
} else {
  gsap.set('.star', { opacity: 0 })
  gsap.set('.scene__moon', {
    yPercent: 100,
    scale: 0,
  })
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

const TWINKLE = gsap
  .timeline({
    paused: true,
    repeat: -1,
    yoyo: true,
  })
  .fromTo(
    '.star--twinkler',
    {
      scale: 0.5,
      opacity: 0.25,
    },
    {
      scale: 1.1,
      opacity: 1,
      repeat: 1,
      yoyo: true,
      stagger: 0.5,
    }
  )

const BEAM = gsap.timeline({ paused: true, repeat: -1 }).fromTo(
  [RAYS[1], RAYS[3], RAYS[6]],
  {
    scale: 1,
  },
  {
    scale: 1.25,
    transformOrigin: '50% 50%',
    repeat: 1,
    duration: 0.1,
    yoyo: true,
    stagger: 0.14,
  }
)

const SUNSET_TL = () =>
  gsap
    .timeline({
      // paused: true,
      onStart: () => {
        gsap.to(AUDIO.DAYTIME, {
          volume: 0,
          onComplete: () => {
            AUDIO.DAYTIME.pause()
            AUDIO.DAYTIME.currentTime = 0
          },
        })
      },
      onComplete: () => {
        ANIMATING = false
      },
    })
    .set('.scene__shooter', {
      yPercent: 0,
    })
    .to('.scene__sun', {
      yPercent: 100,
      scale: 0,
    })
    .to(
      'html',
      {
        '--on': 0,
        onStart: () => {
          gsap.to(AUDIO.CRICKETS, {
            volume: 1,
            repeat: 1,
            yoyo: true,
            repeatDelay: 1,
            onStart: () => {
              AUDIO.CRICKETS.currentTime = 0
              AUDIO.CRICKETS.play()
            },
            onComplete: () => {
              AUDIO.CRICKETS.pause()
              AUDIO.CRICKETS.currentTime = 0
            },
          })
        },
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
    .to(
      '.scene__moon',
      {
        yPercent: 0,
        scale: 1,
        ease: 'elastic.out(1.1, 1)',
      },
      '<'
    )
    .to(
      '.star',
      {
        opacity: 1,
      },
      '<'
    )
    .to(
      '.scene__shooter',
      {
        yPercent: -600,
      },
      '<+0.25'
    )

const COCKEREL_TL = () =>
  gsap
    .timeline({
      paused: false,
      onStart: () => {
        gsap.delayedCall(CONFIG.DOODLE_DELAY, () => {
          AUDIO.DOODLE.pause()
          AUDIO.DOODLE.currentTime = 0
          AUDIO.DOODLE.play()
        })
      },
    })
    .set('.scene__shout', {
      display: 'block',
    })
    .fromTo(
      '.scene__shout',
      {
        scale: 0,
      },
      {
        scale: 1.25,
        ease: CONFIG.EASE,
        onComplete: () => {
          gsap.set('.scene__shout', { display: 'none' })
        },
      },
      CONFIG.DOODLE_DELAY
    )
    .to(
      '.cockerel__beak--left',
      {
        rotation: 0,
        ease: CONFIG.EASE,
        duration: CONFIG.DOODLE_DURATION,
      },
      CONFIG.DOODLE_DELAY
    )
    .to(
      '.cockerel__beak--right',
      {
        rotation: 0,
        ease: CONFIG.EASE,
        duration: CONFIG.DOODLE_DURATION,
      },
      CONFIG.DOODLE_DELAY
    )
    .to(
      '.cockerel',
      {
        yPercent: '-=5',
        ease: CONFIG.EASE,
        duration: CONFIG.DOODLE_DURATION,
      },
      CONFIG.DOODLE_DELAY
    )
    .to(
      '.cockerel__beak--right',
      {
        rotation: -CONFIG.BEAK_ROTATE,
      },
      CONFIG.DOODLE_DELAY + CONFIG.DOODLE_DURATION + CONFIG.DOODLE_GAP
    )
    .to(
      '.cockerel__beak--left',
      {
        rotation: CONFIG.BEAK_ROTATE,
      },
      CONFIG.DOODLE_DELAY + CONFIG.DOODLE_DURATION + CONFIG.DOODLE_GAP
    )
    .to(
      '.cockerel',
      {
        yPercent: '+=5',
      },
      CONFIG.DOODLE_DELAY + CONFIG.DOODLE_DURATION + CONFIG.DOODLE_GAP
    )
    .to('.cockerel__eye', {
      scaleX: 0.1,
      transformOrigin: '50% 50%',
      duration: 0.05,
      repeat: 1,
      yoyo: true,
    })

const SUNRISE_TL = () =>
  gsap
    .timeline({
      // paused: true,
      onComplete: () => {
        ANIMATING = false
      },
      onStart: () => {
        TWINKLE.pause()
        gsap.to(AUDIO.CRICKETS, {
          volume: 0,
          onComplete: () => {
            AUDIO.CRICKETS.pause()
            AUDIO.CRICKETS.currentTime = 0
          },
        })
      },
    })
    .to('.scene__moon', {
      yPercent: 100,
      scale: 0,
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
        onStart: () => {
          gsap.to(AUDIO.DAYTIME, {
            volume: 1,
            repeat: 1,
            yoyo: true,
            repeatDelay: 1,
            onStart: () => {
              AUDIO.DAYTIME.currentTime = 0
              AUDIO.DAYTIME.play()
            },
            onComplete: () => {
              AUDIO.DAYTIME.pause()
              AUDIO.DAYTIME.currentTime = 0
            },
          })
        },
      },
      '>-0.25'
    )
    .to('.scene__cockerel', {
      ease: 'elastic.out(1.1, 1)',
      yPercent: CONFIG.COCKEREL_END,
    })
    .add(COCKEREL_TL())
    .to(
      '.scene__sun',
      {
        yPercent: 0,
        ease: 'elastic.out(1.1, 1)',
        scale: 1,
      },
      '<'
    )
    .to('.scene__cockerel', {
      delay: 0.4,
      ease: 'elastic.out(1.1, 1)',
      yPercent: CONFIG.COCKEREL_START,
    })
    .fromTo(
      '.sun__ray',
      {
        yPercent: 0,
      },
      {
        stagger: 0.1,
        ease: 'elastic.out(1.1, 1)',
        duration: 0.1,
        yPercent: -260,
      },
      '<-1.6'
    )
    .to(
      '.sun',
      {
        rotate: '+=360',
        duration: 1.25,
        ease: 'none',
      },
      '<'
    )

const TOGGLE = () => {
  if (ANIMATING) return
  ANIMATING = true
  const NEW_THEME = window.__THEME === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
  window.__setTheme(NEW_THEME)
  gsap.set('button', {
    attr: {
      'aria-pressed': NEW_THEME === THEMES.DARK ? false : true,
    },
  })
  if (NEW_THEME === THEMES.DARK) SUNSET_TL()
  else SUNRISE_TL()
  // COCKEREL_TL()
}

const BUTTON = document.querySelector('button')
BUTTON.addEventListener('click', TOGGLE)

BUTTON.addEventListener('pointerenter', () => {
  if (window.__THEME === THEMES.DARK && !ANIMATING) {
    TWINKLE.play()
    gsap.to(AUDIO.CRICKETS, {
      onStart: () => {
        AUDIO.CRICKETS.currentTime = 0
        AUDIO.CRICKETS.play()
      },
      volume: 1,
    })
  } else {
    gsap.to(AUDIO.DAYTIME, {
      onStart: () => {
        AUDIO.DAYTIME.currentTime = 0
        AUDIO.DAYTIME.play()
      },
      volume: 1,
    })
    BEAM.play()
  }
})
BUTTON.addEventListener('pointerleave', () => {
  if (window.__THEME === THEMES.DARK && !ANIMATING) {
    TWINKLE.pause()
    gsap.to(AUDIO.CRICKETS, {
      volume: 0,
      onComplete: () => {
        AUDIO.CRICKETS.pause()
        AUDIO.CRICKETS.currentTime = 0
      },
    })
  } else {
    gsap.to(AUDIO.DAYTIME, {
      volume: 0,
      onComplete: () => {
        AUDIO.DAYTIME.pause()
        AUDIO.DAYTIME.currentTime = 0
      },
    })
    BEAM.pause()
  }
})
