const {
  gsap: { timeline, set },
} = window

const LOLLIPOP = document.querySelector('.train__lollipop')
const LOLLIPOP_CONTAINER = document.querySelector('.train__lollipop-container')
const BUBBLES_RECT = document.querySelectorAll('.bubbles rect')
const BUBBLES = [
  ...document.querySelectorAll('.bubbles circle'),
  ...BUBBLES_RECT,
]
const BUBBLE_CONTAINERS = [...document.querySelectorAll('.bubble')]
// new timeline()

const SPEED = 0.25
set(BUBBLES, { transformOrigin: '50% 50%' })
set(BUBBLES_RECT, { transformOrigin: '75% 100%' })
set(BUBBLE_CONTAINERS, { y: '-=20' })
set(LOLLIPOP_CONTAINER, { transformOrigin: '15% 50%' })
set(LOLLIPOP, { transformOrigin: '0% 50%' })
new timeline()
  .to(LOLLIPOP_CONTAINER, {
    repeat: -1,
    rotate: 360,
    duration: SPEED,
    ease: 'none',
  })
  .to(LOLLIPOP, { repeat: -1, rotate: -360, duration: SPEED, ease: 'none' }, 0)

const BUBBLE_SPEED = 0.5
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

// .to(LOLLIPOP, {
//   duration: 1,
//   repeat: -1,
//   x: '+=50',
//   yoyo: true,
//   ease: 'none',
// })
// .to(
//   LOLLIPOP_CONTAINER,
//   {
//     repeat: -1,
//     yoyo: true,
//     ease: 'none',
//     duration: 0.5,
//     y: '+=100',
//   },
//   0
// )
// const { d3 } = window
// const BUTTON = document.querySelector('button')

// const randomInRange = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1)) + min

// const TRAIN = document.querySelector('.train')
// const DOMAIN = [0, 10]
// const NUM_POINTS = 10
// const PADDING = 10
// const MIN_SIZE = 300
// const MIN_RADIUS = MIN_SIZE / 3
// const angleScale = d3
//   .scaleLinear()
//   .domain(DOMAIN)
//   .range([0, 2 * Math.PI])

// const generateStaticPoints = () => {
//   const POINTS = []
//   /**
//    * How about we always have the same number of POINTS? But if we want to skip one, we duplicate?
//    * We know the number of points and the domain. So we can calculate a step point at which it should be used right?
//    *  */
//   const STEP = DOMAIN[1] / NUM_POINTS
//   for (let p = 0; p < NUM_POINTS; p++) {
//     const X = randomInRange(p * STEP, p + 1 * STEP)
//     POINTS.push([X, Math.random() * 10])
//   }
//   return POINTS
// }

// let POINTS
// const generatePoints = () => {
//   POINTS = generateStaticPoints()
// }

// const generateScene = () => {
//   const { height } = document.querySelector('svg').getBoundingClientRect()
//   const SIZE = Math.max(MIN_SIZE, height)
//   const radiusScale = d3
//     .scaleLinear()
//     .domain(DOMAIN)
//     .range([MIN_RADIUS, Math.max(MIN_SIZE, height) / 2 - PADDING])
//   const LINE = d3.lineRadial().curve(d3.curveBasisClosed)(
//     POINTS.map(POINT => [angleScale(POINT[0]), radiusScale(POINT[1])])
//   )
//   d3.select('svg')
//     .attr('viewBox', `0 0 ${SIZE} ${SIZE}`)
//     .attr('height', SIZE)
//     .attr('width', SIZE)
//   d3.select('path')
//     .attr('d', `${LINE}`)
//     .attr('transform', `translate(${SIZE / 2}, ${SIZE / 2})`)
//   TRAIN.style.setProperty('--path', `"${LINE}"`)
// }
// const generate = () => {
//   generatePoints()
//   generateScene()
// }
// generate()
// BUTTON.addEventListener('click', generate)
// window.addEventListener('resize', generateScene)
