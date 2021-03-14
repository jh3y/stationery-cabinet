import gsap from 'https://cdn.skypack.dev/gsap'

document.addEventListener('pointermove', ({ x, y }) => {
  const RX = gsap.utils.mapRange(0, window.innerWidth, -10, 10, x)
  const RY = gsap.utils.mapRange(0, window.innerHeight, -10, 10, y)
  gsap.set(document.documentElement, {
    '--rx': RX,
    '--ry': RY,
  })
})
