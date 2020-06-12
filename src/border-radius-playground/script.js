const {
  dat: { GUI },
} = window

const CONFIG = {
  height: 50,
  width: 50,
  htr: Math.floor(Math.random() * 100),
  htl: Math.floor(Math.random() * 100),
  hbr: Math.floor(Math.random() * 100),
  hbl: Math.floor(Math.random() * 100),
  vtr: Math.floor(Math.random() * 100),
  vtl: Math.floor(Math.random() * 100),
  vbr: Math.floor(Math.random() * 100),
  vbl: Math.floor(Math.random() * 100),
}

for (const key of Object.keys(CONFIG)) {
  document.documentElement.style.setProperty(`--${key}`, CONFIG[key])
}

const OUTPUT = document.querySelector('.output')

const renderOutput = () => {
  OUTPUT.innerHTML = `border-radius: ${CONFIG.htl}% ${CONFIG.htr}% ${CONFIG.hbr}% ${CONFIG.hbl}% / ${CONFIG.vtl}% ${CONFIG.vtr}% ${CONFIG.vbr}% ${CONFIG.vbl}%;`
}
renderOutput()
const controls = new GUI()
controls
  .add(CONFIG, 'height', 1, 100, 1)
  .onChange(value => {
    document.documentElement.style.setProperty('--height', value)
    renderOutput()
  })
  .name('Height')
controls
  .add(CONFIG, 'width', 1, 100, 1)
  .onChange(value => {
    document.documentElement.style.setProperty('--width', value)
    renderOutput()
  })
  .name('Width')

const H = controls.addFolder('Horizontal Radius')
H.add(CONFIG, 'htl', 0, 100, 1)
  .onChange(value => {
    document.documentElement.style.setProperty('--htl', value)
    renderOutput()
  })
  .name('Top Left')
H.add(CONFIG, 'htr', 0, 100, 1)
  .onChange(value => {
    document.documentElement.style.setProperty('--htr', value)
    renderOutput()
  })
  .name('Top Right')
H.add(CONFIG, 'hbl', 0, 100, 1)
  .onChange(value => {
    document.documentElement.style.setProperty('--hbl', value)
    renderOutput()
  })
  .name('Bottom Left')
H.add(CONFIG, 'hbr', 0, 100, 1)
  .onChange(value => {
    document.documentElement.style.setProperty('--hbr', value)
    renderOutput()
  })
  .name('Bottom Right')

const V = controls.addFolder('Vertical Radius')
V.add(CONFIG, 'vtl', 0, 100, 1)
  .onChange(value => {
    document.documentElement.style.setProperty('--vtl', value)
    renderOutput()
  })
  .name('Top Left')
V.add(CONFIG, 'vtr', 0, 100, 1)
  .onChange(value => {
    document.documentElement.style.setProperty('--vtr', value)
    renderOutput()
  })
  .name('Top Right')
V.add(CONFIG, 'vbl', 0, 100, 1)
  .onChange(value => {
    document.documentElement.style.setProperty('--vbl', value)
    renderOutput()
  })
  .name('Bottom Left')
V.add(CONFIG, 'vbr', 0, 100, 1)
  .onChange(value => {
    document.documentElement.style.setProperty('--vbr', value)
    renderOutput()
  })
  .name('Bottom Right')
