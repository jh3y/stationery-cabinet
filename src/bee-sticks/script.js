import gsap from 'https://cdn.skypack.dev/gsap'

const ONE = 15
const TWO = 180
const THREE = 280
const FOUR = 90

gsap.set('.stick--even', { '--bg': ONE })
gsap.set('.stick--odd', { '--bg': TWO })
gsap.set('.sticks', { display: 'grid' })
const CONFIG = {
  delay: gsap.utils.distribute({
    grid: 'auto',
    from: 'center',
    base: 0,
    amount: 2,
  }),
  rotate: '+=45',
  duration: 0.25,
  ease: 'power4.in',
  '--bg': (_, element) => {
    const CURRENT = parseInt(element.style.getPropertyValue('--bg'), 10)
    switch (CURRENT) {
      case TWO:
        return FOUR
      case ONE:
        return THREE
      case FOUR:
        return TWO
      case THREE:
        return ONE
      default:
        return 'black'
    }
  },
}

gsap
  .timeline({
    repeat: -1,
  })
  .to('.stick', {
    ...CONFIG,
  })
  .to(
    '.stick',
    {
      ...CONFIG,
    },
    '>-1'
  )
  .to(
    '.stick',
    {
      ...CONFIG,
    },
    '>-1'
  )
  .to(
    '.stick',
    {
      ...CONFIG,
    },
    '>-1'
  )
