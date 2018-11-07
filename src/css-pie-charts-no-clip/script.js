const pie = document.querySelector('.pie')
const actions = document.querySelector('.actions')
const segments = pie.children

const updateSegment = e => {
  const idx = [...actions.children].indexOf(e.target)
  const key = idx % 2 === 0 ? 'offset' : 'value'
  const toUpdate = segments[Math.floor(idx / 2) - 1]
  toUpdate.style.setProperty(`--${key}`, e.target.value)
}
window.addEventListener('input', updateSegment)
