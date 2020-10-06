// Purely for debugging purposes
const {
  dat: { GUI },
} = window

const CONTROLLER = new GUI()
const CONFIG = {
  'rotate-x': -24,
  'rotate-y': -40,
  fade: false,
  base: false,
  'chair-x': 25,
  'chair-y': 17,
  'chair-rotate': 335,
  spin: false,
}
const UPDATE = () => {
  Object.entries(CONFIG).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value)
  })
  document.documentElement.style.setProperty('--fade', CONFIG.fade ? 1 : 0)
  document.documentElement.style.setProperty('--base', CONFIG.base ? 1 : 0)
  document.documentElement.style.setProperty('--spin', CONFIG.spin ? 1 : 0)
}
const PLANE_FOLDER = CONTROLLER.addFolder('Plane')
const CHAIR_FOLDER = CONTROLLER.addFolder('Chair')
PLANE_FOLDER.add(CONFIG, 'rotate-x', -360, 360, 1)
  .name('Rotate X (deg)')
  .onChange(UPDATE)
PLANE_FOLDER.add(CONFIG, 'rotate-y', -360, 360, 1)
  .name('Rotate Y (deg)')
  .onChange(UPDATE)
CHAIR_FOLDER.add(CONFIG, 'fade')
  .name('Fade')
  .onChange(UPDATE)
CHAIR_FOLDER.add(CONFIG, 'base')
  .name('Show base')
  .onChange(UPDATE)
CHAIR_FOLDER.add(CONFIG, 'chair-x', 0, 36, 1)
  .name('Position X')
  .onChange(UPDATE)
CHAIR_FOLDER.add(CONFIG, 'chair-y', 0, 36, 1)
  .name('Position Y')
  .onChange(UPDATE)
CHAIR_FOLDER.add(CONFIG, 'chair-rotate', 0, 360, 1)
  .name('Rotation')
  .onChange(UPDATE)
CHAIR_FOLDER.add(CONFIG, 'spin')
  .name('Spin chair')
  .onChange(UPDATE)
UPDATE()
