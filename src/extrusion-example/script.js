import { GUI } from 'https://cdn.skypack.dev/dat.gui'

const CONTROLLER = new GUI({
  width: 300,
})

const CONFIG = {
  x: 0,
  y: 0,
  z: 0,
  'rotate-x': 0,
  'rotate-y': 0,
  'rotate-z': 0,
  thickness: 4,
  width: 10,
  height: 10,
  wireframe: false,
}

const UPDATE = () => {
  Object.entries(CONFIG).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value)
  })
  document.documentElement.style.setProperty(
    '--wireframe',
    CONFIG.wireframe ? 1 : 0
  )
}

CONTROLLER.add(CONFIG, 'height', 1, 20, 1)
  .name('Height (vmin)')
  .onChange(UPDATE)
CONTROLLER.add(CONFIG, 'width', 1, 20, 1)
  .name('Width (vmin)')
  .onChange(UPDATE)
CONTROLLER.add(CONFIG, 'thickness', 0, 100, 1)
  .name('Thickness (vmin)')
  .onChange(UPDATE)
CONTROLLER.add(CONFIG, 'wireframe')
  .name('Wireframe')
  .onChange(UPDATE)
const TRANSLATE = CONTROLLER.addFolder('Translate')
TRANSLATE.add(CONFIG, 'x', -15, 15, 1)
  .name('X (vmin)')
  .onChange(UPDATE)
TRANSLATE.add(CONFIG, 'y', -15, 15, 1)
  .name('Y (vmin)')
  .onChange(UPDATE)
TRANSLATE.add(CONFIG, 'z', -15, 15, 1)
  .name('Z (vmin)')
  .onChange(UPDATE)
const ROTATE = CONTROLLER.addFolder('Rotate')
ROTATE.add(CONFIG, 'rotate-x', -360, 360, 1)
  .name('X (vmin)')
  .onChange(UPDATE)
ROTATE.add(CONFIG, 'rotate-y', -360, 360, 1)
  .name('Y (vmin)')
  .onChange(UPDATE)
ROTATE.add(CONFIG, 'rotate-z', -360, 360, 1)
  .name('Z (vmin)')
  .onChange(UPDATE)

UPDATE()
