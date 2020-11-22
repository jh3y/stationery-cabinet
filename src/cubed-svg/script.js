const {
  gsap: { set, timeline },
} = window
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
set('[data-position="1"', {
  // xPercent: 0,
})
set('[data-position="2"', {
  xPercent: '-=50',
  yPercent: '+=25',
})

set('.cube', { transformOrigin: '50% 50%', scale: 1.1 })

timeline({ repeat: -1, yoyo: true, repeatDelay: 1 })
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
  .to('[data-row="0"]', {
    xPercent: '+=50',
    yPercent: '+=25',
  })
  .to(
    '[data-row="2"]',
    {
      xPercent: '-=50',
      yPercent: '-=25',
    },
    '<'
  )
  .to('[data-position="0"]', {
    xPercent: '-=50',
    yPercent: '+=25',
  })
  .to(
    '[data-position="2"]',
    {
      xPercent: '+=50',
      yPercent: '-=25',
    },
    '<'
  )
  .to('[data-layer="0"]', {
    yPercent: '-=50',
  })
  .to(
    '[data-layer="2"]',
    {
      yPercent: '+=50',
    },
    '<'
  )
