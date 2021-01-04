import gsap from 'https://cdn.skypack.dev/gsap'

const BOUNDS = 40
const UPDATE = ({ x: pointerX, y: pointerY }) => {
  const x = gsap.utils.mapRange(0, window.innerWidth, -BOUNDS, BOUNDS, pointerX)
  const y = gsap.utils.mapRange(
    0,
    window.innerHeight,
    BOUNDS,
    -BOUNDS,
    pointerY
  )
  gsap.set(document.documentElement, { '--x': x, '--y': y })
}

window.addEventListener('pointermove', UPDATE)
