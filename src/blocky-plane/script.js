import gsap from 'https://cdn.skypack.dev/gsap'

const BOUNDS = 50
document.addEventListener('pointermove', ({ x, y }) => {
  const newX = gsap.utils.mapRange(0, window.innerWidth, -BOUNDS, BOUNDS, x)
  const newY = gsap.utils.mapRange(0, window.innerHeight, BOUNDS, -BOUNDS, y)
  gsap.set(document.documentElement, {
    '--rotate-x': newY,
    '--rotate-y': newX,
  })
})

const CHECKER = document.querySelector('[type="checkbox"]')

CHECKER.addEventListener('input', e =>
  document.documentElement.style.setProperty('--dark', CHECKER.checked ? 1 : 0)
)
