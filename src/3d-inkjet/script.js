import gsap from 'https://cdn.skypack.dev/gsap'
const PRINTER = document.querySelector('.printer')

const AUDIO = new Audio('https://assets.codepen.io/605876/print.mp3')
const BOUNDS = 30

const UPDATE = ({ x, y }) => {
  const newX = gsap.utils.mapRange(0, window.innerWidth, -BOUNDS, BOUNDS, x)
  const newY = gsap.utils.mapRange(0, window.innerHeight, BOUNDS, -BOUNDS, y)
  gsap.set(document.documentElement, {
    '--rotate-x': newY,
    '--rotate-y': newX,
  })
}

document.addEventListener('pointermove', UPDATE)

let printing = false
const BUTTON = document.querySelector('.print-button')
BUTTON.addEventListener('click', e => {
  if (printing) return
  printing = true
  setTimeout(() => AUDIO.play(), 1000)
  PRINTER.classList.add('printing')
  setTimeout(() => {
    printing = false
    PRINTER.classList.remove('printing')
  }, 4500)
})

// // Purely for debugging purposes
// import { GUI } from 'https://cdn.skypack.dev/dat.gui'
// const CONTROLLER = new GUI()
// const CONFIG = {
//   'rotate-x': -360,
//   'rotate-y': -360,
// }
// const UPDATE = () => {
//   Object.entries(CONFIG).forEach(([key, value]) => {
//     document.documentElement.style.setProperty(`--${key}`, value)
//   })
// }
// const PLANE_FOLDER = CONTROLLER.addFolder('Plane')
// PLANE_FOLDER.add(CONFIG, 'rotate-x', -360, 360, 1)
//   .name('Rotate X (deg)')
//   .onChange(UPDATE)
// PLANE_FOLDER.add(CONFIG, 'rotate-y', -360, 360, 1)
//   .name('Rotate Y (deg)')
//   .onChange(UPDATE)
// UPDATE()
