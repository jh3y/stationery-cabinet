const {
  gsap: {
    set,
    to,
    timeline,
    registerPlugin,
    utils: { mapRange, clamp, random },
  },
  Draggable,
  InertiaPlugin,
} = window

registerPlugin(InertiaPlugin)

let shakeReset
let comparator
let INERT_COUNT = 0
let toggleTimeout
let humInterval
let SHAKING = false
const SABER = document.querySelector('.lightsaber')
const SABER_DRAG = document.querySelector('.lightsaber__drag')
const BOUNDS = 800
const SHAKE_BOUND = 200
const ROTATE = 35
const SHAKE_THRESHOLD = 6
const SHAKE_TIMEOUT = 500
const AUDIO = {
  HUM: new Audio('https://assets.codepen.io/605876/lightsaber-hum.mp3'),
  ON: new Audio('https://assets.codepen.io/605876/lightsaber-on.mp3'),
  OFF: new Audio('https://assets.codepen.io/605876/lightsaber-off.mp3'),
  ON_TWO: new Audio('https://assets.codepen.io/605876/lightsaber-on--two.mp3'),
  SPIN: new Audio('https://assets.codepen.io/605876/lightsaber-spin.mp3'),
  SWING_ONE: new Audio(
    'https://assets.codepen.io/605876/lightsaber-swing--one.mp3'
  ),
  SWING_TWO: new Audio(
    'https://assets.codepen.io/605876/lightsaber-swing--two.mp3'
  ),
}
const STATE = {
  ON: false,
}

set('.saber__beam', {
  scaleY: 0,
  transformOrigin: '50% 99%',
})

set(SABER_DRAG, {
  transformOrigin: '50% 500%',
})

const toggleBeam = () => {
  STATE.ON = !STATE.ON
  if (STATE.ON) {
    to('.saber__beam', {
      scaleY: 1,
      duration: 0.1,
      onStart: () => {
        AUDIO[`ON${Math.random() > 0.5 ? '_TWO' : ''}`].play()
        AUDIO.OFF.pause()
        AUDIO.OFF.currentTime = 0
      },
      onComplete: () => {
        PULSE.play()
        humInterval = setInterval(() => {
          AUDIO.HUM.play()
        }, random(3000, 10000))
      },
    })
  } else {
    clearInterval(humInterval)
    to('.saber__beam', {
      scaleY: 0,
      duration: 0.1,
      onStart: () => {
        AUDIO.OFF.play()
        AUDIO.ON.pause()
        AUDIO.ON.currentTime = 0
      },
      onComplete: () => {
        PULSE.pause()
      },
    })
  }
}

const TWIRL = () => {
  timeline({
    onStart: () => {
      AUDIO.SPIN.play()
    },
  })
    .to(SABER, {
      rotate: `${Math.random() > 0.5 ? '+' : '-'}=360`,
    })
    .to(
      SABER_DRAG,
      {
        yPercent: 150,
        yoyo: true,
        repeat: 1,
        duration: 0.25,
      },
      '<'
    )
}

let prevent = false

SABER_DRAG.addEventListener('click', () => {
  toggleTimeout = setTimeout(() => {
    if (!prevent) {
      toggleBeam()
    }
    prevent = false
  }, 200)
})
SABER_DRAG.addEventListener('dblclick', () => {
  clearTimeout(toggleTimeout)
  prevent = true
  if (STATE.ON) TWIRL()
})

const PULSE = to('.beam__bleed', {
  paused: true,
  scaleX: 1.075,
  scaleY: 1.005,
  repeat: -1,
  duration: 0.1,
  transformOrigin: '50% 50%',
  yoyo: true,
})

Draggable.create(SABER_DRAG, {
  type: 'x,y',
  trigger: SABER_DRAG,
  inertia: true,
  bounds: document.body,
  dragResistance: 0.25,
  onDrag: function() {
    clearInterval(humInterval)
    set(SABER_DRAG, {
      x: this.x,
      y: this.y,
    })
    const INE_X = InertiaPlugin.getVelocity(SABER_DRAG, 'x')
    const MOM_X = clamp(-BOUNDS, BOUNDS, INE_X)
    const rotation = mapRange(-BOUNDS, BOUNDS, ROTATE, -ROTATE, MOM_X)

    // on Drag I have the Inertia and I can play either swing one or two based on the direction?

    if (INE_X > BOUNDS && STATE.ON) {
      AUDIO.SWING_ONE.play()
    } else if (INE_X < -BOUNDS && STATE.ON) {
      AUDIO.SWING_TWO.play()
    }

    to(SABER_DRAG, {
      rotation,
      duration: 0.25,
    })

    if (
      ((INE_X < -SHAKE_BOUND || INE_X > SHAKE_BOUND) && !SHAKING) ||
      (SHAKING && comparator(INE_X))
    ) {
      SHAKING = true
      INERT_COUNT += 1
      // Need to create a way of mapping the opposite
      if (INE_X < -SHAKE_BOUND) {
        // The next value must be INE_X > SHAKE_BOUND
        // Create a function
        comparator = val => val > SHAKE_BOUND
      } else {
        comparator = val => val < -SHAKE_BOUND
      }

      if (shakeReset) clearTimeout(shakeReset)
      shakeReset = setTimeout(() => {
        INERT_COUNT = 0
        SHAKING = false
        shakeReset = null
      }, SHAKE_TIMEOUT)
    }
  },
  onDragEnd: () => {
    if (INERT_COUNT > SHAKE_THRESHOLD && STATE.ON) {
      timeline({
        onComplete: () => {
          document.documentElement.style.setProperty(
            '--beam-hue',
            random(0, 359)
          )
          to(SABER, {
            rotation: 0,
            duration: 0.25,
          })
        },
      }).fromTo(
        SABER,
        {
          rotation: -5,
        },
        {
          rotation: 5,
          duration: 0.05,
          repeat: 2,
          yoyo: true,
        }
      )
    }

    if (STATE.ON) {
      humInterval = setInterval(() => {
        AUDIO.HUM.play()
      }, random(3000, 10000))
    }

    to(SABER_DRAG, {
      duration: 0.25,
      rotation: 0,
    })
  },
})


set('.svg-saber', {
  display: 'block'
})