const {
  THREE,
  dat: { GUI },
} = window
const {
  Color,
  Group,
  Mesh,
  BoxGeometry,
  CylinderGeometry,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  RingGeometry,
  OrbitControls,
  PointLight,
  MeshPhongMaterial,
} = THREE

const CONFIG = {
  UNIT: 1,
  FOV: 75,
  NEAR: 0.1,
  FAR: 1000,
  BRICK_WIDTH: 16,
  BRICK_HEIGHT: 9,
  BRICK_LENGTH: 31,
  LIGHT: {
    COLOR: 0xffffff,
    X: -40,
    Y: 10,
    Z: 20,
    X1: -5,
    Y1: -4,
    Z1: 75,
    HELP: false,
  },
  SPIN: {
    X: 0,
    Y: 0,
    Z: 0.005,
  },
  ROTATION: {
    X: 0.3053348710364714,
    Y: 2.592098160501108,
    Z: 0,
  },
}

// Set the scene
const SCENE = new Scene()
// Set up a camera
const CAMERA = new PerspectiveCamera(
  CONFIG.FOV,
  window.innerWidth / window.innerHeight,
  CONFIG.NEAR,
  CONFIG.FAR
)
// Create the renderer
const RENDERER = new WebGLRenderer({ alpha: false })
RENDERER.setSize(window.innerWidth, window.innerHeight)
// Set orbital controls so user can move things around
new OrbitControls(CAMERA, RENDERER.domElement)
const HUE = Math.random() * 360
const TRUCK = new Group()
TRUCK.rotation.x = CONFIG.ROTATION.X
TRUCK.rotation.y = CONFIG.ROTATION.Y
TRUCK.rotation.z = CONFIG.ROTATION.Z
// Create a color for the brick material from HSL
const COLOR = new Color(`hsl(${HUE}, 0%, 75%)`)
const BRICK_MATERIAL = new MeshPhongMaterial({
  color: COLOR,
  wireframe: false,
  specular: 0xffffff,
  shininess: 15,
})
// Start creating the brick sides. Can't use planes as there is no thickness
const BRICK_FRONT_GEOMETRY = new BoxGeometry(
  CONFIG.BRICK_WIDTH,
  CONFIG.BRICK_HEIGHT,
  CONFIG.UNIT
)
const BRICK_FRONT = new Mesh(BRICK_FRONT_GEOMETRY, BRICK_MATERIAL)
BRICK_FRONT.position.z = CONFIG.BRICK_LENGTH / 2
const BRICK_REAR = BRICK_FRONT.clone(true)
BRICK_REAR.position.z = CONFIG.BRICK_LENGTH / -2
const BRICK_MIDDLE_GEOMETRY = new BoxGeometry(
  CONFIG.BRICK_WIDTH - CONFIG.UNIT,
  CONFIG.BRICK_WIDTH / 4,
  CONFIG.UNIT / 2
)
const BRICK_MIDDLE = new Mesh(BRICK_MIDDLE_GEOMETRY, BRICK_MATERIAL)
BRICK_MIDDLE.position.y = 2
const BRICK_LEFT_GEOMETRY = new BoxGeometry(
  CONFIG.BRICK_LENGTH,
  CONFIG.BRICK_HEIGHT,
  CONFIG.UNIT
)
const BRICK_LEFT = new Mesh(BRICK_LEFT_GEOMETRY, BRICK_MATERIAL)
BRICK_LEFT.position.x = -(CONFIG.BRICK_WIDTH / 2 - CONFIG.UNIT / 2)
BRICK_LEFT.rotation.y = (90 * Math.PI) / 180
const BRICK_RIGHT = BRICK_LEFT.clone(true)
BRICK_RIGHT.position.x = CONFIG.BRICK_WIDTH / 2 - CONFIG.UNIT / 2
const BRICK_TOP_GEOMETRY = new BoxGeometry(
  CONFIG.BRICK_WIDTH,
  CONFIG.UNIT,
  CONFIG.BRICK_LENGTH + CONFIG.UNIT
)
const BRICK_TOP = new Mesh(BRICK_TOP_GEOMETRY, BRICK_MATERIAL)
BRICK_TOP.position.y = 4
const BRICK = new Group()
BRICK.add(BRICK_FRONT)
BRICK.add(BRICK_REAR)
BRICK.add(BRICK_LEFT)
BRICK.add(BRICK_MIDDLE)
BRICK.add(BRICK_RIGHT)
BRICK.add(BRICK_TOP)
/**
 * Now create the points
 * We can reuse the brick material from before
 * A point is about 1.5 x 4 x 4
 */
const POINT_GEOMETRY = new CylinderGeometry(2, 2, 1.5, 64)
const POINT = new Mesh(POINT_GEOMETRY, BRICK_MATERIAL)
POINT.position.y = 5
POINT.position.x = -4
POINT.position.z = 4
const POINT_ONE = POINT.clone(true)
POINT_ONE.position.x = 4
POINT_ONE.position.z = 4
const POINT_TWO = POINT_ONE.clone(true)
POINT_TWO.position.z = 12
const POINT_THREE = POINT_ONE.clone(true)
POINT_THREE.position.z = -12
const POINT_FOUR = POINT_ONE.clone(true)
POINT_FOUR.position.z = -4
const POINT_FIVE = POINT_ONE.clone(true)
POINT_FIVE.position.x = -4
POINT_FIVE.position.z = -4
const POINT_SIX = POINT_ONE.clone(true)
POINT_SIX.position.x = -4
POINT_SIX.position.z = -12
const POINT_SEVEN = POINT_ONE.clone(true)
POINT_SEVEN.position.x = -4
POINT_SEVEN.position.z = 12
BRICK.add(POINT)
BRICK.add(POINT_ONE)
BRICK.add(POINT_TWO)
BRICK.add(POINT_THREE)
BRICK.add(POINT_FOUR)
BRICK.add(POINT_FIVE)
BRICK.add(POINT_SIX)
BRICK.add(POINT_SEVEN)
const BRACE = new Group()
const OUTER_BRACE_GEOMETRY = new CylinderGeometry(3, 3, 6, 64, 1, true)
const OUTER_BRACE = new Mesh(OUTER_BRACE_GEOMETRY, BRICK_MATERIAL)
const INNER_BRACE_GEOMETRY = new CylinderGeometry(2.5, 2.5, 6, 64, 1, true)
const INNER_BRACE = new Mesh(INNER_BRACE_GEOMETRY, BRICK_MATERIAL)
const TOP_BRACE_GEOMETRY = new RingGeometry(2.5, 3, 64)
const TOP_BRACE = new Mesh(TOP_BRACE_GEOMETRY, BRICK_MATERIAL)
TOP_BRACE.rotation.x = (90 * Math.PI) / 180
TOP_BRACE.position.y = -3
BRACE.add(OUTER_BRACE)
BRACE.add(INNER_BRACE)
BRACE.add(TOP_BRACE)
const BRACE_TOP = BRACE.clone(true)
BRACE_TOP.position.z = 8
const BRACE_BOTTOM = BRACE.clone(true)
BRACE_BOTTOM.position.z = -8
BRICK.add(BRACE)
BRICK.add(BRACE_TOP)
BRICK.add(BRACE_BOTTOM)

TRUCK.add(BRICK)
/**
 * Wheels
 */
const HUB = new Group()
const HUB_MATERIAL = BRICK_MATERIAL.clone(true)
HUB_MATERIAL.shininess = 5
const HUB_BASE_GEOMETRY = new BoxGeometry(
  CONFIG.BRICK_WIDTH,
  CONFIG.UNIT * 3,
  16
)
const HUB_BASE = new Mesh(HUB_BASE_GEOMETRY, HUB_MATERIAL)
HUB.position.y = -(CONFIG.BRICK_HEIGHT / 2 + CONFIG.UNIT * 1.5)
HUB.position.z = 8.01
const AXLE_GEOMETRY = new CylinderGeometry(2.5, 2.5, 16, 64)
const AXLE = new Mesh(AXLE_GEOMETRY, HUB_MATERIAL)
AXLE.rotation.x = (90 * Math.PI) / 180
AXLE.rotation.z = (90 * Math.PI) / 180
AXLE.position.y = -1.25
HUB.add(HUB_BASE)
HUB.add(AXLE)
TRUCK.add(HUB)
const WHEEL = new Group()
const WHEEL_MATERIAL = new MeshPhongMaterial({
  color: 0x333333,
  wireframe: false,
  specular: 0xffffff,
  shininess: 50,
})
const WHEEL_OUTER_GEOMETRY = new CylinderGeometry(3, 3, CONFIG.UNIT * 1.5, 64)
const WHEEL_OUTER = new Mesh(WHEEL_OUTER_GEOMETRY, WHEEL_MATERIAL)
WHEEL.add(WHEEL_OUTER)
WHEEL.position.x = -9
WHEEL.position.y = -1.5
WHEEL.rotation.x = (90 * Math.PI) / 180
WHEEL.rotation.z = (90 * Math.PI) / 180
const OTHER_WHEEL = WHEEL.clone(true)
OTHER_WHEEL.position.x = 9
HUB.add(WHEEL)
HUB.add(OTHER_WHEEL)
const FRONT_HUB = HUB.clone(true)
FRONT_HUB.position.z = -8.01
TRUCK.add(FRONT_HUB)
SCENE.add(TRUCK)
/**
 * Add the under points
 */
/**
 * Mess around with rotation
 */

/**
 * LIGHTING
 * Could loop this over a DAT GUI config?
 */
const LIGHT = new PointLight(0xfafafa, 1)
LIGHT.position.set(CONFIG.LIGHT.X, CONFIG.LIGHT.Y, CONFIG.LIGHT.Z)
const LIGHT_2 = new PointLight(0xfafafa, 1)
LIGHT_2.position.set(CONFIG.LIGHT.X1, CONFIG.LIGHT.Y1, CONFIG.LIGHT.Z1)
SCENE.add(LIGHT)
SCENE.add(LIGHT_2)
const LIGHT_HELPER = new THREE.PointLightHelper(LIGHT)
const LIGHT_HELPER_2 = new THREE.PointLightHelper(LIGHT_2)
/**
 * Set up renderer and scene
 */
CAMERA.position.z = 100
const animate = () => {
  requestAnimationFrame(animate)
  TRUCK.rotation.x += CONFIG.SPIN.X
  TRUCK.rotation.z += CONFIG.SPIN.Y
  TRUCK.rotation.y += CONFIG.SPIN.Z
  RENDERER.render(SCENE, CAMERA)
}
document.body.appendChild(RENDERER.domElement)
animate()
// On window resize, update the aspect ratio and renderer dimensions
window.addEventListener('resize', () => {
  RENDERER.setSize(window.innerWidth, window.innerHeight)
  CAMERA.aspect = window.innerWidth / window.innerHeight
  CAMERA.updateProjectionMatrix()
})
/**
 * Set up dat.GUI to play with different controls
 */
const CONTROLS = new GUI({ closed: false })
const CAMERA_CONTROLS = CONTROLS.addFolder('CAMERA')
const fovController = CAMERA_CONTROLS.add(CONFIG, 'FOV', 1, 250)
fovController.onChange(value => {
  CONFIG.FOV = value
  CAMERA.fov = value
  CAMERA.updateProjectionMatrix()
})

const LIGHTS = CONTROLS.addFolder('LIGHT')
const lightXController = LIGHTS.add(CONFIG.LIGHT, 'X', -40, 40)
lightXController.onChange(() => {
  LIGHT.position.set(CONFIG.LIGHT.X, CONFIG.LIGHT.Y, CONFIG.LIGHT.Z)
})
const lightYController = LIGHTS.add(CONFIG.LIGHT, 'Y', -100, 100)
lightYController.onChange(() => {
  LIGHT.position.set(CONFIG.LIGHT.X, CONFIG.LIGHT.Y, CONFIG.LIGHT.Z)
})
const lightZController = LIGHTS.add(CONFIG.LIGHT, 'Z', -100, 100)
lightZController.onChange(() => {
  LIGHT.position.set(CONFIG.LIGHT.X, CONFIG.LIGHT.Y, CONFIG.LIGHT.Z)
})
const lightX1Controller = LIGHTS.add(CONFIG.LIGHT, 'X1', -40, 40)
lightX1Controller.onChange(() => {
  LIGHT_2.position.set(CONFIG.LIGHT.X1, CONFIG.LIGHT.Y1, CONFIG.LIGHT.Z1)
})
const lightY1Controller = LIGHTS.add(CONFIG.LIGHT, 'Y1', -100, 100)
lightY1Controller.onChange(() => {
  LIGHT_2.position.set(CONFIG.LIGHT.X1, CONFIG.LIGHT.Y1, CONFIG.LIGHT.Z1)
})
const lightZ1Controller = LIGHTS.add(CONFIG.LIGHT, 'Z1', -100, 100)
lightZ1Controller.onChange(() => {
  LIGHT_2.position.set(CONFIG.LIGHT.X1, CONFIG.LIGHT.Y1, CONFIG.LIGHT.Z1)
})
const ROTATION = CONTROLS.addFolder('ROTATION')
const rotationXController = ROTATION.add(
  CONFIG.ROTATION,
  'X',
  0,
  (360 * Math.PI) / 180
)
rotationXController.onChange(() => {
  TRUCK.rotation.set(CONFIG.ROTATION.X, CONFIG.ROTATION.Y, CONFIG.ROTATION.Z)
})
const rotationYController = ROTATION.add(
  CONFIG.ROTATION,
  'Y',
  0,
  (360 * Math.PI) / 180
)
rotationYController.onChange(() => {
  TRUCK.rotation.set(CONFIG.ROTATION.X, CONFIG.ROTATION.Y, CONFIG.ROTATION.Z)
})
const rotationZController = ROTATION.add(
  CONFIG.ROTATION,
  'Z',
  0,
  (360 * Math.PI) / 180
)
rotationZController.onChange(() => {
  TRUCK.rotation.set(CONFIG.ROTATION.X, CONFIG.ROTATION.Y, CONFIG.ROTATION.Z)
})
const SPIN = CONTROLS.addFolder('SPIN')
SPIN.add(CONFIG.SPIN, 'X', 0, 0.2)
SPIN.add(CONFIG.SPIN, 'Y', 0, 0.2)
SPIN.add(CONFIG.SPIN, 'Z', 0, 0.2)

const lightHelpController = LIGHTS.add(CONFIG.LIGHT, 'HELP')
lightHelpController.onChange(() => {
  if (CONFIG.LIGHT.HELP) {
    SCENE.add(LIGHT_HELPER)
    SCENE.add(LIGHT_HELPER_2)
  } else {
    SCENE.remove(LIGHT_HELPER)
    SCENE.remove(LIGHT_HELPER_2)
  }
})
