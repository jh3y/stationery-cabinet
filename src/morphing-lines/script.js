import gsap from 'https://cdn.skypack.dev/gsap'
const { registerPlugin } = gsap
const { MorphSVGPlugin } = window
registerPlugin(MorphSVGPlugin)

const STRAIGHT = 'M124 13L124 193'
const LEFT_BEND =
  'M124.151 12.5C114.934 57.0054 104.819 85.0814 34.1506 168.385'
const RIGHT_BEND =
  'M123.651 12.5C132.867 57.0054 142.982 85.0814 213.651 168.385'

gsap.set('.string-and-ball', {
  transformOrigin: '50% 0',
})

gsap.set('.string', {
  stroke: 'none',
})

gsap
  .timeline({
    repeat: -1,
    yoyo: true,
  })
  .set('.string-and-ball', {
    rotate: 30,
    ease: 'none',
  })
  .set('.actual-string', {
    morphSVG: LEFT_BEND,
  })
  .to('.string-and-ball', {
    rotate: 0,
    ease: 'none',
  })
  .to(
    '.actual-string',
    {
      morphSVG: STRAIGHT,
      ease: 'none',
    },
    '<'
  )
  .to('.string-and-ball', {
    rotate: -30,
    ease: 'none',
  })
  .to(
    '.actual-string',
    {
      morphSVG: RIGHT_BEND,
      ease: 'none',
    },
    '<'
  )
