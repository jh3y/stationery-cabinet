const {
  gsap: { timeline, set },
  d3,
} = window
// UTIL FUNCTION
const randomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

// CONFIG VARS
// graph config
const NUM_POINTS = 20
const DOMAIN = [0, 50]
// animation config
const BUBBLE_SPEED = 0.5
const SPEED = 1
// ELEMENTS
// const TRAIN = document.querySelector('.train')
const SOUND_TOGGLE = document.querySelector('.sound-toggle')
const SCENE = document.querySelector('.scene')
const LOLLIPOP = document.querySelector('.train__lollipop')
const LOLLIPOP_CONTAINER = document.querySelector('.train__lollipop-container')
const BUBBLES_RECT = document.querySelectorAll('.bubbles rect')
const BUBBLES = [
  ...document.querySelectorAll('.bubbles circle'),
  ...BUBBLES_RECT,
]
const BUBBLE_CONTAINERS = [...document.querySelectorAll('.bubble')]
const EYES = document.querySelector('.face__eyes')
const MOUTHS = document.querySelectorAll('.face__mouth')
// ANIMATION CODE RELATED TO TRAIN
// set things in GSAP
set(BUBBLES, { transformOrigin: '50% 50%' })
set(BUBBLES_RECT, { transformOrigin: '75% 100%' })
set(BUBBLE_CONTAINERS, { y: '-=20' })
set(LOLLIPOP_CONTAINER, { transformOrigin: '15% 50%' })
set(LOLLIPOP, { transformOrigin: '0% 50%' })
set('.train__wheel', { transformOrigin: '50% 50%' })
// Lollipop timeline for the bar moving across the wheels
new timeline()
  .to(LOLLIPOP_CONTAINER, {
    repeat: -1,
    rotate: 360,
    duration: SPEED,
    ease: 'none',
  })
  .to(LOLLIPOP, { repeat: -1, rotate: -360, duration: SPEED, ease: 'none' }, 0)
// Set all the bubbles up
for (const BUBBLE of BUBBLES) {
  timeline({ delay: Math.random() * -10, repeat: -1 })
    .to(
      BUBBLE,
      {
        duration: BUBBLE_SPEED,
        scale: 'random(2, 8)',
        y: () => `-=${Math.random() * 80 + 150}`,
      },
      0
    )
    .to(
      BUBBLE,
      {
        duration: BUBBLE_SPEED * 0.7,
        opacity: 0,
      },
      0
    )
    .to(
      BUBBLE,
      {
        duration: BUBBLE_SPEED,
        x: -800,
      },
      BUBBLE_SPEED / 4
    )
}
// Wheel Timeline
new timeline().to('.train__wheel', {
  duration: (index, target) =>
    target.classList.contains('wheel--big') ? SPEED : SPEED / 2,
  repeat: -1,
  ease: 'none',
  rotate: 360,
})
// FACE BLINKING ETC.
const blink = () => {
  set(EYES, { scaleY: 1 })
  if (EYES.BLINK_TL) EYES.BLINK_TL.kill()
  EYES.BLINK_TL = new timeline({
    delay: Math.floor(Math.random() * 4) + 1,
    onComplete: () => blink(EYES),
  }).to(EYES, {
    duration: 0.05,
    transformOrigin: '50% 50%',
    scaleY: 0,
    yoyo: true,
    repeat: 1,
  })
}
let FACE_SWAP
const swapFace = () => {
  set(MOUTHS, { display: 'none' })
  set(MOUTHS[Math.floor(Math.random() * MOUTHS.length)], {
    display: 'block',
  })
  if (FACE_SWAP) clearTimeout(FACE_SWAP)
  FACE_SWAP = setTimeout(() => swapFace(), Math.random() * 6000 + 1000)
}
// Initiates the blink here
blink()
// Initiates the face swap
swapFace()

// D3 GRAPH GEN STUFF
const angleScale = d3
  .scaleLinear()
  .domain(DOMAIN)
  .range([0, 2 * Math.PI])

const generateStaticPoints = () => {
  const POINTS = []
  /**
   * How about we always have the same number of POINTS? But if we want to skip one, we duplicate?
   * We know the number of points and the domain. So we can calculate a step point at which it should be used right?
   *  */
  const STEP = DOMAIN[1] / NUM_POINTS
  for (let p = 0; p < NUM_POINTS; p++) {
    POINTS.push([p * STEP, randomInRange(...DOMAIN)])
  }
  return POINTS
}

let POINTS
const generatePoints = () => {
  POINTS = generateStaticPoints()
}
const generateScene = () => {
  const { height: SIZE } = document
    .querySelector('svg.globe')
    .getBoundingClientRect()
  const radiusScale = d3
    .scaleLinear()
    .domain(DOMAIN)
    .range([SIZE / 4, SIZE / 2])
  const LINE = d3.lineRadial().curve(d3.curveBasisClosed)(
    POINTS.map(POINT => [angleScale(POINT[0]), radiusScale(POINT[1])])
  )
  d3.select('svg.globe')
    .attr('viewBox', `0 0 ${SIZE} ${SIZE}`)
    .attr('height', SIZE)
    .attr('width', SIZE)
  d3.select('svg.globe path')
    .attr('d', `${LINE}`)
    .attr('transform', `translate(${SIZE / 2}, ${SIZE / 2})`)
  SCENE.style.setProperty('--path', `"${LINE}"`)
}
const generate = () => {
  generatePoints()
  generateScene()
}
generate()
// Don't transition the first generation
setTimeout(() => SCENE.style.setProperty('--transition-speed', 0.25), 250)
document.body.addEventListener('click', () => {
  generate()
})
window.addEventListener('resize', generateScene)

// Horn noise courtesy of eliasheuninck on freesound.org : https://freesound.org/people/eliasheuninck/sounds/170464/
const BLAST = new Audio(
  'https://freesound.org/data/previews/170/170464_1407-lq.mp3'
)
// Chug noise courtest of gadzooks on freesound.org: https://freesound.org/people/gadzooks/sounds/39413/
const CHUG = new Audio(
  'https://freesound.org/data/previews/39/39413_44431-lq.mp3'
)
CHUG.loop = true
CHUG.volume = 0.25
let tooting
const toot = () => {
  BLAST.play()
  tooting = setTimeout(toot, Math.random() * 6000 + 2000)
}
SOUND_TOGGLE.addEventListener('click', e => {
  e.stopPropagation()
  SOUND_TOGGLE.classList.toggle('sound-toggle--active')
  if (SOUND_TOGGLE.classList.contains('sound-toggle--active')) {
    CHUG.play()
    toot()
  } else {
    CHUG.pause()
    BLAST.pause()
    if (tooting) clearTimeout(tooting)
  }
})
