const { TweenMax, TimelineMax, Power0, Power4 } = window
const MAX_DURATION = 1000
const MAX_DISTANCE = 120
const MAX_HEIGHT = 50

class Astronaut {
  el = document.querySelector('.astronaut')
  wrapper = document.querySelector('.astronaut__wrapper')
  state = {
    angle: 0,
  }
}
const myAstronaut = new Astronaut()
const start = () => {
  if (myAstronaut.state.jumping || myAstronaut.state.starting) return
  myAstronaut.state = {
    ...myAstronaut.state,
    starting: true,
    start: new Date().getTime(),
  }
}
const jump = () => {
  if (myAstronaut.state.jumping) return
  myAstronaut.state = {
    ...myAstronaut.state,
    jumping: true,
  }
  const jumpTime = new Date().getTime() - myAstronaut.state.start
  const DIFF = Math.min(1, jumpTime / MAX_DURATION)
  const DURATION = DIFF.toFixed(1)
  const ANGLE = Math.floor(Math.min(MAX_DISTANCE, DURATION * MAX_DISTANCE))
  const HEIGHT = Math.floor(Math.min(MAX_HEIGHT, DURATION * MAX_HEIGHT))
  new TimelineMax({
    onComplete: () => {
      myAstronaut.state = {
        ...myAstronaut.state,
        jumping: false,
        starting: false,
      }
    },
  })
    .add(
      TweenMax.to(myAstronaut.wrapper, DURATION, {
        rotation: (myAstronaut.state.angle += ANGLE),
        ease: Power0.easeNone,
      }),
      0
    )
    .add(
      TweenMax.to(myAstronaut.el, DURATION / 2, {
        y: -HEIGHT,
        ease: Power4.easeOut,
        yoyo: true,
        repeat: 1,
      }),
      0
    )
}

document.addEventListener('mousedown', start)
document.addEventListener('touchstart', start)
document.addEventListener('mouseup', jump)
document.addEventListener('touchend', jump)
document.addEventListener('keydown', e => {
  if (e.keyCode === 32 && !myAstronaut.state.starting) {
    start()
  }
})
document.addEventListener('keyup', e => {
  if (e.keyCode === 32 && myAstronaut.state.starting) {
    jump()
  }
})
