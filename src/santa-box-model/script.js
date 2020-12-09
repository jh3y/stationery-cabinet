const {
  dat: { GUI },
} = window

const CONFIG = {
  'body-width': 100,
  'body-padding': 0,
  'body-margin': 0,
  'body-border': 0,
  'content-box': false,
  'show-box-model': false,
}

const SANTA = document.querySelector('.santa')
const OUTPUT = document.querySelector('.output')

const renderOutput = () => {
  OUTPUT.innerHTML = `box-sizing: ${
    CONFIG['content-box'] ? 'content-box' : 'border-box'
  };`
}

const controls = new GUI({
  width: 320,
})
const update = value => {
  for (const key of Object.keys(CONFIG)) {
    document.documentElement.style.setProperty(`--${key}`, CONFIG[key])
  }
  document.documentElement.style.setProperty(
    `--box-sizing`,
    CONFIG['content-box'] ? 'content-box' : 'border-box'
  )
  document.documentElement.style.setProperty(
    '--belt',
    CONFIG['content-box'] ? 0 : 1
  )

  if (CONFIG['content-box'] || CONFIG['show-box-model'])
    SANTA.classList.add('santa--embarrassed')
  else SANTA.classList.remove('santa--embarrassed')

  document.documentElement.style.setProperty(
    '--show-box-model',
    CONFIG['show-box-model'] ? 1 : 0
  )
  document.documentElement.style.setProperty(
    '--belt',
    CONFIG['content-box'] ? 0 : 1
  )
  renderOutput()
}
update()

const SANTA_FOLDER = controls.addFolder('Santa')
SANTA_FOLDER.add(CONFIG, 'body-width', 80, 150, 1)
  .name('Body width')
  .onChange(update)
SANTA_FOLDER.add(CONFIG, 'body-padding', 0, 40, 1)
  .name('Body padding')
  .onChange(update)
SANTA_FOLDER.add(CONFIG, 'body-margin', 0, 20, 1)
  .name('Body margin')
  .onChange(update)
SANTA_FOLDER.add(CONFIG, 'body-border', 0, 5, 1)
  .name('Body border')
  .onChange(update)
controls
  .add(CONFIG, 'content-box')
  .name('Use content-box?')
  .onChange(update)
controls
  .add(CONFIG, 'show-box-model')
  .name('Show box model?')
  .onChange(update)
