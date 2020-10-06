// Purely for debugging purposes
const {
  dat: { GUI },
} = window

const CONTROLLER = new GUI()
const CONFIG = {
  'rotate-x': 0,
  'rotate-y': 0,
  center: false,
  animate: false,
  show: false,
}
const UPDATE = () => {
  Object.entries(CONFIG).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value)
  })
  document.documentElement.style.setProperty('--show', CONFIG.show ? 1 : 0)
  document.documentElement.style.setProperty(
    '--animate',
    CONFIG.animate ? 1 : 0
  )
  document.documentElement.style.setProperty('--center', CONFIG.center ? 1 : 0)
}
const PLANE_FOLDER = CONTROLLER.addFolder('Plane')
PLANE_FOLDER.add(CONFIG, 'rotate-x', -360, 360, 1)
  .name('Rotate X (deg)')
  .onChange(UPDATE)
PLANE_FOLDER.add(CONFIG, 'rotate-y', -360, 360, 1)
  .name('Rotate Y (deg)')
  .onChange(UPDATE)

CONTROLLER.add(CONFIG, 'show')
  .name('Show center')
  .onChange(UPDATE)
CONTROLLER.add(CONFIG, 'animate')
  .name('Animate slice')
  .onChange(UPDATE)
CONTROLLER.add(CONFIG, 'center')
  .name('Offset center')
  .onChange(UPDATE)
UPDATE()
