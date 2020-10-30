const {
  gsap: {
    set,
    to,
    timeline,
    utils: { random, distribute },
  },
} = window

set('.ghost__tails--two', { xPercent: -100 })
// Move pupils across 2 and down 2 to center: x: '+=2', y: '+=2'
set('.ghost__eyes', { transformOrigin: '50% 50%' })
set('.ghost__pupil', { x: 0, y: 0, transformOrigin: '50% 50%' })

// Randomise the position of static sweets
set('.sweet', {
  transformOrigin: '50% 50%',
  rotation: () => random(0, 359),
  '--hue': () => random(0, 359),
})
const RESET = () => {
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
    // scale: 0,
    display: 'none',
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
RESET()
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

set('.static-sweets .sweet', { display: 'none' })
const FIRING_SWEETS = document.querySelectorAll('.firing-sweets .sweet')

const FIRE = () => {
  // const VMIN = Math.min(window.innerHeight, window.innerWidth) / 100
  FIRING_SWEETS.forEach(sweet => {
    to(sweet, {
      onComplete: () => {
        set(sweet, { x: 0, y: 0 })
      },
      ease: 'power3.out',
      duration: () => random(0.1, 1),
      physics2D: {
        velocity: () => random(50, 200),
        angle: () => random(-180, -90),
        gravity: () => random(50, 400),
      },
    })
  })
}

document.addEventListener('click', FIRE)

const TIMING = {
  TAILS: 0.8,
}

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
BLINK()

timeline({
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
