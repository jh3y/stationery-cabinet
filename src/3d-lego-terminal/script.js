// Purely for debugging purposes
const {
  dat: { GUI },
} = window

const CONTROLLER = new GUI()
const CONFIG = {
  'rotate-x': -24,
  'rotate-y': -40,
  wireframe: false,
  rotate: true,
}
const UPDATE = () => {
  Object.entries(CONFIG).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value)
  })
  document.documentElement.style.setProperty(
    `--wireframe`,
    CONFIG.wireframe ? 1 : 0
  )
  document.documentElement.style.setProperty(`--rotate`, CONFIG.rotate ? 1 : 0)
}
const PLANE_FOLDER = CONTROLLER.addFolder('Plane')
PLANE_FOLDER.add(CONFIG, 'rotate-x', -360, 360, 1)
  .name('Rotate X (deg)')
  .onChange(UPDATE)
PLANE_FOLDER.add(CONFIG, 'rotate-y', -360, 360, 1)
  .name('Rotate Y (deg)')
  .onChange(UPDATE)
CONTROLLER.add(CONFIG, 'wireframe')
  .name('Show wireframe')
  .onChange(UPDATE)
CONTROLLER.add(CONFIG, 'rotate')
  .name('Rotate face')
  .onChange(UPDATE)
UPDATE()
