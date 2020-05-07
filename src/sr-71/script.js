const {
  gsap: { timeline, set },
} = window

// 100 x to 58 y is the ratio for movement
new timeline({
  id: 'Main',
  repeat: -1,
  onStart: () => {
    set('.building', { opacity: 1 })
    set('.landscape', { x: '-=500', y: '+=290' })
  },
})
  .to('.landscape', { ease: 'none', x: '+=1000', y: '-=580', duration: 1 })
  .to(
    '.building',
    { id: 'building', ease: 'none', opacity: 0, duration: 0.1 },
    0.5
  )
  .to('.mountain', { ease: 'none', opacity: 0, duration: 0.1 }, 0.85)

// GSDevTools.create()
