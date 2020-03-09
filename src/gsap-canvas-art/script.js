const { gsap } = window

const CANVAS = document.querySelector('canvas')
const CONTEXT = CANVAS.getContext('2d')
const BUTTON = document.querySelector('button')
const randomInRange = (min, max) =>
  Math.floor(Math.random() * max - min + 1) + min
let STATE = {
  X: 50,
  Y: 50,
  DRAWING: false,
}

let CHARACTER = {}

const draw = () => {
  if (STATE.DRAWING) {
    if (Math.random() > 0) {
      CONTEXT.save()
      const { height: size } = CANVAS.getBoundingClientRect()
      let h
      let s
      let l
      if (CHARACTER.COLOR[1] === true || CHARACTER.COLOR[2] === true) {
        h = CHARACTER.HUE
        s =
          CHARACTER.COLOR[1] === true
            ? Math.random() * 100
            : CHARACTER.SATURATION
        l =
          CHARACTER.COLOR[2] === true
            ? Math.random() * 100
            : CHARACTER.SATURATION
      } else {
        h = randomInRange(CHARACTER.HUE_RANGE[0], CHARACTER.HUE_RANGE[1])
        s = CHARACTER.SATURATION
        l = CHARACTER.LIGHTNESS
      }
      CONTEXT.beginPath()
      CONTEXT.fillStyle =
        CHARACTER.STROKE === true ? 'transparent' : `hsl(${h}, ${s}%, ${l}%)`
      CONTEXT.strokeStyle = `hsl(${h}, ${s}%, ${l}%)`
      const HEIGHT = Math.max(size * 0.1, Math.random() * size * 0.5)
      const WIDTH = Math.max(size * 0.1, Math.random() * size * 0.5)
      if (CHARACTER.TRANSLATING === true && CHARACTER.ROTATING === true)
        CONTEXT.translate(STATE.X + HEIGHT / 2, STATE.Y + WIDTH / 2)
      if (CHARACTER.ROTATING === true)
        CONTEXT.rotate(Math.random() * 360 * (Math.PI / 180))
      if (CHARACTER.TRANSLATING === true && CHARACTER.ROTATING === true)
        CONTEXT.rect(-HEIGHT / 2, -WIDTH / 2, HEIGHT, WIDTH)
      else CONTEXT.rect(STATE.X, STATE.Y, HEIGHT, WIDTH)
      CONTEXT.fill()
      if (CHARACTER.STROKE === true) CONTEXT.stroke()
      CONTEXT.restore()
    }
    requestAnimationFrame(draw)
  }
}

const onDrawStart = () => {
  const { height: size } = CANVAS.getBoundingClientRect()
  CANVAS.height = size
  CANVAS.width = size
  // This is where we can define drawing characteristics for the next piece
  // Should we play with lightness, saturation, or hue?
  const HUE_LOWER = randomInRange(0, 360)
  const HUE_HIGHER = randomInRange(HUE_LOWER, 360)
  const newCharacter = {
    COLOR: new Array(3).fill().map(() => Math.random() > 0.5),
    // Ignored if we are playing with lightness/saturation
    HUE: Math.random() * 360,
    SATURATION: Math.random() * 100,
    LIGHTNESS: Math.random() * 100,
    HUE_RANGE: Math.random() > 0.5 ? [0, 360] : [HUE_LOWER, HUE_HIGHER],
    STROKE: Math.random() > 0.75,
    TRANSLATING: Math.random() > 0.5,
    ROTATING: Math.random() > 0.5,
  }
  CHARACTER = newCharacter
  STATE.DRAWING = true
  draw()
}

const onComplete = () => {
  const { height: size } = CANVAS.getBoundingClientRect()
  STATE = {
    X: 0,
    Y: Math.random() * size,
    DRAWING: false,
  }
}

const start = () => {
  const { height: size } = CANVAS.getBoundingClientRect()
  gsap
    .timeline()
    .add(
      gsap
        .timeline({
          onComplete: onDrawStart,
        })
        .add(
          gsap.to('.curtain--left', {
            duration: 0.25,
            scaleX: 1,
          })
        )
        .add(gsap.to('.curtain--right', { duration: 0.25, scaleX: 1 }), 0)
    )
    .add(
      gsap
        .timeline({ onComplete })
        .add(
          gsap.to(STATE, {
            duration: 'random(0.1, 1)',
            X: size,
          })
        )
        .add(
          gsap.to(STATE, {
            duration: 'random(0.1, 1)',
            Y: Math.random() * size,
          }),
          0
        )
    )
    .add(
      gsap
        .timeline()
        .add(
          gsap.to('.curtain--left', {
            duration: 0.25,
            scaleX: 0.1,
          })
        )
        .add(gsap.to('.curtain--right', { duration: 0.25, scaleX: 0.1 }), 0)
    )
  // draw()
}

BUTTON.addEventListener('click', () => {
  if (!STATE.DRAWING) start()
})

start()
