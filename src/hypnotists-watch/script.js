import gsap from 'https://cdn.skypack.dev/gsap'
const { registerPlugin } = gsap
const { MorphSVGPlugin } = window
registerPlugin(MorphSVGPlugin)

const STRAIGHT = 'M191 19.5V243'
const LEFT_BEND = 'M190.159 19C179.503 68.34 117.5 193 78.409 212.557'
const RIGHT_BEND = 'M191.909 19c10.656 49.34 72.659 174 111.75 193.557'

gsap.defaults({
  ease: 'none',
})

gsap.set('.pocket-watch__chain--invisible', {
  stroke: 'none',
})
gsap.set('.pocket-watch__chain--morpher', {
  morphSVG: LEFT_BEND,
  stroke: 'hsl(45, 50%, 50%)',
})
gsap.set('.pocket-watch__watch', {
  transformOrigin: '50% 50%',
})

gsap.set('.pocket-watch__watch rect:first-of-type', {
  fill: 'hsl(45, 50%, 40%)',
})
gsap.set('.pocket-watch__watch path', {
  stroke: 'hsla(0, 0%, 100%, 0.75)',
})
gsap.set('.pocket-watch__watch path:first-of-type', {
  stroke: 'hsl(45, 50%, 65%)',
})
gsap.set('.pocket-watch__watch rect:last-of-type', {
  fill: 'hsl(45, 50%, 55%)',
})
gsap.set('.pocket-watch__watch circle', {
  fill: index => {
    if (index === 0) return 'hsl(45, 50%, 30%)'
    if (index === 1) return 'hsl(45, 50%, 50%)'
    if (index === 2) return 'hsl(45, 50%, 45%)'
  },
})

gsap.set('.pocket-watch__group', {
  transformOrigin: '50% 0%',
  rotate: 30,
})

const SWING = gsap
  .timeline({
    paused: true,
  })
  .to('.pocket-watch__group', {
    rotate: 0,
  })
  .to(
    '.pocket-watch__chain--morpher',
    {
      morphSVG: STRAIGHT,
    },
    '<'
  )
  .to('.pocket-watch__group', {
    rotate: -30,
  })
  .to(
    '.pocket-watch__chain--morpher',
    {
      morphSVG: RIGHT_BEND,
    },
    '<'
  )
  .to(
    '.pocket-watch__watch',
    {
      repeat: 1,
      duration: 0.5,
      yoyo: true,
      yPercent: -25,
    },
    0
  )

gsap.to(SWING, {
  totalTime: SWING.duration(),
  duration: 1,
  ease: 'power3.inOut',
  repeat: -1,
  yoyo: true,
})

gsap.set('.pocket-watch', {
  display: 'block',
})
