import gsap from 'https://cdn.skypack.dev/gsap'

const { InertiaPlugin } = window

gsap.registerPlugin(Draggable)
gsap.registerPlugin(InertiaPlugin)

const friction = -0.5
const CONTAINER = document.querySelector('.slider')
const PROXY = document.querySelector('.slider__proxy')
const LABEL = document.querySelector('.slider__label')
const INPUT = document.querySelector('input')
const VALUE_TOGGLE = document.querySelector('button')
const PROXY_PROPS = gsap.getProperty(PROXY)
const TRACKER = InertiaPlugin.track(PROXY, 'x,y')[0]
const BUMP = 10

const KNOCK = new Audio('https://assets.codepen.io/605876/pinball-knock.mp3')

let animateBounce

gsap.defaults({
  overwrite: true,
})

const syncInput = e => {
  const range = PROXY_PROPS('x')
  const width = CONTAINER.getBoundingClientRect().width
  const radius = PROXY.getBoundingClientRect().width / 2
  const min = INPUT.min
  const max = INPUT.max
  const value =
    e && e.type === 'change'
      ? e.target.value
      : Math.floor(gsap.utils.mapRange(radius, width - radius, min, max, range))

  if (!isNaN(value)) {
    gsap.set(INPUT, { value })
    gsap.set(LABEL, { innerText: value })
    if (e && e.type === 'change')
      gsap.set(PROXY, {
        x: gsap.utils.mapRange(min, max, radius, width - radius, value),
      })
  }
}
let bumping
const bumpContainer = coeff => {
  if (bumping !== false && coeff === bumping) return
  bumping = coeff
  const vx = TRACKER.get('x')
  const xPercent =
    gsap.utils.clamp(
      0,
      BUMP,
      gsap.utils.mapRange(0, 1000, 0, BUMP, Math.abs(vx)),
    ) * coeff
  const duration = gsap.utils.clamp(
    0.05,
    0.2,
    gsap.utils.mapRange(0, 1000, 0.2, 0.05, Math.abs(vx)),
  )
  // const xPercent = BUMP * coeff
  gsap.to(CONTAINER, {
    onStart: () => {
      KNOCK.pause()
      KNOCK.currentTime = 0
      KNOCK.play()
    },
    onComplete: () => {
      bumping = false
    },
    xPercent,
    yoyo: true,
    repeat: 1,
    duration,
  })
}

INPUT.addEventListener('change', syncInput, false)
VALUE_TOGGLE.addEventListener('click', () => {
  gsap.killTweensOf([PROXY, CONTAINER])
  const PRESSED =
    VALUE_TOGGLE.getAttribute('aria-pressed') === 'false' ? 'true' : 'false'
  VALUE_TOGGLE.setAttribute('aria-pressed', PRESSED)
  gsap.set(LABEL, {
    '--opacity': PRESSED === 'true' ? 1 : 0,
  })
})

function checkBounds() {
  const radius = PROXY.getBoundingClientRect().width / 2
  let r = radius
  let x = PROXY_PROPS('x')
  let vx = TRACKER.get('x')
  let xPos = x

  let hitting = false

  syncInput()

  if (x + r > CONTAINER.getBoundingClientRect().width) {
    xPos = CONTAINER.getBoundingClientRect().width - r
    vx *= friction
    bumpContainer(1)
    hitting = true
  } else if (x - r < 0) {
    xPos = r
    vx *= friction
    bumpContainer(-1)
    hitting = true
  }

  if (hitting) {
    animateBounce(xPos, vx)
  }
}

animateBounce = (x = '+=0', vx = 'auto') => {
  gsap.fromTo(
    PROXY,
    { x },
    {
      inertia: {
        x: vx,
      },
      onUpdate: checkBounds,
    }
  )
}

const dragHandle = new Draggable(PROXY, {
  bounds: CONTAINER,
  type: 'x',
  onPress: () => {
    gsap.killTweensOf(PROXY)
    dragHandle.update()
  },
  onDragEndParams: [],
  onDragEnd: animateBounce,
  onDrag: syncInput,
})
