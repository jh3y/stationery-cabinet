const {
  dat: { GUI },
} = window

const LABEL = document.querySelector('label')

const CONFIG = {
  'mouth-back': false,
  'mouth-radius': 44,
  'mouth-x': 50,
  'mouth-y': 100,
  'mouth-circle-x': 50,
  'mouth-circle-y': 0,
  'left-x': 25,
  'right-x': 75,
  'left-y': 15,
  'right-y': 15,
}

const CONTROLLER = new GUI()

const UPDATE = () => {
  Object.entries(CONFIG).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value)
  })
  document.documentElement.style.setProperty(
    '--mouth-back',
    CONFIG['mouth-back'] ? 1 : 0
  )
  const MOUTH = `radial-gradient(circle at 50% 0, #FFF 44%, ${
    CONFIG['mouth-back'] ? 'red' : 'transparent'
  } 44%) ${CONFIG['mouth-x']}% ${CONFIG['mouth-y']}% / 10vmin 10vmin;`
  LABEL.innerHTML = `background: ${MOUTH} <br/>`
}

const LEFT_EYE = CONTROLLER.addFolder('Left eye')
LEFT_EYE.add(CONFIG, 'left-x', 0, 100, 1)
  .name('position-x')
  .onChange(UPDATE)
LEFT_EYE.add(CONFIG, 'left-y', 0, 100, 1)
  .name('position-y')
  .onChange(UPDATE)

const RIGHT_EYE = CONTROLLER.addFolder('Right eye')
RIGHT_EYE.add(CONFIG, 'right-x', 0, 100, 1)
  .name('position-x')
  .onChange(UPDATE)
RIGHT_EYE.add(CONFIG, 'right-y', 0, 100, 1)
  .name('position-y')
  .onChange(UPDATE)

const MOUTH = CONTROLLER.addFolder('Mouth')
MOUTH.add(CONFIG, 'mouth-back')
  .name('Show bounds')
  .onChange(UPDATE)
MOUTH.add(CONFIG, 'mouth-radius', 0, 100, 1)
  .name('Circle radius')
  .onChange(UPDATE)
MOUTH.add(CONFIG, 'mouth-x', 0, 100, 1)
  .name('position-x')
  .onChange(UPDATE)
MOUTH.add(CONFIG, 'mouth-y', 0, 100, 1)
  .name('position-y')
  .onChange(UPDATE)
