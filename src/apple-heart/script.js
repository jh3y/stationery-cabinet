const { gsap, Physics2DPlugin } = window
gsap.registerPlugin(Physics2DPlugin)
let timeline
const CLICK = new Audio('https://assets.codepen.io/605876/click.mp3')
const SPARKLE = new Audio('https://assets.codepen.io/605876/sparkle.mp3')
const BUTTON = document.querySelector('button')

const STARTERS = document.querySelectorAll('.heart__segment--start')
const MIDS = [...document.querySelectorAll('.heart__segment--middle')].reverse()
const ENDERS = [...document.querySelectorAll('.heart__segment--end')].reverse()
const SEGMENTS = [...STARTERS, ...MIDS, ...ENDERS]

gsap.set(SEGMENTS, {
  '--lightness': index =>
    gsap.utils.mapRange(0, SEGMENTS.length, 94, 60, index),
})

gsap.set(SEGMENTS, { opacity: 0 })
gsap.set('.heart__beat', { transformOrigin: '50% 50%', yPercent: 5 })
gsap.set('.heart__fragment', { opacity: 0 })

const LIKE = () =>
  gsap
    .timeline({
      onStart: () => {
        gsap.set([SEGMENTS, '.heart__fragments'], { display: 'block' })
        gsap.set('.heart__stroke', { display: 'none' })
        gsap.set('.heart__fragment', {
          opacity: 0,
          '--hue': () => gsap.utils.random(0, 359),
        })
      },
      onComplete: () => {
        gsap.set([SEGMENTS, '.heart__fragments'], { display: 'none' })
      },
    })
    .set('.heart__beat', { '--hue': 180 })
    .set('.heart__segment--start', { opacity: 1 })
    .to([MIDS, ENDERS], {
      stagger: 0.005,
      opacity: 1,
      duration: 0.05,
    })
    .to(
      '.heart__beat',
      {
        duration: 0.5,
        '--hue': 360,
        ease: 'power1.in',
      },
      0
    )
    .to(
      STARTERS,
      {
        stagger: 0.025,
        opacity: 0,
        duration: 0.05,
      },
      0.2
    )
    .to(
      '.heart__beat',
      {
        scale: 1.5,
        duration: 0.25,
      },
      '>-0.15'
    )
    .to('.heart__beat', {
      scale: 1,
      duration: 0.35,
      ease: 'back.out(5)',
    })
    .to(
      '.heart__fill',
      {
        display: 'block',
      },
      '>-0.25'
    )
    .to(SEGMENTS, { opacity: 0 }, '>-0.25')
    .fromTo(
      '.heart__fragment',
      {
        opacity: 1,
      },
      {
        onStart: () => {
          SPARKLE.play()
        },
        ease: 'power4.in',
        opacity: 0,
        physics2D: {
          velocity: 90,
          angle: gsap.utils.distribute({
            base: 0,
            amount: 360,
            from: 'start',
          }),
          gravity: 0,
        },
        duration: () => gsap.utils.random(0.15, 0.65),
      },
      '>-0.725'
    )
    .timeScale(1.15)

BUTTON.addEventListener('click', () => {
  CLICK.play()
  BUTTON.classList.toggle('active')
  if (BUTTON.className.includes('active')) timeline = LIKE()
  else {
    gsap.set('.heart__stroke', { display: 'block' })
    gsap.set([SEGMENTS, '.heart__fragments'], { display: 'none' })
    timeline.pause()
    timeline.time(0)
  }
})

// GSDevTools.create()
