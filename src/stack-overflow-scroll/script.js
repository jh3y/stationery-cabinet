import gsap from 'https://cdn.skypack.dev/gsap'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BOUNDS = 50
// document.addEventListener('pointermove', ({ x, y }) => {
//   const newX = gsap.utils.mapRange(0, window.innerWidth, -BOUNDS, BOUNDS, x)
//   const newY = gsap.utils.mapRange(0, window.innerHeight, BOUNDS, -BOUNDS, y)
//   gsap.set(document.documentElement, {
//     '--rotate-x': newY,
//     '--rotate-y': newX,
//   })
// })

gsap.set('.stacked__block', {
  xPercent: 80,
  yPercent: -690,
  rotate: 54,
})

// gsap.set('.stacked__block .cuboid div', {
//   opacity: 0,
// })

const MAIN = gsap.timeline({
  // delay: 1,
  // repeat: -1,
  // repeatDelay: 1,
  paused: true
})

const stagger = 0.1
const getStack = () =>
  gsap
    .timeline({
      paused: false,
    })
    .set('.stacked__block', {
      xPercent: 80,
      yPercent: -690,
      rotate: 54,
      scale: 0,
    })
    .to(
      '.stacked__block',
      {
        scale: 1,
        stagger,
        duration: 0.05,
      },
      0
    )
    .to(
      '.stacked__block',
      {
        stagger,
        xPercent: 0,
        duration: 0.5,
        ease: 'power4.out',
      },
      0
    )
    .to(
      '.stacked__block',
      {
        duration: 0.5,
        stagger,
        rotate: 0,
      },
      0
    )
    .to(
      '.stacked__block',
      {
        duration: 0.5,
        stagger,
        yPercent: 100,
      },
      0
    )
    .to(
      '.stacked__block',
      {
        scale: 0,
        stagger,
        duration: 0.05,
      },
      0.45
    )

MAIN.add(getStack(), 0)

const SCRUB = gsap.timeline({
  paused: true,
  repeat: -1,
})
  .fromTo(MAIN, {
    totalTime: 0.5
  }, {
    // repeat: -1,
    totalTime: 1,
    duration: 2,
    ease: 'none'
  })


gsap.set('.scene', {
  display: 'block',
})


document.documentElement.scrollTop = 2
document.body.scrollTop = 2


ScrollTrigger.create({
  trigger: 'body',
  start: 1,
  end: 'bottom bottom',
  onLeaveBack: () => {
    document.body.scrollTop = document.body.scrollHeight - window.innerHeight - 2
    document.documentElement.scrollTop = document.body.scrollHeight - window.innerHeight - 2
  },
  onLeave: () => {
    document.documentElement.scrollTop = 2
    document.body.scrollTop = 2

  },
  onUpdate: self => {
    SCRUB.progress(self.progress)
  },
})