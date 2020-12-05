import Meanderer from 'https://cdn.skypack.dev/meanderer'
// import { GUI } from 'https://cdn.skypack.dev/dat.gui'

const width = 64.228
const height = 27.004
const path =
  'M32.074 13.446s-2.706-2.965-4.158-4.349c-2.003-1.908-3.941-3.942-6.268-5.437C19.33 2.173 16.838.747 14.132.24 13.01.028 11.818.152 10.71.43 8.61.96 6.534 1.85 4.826 3.18a11.59 11.59 0 00-3.262 3.998C.624 9.104.186 11.304.136 13.446c-.04 1.678.287 3.389.884 4.957.602 1.579 1.477 3.106 2.655 4.318 1.545 1.59 3.456 2.957 5.564 3.645 1.786.583 3.783.636 5.629.288 1.861-.35 3.56-1.354 5.18-2.334 1.82-1.1 3.429-2.525 5.021-3.934 3.71-3.281 6.94-7.07 10.522-10.49 1.692-1.614 3.369-3.253 5.18-4.732 1.614-1.318 3.155-2.82 5.054-3.678C47.606.68 49.595.147 51.549.206c2.04.062 4.1.705 5.884 1.696 1.492.827 2.796 2.047 3.806 3.421 1.138 1.55 1.896 3.39 2.399 5.245.361 1.334.547 2.75.415 4.126-.155 1.628-.675 3.238-1.407 4.7-.754 1.507-1.775 2.913-3.006 4.062-1.202 1.122-2.603 2.12-4.157 2.655-1.701.585-3.583.692-5.373.511-1.819-.183-3.611-.78-5.245-1.599-1.833-.92-3.405-2.304-4.957-3.645-2.811-2.43-7.834-7.932-7.834-7.932'
const SCENE = document.querySelector('.scene')

const HOLIDAY_ROAD = new Meanderer({
  path,
  height,
  width,
})

const setPath = () => {
  const scaled = HOLIDAY_ROAD.generatePath(
    SCENE.offsetWidth,
    SCENE.offsetHeight
  )
  SCENE.style.setProperty('--path', `"${scaled}"`)
}

const SizeObserver = new ResizeObserver(setPath)
SizeObserver.observe(SCENE)

// const CONTROLLER = new GUI()

// const CONFIG = {
//   perspective: 1000,
//   'rotate-x': -34,
//   'rotate-y': 34,
//   'scene-width': 50,
//   'scene-height': 50,
// }

// const UPDATE = () => {
//   Object.entries(CONFIG).forEach(([key, value]) => {
//     document.documentElement.style.setProperty(`--${key}`, value)
//   })
// }
// const SCENE_FOLDER = CONTROLLER.addFolder('Scene')
// SCENE_FOLDER.add(CONFIG, 'perspective', 100, 2000, 1)
//   .name('Perspective (px)')
//   .onChange(UPDATE)
// SCENE_FOLDER.add(CONFIG, 'rotate-x', -360, 360, 1)
//   .name('Rotate X (deg)')
//   .onChange(UPDATE)
// SCENE_FOLDER.add(CONFIG, 'rotate-y', -360, 360, 1)
//   .name('Rotate Y (deg)')
//   .onChange(UPDATE)
// SCENE_FOLDER.add(CONFIG, 'scene-height', 1, 80, 1)
//   .name('Height (vmin)')
//   .onChange(UPDATE)
// SCENE_FOLDER.add(CONFIG, 'scene-width', 1, 80, 1)
//   .name('Width (vmin)')
//   .onChange(UPDATE)

// UPDATE()
