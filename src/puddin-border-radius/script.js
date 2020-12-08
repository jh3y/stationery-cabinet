const {
  dat: { GUI },
} = window

const CONFIG = {
  height: 25,
  width: 25,
  linked: true,
}

const RADIUS = {
  htr: 50,
  htl: 50,
  hbr: 50,
  hbl: 50,
  vtr: 50,
  vtl: 50,
  vbr: 50,
  vbl: 50,
}

const MERGED = { ...CONFIG, ...RADIUS }

for (const key of Object.keys(MERGED)) {
  document.documentElement.style.setProperty(`--${key}`, MERGED[key])
}

const OUTPUT = document.querySelector('.output')

const renderOutput = () => {
  // Shorthands if htl && vtl && hbr && hbl that's h v.
  if (new Set(Object.values(RADIUS)).size === 1) {
    // If all the same border-radius X%;
    OUTPUT.innerHTML = `border-radius: ${RADIUS.htl}%;`
  } else if (
    CONFIG.linked &&
    RADIUS.htl === RADIUS.hbr &&
    RADIUS.htr === RADIUS.hbl
  ) {
    OUTPUT.innerHTML = `border-radius: ${RADIUS.htl}% ${RADIUS.htr}%;`
  } else if (CONFIG.linked) {
    // If the horizontal and vertical are the same
    OUTPUT.innerHTML = `border-radius: ${RADIUS.vtl}% ${RADIUS.vtr}% ${RADIUS.vbr}% ${RADIUS.vbl}%;`
  } else {
    OUTPUT.innerHTML = `border-radius: ${RADIUS.htl}% ${RADIUS.htr}% ${RADIUS.hbr}% ${RADIUS.hbl}% / ${RADIUS.vtl}% ${RADIUS.vtr}% ${RADIUS.vbr}% ${RADIUS.vbl}%;`
  }
}
renderOutput()

const controls = new GUI()
const update = (target, link) => value => {
  document.documentElement.style.setProperty(`--${target}`, value)
  if (CONFIG.linked && link) {
    RADIUS[link] = value
    document.documentElement.style.setProperty(`--${link}`, value)
    controls.updateDisplay()
  }
  renderOutput()
}

controls
  .add(CONFIG, 'height', 10, 100, 1)
  .onChange(update('height'))
  .name('Height')
controls
  .add(CONFIG, 'width', 10, 100, 1)
  .onChange(update('width'))
  .name('Width')

const H = controls.addFolder('Horizontal Radius')
H.add(RADIUS, 'htl', 0, 100, 1)
  .onChange(update('htl', 'vtl'))
  .name('Top Left')
H.add(RADIUS, 'htr', 0, 100, 1)
  .onChange(update('htr', 'vtr'))
  .name('Top Right')
H.add(RADIUS, 'hbl', 0, 100, 1)
  .onChange(update('hbl', 'vbl'))
  .name('Bottom Left')
H.add(RADIUS, 'hbr', 0, 100, 1)
  .onChange(update('hbr', 'vbr'))
  .name('Bottom Right')

const V = controls.addFolder('Vertical Radius')
V.add(RADIUS, 'vtl', 0, 100, 1)
  .onChange(update('vtl', 'htl'))
  .name('Top Left')
V.add(RADIUS, 'vtr', 0, 100, 1)
  .onChange(update('vtr', 'htr'))
  .name('Top Right')
V.add(RADIUS, 'vbl', 0, 100, 1)
  .onChange(update('vbl', 'hbl'))
  .name('Bottom Left')
V.add(RADIUS, 'vbr', 0, 100, 1)
  .onChange(update('vbr', 'hbr'))
  .name('Bottom Right')
controls.add(CONFIG, 'linked').name('Linked radius')
