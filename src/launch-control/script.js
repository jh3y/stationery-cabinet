const {
  gsap: {
    timeline,
    set,
    delayedCall,
    to,
    utils: { random },
  },
  Splitting,
} = window

const SOUNDS = {
  ALARM: new Audio(
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/alarm-trimmed.mp3'
  ),
  SCREAM: new Audio(
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/crowd-screaming.mp3'
  ),
  OPEN: new Audio(
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/garage-door-opening.mp3'
  ),
  CLOSE: new Audio(
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/garage-door-closing.mp3'
  ),
  THRUSTERS: new Audio(
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/rocket-thrusters-trimmed.mp3'
  ),
}

SOUNDS.ALARM.muted = SOUNDS.SCREAM.muted = SOUNDS.CLOSE.muted = SOUNDS.OPEN.muted = SOUNDS.CLOSE.muted = SOUNDS.THRUSTERS.muted = true

const toggleAudio = () => {
  SOUNDS.ALARM.muted = SOUNDS.SCREAM.muted = SOUNDS.CLOSE.muted = SOUNDS.OPEN.muted = SOUNDS.CLOSE.muted = SOUNDS.THRUSTERS.muted = !SOUNDS
    .THRUSTERS.muted
}

document.querySelector('#volume').addEventListener('input', toggleAudio)

Splitting()

const LAUNCH_BTN = document.querySelector('.launch-control__button')
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
const getJets = () => {
  return timeline({
    onStart: () => {
      delayedCall(1, () => {
        SOUNDS.THRUSTERS.playbackRate = 1
        SOUNDS.THRUSTERS.play()
      })
    },
  })
    .to(
      '.jet',
      {
        delay: 1,
        scaleY: 1,
        duration: 0.1,
      },
      0
    )
    .to(
      '.bubble',
      {
        delay: 1,
        opacity: 1,
        duration: 0.1,
        onStart: () => {
          BUBBLE_TL.timeScale(0.75)
          BUBBLE_TL.play()
          delayedCall(1, () => BUBBLE_TL.timeScale(2))
          delayedCall(4, () => BUBBLE_TL.timeScale(0.5))
        },
      },
      0
    )
}
const getTakeoff = (s, d) =>
  timeline({
    onStart: () => {
      delayedCall(0.6, () => {
        set('.rocket__face', { display: 'none' })
        set('.rocket__face-takeoff', { display: 'block' })
      })
    },
  })
    .set('.jet', { transformOrigin: '50% 100%' })
    .to('.rocket', { x: 1, y: 1, repeat: 29, yoyo: true, duration: 0.05 })
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
set('.avatar', { transformOrigin: '50% 50%', rotate: -28 })
set('.control-tower__body', { y: '+=100%' })
set('.jet--two', { x: '-=50%' })
set('.rocket__face-takeoff', { display: 'none' })
const RESET = () => {
  LAUNCH_BTN.removeAttribute('disabled')
  set(SOUNDS.THRUSTERS, { volume: 1 })
  set(
    [
      '.rocket',
      '.control-tower',
      '.launch-control__jets',
      '.launch-control__bubbles',
      '.rocket__face-takeoff',
    ],
    { display: 'none' }
  )
  set('.rocket__face', { display: 'block' })
  set(['.rocket'], { y: 0 })
  set(['.rocket__ship'], { y: '+=100%' })
  set('.launch-control__hatch', { scaleX: 0, transformOrigin: '50% 50%' })
  set('.jet', { transformOrigin: '50% 0', scaleY: 0, opacity: 1 })
  set('.bubble', { scale: 0 })
}
// Start small
set('.launch-control', { scale: 0.5 })
RESET()
const PPS = 150
const LAUNCH = () => {
  LAUNCH_BTN.setAttribute('disabled', true)
  const DISTANCE = window.innerHeight * 0.6
  const SPEED = DISTANCE / PPS
  set(
    [
      '.rocket',
      '.control-tower',
      '.launch-control__bubbles',
      '.launch-control__jets',
    ],
    { display: 'block' }
  )
  timeline({
    onComplete: RESET,
    onStart: () => {
      set(LAUNCH_BTN, { '--h': 0 })
    },
  })
    .to('.launch-control', {
      onStart: () => {
        SOUNDS.ALARM.play()
      },
      scale: 1,
      duration: 0.5,
    })
    .fromTo(
      LAUNCH_BTN,
      { '--l': 50 },
      {
        '--l': 100,
        duration: 0.9,
        repeat: 4,
        yoyo: true,
      },
      0.5
    )
    .to(
      '.char',
      {
        onStart: () => SOUNDS.SCREAM.play(),
        duration: () => random(0.5, 1),
        // delay: Math.random(),
        x: () => random(-100, 100),
        y: () => random(100, 120),
        scale: () => random(1, 1.5),
        // opacity: 0,
      },
      0.5
    )
    .to(
      '.char',
      {
        duration: 0.1,
        opacity: 0,
      },
      '>-0.5'
    )
    .to('.launch-control__hatch', {
      duration: 5,
      scaleX: 1,
      onStart: () => {
        SOUNDS.OPEN.playbackRate = 2.6
        SOUNDS.OPEN.play()
      },
    })
    .to(['.control-tower__body', '.rocket__ship'], {
      ease: 'none',
      duration: 2,
      y: 0,
    })
    .to(
      '.rocket__eyes',
      {
        scaleY: 0,
        repeat: 1,
        yoyo: true,
        transformOrigin: '50% 50%',
        duration: 0.05,
      },
      '<2'
    )
    // // Jets firing and smoke blah
    .add(getJets())
    .add(getTakeoff(SPEED, DISTANCE))
    .to(['.jet', '.bubble'], {
      delay: 0.5,
      duration: 1,
      opacity: 0,
      onComplete: () => {
        to(SOUNDS.THRUSTERS, { delay: 0.5, duration: 1, volume: 0 })
        BUBBLE_TL.pause()
      },
    })
    .to('.control-tower__body', { duration: 2, y: '+=100%' })
    .to('.launch-control__hatch', {
      onStart: () => {
        SOUNDS.CLOSE.playbackRate = 2.6
        SOUNDS.CLOSE.play()
      },
      duration: 5,
      scaleX: 0,
    })
    .set('.char', { x: 0, y: 0, scale: 1 })
    .set(LAUNCH_BTN, { '--h': 115 })
    .to('.launch-control', {
      onStart: () => {
        set('.rocket', { display: 'none' })
      },
      delay: 0.5,
      scale: 0.5,
      duration: 1,
    })
    .to(LAUNCH_BTN, { '--l': 50, duration: 0.2 })
    .to('.char', { opacity: 1, duration: 0.5 })
}

LAUNCH_BTN.addEventListener('click', LAUNCH)
