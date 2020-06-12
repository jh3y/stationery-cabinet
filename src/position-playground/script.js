const {
  dat: { GUI },
} = window

const CONFIG = {
  relative: false,
  t: Math.floor(Math.random() * 100),
  r: Math.floor(Math.random() * 100),
  b: Math.floor(Math.random() * 100),
  l: Math.floor(Math.random() * 100),
}

for (const key of Object.keys(CONFIG).filter(k => k !== 'relative')) {
  document.documentElement.style.setProperty(`--${key}`, CONFIG[key])
}

const CONTAINER = document.querySelector('.container')
const LABEL = document.querySelector('.label')

const controls = new GUI({
  width: 310,
})
controls
  .add(CONFIG, 't', 0, 100, 1)
  .onChange(value => {
    document.documentElement.style.setProperty('--t', value)
  })
  .name('Top (%)')
controls
  .add(CONFIG, 'l', 0, 100, 1)
  .onChange(value => {
    document.documentElement.style.setProperty('--l', value)
  })
  .name('Left (%)')
controls
  .add(CONFIG, 'relative', 0, 100, 1)
  .onChange(value => {
    CONTAINER.style.position = value ? 'relative' : 'static'
    LABEL.innerHTML = `position: ${value ? 'relative' : 'static'}`
  })
  .name('Relative container')
