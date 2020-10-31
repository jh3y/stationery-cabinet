const {
  gsap: {
    set,
    // to,
    timeline,
    utils: { random, distribute },
  },
} = window

let FIRING = false
const TIMING = {
  TAILS: 1,
}
const FIRING_SWEETS = document.querySelectorAll('.firing-sweets .sweet')
const BLINK = () => {
  const delay = random(2, 6)
  timeline().to('.ghost__eyes', {
    delay,
    onComplete: () => BLINK(),
    scaleY: 0.1,
    repeat: 3,
    yoyo: true,
    duration: 0.05,
  })
}
const RESET = () => {
  set('.firing-sweets .sweet', {
    transformOrigin: '50% 50%',
    rotation: () => random(0, 359),
    '--hue': () => random(0, 359),
    display: 'block',
    scale: 0,
  })
  set('.firing-sweets .sweet--sweet', {
    xPercent: distribute({
      base: -50,
      amount: 100,
    }),
    yPercent: distribute({
      base: 70,
      amount: 40,
      from: 'center',
    }),
  })
  set('.firing-sweets .sweet--lolly', {
    xPercent: distribute({
      base: -50,
      amount: 100,
    }),
    yPercent: distribute({
      base: 10,
      amount: 30,
      from: 'center',
    }),
    // scale: 0,
  })
}
set('.ghost__tails--two', { xPercent: -100 })
// Move pupils across 2 and down 2 to center: x: '+=2', y: '+=2'
set(['.ghost__eyes', '.ghost__mouth-clip'], { transformOrigin: '50% 50%' })
set('.ghost__pupil', { x: 0, y: 0, transformOrigin: '50% 50%' })

// Randomise the position of static sweets
set('.sweet', {
  transformOrigin: '50% 50%',
  rotation: () => random(0, 359),
  '--hue': () => random(0, 359),
  display: 'block',
})
set('.static-sweets .sweet--sweet', {
  xPercent: distribute({
    base: -130,
    amount: 260,
  }),
  yPercent: distribute({
    base: 110,
    amount: 60,
    from: 'center',
  }),
})
set('.static-sweets .sweet--lolly', {
  xPercent: distribute({
    base: -300,
    amount: 600,
  }),
  yPercent: distribute({
    base: 70,
    amount: 20,
    from: 'center',
  }),
})

RESET()
BLINK()

// Ghost tails timeline
const TAILS_TL = timeline({
  repeat: -1,
  ease: 'none',
})
  .to(
    '.ghost__tails',
    { duration: TIMING.TAILS, xPercent: 100, ease: 'none' },
    0
  )
  .to(
    '.ghost__tails--two',
    { duration: TIMING.TAILS, xPercent: 0, ease: 'none' },
    0
  )

const FIRE = onComplete => {
  // if (FIRING) return
  const VMIN = Math.max(window.innerHeight, window.innerWidth) / 100
  const FIRING_TL = timeline({
    // onStart: () => {
    //   FIRING = true
    // },
    // paused: true,
    onComplete: () => {
      // FIRING = false
      RESET()
      FIRING_TL.pause(0)
      if (onComplete) onComplete()
    },
  })
  FIRING_SWEETS.forEach(sweet => {
    let sweetTL
    const duration = random(0.5, 2)
    sweetTL = timeline()
      .to(
        sweet,
        {
          ease: 'power3.out',
          duration,
          physics2D: {
            velocity: () => random(6 * VMIN, 12 * VMIN),
            angle: () => random(180, 360),
            gravity: 12 * VMIN,
          },
        },
        0
      )
      .to(
        sweet,
        {
          scale: 1,
          duration: 0.1,
        },
        0
      )
      .to(
        sweet,
        {
          opacity: 0,
          duration: 0.2,
        },
        duration - 0.2
      )

    FIRING_TL.add(sweetTL, 0)
  })
  return FIRING_TL
}

const LOWER = timeline({
  paused: true,
})
  .to('.ghost__ghost', { yPercent: 0 })
  .to('.ghost__mouth-clip', { scale: 1, duration: 0.1 }, '<')
  .to(TAILS_TL, { timeScale: 1, duration: 0.5 })
const MAIN = timeline({
  paused: true,
  onStart: () => {
    FIRING = true
  },
  onComplete: () => {
    FIRING = false
  },
})
  .to(TAILS_TL, { duration: 0.5, timeScale: 2 })
  .to('.ghost__ghost', { yPercent: -80 })
  .to('.ghost__mouth-clip', { scale: 0.2, duration: 0.1 }, '<')
  .add(() =>
    FIRE(() => {
      LOWER.restart()
    })
  )

document.addEventListener('click', () => {
  if (!FIRING) {
    MAIN.restart()
  }
})

// to('.ghost__mouth-clip', {
//   scale: 0.2,
//   repeat: -1,
//   yoyo:
// })
