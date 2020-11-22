const {
  gsap: { set, timeline },
} = window
const RESET = () => {
  set('[data-layer="0"]', {
    yPercent: 50,
  })
  set('[data-layer="1"]', {
    yPercent: 0,
  })
  set('[data-layer="2"]', {
    yPercent: -50,
  })
  set('[data-row="0"', {
    xPercent: -50,
    yPercent: '-=25',
  })
  set('[data-row="1"', {
    xPercent: 0,
  })
  set('[data-row="2"', {
    xPercent: 50,
    yPercent: '+=25',
  })
  set('[data-position="0"', {
    xPercent: '+=50',
    yPercent: '-=25',
  })
  set('[data-position="2"', {
    xPercent: '-=50',
    yPercent: '+=25',
  })
}

RESET()

let hueOne
let hueTwo
let hueThree

set(['.cube', '.cube__holder'], { transformOrigin: '50% 50%', scale: 1.01 })

timeline({
  repeat: -1,
  repeatDelay: 0.5,
  onRepeat: () => {
    document.documentElement.style.setProperty('--hue-one', hueOne)
    document.documentElement.style.setProperty('--hue-two', hueTwo)
    document.documentElement.style.setProperty('--hue-three', hueThree)
  },
})
  .to('[data-row="0"]', {
    xPercent: '-=50',
    yPercent: '-=25',
  })
  .to(
    '[data-row="2"]',
    {
      yPercent: '+=25',
      xPercent: '+=50',
    },
    '<'
  )
  .to('[data-position="0"]', {
    xPercent: '+=50',
    yPercent: '-=25',
  })
  .to(
    '[data-position="2"]',
    {
      xPercent: '-=50',
      yPercent: '+=25',
    },
    '<'
  )
  .to('[data-layer="0"]', {
    yPercent: '+=50',
  })
  .to(
    '[data-layer="2"]',
    {
      yPercent: '-=50',
    },
    '<'
  )
  .to('[data-layer="1"][data-row="1"][data-position="1"]', {
    onStart: () => {
      hueOne = Math.random() * 359
      hueTwo = Math.random() * 359
      hueThree = Math.random() * 359
      set('[data-layer="1"][data-row="1"][data-position="1"]', {
        '--hue-one': hueOne,
        '--hue-two': hueTwo,
        '--hue-three': hueThree,
      })
    },
    duration: 0.2,
    scale: 3,
  })
  .to(
    [
      '[data-layer="2"][data-row="0"][data-position="0"]',
      '[data-layer="1"][data-row="0"][data-position="0"]',
      '[data-layer="0"][data-row="0"][data-position="0"]',
    ],
    {
      duration: 0.5,
      xPercent: '0',
      yPercent: '-=400',
      opacity: 0,
    },
    '>-0.1'
  )
  .to(
    [
      '[data-layer="2"][data-row="1"][data-position="0"]',
      '[data-layer="1"][data-row="1"][data-position="0"]',
      '[data-layer="0"][data-row="1"][data-position="0"]',
    ],
    {
      duration: 0.5,
      xPercent: '+=400',
      yPercent: '-=200',
      opacity: 0,
    },
    '<'
  )
  .to(
    [
      '[data-layer="2"][data-row="2"][data-position="0"]',
      '[data-layer="1"][data-row="2"][data-position="0"]',
      '[data-layer="0"][data-row="2"][data-position="0"]',
    ],
    {
      duration: 0.5,
      xPercent: '+=600',
      opacity: 0,
    },
    '<'
  )
  .to(
    [
      '[data-layer="2"][data-row="0"][data-position="1"]',
      '[data-layer="1"][data-row="0"][data-position="1"]',
      '[data-layer="0"][data-row="0"][data-position="1"]',
    ],
    {
      duration: 0.5,
      xPercent: '-=400',
      yPercent: '-=200',
      opacity: 0,
    },
    '<'
  )
  .to(
    [
      '[data-layer="2"][data-row="0"][data-position="2"]',
      '[data-layer="1"][data-row="0"][data-position="2"]',
      '[data-layer="0"][data-row="0"][data-position="2"]',
    ],
    {
      duration: 0.5,
      xPercent: '-=600',
      opacity: 0,
    },
    '<'
  )
  .to(
    [
      '[data-layer="2"][data-row="2"][data-position="1"]',
      '[data-layer="1"][data-row="2"][data-position="1"]',
      '[data-layer="0"][data-row="2"][data-position="1"]',
    ],
    {
      duration: 0.5,
      xPercent: '+=400',
      yPercent: '+=200',
      opacity: 0,
    },
    '<'
  )
  .to(
    [
      '[data-layer="2"][data-row="2"][data-position="2"]',
      '[data-layer="1"][data-row="2"][data-position="2"]',
      '[data-layer="0"][data-row="2"][data-position="2"]',
    ],
    {
      duration: 0.5,
      yPercent: '+=600',
      opacity: 0,
    },
    '<'
  )
  .to(
    [
      '[data-layer="2"][data-row="1"][data-position="2"]',
      '[data-layer="1"][data-row="1"][data-position="2"]',
      '[data-layer="0"][data-row="1"][data-position="2"]',
    ],
    {
      duration: 0.5,
      xPercent: '-=400',
      yPercent: '+=200',
      opacity: 0,
    },
    '<'
  )
  .to(
    '[data-layer="0"][data-row="1"][data-position="1"]',
    {
      yPercent: '+=600',
      opacity: 0,
      duration: 0.5,
    },
    '<'
  )
  .to(
    '[data-layer="2"][data-row="1"][data-position="1"]',
    {
      yPercent: '-=600',
      opacity: 0,
      duration: 0.5,
    },
    '<'
  )
