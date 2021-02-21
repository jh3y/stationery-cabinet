import gsap from 'https://cdn.skypack.dev/gsap'

const COUNT = 5
const grid = [COUNT, COUNT]
const MULTIPLIER = 42
const CONFIG = {
  base: -(COUNT * MULTIPLIER),
  amount: 2 * (COUNT * MULTIPLIER),
}
gsap.set('.mushroom-field__shroom', {
  xPercent: gsap.utils.distribute({
    ...CONFIG,
    grid,
    axis: 'x',
  }),
  yPercent: gsap.utils.distribute({
    ...CONFIG,
    grid,
    axis: 'y',
  }),
})

gsap.set('.shroom', {
  xPercent: index => {
    const ROW = Math.round(COUNT * -0.5) + (Math.floor(index / COUNT) % COUNT)
    return ROW * 100
  },
  yPercent: index => {
    const COLUMN = Math.round(COUNT * -0.5) + (index % COUNT)
    const ROW = Math.round(COUNT * -0.5) + (Math.floor(index / COUNT) % COUNT)
    return COLUMN * 100 * -0.5775 + ROW * (100 * -0.5775)
  },
})

const duration = 1
const JUMP_DISTRO = gsap.utils.distribute({
  amount: 1,
  base: 0,
  grid,
  from: 'edges',
})

const WRAPS = gsap.utils.toArray('.shroom__wrap')

const JUMP = () => {
  const TL = gsap.timeline()
  for (let m = 0; m < WRAPS.length; m++) {
    const SHROOM = WRAPS[m]
    gsap.set(SHROOM, { transformOrigin: '50% 100%' })
    const JUMP_TL = gsap
      .timeline()
      .to(SHROOM, {
        yPercent: -25,
        duration: duration,
        yoyo: true,
        repeat: 1,
      })
      .to(
        SHROOM,
        {
          scaleY: 0.9,
          scaleX: 1.1,
          duration: 0.25,
        },
        '>-0.2'
      )
      .to(
        SHROOM,
        {
          scaleY: 1,
          scaleX: 1,
          duration: 0.25,
        },
        0
      )
      .to(
        SHROOM,
        {
          scaleY: 1.1,
          scaleX: 0.9,
          duration: 0.25,
        },
        '>'
      )
    TL.add(JUMP_TL, JUMP_DISTRO(m, SHROOM, WRAPS))
  }
  return TL
}

const PADDED = gsap.timeline({ repeat: -1 })
PADDED.add(JUMP())
  .add(JUMP(), '>-1')
  .add(JUMP(), '>-1')

gsap.fromTo(
  PADDED,
  {
    totalTime: 1,
  },
  {
    repeat: -1,
    duration: 1,
    totalTime: 5,
    ease: 'none',
  }
)
gsap.set('.mushroom-field', { display: 'block' })
