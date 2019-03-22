const { TimelineMax, TweenMax } = window
const heart = document.querySelector('.heart')
const eye = document.querySelector('.eye')
const straight = document.querySelector('.eye__piece--straight')
const curved = document.querySelector('.eye__piece--curved')
const mouth = document.querySelector('.mouth')
const cloak = document.querySelector('.cloak')

const timeline = new TimelineMax({ delay: 1, repeat: -1, repeatDelay: 1 })

const beat = delay =>
  new TimelineMax({ delay })
    .to(heart, 0.1, { scale: 0.85 })
    .to(heart, 0.1, { scale: 0.95 })
    .to(heart, 0.1, { scale: 0.85 })
    .to(heart, 0.1, { scale: 1 })

const rotate = () =>
  new TimelineMax()
    .to(eye, 0.4, { rotation: 45 })
    .to(eye, 0.4, { rotation: 90 })
    .to(eye, 0.4, { rotation: 135 })
    .to(eye, 0.4, { rotation: 180 })

timeline
  .add(TweenMax.from(heart, 0.15, { scale: 0 }))
  .add(beat(), 1.2)
  .add(beat(0.25))
  .add(beat(0), 3.6)
  .add(TweenMax.from(straight, 0.3, { x: '-100vw', y: '-100vw' }), 0.9)
  .add(TweenMax.from(curved, 0.3, { x: '100vw', y: '-100vw' }), 1.1)
  .add(rotate(), 2.75)
  .add(TweenMax.from(mouth, 0.3, { scaleX: 1, x: '-100vw' }), 2.75)
  .add(TweenMax.to(mouth, 0.25, { scaleX: 1 }, 3.4))
  .add(TweenMax.to(mouth, 0.25, { height: '100vh' }))
  .add(TweenMax.to(cloak, 0.5, { y: '-50%' }), 4.8)
