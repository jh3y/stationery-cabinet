import gsap from 'https://cdn.skypack.dev/gsap'
let FIRING = false
const BOUNDS = 50
document.addEventListener('pointermove', ({ x, y }) => {
  const newX = gsap.utils.mapRange(0, window.innerWidth, -BOUNDS, BOUNDS, x)
  const newY = gsap.utils.mapRange(0, window.innerHeight, BOUNDS, -BOUNDS, y)
  gsap.set(document.documentElement, {
    '--rotate-x': newY,
    '--rotate-y': newX,
  })
})
const LEFT_LAUNCHER = document.querySelector('.helicopter__launcher--left')
const RIGHT_LAUNCHER = document.querySelector('.helicopter__launcher--right')

gsap.ticker.add((time, deltaTime, frame) => {
  if (FIRING) {
    const AMMO = document.createElement('div')
    AMMO.innerHTML = `
      <div class="cuboid cuboid--ammo">
        <div class="cuboid__side"></div>
        <div class="cuboid__side"></div>
        <div class="cuboid__side"></div>
        <div class="cuboid__side"></div>
        <div class="cuboid__side"></div>
        <div class="cuboid__side"></div>
      </div>
    `
    AMMO.className = 'helicopter__ammo'
    AMMO.style.setProperty('--hue', Math.random() * 360)
    if (frame % 2 === 0) LEFT_LAUNCHER.appendChild(AMMO)
    else RIGHT_LAUNCHER.appendChild(AMMO)

    gsap.to(AMMO, {
      xPercent: () => gsap.utils.random(-3000, -2000),
      // duration: 0.2,
      onComplete: () => AMMO.remove(),
    })
  }
})

gsap.ticker.fps(24)

document.addEventListener('pointerdown', () => {
  FIRING = true
})
document.addEventListener('pointerup', () => {
  FIRING = false
})

// Purely for debugging purposes
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
