const {
  dat: { GUI },
} = window

const CONFIG = {
  saturation: 100,
  lightness: 50,
}

const CONTROLLER = new GUI()
const UPDATE = () => {
  document.documentElement.style.setProperty('--saturation', CONFIG.saturation)
  document.documentElement.style.setProperty('--lightness', CONFIG.lightness)
}
CONTROLLER.add(CONFIG, 'saturation', 0, 100, 1)
  .name('Saturation')
  .onChange(UPDATE)
CONTROLLER.add(CONFIG, 'lightness', 0, 100, 1)
  .name('Lightness')
  .onChange(UPDATE)

const duotone = document.querySelector('.duotone')
const choosers = {
  darken: document.querySelector('.chooser--darken'),
  lighten: document.querySelector('.chooser--lighten'),
}
const updateTone = e => {
  const { name, value } = e.target
  duotone.style.setProperty(`--${name}`, value)
  choosers[name].style.setProperty(
    '--selectedRotation',
    e.target.style.getPropertyValue('--angle')
  )
}

// Set up drag and drop handling
const onFileDrop = e => {
  e.preventDefault()
  const file = e.dataTransfer.files[0] || e.dataTransfer.getData('URL')
  if (typeof file === 'string')
    duotone.style.setProperty('--img', `url(${file})`)
  else if (file.type.includes('image')) {
    // process the file.
    const reader = new FileReader()
    reader.onloadend = response => {
      try {
        duotone.style.setProperty('--img', `url(${reader.result})`)
      } catch (e) {
        throw Error('Something went wrong', e)
      }
    }
    reader.readAsDataURL(file)
  }
}
// Don't do anything on drag over
document.body.addEventListener('dragover', e => e.preventDefault())
// On drop, process file and take first path
document.body.addEventListener('drop', onFileDrop)
document.body.addEventListener('input', updateTone)
document.body.addEventListener('change', updateTone)
