import gsap from 'https://cdn.skypack.dev/gsap'
const ONE = 'hsl(1, 76%, 42%)'
const TWO = 'hsl(98, 20%, 47%)'
const THREE = 'hsl(211, 36%, 23%)'
const FOUR = 'hsl(31, 94%, 42%)'

gsap.set('.stick--red', { '--bg': ONE })
gsap.set('.stick--green', { '--bg': TWO })

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
    const CURRENT = element.style.getPropertyValue('--bg')
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
