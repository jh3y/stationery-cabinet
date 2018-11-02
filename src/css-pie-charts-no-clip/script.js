const pie = document.querySelector('.pie')
const selected = pie.children[pie.children.length - 1]
const updateSegment = ({ target: { name, value } }) => {
  selected.style.setProperty(`--${name}`, value)
  if (name === 'value')
    selected.style.setProperty('--over180', value > 180 ? 1 : 0)
}
window.addEventListener('input', updateSegment)
