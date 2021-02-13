import * as THREE from 'https://cdn.skypack.dev/three'
// import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js'
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'https://cdn.skypack.dev/three/examples/jsm/renderers/CSS2DRenderer.js'
import gsap from 'https://cdn.skypack.dev/gsap'

const ScrollTrigger = window.ScrollTrigger

gsap.registerPlugin(ScrollTrigger)

/**
 * Principles of threeJS are as follows.
 * 1. Set up a scene
 * 2. Set up a camera in order to see that scene
 * 3. Add lighting to the scene in order to see things. Some materials don't care about lighting (Mesh Basic Material?)
 * 4. Everything is a Mesh. A Mesh consists of a geometry and material combined.
 * 5. You can group meshes into a Group.
 * 6. Need a different shape or material? Check the docs.
 * 7. You can apply transforms to a mesh and declare position like you would in say ZDog
 * 8. Animate a scene using requestAnimationFrame as you would normally 👍
 *    If you don't keep rendering the scene within a requestAnimationFrame, drag controls etc. won't work
 * 9. Do this by having the renderer render the scene with the camera
 * 10. Before doing anything though, append the renderer's DOM element to the document.body
 *     or wherever it's going.
 */

const CONFIG = {
  FOV: 45,
  NEAR: 5,
  FAR: 1000,
}

const {
  AmbientLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Color,
  Mesh,
  Group,
  BoxGeometry,
  MeshPhongMaterial,
  PointLight,
} = THREE

// Create a scene - Everything powered through here.
const SCENE = new Scene()

// Set up a Camera for the scene - Talk about camera types here.
const CAMERA = new PerspectiveCamera(
  CONFIG.FOV,
  window.innerWidth / window.innerHeight,
  CONFIG.NEAR,
  CONFIG.FAR
)

const HTML_RENDERER = new CSS2DRenderer()
HTML_RENDERER.setSize(window.innerWidth, window.innerHeight)
gsap.set(HTML_RENDERER.domElement, {
  position: 'fixed',
  top: 0,
  left: 0,
})
const RENDERER = new WebGLRenderer({ alpha: false })
RENDERER.setSize(window.innerWidth, window.innerHeight)

// Tie up some orbital controls with the camera + Renderer
// new OrbitControls(CAMERA, RENDERER.domElement)

// Generic Material for Frames
const MATERIAL = new MeshPhongMaterial({
  color: new Color(`hsl(0, 0%, 50%)`),
  shininess: 15,
  specular: new Color('hsl(0, 0%, 100%)'),
})

const FRAME = new Group()
const SECTION = new BoxGeometry(50, 2.5, 12.5)
const SECTION_MESH = new Mesh(SECTION, MATERIAL)

const TOP = SECTION_MESH.clone()
TOP.position.y = 23.75
const BOTTOM = SECTION_MESH.clone()
BOTTOM.position.y = -23.75
const LEFT = SECTION_MESH.clone()
LEFT.position.x = -23.75
LEFT.rotation.z = (Math.PI / 180) * -90
const RIGHT = SECTION_MESH.clone()
RIGHT.position.x = 23.75
RIGHT.rotation.z = (Math.PI / 180) * 90

FRAME.add(TOP)
FRAME.add(BOTTOM)
FRAME.add(LEFT)
FRAME.add(RIGHT)

// FRAME is the starter frame
// Then we clone it
const DISTANCE = 40
const ROTATION = 25
const FIRST = FRAME.clone()
FIRST.position.z = DISTANCE * 2
const SECOND = FRAME.clone()
SECOND.position.z = DISTANCE
SECOND.rotation.z = (Math.PI / 180) * ROTATION
const THIRD = FRAME.clone()
THIRD.rotation.z = (Math.PI / 180) * (ROTATION * 2)
const FOURTH = FRAME.clone()
FOURTH.position.z = -DISTANCE
FOURTH.rotation.z = (Math.PI / 180) * (ROTATION * 3)
const FIFTH = FRAME.clone()
FIFTH.position.z = -(DISTANCE * 2)
FIFTH.rotation.z = (Math.PI / 180) * (ROTATION * 4)

const FRAMES = new Group()
FRAMES.add(FIRST)
FRAMES.add(SECOND)
FRAMES.add(THIRD)
FRAMES.add(FOURTH)
FRAMES.add(FIFTH)

SCENE.add(FRAMES)

// const BOX_TWO = STARTER.clone()
// BOX_TWO.position.z = 20

// SCENE.add(BOX_TWO)

const LIGHT = new PointLight(0xfafafa, 1)
const AMBIENT_COLOR = new Color('hsl(280, 80%, 50%)')
const AMBIENT_LIGHT = new AmbientLight(AMBIENT_COLOR)

SCENE.add(AMBIENT_LIGHT)

LIGHT.position.set(10, 5, 25)

SCENE.add(LIGHT)

CAMERA.position.z = 350

// Random Nav Label
const NAV = document.createElement('nav')
NAV.textContent = 'NAVVVY'
const NAV_EL = new CSS2DObject(NAV)
NAV_EL.position.y = 15
NAV_EL.width = DISTANCE * 5
NAV_EL.rotation.x = (Math.PI / 180) * 90
SCENE.add(NAV_EL)

document.body.appendChild(RENDERER.domElement)
document.body.appendChild(HTML_RENDERER.domElement)

const animate = () => {
  RENDERER.render(SCENE, CAMERA)
  HTML_RENDERER.render(SCENE, CAMERA)
  requestAnimationFrame(animate)
}

const ROTATIONS = FRAMES.children
  .filter((_, index) => index !== 0)
  .map(f => f.rotation)
const ROTATIONS_TWO = FRAMES.children
  .filter((_, index) => index !== FRAMES.children.length - 1)
  .map(f => f.rotation)

const SPINNER = gsap
  .timeline({
    paused: true,
  })
  .to(
    CAMERA.position,
    {
      z: 500,
      duration: 10,
    },
    0
  )
  .to(
    SCENE.rotation,
    {
      y: (Math.PI / 180) * -90,
      duration: 10,
    },
    0
  )
  .to(
    ROTATIONS,
    {
      z: (Math.PI / 180) * 360,
      duration: 10,
    },
    0
  )
  .to(
    CAMERA.position,
    {
      z: 350,
      duration: 10,
    },
    12
  )
  .to(
    SCENE.rotation,
    {
      y: (Math.PI / 180) * -180,
      duration: 10,
    },
    12
  )
  .to(
    ROTATIONS_TWO,
    {
      z: index => (Math.PI / 180) * 720 + index * ((Math.PI / 180) * ROTATION),
      duration: 10,
    },
    12
  )

let TRIGGER

animate()

const bindScroll = () => {
  return ScrollTrigger.create({
    start: 0,
    end: '+=3000',
    pin: 'canvas',
    invalidateOnRefresh: true,
    onUpdate: self => {
      if (self.progress === 1 && self.direction > 0) {
        TRIGGER.scroll(TRIGGER.start + 5)
      } else if (self.progress < 0.00001 && self.direction < 0) {
        TRIGGER.scroll(TRIGGER.end - 5)
      } else {
        gsap.set(SPINNER, {
          totalTime: SPINNER.duration() * self.progress,
        })
      }
    },
  })
}

window.addEventListener('resize', () => {
  RENDERER.setSize(window.innerWidth, window.innerHeight)
  CAMERA.aspect = window.innerWidth / window.innerHeight
  CAMERA.updateProjectionMatrix()
  TRIGGER.refresh()
})

TRIGGER = bindScroll()
window.TRIGGER = TRIGGER
