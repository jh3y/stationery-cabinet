import { GUI } from 'https://cdn.skypack.dev/dat.gui'

const CONFIG = {
  sides: 30,
  radius: 20,
  height: 30,
  hue: Math.random() * 360,
  start: 0,
  end: 7.5,
  animate: true,
  'base-rotate-x': -24,
  'base-rotate-y': -24,
}

let START
let END

const CYLINDER = document.querySelector('.cylinder')

const CTRL = new GUI()

const UPDATE = () => {
  const innerAngle = (((CONFIG.sides - 2) * 180) / CONFIG.sides) * 0.5
  const cosAngle = Math.cos(innerAngle * (Math.PI / 180))
  const side = 2 * CONFIG.radius * cosAngle
  const projection = Math.sqrt(
    Math.pow(CONFIG.radius, 2) - Math.pow(side / 2, 2)
  )

  for (const key of Object.keys(CONFIG)) {
    CYLINDER.style.setProperty(`--${key}`, CONFIG[key])
  }
  CYLINDER.style.setProperty('--projection', projection)
  CYLINDER.style.setProperty('--side', side)

  // Add the sides however you need to.
  CYLINDER.innerHTML = null

  const FRAG = new DocumentFragment()
  for (let i = 0; i < 2; i++) {
    const END = document.createElement('div')
    END.className = 'cylinder__end cylinder__segment'
    FRAG.appendChild(END)
  }
  for (let s = CONFIG.start; s < CONFIG.end; s++) {
    const SIDE = document.createElement('div')
    SIDE.className = 'cylinder__side cylinder__segment'
    SIDE.style.setProperty('--index', s)
    FRAG.appendChild(SIDE)
  }

  CYLINDER.appendChild(FRAG)

  // Refresh control limits
  START.max(Math.min(CONFIG.sides, CONFIG.end) - 1)
  END.min(CONFIG.start + 1)
  END.max(CONFIG.sides)
}

const SIZE = CTRL.addFolder('Size')
SIZE.add(CONFIG, 'radius', 2, 50, 1)
  .onChange(UPDATE)
  .name('Radius')
SIZE.add(CONFIG, 'height', 5, 50, 1)
  .onChange(UPDATE)
  .name('Height')
const CYL = CTRL.addFolder('Cylinder Config')
CYL.add(CONFIG, 'sides', 5, 100, 1)
  .onChange(UPDATE)
  .name('# of Sides')
START = CYL.add(CONFIG, 'start', 0, Math.min(CONFIG.sides, CONFIG.end) - 1, 1)
  .onChange(UPDATE)
  .name('Start Side')
END = CYL.add(CONFIG, 'end', CONFIG.start + 1, CONFIG.sides, 1)
  .onChange(UPDATE)
  .name('End Side')
CYL.add(CONFIG, 'hue', 0, 360, 1)
  .onChange(UPDATE)
  .name('Hue')
const CAM = CTRL.addFolder('Camera')
CAM.add(CONFIG, 'base-rotate-x', -360, 360, 1)
  .onChange(val =>
    document.documentElement.style.setProperty('--base-rotate-x', val)
  )
  .name('Rotate X')
CAM.add(CONFIG, 'base-rotate-y', -360, 360, 1)
  .onChange(val =>
    document.documentElement.style.setProperty('--base-rotate-y', val)
  )
  .name('Rotate Y')
CAM.add(CONFIG, 'animate')
  .onChange(animate =>
    document.documentElement.style.setProperty('--animate', animate ? 1 : 0)
  )
  .name('Animate')
UPDATE()
