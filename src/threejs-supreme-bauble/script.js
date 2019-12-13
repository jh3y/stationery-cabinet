const {
  THREE,
  gsap: { to, timeline, from, fromTo },
  dat: { GUI },
} = window
const {
  Group,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  OrbitControls,
  PointLight,
} = THREE
let CAMERA
let CAM_CONTROLS
let BAUBLE
let X_SPIN
let Y_SPIN
let Z_SPIN
let X_ROTATION
let Y_ROTATION
let Z_ROTATION
const CONFIG = {
  UNIT: 1,
  FOV: 75,
  NEAR: 0.1,
  FAR: 1000,
  RADIUS: 15,
  DOTS: 15,
  RINGS: 9,
  TRANSITION: 1,
  RESET_CAMERA: () => {
    CAM_CONTROLS.reset()
  },
  LIGHT: {
    COLOR: 0xffffff,
    X: -20,
    Y: 20,
    Z: 40,
    HELP: false,
  },
  SPIN: {
    X: 0.01,
    Y: 0.001,
    Z: 0.01,
    STOP: () => {
      CONFIG.SPIN.X = 0
      CONFIG.SPIN.Y = 0
      CONFIG.SPIN.Z = 0
      X_SPIN.setValue(0)
      Y_SPIN.setValue(0)
      Z_SPIN.setValue(0)
    },
  },
  ROTATION: {
    X: 300,
    Y: 0,
    Z: 0,
    RESET: () => {
      BAUBLE.rotation.x = 300
      BAUBLE.rotation.y = 0
      BAUBLE.rotation.z = 0
      X_ROTATION.setValue(300)
      Y_ROTATION.setValue(0)
      Z_ROTATION.setValue(0)
    },
  },
  COLORS: {
    BODY: 0xff0000,
    TOP: 0xffffff,
    DOTS: 0xffffff,
  },
}

// These are the bauble colors
let TL
BAUBLE = new Group()
CAMERA = new PerspectiveCamera(
  CONFIG.FOV,
  window.innerWidth / window.innerHeight,
  CONFIG.NEAR,
  CONFIG.FAR
)
CAMERA.position.set(0, 0, 100)
// Set the scene
const SCENE = new Scene()
// Create the renderer
const RENDERER = new WebGLRenderer({
  alpha: false,
  logarithmicDepthBuffer: false,
  pixelRatio: window.devicePixelRatio || 1,
  antialias: true,
})
RENDERER.setSize(window.innerWidth, window.innerHeight)
// Set orbital controls so user can move things around
CAM_CONTROLS = new OrbitControls(CAMERA, RENDERER.domElement)
CAM_CONTROLS.enablePan = false

let DOTS = []
let UPDATING = true

const SPHERE_GEOMETRY = new THREE.SphereGeometry(CONFIG.RADIUS, 32, 32)
const SPHERE_MATERIAL = new THREE.MeshPhongMaterial({
  color: 0xe74c3c,
  opacity: 0.75,
  transparent: true,
  shininess: 50,
  specular: 0xffffff,
  reflectivity: 1,
  combine: THREE.MultiplyOperation,
})
const TOP_MATERIAL = SPHERE_MATERIAL.clone()
TOP_MATERIAL.color = new THREE.Color(0xfafafa)
const DOTS_MATERIAL = SPHERE_MATERIAL.clone()
DOTS_MATERIAL.color = new THREE.Color(0xffffff)
TOP_MATERIAL.opacity = DOTS_MATERIAL.opacity = 1
const GLOBAL_SPHERE = new THREE.Mesh(SPHERE_GEOMETRY, SPHERE_MATERIAL)
GLOBAL_SPHERE.scale.x = GLOBAL_SPHERE.scale.y = GLOBAL_SPHERE.scale.z = 0.1
const BAUBLE_TOP_GEOMETRY = new THREE.CylinderGeometry(4, 4, 6, 64)
const BAUBLE_TOP = new THREE.Mesh(BAUBLE_TOP_GEOMETRY, TOP_MATERIAL)
BAUBLE_TOP.rotateX(90 * (Math.PI / 180))
BAUBLE_TOP.translateY(CONFIG.RADIUS)
const TOP_RING_GEO = new THREE.TorusGeometry(3, 0.5, 16, 100)
const TOP_RING = new THREE.Mesh(TOP_RING_GEO, TOP_MATERIAL)
TOP_RING.rotateX(0 * (Math.PI / 180))
TOP_RING.translateY(5)
BAUBLE_TOP.add(TOP_RING)
GLOBAL_SPHERE.add(BAUBLE_TOP)
BAUBLE.add(GLOBAL_SPHERE)

const addRing = (RADIUS, HEIGHT) => {
  for (let d = 0; d < CONFIG.DOTS; d++) {
    const SPHERE_GEOMETRY = new THREE.SphereGeometry(0.5, 32, 32)
    const SPHERE = new THREE.Mesh(SPHERE_GEOMETRY, DOTS_MATERIAL)

    SPHERE.rotateZ((360 / CONFIG.DOTS) * d * (Math.PI / 180))
    SPHERE.scale.x = SPHERE.scale.y = SPHERE.scale.z = 0.1
    SPHERE.metadata = {
      HEIGHT,
    }
    SPHERE.translateX(RADIUS)
    SPHERE.translateZ(HEIGHT)
    DOTS.push(SPHERE)
    BAUBLE.add(SPHERE)
  }
}

const generateRings = () => {
  DOTS = []
  // Calculate the ring gap
  const GAP =
    CONFIG.RINGS % 2 === 0
      ? CONFIG.RADIUS / (CONFIG.RINGS / 2 + 1)
      : CONFIG.RADIUS / (CONFIG.RINGS / 2)
  // Iterate and create the rings that aren't the center ring
  for (
    let r = 0;
    r < (CONFIG.RINGS % 2 === 0 ? CONFIG.RINGS / 2 : (CONFIG.RINGS - 1) / 2);
    r++
  ) {
    // Generate a ring, work out its position. Add it to the scene 👍
    const SPHERE_RADIUS = CONFIG.RADIUS
    // If I want the ring at height 5 that means a cap height of 10 for the equation.
    const HEIGHT = (r + 1) * GAP
    // This is the equation to grab the radius, thanks mathworld.wolfram.com/SphericalCap.html 🙌
    const RADIUS = Math.sqrt(
      (SPHERE_RADIUS - HEIGHT) * (2 * 15 - (SPHERE_RADIUS - HEIGHT))
    )
    addRing(RADIUS, HEIGHT)
    addRing(RADIUS, -HEIGHT)
  }
  // Add the center ring, if the number of rings is odd here 👍
  if (CONFIG.RINGS % 2 !== 0) {
    addRing(CONFIG.RADIUS, 0)
  }
  TL = new timeline({
    onComplete: () => (UPDATING = false),
    onReverseComplete: generateScene,
  })
    .add(
      to(GLOBAL_SPHERE.scale, CONFIG.TRANSITION, {
        x: 1,
        y: 1,
        z: 1,
      }),
      0
    )
    .add(
      fromTo(
        SPHERE_MATERIAL,
        { opacity: 0 },
        {
          opacity: 0.75,
          duration: CONFIG.TRANSITION / 2,
        }
      ),
      0
    )
    .add(
      fromTo(
        [DOTS_MATERIAL, TOP_MATERIAL],
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: CONFIG.TRANSITION / 2,
        }
      ),
      0
    )
    .add(
      from(DOTS.map(d => d.position), CONFIG.TRANSITION, {
        x: 0,
        y: 0,
        z: 0,
      }),
      0
    )
    .add(
      to(DOTS.map(d => d.scale), CONFIG.TRANSITION, {
        x: 1,
        y: 1,
        z: 1,
      }),
      0
    )
}
const generateScene = () => {
  while (BAUBLE.children.length > 1) {
    // Clear the children
    BAUBLE.remove(BAUBLE.children[1])
  }
  generateRings()
}
SCENE.add(BAUBLE)
generateScene()
/**
 * LIGHTING
 * Could loop this over a DAT GUI config?
 */ const LIGHT = new PointLight(0xfafafa, 1)
LIGHT.position.set(CONFIG.LIGHT.X, CONFIG.LIGHT.Y, CONFIG.LIGHT.Z)
SCENE.add(LIGHT)
const LIGHT_HELPER = new THREE.PointLightHelper(LIGHT)
/**
 * Set up renderer and scene
 */ BAUBLE.rotation.x = CONFIG.ROTATION.X
BAUBLE.rotation.y = CONFIG.ROTATION.Y
BAUBLE.rotation.z = CONFIG.ROTATION.Z
const animate = () => {
  BAUBLE.rotation.x += CONFIG.SPIN.X
  BAUBLE.rotation.y += CONFIG.SPIN.Y
  BAUBLE.rotation.z += CONFIG.SPIN.Z
  RENDERER.render(SCENE, CAMERA)
  requestAnimationFrame(animate)
}
document.body.appendChild(RENDERER.domElement)
animate() // On window resize, update the aspect ratio and renderer dimensions
window.addEventListener('resize', () => {
  RENDERER.setSize(window.innerWidth, window.innerHeight)
  CAMERA.aspect = window.innerWidth / window.innerHeight
  CAMERA.updateProjectionMatrix()
})
/**
 * Set up dat.GUI to play with different controls
 */ const CONTROLS = new GUI({ closed: false })
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
const lightHelpController = LIGHTS.add(CONFIG.LIGHT, 'HELP')
lightHelpController.onChange(() => {
  if (CONFIG.LIGHT.HELP) {
    SCENE.add(LIGHT_HELPER)
  } else {
    SCENE.remove(LIGHT_HELPER)
  }
})
const SPIN = CONTROLS.addFolder('SPIN')
X_SPIN = SPIN.add(CONFIG.SPIN, 'X', 0, 0.1)
Y_SPIN = SPIN.add(CONFIG.SPIN, 'Y', 0, 0.1)
Z_SPIN = SPIN.add(CONFIG.SPIN, 'Z', 0, 0.1)
SPIN.add(CONFIG.SPIN, 'STOP')
const ROTATION = CONTROLS.addFolder('ROTATION')
X_ROTATION = ROTATION.add(CONFIG.ROTATION, 'X', 0, 360).onChange(
  value => (BAUBLE.rotation.x = value * (Math.PI / 180))
)
Y_ROTATION = ROTATION.add(CONFIG.ROTATION, 'Y', 0, 360).onChange(
  value => (BAUBLE.rotation.y = value * (Math.PI / 180))
)
Z_ROTATION = ROTATION.add(CONFIG.ROTATION, 'Z', 0, 360).onChange(
  value => (BAUBLE.rotation.z = value * (Math.PI / 180))
)
ROTATION.add(CONFIG.ROTATION, 'RESET')
const COLORS = CONTROLS.addFolder('COLORS')
COLORS.addColor(CONFIG.COLORS, 'BODY').onChange(
  value => (SPHERE_MATERIAL.color = new THREE.Color(value))
)
COLORS.addColor(CONFIG.COLORS, 'DOTS').onChange(
  value => (DOTS_MATERIAL.color = new THREE.Color(value))
)
COLORS.addColor(CONFIG.COLORS, 'TOP').onChange(
  value => (TOP_MATERIAL.color = new THREE.Color(value))
)
const CONFIGCONTROLS = CONTROLS.addFolder('CONFIG')
const ringsController = CONFIGCONTROLS.add(CONFIG, 'RINGS', 2, 15, 1)
ringsController.onFinishChange(() => {
  if (!UPDATING) {
    TL.reverse()
  }
})
const dotsController = CONFIGCONTROLS.add(CONFIG, 'DOTS', 2, 20, 1)
dotsController.onFinishChange(() => {
  if (!UPDATING) {
    TL.reverse()
  }
})
CONTROLS.add(CONFIG, 'RESET_CAMERA').name('RESET CAMERA')
CONFIGCONTROLS.add(CONFIG, 'TRANSITION', 0.5, 5, 0.1)
