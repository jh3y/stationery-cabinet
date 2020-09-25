// Purely for debugging purposes
const {
  dat: { GUI },
} = window

const CONTROLLER = new GUI()
const CONFIG = {
  'rotate-x': -20,
  'rotate-y': -45,
  dark: false,
  zoomed: false,
  spin: false,
}
const UPDATE = () => {
  Object.entries(CONFIG).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value)
  })
  document.documentElement.style.setProperty('--dark', CONFIG.dark ? 1 : 0)
  document.documentElement.style.setProperty('--zoomed', CONFIG.zoomed ? 1 : 0)
  document.documentElement.style.setProperty('--spin', CONFIG.spin ? 1 : 0)
}
const PLANE_FOLDER = CONTROLLER.addFolder('Plane')
PLANE_FOLDER.add(CONFIG, 'rotate-x', -360, 360, 1)
  .name('Rotate X (deg)')
  .onChange(UPDATE)
PLANE_FOLDER.add(CONFIG, 'rotate-y', -360, 360, 1)
  .name('Rotate Y (deg)')
  .onChange(UPDATE)

const ACTIONS_FOLDER = CONTROLLER.addFolder('Actions')
ACTIONS_FOLDER.add(CONFIG, 'dark')
  .name('Dark mode?')
  .onChange(UPDATE)
ACTIONS_FOLDER.add(CONFIG, 'zoomed')
  .name('Zoom?')
  .onChange(UPDATE)
ACTIONS_FOLDER.add(CONFIG, 'spin')
  .name('Spin?')
  .onChange(UPDATE)
UPDATE()
