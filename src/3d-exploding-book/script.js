const {
  dat: { GUI },
} = window

const CONFIG = {
  x: 0,
  y: 0,
  z: 0,
  spin: false,
  scale: 2,
  exploded: true,
}

const UPDATE = () => {
  document.documentElement.style.setProperty('--x', CONFIG.x)
  document.documentElement.style.setProperty('--y', CONFIG.y)
  document.documentElement.style.setProperty('--z', CONFIG.z)
  document.documentElement.style.setProperty('--scale', CONFIG.scale)
  document.documentElement.style.setProperty(
    '--state',
    CONFIG.spin ? 'running' : 'paused'
  )
  document.documentElement.style.setProperty(
    '--exploded',
    CONFIG.exploded ? 1 : 0
  )
}

const CONTROLLER = new GUI()
const ROTATION = CONTROLLER.addFolder('Rotate')
ROTATION.add(CONFIG, 'x', 0, 360, 1)
  .name('X')
  .onChange(UPDATE)
ROTATION.add(CONFIG, 'y', 0, 360, 1)
  .name('Y')
  .onChange(UPDATE)
ROTATION.add(CONFIG, 'z', 0, 360, 1)
  .name('Z')
  .onChange(UPDATE)
CONTROLLER.add(CONFIG, 'exploded')
  .name('Exploded')
  .onChange(UPDATE)
CONTROLLER.add(CONFIG, 'spin')
  .name('Spin')
  .onChange(UPDATE)
CONTROLLER.add(CONFIG, 'scale', 0.5, 5, 0.1)
  .name('Scale')
  .onChange(UPDATE)
