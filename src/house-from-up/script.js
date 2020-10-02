// Purely for debugging purposes
const {
  dat: { GUI },
} = window

const CONTROLLER = new GUI()
const CONFIG = {
  'rotate-y': -55,
}
const UPDATE = () => {
  Object.entries(CONFIG).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value)
  })
}
const PLANE_FOLDER = CONTROLLER.addFolder('Plane')
PLANE_FOLDER.add(CONFIG, 'rotate-y', -360, 360, 1)
  .name('Rotate Y (deg)')
  .onChange(UPDATE)
UPDATE()
