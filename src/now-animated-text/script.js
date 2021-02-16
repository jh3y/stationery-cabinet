import Splitting from 'https://cdn.skypack.dev/splitting'
import gsap from 'https://cdn.skypack.dev/gsap'

Splitting()

gsap.set(['[aria-hidden]', '.char'], {
  opacity: 0,
})

const COLOR = 'hsl(10, 80%, 50%)'
const STAGGER = 0.025
const SPEED = 0.2
gsap
  .timeline()
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
