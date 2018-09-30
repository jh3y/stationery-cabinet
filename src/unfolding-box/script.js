const { TimelineMax, TweenMax } = window
const wraps = document.querySelectorAll('.cube__wrapper')
const t = document.querySelector('.cube__panel--top')
const l = document.querySelector('.cube__panel--left')
const r = document.querySelector('.cube__panel--right')
const fake = document.querySelector('.cube__panel--fake')
const PANEL_DUR = 0.85

const UnfoldingTL = new TimelineMax({ repeatDelay: 0 })

UnfoldingTL.add(
  TweenMax.to(l, PANEL_DUR, {
    rotationX: -270,
  }),
  0
)
  .add(
    TweenMax.to(t, PANEL_DUR, {
      rotationY: -270,
    }),
    0
  )
  .add(
    TweenMax.to(r, PANEL_DUR, {
      rotationY: 270,
    }),
    0
  )
  .set(wraps[1], { display: 'block' })
  .set(fake, { display: 'block' })
  .add(
    TweenMax.to([...wraps], PANEL_DUR, {
      rotationX: 35,
      zIndex: 5,
    })
  )
  .repeat(-1)
