const {
  gsap: {
    to,
    timeline,
    set,
    utils: { random },
  },
} = window

set('.tweeter', { transformOrigin: '50% 50%' })

to('.tweeter', {
  duration: 0.2,
  scale: 1.1,
  yoyo: true,
  repeat: -1,
})
to('feGaussianBlur', {
  attr: {
    stdDeviation: 2,
  },
  yoyo: true,
  repeat: -1,
  duration: 0.2,
})

timeline({
  ease: 'none',
  repeat: -1,
})
  .to('#speaker', {
    transformOrigin: '50% 100%',
    scaleX: 1.05,
    scaleY: 0.95,
    duration: 0.2,
  })
  .to('#speaker', {
    transformOrigin: '50% 100%',
    scaleX: 0.95,
    scaleY: 1.05,
    duration: 0.2,
    y: -20,
  })
  .to('#speaker', {
    transformOrigin: '50% 100%',
    scaleX: 1,
    scaleY: 1,
    duration: 0.2,
    y: 0,
  })

timeline({ repeat: -1 })
  .add(
    timeline()
      .to(
        '.stack',
        {
          y: -10,
          repeat: 1,
          yoyo: true,
          duration: 0.1,
        },
        0
      )
      .to(
        '.stack',
        {
          duration: 0.2,
          x: '+=2',
        },
        0
      ),
    0.6
  )
  .add(
    timeline()
      .to(
        '.stack',
        {
          y: -10,
          repeat: 1,
          yoyo: true,
          duration: 0.1,
        },
        0
      )
      .to(
        '.stack',
        {
          duration: 0.2,
          x: '-=2',
        },
        0
      ),
    1.2
  )

const LIMIT = 150
set('.note', {
  '--hue': () => random(0, 360),
  transformOrigin: index => (index < 3 ? '100% 100%' : '0 100%'),
  scale: 0,
  opacity: 0,
  x: index => (index < 3 ? random(10, LIMIT) : random(-LIMIT, -10)),
  y: 90,
  rotation: random(-25, 25),
})

document.querySelectorAll('.note').forEach((note, index) =>
  to(note, {
    scale: random(0.75, 1.1),
    opacity: 1,
    repeat: -1,
    ease: 'sine.inOut',
    x: `${index < 3 ? '-' : '+'}=${random(10, 20)}`,
    y: 20,
    duration: random(0.5, 1.5),
  })
)

set('.lcd__text', { x: 200 })
set('.lcd__line', { x: 500 })
to('.lcd__text', { x: -200, repeat: -1, duration: 5, ease: 'none' })
to('.lcd__line', { x: -500, repeat: -1, duration: 3, ease: 'none' })

to('.slider__handle', {
  y: 'random(5, 45)',
  duration: random(0.1, 0.8),
  repeat: -1,
  yoyo: true,
  repeatRefresh: true,
})
to('.dial', {
  rotation: 'random(-355, 355)',
  duration: random(0.1, 0.8),
  repeat: -1,
  yoyo: true,
  transformOrigin: '50% 50%',
  repeatRefresh: true,
})

// GSDevTools.create()
