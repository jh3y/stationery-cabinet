import gsap from 'https://cdn.skypack.dev/gsap'

const delay = 0.5
const stagger = 0.1
const duration = 0.4

gsap
  .timeline({
    repeat: -1,
    repeatDelay: delay,
    delay,
  })
  .from('.polywork__color', {
    fill: 'black',
    stagger,
    duration,
  })
  .to('.polywork__color', {
    fill: 'black',
    stagger,
    duration,
  })

gsap.set('.polywork', { display: 'block' })
