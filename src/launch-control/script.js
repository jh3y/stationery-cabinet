const {
  gsap: { timeline, set },
} = window

// const LAUNCH_BTN = document.querySelector('.launch-control__button')
// let LAUNCH_TL

set('.bubble', { transformOrigin: '50% 100%', scale: 0, opacity: 0 })

const BUBBLE_TL = timeline({ paused: true })
document.querySelectorAll('.bubble').forEach(bubble =>
  BUBBLE_TL.to(bubble, {
    scale: 1,
    duration: 'random(0.15, 0.5)',
    delay: () => Math.random() * -1,
    repeat: -1,
    yoyo: true,
  })
)
// BUBBLE_TL.play()

const getTakeoff = (s, d) =>
  timeline()
    .set('.jet', { transformOrigin: '50% 100%' })
    .to(
      '.rocket',
      {
        duration: s,
        ease: 'power4.in',
        y: `-=${d}`,
      },
      0
    )
    .to(
      '.jet',
      {
        duration: s,
        ease: 'power4.in',
        scaleY: (index, self) => {
          return d / self.offsetHeight + 1
        },
      },
      0
    )

set('.control-tower__body', { y: '+=100%' })
const RESET = () => {
  set(['.rocket', '.control-tower'], { display: 'none' })
  set(['.rocket'], { y: 0 })
  set(['.rocket__ship'], { y: '+=100%' })
  set('.launch-control__hatch', { scaleX: 0, transformOrigin: '50% 50%' })
  set('.jet', { transformOrigin: '50% 0', scaleY: 0, opacity: 1 })
}
RESET()
const PPS = 150
const LAUNCH = () => {
  const DISTANCE = window.innerHeight * 0.6
  const SPEED = DISTANCE / PPS
  set(['.rocket', '.control-tower'], { display: 'block' })
  timeline({
    onComplete: RESET,
  })
    .to('.launch-control__hatch', {
      duration: 1,
      scaleX: 1,
    })
    .to(['.control-tower__body', '.rocket__ship'], {
      ease: 'none',
      duration: 1,
      y: 0,
    })
    // Jets firing and smoke blah
    .to(
      '.jet',
      {
        delay: 1,
        scaleY: 1,
        duration: 0.1,
      },
      2
    )
    .to(
      '.bubble',
      {
        delay: 1,
        opacity: 1,
        duration: 0.1,
        onStart: () => BUBBLE_TL.play(),
      },
      2
    )
    .add(getTakeoff(SPEED, DISTANCE))
    .to(['.jet', '.bubble'], {
      delay: 0.5,
      duration: 1,
      opacity: 0,
      onComplete: () => BUBBLE_TL.pause(),
    })
    .to('.control-tower__body', { duration: 1, y: '+=100%' })
    .to('.launch-control__hatch', { duration: 1, scaleX: 0 })
}

document.body.addEventListener('click', LAUNCH)
