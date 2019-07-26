/**
 * JavaScript only used to update sparkler position 😅
 */ const root = document.documentElement
const update = ({ x, y }) => {
  root.style.setProperty('--x', x)
  root.style.setProperty('--y', y)
}
update({ x: innerWidth / 2, y: innerHeight / 2 })
window.addEventListener('pointermove', update)
window.addEventListener('pointerdown', update)
