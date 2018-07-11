const duotone = document.querySelector('.duotone')
const choosers = {
  darken: document.querySelector('.chooser--darken'),
  lighten: document.querySelector('.chooser--lighten'),
}
const updateTone = (e) => {
  const {
    name,
    value,
  } = e.target
  duotone.style.setProperty(`--${name}`, value)
  choosers[name].style.setProperty('--selectedRotation', e.target.style.getPropertyValue('--angle'))
}
document.body.addEventListener('input', updateTone)