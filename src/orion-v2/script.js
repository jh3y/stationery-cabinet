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

const AUDIO = {
  AMBIENCE: new Audio('https://assets.codepen.io/605876/street-ambience.mp3'),
  MEW: new Audio('https://assets.codepen.io/605876/kitty-mew.mp3'),
  MEWTWO: new Audio('https://assets.codepen.io/605876/kitty-mew-2.mp3'),
  PURRING: new Audio('https://assets.codepen.io/605876/kitty-purring.mp3'),
  ROCK: new Audio(
    'https://assets.codepen.io/605876/Monplaisir-Aimer_cest_ce_quil_y_a_de_plus_beau.mp3'
  ),
}

AUDIO.ROCK.loop = AUDIO.AMBIENCE.loop = AUDIO.PURRING.loop = true
AUDIO.ROCK.volume = 0
AUDIO.ROCK.muted = AUDIO.AMBIENCE.muted = AUDIO.MEW.muted = AUDIO.MEWTWO.muted = AUDIO.PURRING.muted = true

const toggleAudio = () => {
  if (AUDIO.ROCK.currentTime === 0 || AUDIO.AMBIENCE.currentTime === 0) {
    AUDIO.ROCK.play()
    AUDIO.AMBIENCE.play()
    AUDIO.PURRING.play()
  }
  AUDIO.ROCK.muted = AUDIO.AMBIENCE.muted = AUDIO.MEW.muted = AUDIO.MEWTWO.muted = AUDIO.PURRING.muted = !AUDIO
    .PURRING.muted
}

document.querySelector('#volume').addEventListener('input', toggleAudio)

const MEW = () => {
  setTimeout(() => {
    AUDIO[Math.random() > 0.5 ? 'MEW' : 'MEWTWO'].play()
    MEW()
  }, random(1000, 20000))
}
MEW()

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
  '--hue': () => random(0, 359),
  '--lightness': () => random(30, 80),
})
set('.bear', { transformOrigin: '50% 50%', opacity: 0.75, rotate: -15 })
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
set('.logo', { opacity: 0.75 })
const SPACE_BLOBS = document.querySelectorAll('.space-blob')
set(SPACE_BLOBS[6], {
  yPercent: -25,
  scale: 1.5,
  xPercent: -25,
  transformOrigin: '50% 50%',
})

const getZoom = () =>
  timeline({
    onComplete: () => (zoomed = !zoomed),
    onReverseComplete: () => (zoomed = !zoomed),
    paused: true,
  })
    .set(ORION, {
      attr: {
        viewBox: '-200 -200 5646.15 7862.26',
      },
    })
    .to(
      ORION,
      {
        ease: 'power3.out',
        attr: {
          viewBox: '3160.446 4205.751 28.335 6.775',
        },
        duration: 2,
      },
      0
    )
    .to(
      AUDIO.ROCK,
      {
        ease: 'power3.out',
        duration: 1,
        volume: 1,
      },
      '>-1'
    )
    .to(
      [AUDIO.AMBIENCE, AUDIO.MEW, AUDIO.MEWTWO, AUDIO.PURRING],
      {
        duration: 1,
        ease: 'power3.out',
        volume: 0,
      },
      '<'
    )

const RESET = () => {
  if (ZOOM && ZOOM.progress() !== 0) {
    ZOOM.pause()
    ZOOM.time(0)
  }
  set(ORION, { attr: { viewBox: '-200 -200 5646.15 7862.26' } })
  ORION.removeAttribute('style')
  set(ORION, { opacity: 1 })
  zoomed = false
}
RESET()

// General mood timelines
const TILT = () => {
  to('.orion__head', {
    rotate: 'random(-15, 15)',
    duration: random(0.5, 2),
    delay: random(0, 2),
    onComplete: () => TILT(),
  })
}
TILT()

const WAG = () => {
  to('.orion__tail', {
    delay: random(0.5, 4),
    duration: random(0.25, 2),
    rotate: random(5, 15),
    repeat: 1,
    yoyo: true,
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
  const duration = random(1, 4)
  timeline({ repeat: -1 })
    .to(OBJ, {
      duration: duration,
      ease: 'none',
      x: 80,
      delay: () => random(0, 10),
    })
    .to(
      OBJ,
      {
        opacity: 1,
        repeat: 1,
        repeatDelay: duration - 1,
        yoyo: true,
        duration: 0.5,
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
  duration: 1.5,
  ease: 'sine.inOut',
  yoyo: true,
  rotate: -5,
})

const handleZoom = () => {
  if (ZOOM && ZOOM.progress() !== 1 && ZOOM.progress() !== 0) return
  if (zoomed && ZOOM) ZOOM.reverse()
  else {
    ZOOM = getZoom()
    ZOOM.play()
  }
}
ORION.addEventListener('click', handleZoom)
TURTLE.addEventListener('click', handleZoom)

// On Resize, reset to non-zoomed for ease.
window.addEventListener('resize', RESET)
