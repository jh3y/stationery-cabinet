import Splitting from 'https://cdn.skypack.dev/splitting'
import gsap from 'https://cdn.skypack.dev/gsap'
import { RoughEase } from 'https://cdn.skypack.dev/gsap/EasePack'

gsap.registerPlugin(RoughEase)

Splitting()

let COLOR
let FLICKER
let MAIN

const setColor = () => {
  const hue = Math.random() * 360
  gsap.set(document.documentElement, {
    '--hue': hue,
  })
  COLOR = `hsl(${hue}, 65%, 80%)`
}
const CHARS = gsap.utils.toArray('.text-grid__main .char')
const STAGGER = 0.025
const SPEED = 0.2
const RESET = () => {
  if (MAIN) MAIN.kill()
  window.FLICKER = FLICKER =
    CHARS[Math.floor(Math.random() * 'Jhey Tompkins'.split('').length)]
  setColor()
  gsap.set(['[aria-hidden]', '.char'], {
    opacity: 0,
  })
  gsap.set('.avatar-ring', {
    clearProps: 'all',
  })
  gsap.set('.avatar-ring', {
    scale: 0,
    transformOrigin: '50% 65%',
  })
  gsap.set('.char', {
    color: 'transparent',
    stroke: 'hsl(0, 0%, 50%)',
    scale: 1,
  })
  gsap.set('img', {
    yPercent: 100,
  })
  gsap.set(CHARS, {
    attr: {
      class: 'char',
    },
  })
}
const REVEAL = () =>
  gsap
    .timeline()
    .set('.char', {
      '--drop': 0,
      '--stroke': 'hsl(0, 0%, 50%)',
    })
    .to('.char', {
      stagger: STAGGER,
      opacity: 1,
      duration: SPEED,
    })
    .to(
      '.char',
      {
        stagger: STAGGER,
        color: COLOR,
        duration: SPEED,
        '--stroke': COLOR,
      },
      '<+0.4'
    )
    .to('[aria-hidden]', {
      opacity: 1,
      duration: STAGGER,
      delay: gsap.utils.distribute({
        base: 0,
        amount: SPEED,
        grid: 'auto',
        from: 'center',
      }),
      repeat: 1,
      yoyo: true,
    })
    .to(
      '.avatar-ring',
      {
        scale: 1,
        duration: SPEED,
      },
      '<'
    )
    .to(
      'img',
      {
        yPercent: -50,
        duration: SPEED,
      },
      `>-${SPEED * 0.5}`
    )
    .set('.text-grid__main .char', {
      attr: {
        class: 'char char--on',
      },
    })
    .to('.text-grid__main .char', {
      '--drop': 1,
      duration: SPEED,
    })
    .add(
      gsap
        .timeline({
          repeat: -1,
          delay: gsap.utils.random(1, 3),
          repeatDelay: gsap.utils.random(5, 10),
        })
        .to(FLICKER, {
          opacity: 0.3,
          yoyo: true,
          duration: 0.5,
          repeatDelay: 0.1,
          ease: `rough({ template: power1.out, strength: 2, points: 50, taper: 'none', randomize: true, clamp: true})`,
          repeat: 1,
        })
    )

RESET()
MAIN = REVEAL()

document.querySelector('button').addEventListener('click', () => {
  RESET()
  MAIN = REVEAL()
})
