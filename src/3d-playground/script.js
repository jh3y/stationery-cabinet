const {
  dat: { GUI },
} = window

const CONTROLLER = new GUI()

const CONFIG = {
  perspective: 1000,
  'cuboid-height': 10,
  'cuboid-width': 10,
  'cuboid-depth': 10,
  x: 5,
  y: 5,
  z: 5,
  'rotate-x': -30,
  'rotate-y': -24,
  'plane-width': 20,
  'plane-height': 20,
  'rotate-cuboid-x': 0,
  'rotate-cuboid-y': 0,
  'rotate-cuboid-z': 0,
}

const UPDATE = () => {
  Object.entries(CONFIG).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value)
  })
}
const SCENE_FOLDER = CONTROLLER.addFolder('Scene')
SCENE_FOLDER.add(CONFIG, 'perspective', 100, 2000, 1)
  .name('Perspective (px)')
  .onChange(UPDATE)
const CUBOID_FOLDER = CONTROLLER.addFolder('Cuboid')
CUBOID_FOLDER.add(CONFIG, 'cuboid-height', 1, 20, 0.1)
  .name('Height (vmin)')
  .onChange(UPDATE)
CUBOID_FOLDER.add(CONFIG, 'cuboid-width', 1, 20, 0.1)
  .name('Width (vmin)')
  .onChange(UPDATE)
CUBOID_FOLDER.add(CONFIG, 'cuboid-depth', 1, 20, 0.1)
  .name('Depth (vmin)')
  .onChange(UPDATE)
// You have a choice at this point. Use x||y on the plane
// Or, use standard transform with vmin.
CUBOID_FOLDER.add(CONFIG, 'x', 0, 40, 0.1)
  .name('X (vmin)')
  .onChange(UPDATE)
CUBOID_FOLDER.add(CONFIG, 'y', 0, 40, 0.1)
  .name('Y (vmin)')
  .onChange(UPDATE)
CUBOID_FOLDER.add(CONFIG, 'z', -25, 25, 0.1)
  .name('Z (vmin)')
  .onChange(UPDATE)
CUBOID_FOLDER.add(CONFIG, 'rotate-cuboid-x', 0, 360, 1)
  .name('Rotate X (deg)')
  .onChange(UPDATE)
CUBOID_FOLDER.add(CONFIG, 'rotate-cuboid-y', 0, 360, 1)
  .name('Rotate Y (deg)')
  .onChange(UPDATE)
CUBOID_FOLDER.add(CONFIG, 'rotate-cuboid-z', 0, 360, 1)
  .name('Rotate Z (deg)')
  .onChange(UPDATE)

const PLANE_FOLDER = CONTROLLER.addFolder('Plane')
PLANE_FOLDER.add(CONFIG, 'rotate-x', -50, 50, 1)
  .name('Rotate X (deg)')
  .onChange(UPDATE)
PLANE_FOLDER.add(CONFIG, 'rotate-y', -50, 50, 1)
  .name('Rotate Y (deg)')
  .onChange(UPDATE)
PLANE_FOLDER.add(CONFIG, 'plane-height', 1, 50, 1)
  .name('Height (vmin)')
  .onChange(UPDATE)
PLANE_FOLDER.add(CONFIG, 'plane-width', 1, 50, 1)
  .name('Width (vmin)')
  .onChange(UPDATE)

UPDATE()
