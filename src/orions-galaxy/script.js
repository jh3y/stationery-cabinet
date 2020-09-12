const {
  gsap: {
    set,
    timeline,
    to,
    utils: { random },
  },
} = window

let ZOOM
let zoomed = false

const ORION = document.querySelector('.orion')
const TURTLE = document.querySelector('.turtle')
const OBJECTS = [
  ...document.querySelectorAll('.star'),
  ...document.querySelectorAll('.blob'),
]
set(['.star', '.blob'], {
  rotate: () => random(0, 360),
  x: -10,
  scale: () => random(0.2, 1.2),
  opacity: 0,
  yPercent: () => random(-450, 450),
  '--lightness': () => random(30, 80),
})
set(TURTLE, {
  transformOrigin: '50% 50%',
  xPercent: -50,
  yPercent: -50,
})
set('.orion__head', { transformOrigin: '55% 80%' })
set('.orion__tail', { transformOrigin: '95% 50%' })
set('.orion__eye', { transformOrigin: '50% 50%', rotate: -10 })
set('.turtle__tail', { transformOrigin: '0% 50%' })
set('.turtle__eye', { transformOrigin: '50% 50%', scale: 0.8 })
set('.turtle__head', { transformOrigin: '80% 80%', rotate: 5 })

const getScale = () => {
  // At this point work out the bigger of viewport dimensions
  const UP = Math.max(window.innerHeight, window.innerWidth)
  // Work out the scale to make the SVG that big
  const BOX = ORION.getBoundingClientRect()
  // Needs to be by the smallest dimension to work
  const SCALE = Math.ceil((UP / BOX.width) * 1.25)
  return SCALE
}

const getZoom = () =>
  timeline({
    onComplete: () => (zoomed = !zoomed),
    onReverseComplete: () => (zoomed = !zoomed),
    paused: true,
  })
    .set(ORION, {
      scale: 1,
      attr: {
        viewBox: '0 -200 5246.15 7862.26',
      },
    })
    .to(ORION, {
      ease: 'none',
      scale: getScale(),
      duration: 0.25,
    })
    .to(
      ORION,
      {
        ease: 'none',
        attr: {
          viewBox: '3146.446 4215.751 56.335 6.775',
        },
        duration: 1,
      },
      0
    )
    .to(TURTLE, {
      opacity: 1,
      scale: 1,
      duration: 0.1,
    })

const RESET = () => {
  if (ZOOM && ZOOM.progress() !== 0) {
    ZOOM.pause()
    ZOOM.time(0)
  }
  set(ORION, { attr: { viewBox: '0 -200 5246.15 7862.26' } })
  ORION.removeAttribute('style')
  set(ORION, { opacity: 1 })
  zoomed = false
  set(TURTLE, { opacity: 0, scale: 0 })
}
RESET()

// General mood timelines
to('.orion__head', {
  rotate: 'random(-5, 5)',
  duration: random(1, 2),
  repeatRefresh: true,
  repeat: -1,
  delay: random(0, 2),
  repeatDelay: 5,
})

const WAG = () => {
  timeline().to('.orion__tail', {
    delay: random(2, 6),
    duration: random(0.25, 2),
    rotate: random(0, 10),
    onComplete: () => WAG(),
  })
}
WAG()

const BLINK = () => {
  const delay = random(2, 6)
  timeline().to(['.orion__eye', '.turtle__eye'], {
    delay,
    onComplete: () => BLINK(),
    scaleY: 0.1,
    repeat: 1,
    yoyo: true,
    duration: 0.05,
  })
}
BLINK()

OBJECTS.forEach(OBJ => {
  timeline({ repeat: -1 })
    .to(OBJ, {
      duration: 2,
      ease: 'none',
      x: 80,
      delay: () => random(0, 10),
    })
    .to(
      OBJ,
      {
        opacity: 1,
        repeat: 1,
        yoyo: true,
        duration: 1,
      },
      '<'
    )
    .progress(Math.random())
})
to('.turtle__tail', {
  rotate: 10,
  duration: 0.05,
  repeat: -1,
  yoyo: true,
})
to('.turtle__flipper', {
  rotate: index => (index % 2 ? -2 : 2),
  repeat: -1,
  duration: 0.05,
  yoyo: true,
})
to('.turtle__head', {
  repeat: -1,
  duration: 2,
  ease: 'sine.inOut',
  yoyo: true,
  rotate: -5,
})

document.body.addEventListener('click', () => {
  if (ZOOM && ZOOM.progress() !== 1 && ZOOM.progress() !== 0) return
  if (zoomed && ZOOM) ZOOM.reverse()
  else {
    ZOOM = getZoom()
    ZOOM.play()
  }
})

// On Resize, reset to non-zoomed for ease.
window.addEventListener('resize', RESET)
