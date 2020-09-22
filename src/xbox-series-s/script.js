// Purely for debugging purposes
// const {
//   dat: { GUI },
// } = window

// const CONTROLLER = new GUI()
// const CONFIG = {
//   'rotate-x': -24,
//   'rotate-y': -40,
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

const STARTUP = new Audio(
  'https://assets.codepen.io/605876/xbox-series-startup.mp3'
)

const XBOX = document.querySelector('.xbox')
const POWER = document.querySelector('.xbox__power')
let POWERED = false
POWER.addEventListener('click', () => {
  POWERED = !POWERED
  if (POWERED) {
    STARTUP.play()
  } else {
    STARTUP.pause()
    STARTUP.currentTime = 0
  }
  document.documentElement.style.setProperty('--power', POWERED ? 1 : 0)
  XBOX.classList.toggle('xbox--on')
})
