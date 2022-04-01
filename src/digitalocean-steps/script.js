import { GUI } from 'https://cdn.skypack.dev/dat.gui'

const CONFIG = {
	'initial-delay': 1,
  'wave-speed': 2,
  'fade-speed': 0.5,
  'filter-speed': 1,
  'fade-coefficient': 0.75,
  'filter-coefficient': 1.25,
}

const SCENE = document.querySelector('.scene__wrapper')

const UPDATE = () => {
	const CURRENT = SCENE
	SCENE.remove()
	Object.keys(CONFIG).forEach(key => document.documentElement.style.setProperty(`--${key}`, CONFIG[key]))
	requestAnimationFrame(() => document.body.appendChild(CURRENT))
}


const CTRL = new GUI()

CTRL.add(CONFIG, 'initial-delay', 0, 5, 0.1).name('Initial Delay (s)').onFinishChange(UPDATE)
CTRL.add(CONFIG, 'filter-speed', 0, 5, 0.1).name('Filter Speed (s)').onFinishChange(UPDATE)
CTRL.add(CONFIG, 'wave-speed', 0, 5, 0.1).name('Wave Speed (s)').onFinishChange(UPDATE)
CTRL.add(CONFIG, 'fade-speed', 0, 5, 0.1).name('Fade Speed (s)').onFinishChange(UPDATE)
CTRL.add(CONFIG, 'fade-coefficient', 0, 5, 0.01).name('Fade Coefficient').onFinishChange(UPDATE)
CTRL.add(CONFIG, 'filter-coefficient', 0, 5, 0.01).name('Filter Coefficient').onFinishChange(UPDATE)


const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return value => outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}

const BOUNDS = 1     
const updateParallax = ({ x, y }) => {
  const POS_X = mapRange(0, window.innerWidth, -BOUNDS, BOUNDS)(x)
  const POS_Y = mapRange(0, window.innerHeight, -BOUNDS, BOUNDS)(y)
  document.body.style.setProperty('--coefficient-x', POS_X)
  document.body.style.setProperty('--coefficient-y', POS_Y)
}

document.addEventListener('pointermove', updateParallax)

// UPDATE()