import gsap from 'https://cdn.skypack.dev/gsap'

const { registerPlugin } = gsap
const { MorphSVGPlugin } = window

registerPlugin(MorphSVGPlugin)

// Set things up.
gsap.set(['#tail-wag', '#yarn-thread'], {
  display: 'none',
})
gsap.set('.kitty__leg', {
  transformOrigin: '50% 90%',
  // rotate: index => (index < 2 ? 'random(8, 15)' : 'random(-15, -8)'),
  rotate: index => -10,
})
gsap.set('.yarn__thread', {
  transformOrigin: '0% 90%',
  scale: 0.5,
})
gsap.set('.kitty__eye', {
  transformOrigin: '50% 50%',
})
gsap.set('.kitty__head', {
  rotate: -10,
  yPercent: 10,
  xPercent: -8,
})

const YARN_TL = gsap
  .timeline()
  .to(
    '.yarn',
    {
      rotation: '-=360',
      ease: 'none',
      repeat: -1,
      transformOrigin: '52% 48%',
    },
    0
  )
  .to(
    '.yarn',
    {
      yPercent: '-4',
      repeat: -1,
      yoyo: true,
    },
    0
  )
  .to(
    '.yarn__thread',
    {
      morphSVG: '#yarn-thread',
      repeat: -1,
      yoyo: true,
      duration: 0.1,
      ease: 'sine.inOut',
    },
    0
  )

const KITTY_TL = gsap
  .timeline()
  .to(
    '.kitty__tail path',
    {
      morphSVG: '#tail-wag',
      repeat: -1,
      yoyo: true,
      duration: 0.1,
      ease: 'sine.inOut',
    },
    0
  )
  .to(
    '.kitty__tail',
    {
      rotation: -15,
      transformOrigin: '0 100%',
      repeat: -1,
      yoyo: true,
      ease: 'none',
    },
    0
  )
  .to(
    ['.kitty__belly', '.kitty__nearside-legs'],
    {
      repeat: -1,
      yoyo: true,
      yPercent: 10,
    },
    0
  )
  .to(
    ['.kitty__offside-legs'],
    {
      repeat: -1,
      yoyo: true,
      yPercent: -10,
    },
    0
  )
  .to(
    '.kitty__head',
    {
      transformOrigin: '50% 50%',
      rotate: 10,
      ease: 'none',
      yoyo: true,
      duration: 0.25,
      repeat: -1,
    },
    0
  )

const LEGS = gsap.utils.toArray('.kitty__leg')
for (const LEG of LEGS) {
  KITTY_TL.to(
    LEG,
    {
      rotate: 10,
      repeat: -1,
      yoyo: true,
      duration: gsap.utils.random(0.1, 0.2),
    },
    0
  )
}

const BLINK = () => {
  const delay = gsap.utils.random(1, 5)
  gsap.to('.kitty__eye', {
    delay,
    scaleY: 0.1,
    repeat: 3,
    yoyo: true,
    duration: 0.05,
    onComplete: () => {
      BLINK()
    },
  })
}
BLINK()

// const MAIN =
gsap
  .timeline()
  .add(YARN_TL)
  .add(KITTY_TL, 0)

gsap.ticker.fps(24)

// const RANGE = document.querySelector('input')
// RANGE.addEventListener('input', () => {
//   MAIN.timeScale(RANGE.value)
// })

gsap.set('.yarn-kitty', { display: 'block' })
