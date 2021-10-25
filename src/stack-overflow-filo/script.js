import gsap from 'https://cdn.skypack.dev/gsap'

const BOUNDS = 50
document.addEventListener('pointermove', ({ x, y }) => {
  const newX = gsap.utils.mapRange(0, window.innerWidth, -BOUNDS, BOUNDS, x)
  const newY = gsap.utils.mapRange(0, window.innerHeight, BOUNDS, -BOUNDS, y)
  gsap.set(document.documentElement, {
    '--rotate-x': newY,
    '--rotate-y': newX,
  })
})

gsap.set('.stacked__block', {
  xPercent: 80,
  yPercent: -690,
  rotate: 54,
})

gsap.set('.stacked__block .cuboid div', {
  opacity: 0
})

const MAIN = gsap.timeline({
  delay: 1,
  repeat: -1,
  yoyo: true,
  repeatDelay: 1,
})

// Would be cool to use FLIP for this but we need different ease
// MAIN.add(Flip.fit('.stacked__block', '.one', {
//   duration: 5,
//   ease: 'power4.out'
// }))

const BLOCKS = gsap.utils.toArray('.stacked__block')

const genTl = index =>
  gsap
    .timeline()
    .to(
      BLOCKS[index].querySelectorAll('.cuboid div'),
      {
        opacity: 1,
        duration: 0.05,
      },
      0
    )
    .to(BLOCKS[index], {
      xPercent: 0,
      ease: 'power4.out',
    }, 0)
    .to(
      BLOCKS[index],
      {
        rotate: 0,
      },
      0
    )
    .to(
      BLOCKS[index],
      {
        yPercent: index * -100,
      },
      0
    )

MAIN.to('.scene', {
  '--shadow': 1,
  duration: 0.5,
}, 0)
for (let b = 0; b < 5; b++) {
  MAIN.add(genTl(b), b * 0.1)
}
