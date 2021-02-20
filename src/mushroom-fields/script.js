import gsap from 'https://cdn.skypack.dev/gsap'

// 100 x to 57.75 y is the ratio for movement
const COUNT = 5
const grid = [COUNT, COUNT]
const MULTIPLIER = 50
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

const duration = 0.2
const DISTRO = gsap.utils.distribute({
  amount: 0.6,
  base: 0,
  grid,
  from: 'center',
})

const WRAPS = gsap.utils.toArray('.shroom__wrap')

const TL = gsap.timeline({ repeat: -1 })

for (let m = 0; m < WRAPS.length; m++) {
  const SHROOM = WRAPS[m]
  TL.add(
    gsap.to(SHROOM, {
      yPercent: -25,
      yoyo: true,
      repeat: 1,
      duration,
    }),
    DISTRO(m, SHROOM, WRAPS)
  )
}
