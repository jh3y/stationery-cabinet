const {
  gsap: { to, set, timeline },
} = window
const randomInRange = (min, max) => Math.random() * (max - min) + min
const BUTTON = document.querySelector('button')
const X_BOUND = 60
const Y_BOUND = 80
const duration = 'random(1, 10, 0.1)'
const ease = 'sine.inOut'
const FIREFLIES = [...document.querySelectorAll('.firefly')]
const MOUTHS = [...document.querySelectorAll('.face__mouth')]
set(FIREFLIES, { transformOrigin: '50% 50%' })

const swarm = () => {
  const TL = new timeline()
  for (const fly of FIREFLIES) {
    const delay = Math.random() * 3
    const FLY_TL = new timeline()
    const y = randomInRange(-Y_BOUND, Y_BOUND)
    const x = randomInRange(-X_BOUND, X_BOUND)
    set(fly, { y, x })
    FLY_TL.to(
      fly,
      {
        duration,
        x: `random(${-x}, ${x})`,
        repeatRefresh: true,
        ease,
        repeat: -1,
        yoyo: true,
      },
      0
    )
    FLY_TL.to(
      fly,
      {
        duration,
        ease,
        y: `random(${-y}, ${y})`,
        repeatRefresh: true,
        repeat: -1,
        yoyo: true,
      },
      0
    )
    TL.add(FLY_TL, delay)
  }
  TL.time(6)
}

let BLINK_TL
const blink = () => {
  BLINK_TL = new timeline({
    delay: randomInRange(1, 5),
    onComplete: blink,
  })
  BLINK_TL.to('.face__eyes', {
    duration: 0.05,
    transformOrigin: '50% 50%',
    scaleY: 0,
    yoyo: true,
    repeat: 1,
  })
}

const LIGHTS = to(document.documentElement, {
  '--lightness': 80,
  '--shadow-opacity': 0.6,
  '--shadow-lightness': 15,
  '--shadow-saturation': 0,
  '--glow-opacity': 0,
  '--blur': 0,
  '--spread': 40,
  '--shine': 1,
  '--glow': 0,
  '--lid-lightness': 65,
  '--cheeky': 1,
  '--tongue': 1,
  '--fly-saturation': 0,
  '--fly-lightness': 35,
  duration: 0.1,
  paused: true,
})
BUTTON.addEventListener('click', () => {
  if (LIGHTS.progress() > 0 && !LIGHTS.reversed()) {
    LIGHTS.reverse()
  } else {
    LIGHTS.play()
  }
})
const swapFace = () => {
  set(MOUTHS, { display: 'none' })
  set(MOUTHS[Math.floor(Math.random() * MOUTHS.length)], { display: 'block' })
  setTimeout(swapFace, randomInRange(1000, 5000))
}
swapFace()
blink()
swarm()

const keys = [] // PARTY
let PARTY
const PARTY_MODE = () =>
  to(document.documentElement, {
    '--fly-hue': 360,
    repeat: randomInRange(1, 10),
    ease: 'Power0.easeNone',
    duration: 'random(0.1, 1, 0.1)',
    onComplete: () => {
      set(document.documentElement, { '--fly-hue': 65 })
    },
  })

// Yeah, that's it...

// Why are you still going?

// You wouldn't want to party would you?

// No, stop, honestly, this party isn't even that cool!

const shouldWeParty = e => {
  keys.push(e.key)
  if (
    keys
      .slice(keys.length - 5, keys.length)
      .join('')
      .toLowerCase() === 'party' &&
    LIGHTS.progress() === 0 &&
    (!PARTY || (PARTY && (PARTY.progress() === 0 || PARTY.progress() === 1)))
  ) {
    // Let's party
    keys.length = 0
    PARTY = PARTY_MODE()
  }
}
window.addEventListener('keyup', shouldWeParty)
