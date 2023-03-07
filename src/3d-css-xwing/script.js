// Purely for debugging purposes
import { GUI } from 'https://cdn.skypack.dev/dat.gui'

const CONTROLLER = new GUI()
const CONFIG = {
  'rotate-x': -360,
  'rotate-y': -360,
}
const UPDATE = () => {
  Object.entries(CONFIG).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value)
  })
}
const PLANE_FOLDER = CONTROLLER.addFolder('Plane')
PLANE_FOLDER.add(CONFIG, 'rotate-x', -360, 360, 1)
  .name('Rotate X (deg)')
  .onChange(UPDATE)
PLANE_FOLDER.add(CONFIG, 'rotate-y', -360, 360, 1)
  .name('Rotate Y (deg)')
  .onChange(UPDATE)
UPDATE()
