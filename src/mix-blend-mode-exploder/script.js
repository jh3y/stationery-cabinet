const {
  dat: { GUI },
} = window

const CONTROLLER = new GUI({
  width: 300,
  useLocalStorage: true,
})

const CONFIG = {
  exploded: true,
  blended: false,
  rotateX: -30,
  rotateY: 45,
  'bg--one': '#b769b3',
  'bg--two': '#0075ff',
  'hide--one': false,
  'hide--two': false,
  'blend-mode--one': 'darken',
  'blend-mode--two': 'lighten',
}

const OPTIONS = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
]

const mirror = values =>
  Object.freeze(values.reduce((keys, key) => ({ ...keys, [key]: key }), {}))

const generateCSS = () => `
.layer--one {<br/>
  &nbsp;&nbsp;background: ${CONFIG['bg--one']};<br/>
  &nbsp;&nbsp;mix-blend-mode: ${CONFIG['blend-mode--one']};<br/>
}<br/><br/>
.layer--two {<br/>
  &nbsp;&nbsp;background: ${CONFIG['bg--two']};<br/>
  &nbsp;&nbsp;mix-blend-mode: ${CONFIG['blend-mode--two']};<br/>
}
`
let CSS
const BLENDS = mirror(OPTIONS)

const UPDATE = () => {
  for (const KEY of Object.keys(CONFIG))
    document.documentElement.style.setProperty(`--${KEY}`, CONFIG[KEY])
  document.documentElement.style.setProperty(
    '--exploded',
    CONFIG.exploded ? 1 : 0
  )
  document.documentElement.style.setProperty(
    '--blended',
    CONFIG.blended && CONFIG.exploded ? 1 : 0
  )
  document.documentElement.style.setProperty(
    '--hide--one',
    CONFIG['hide--one'] ? 1 : 0
  )
  document.documentElement.style.setProperty(
    '--hide--two',
    CONFIG['hide--two'] ? 1 : 0
  )
  document.querySelector('.css-output').innerHTML = generateCSS()
}

document.documentElement.style.setProperty(
  '--src',
  `url("https://source.unsplash.com/250x350?bear,beach,cat")`
)

const ROTATION = CONTROLLER.addFolder('Rotation')
ROTATION.add(CONFIG, 'rotateX', -45, 45, 1)
  .name('X')
  .onChange(UPDATE)
ROTATION.add(CONFIG, 'rotateY', 0, 90, 1)
  .name('Y')
  .onChange(UPDATE)

const CARD_ONE = CONTROLLER.addFolder('Layer One')
CARD_ONE.addColor(CONFIG, 'bg--one')
  .name('Background')
  .onChange(UPDATE)
CARD_ONE.add(CONFIG, 'blend-mode--one', BLENDS)
  .name('Blend mode')
  .onChange(UPDATE)
CARD_ONE.add(CONFIG, 'hide--one')
  .name('Hide?')
  .onChange(UPDATE)
const CARD_TWO = CONTROLLER.addFolder('Layer Two')
CARD_TWO.addColor(CONFIG, 'bg--two')
  .name('Background')
  .onChange(UPDATE)
CARD_TWO.add(CONFIG, 'blend-mode--two', BLENDS)
  .name('Blend mode')
  .onChange(UPDATE)
CARD_TWO.add(CONFIG, 'hide--two')
  .name('Hide?')
  .onChange(UPDATE)

CSS = CONTROLLER.addFolder('CSS')
const cssElement = document.createElement('li')
cssElement.className = 'css-output'
CSS.domElement.querySelector('ul').append(cssElement)

CONTROLLER.add(CONFIG, 'exploded')
  .name('Explode?')
  .onChange(UPDATE)
CONTROLLER.add(CONFIG, 'blended')
  .name('Blend?')
  .onChange(UPDATE)

UPDATE()
