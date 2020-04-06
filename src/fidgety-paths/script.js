// JS to restart animation on tap

const TEXT = document.querySelector('.text')
window.addEventListener('click', () => {
  TEXT.hidden = true
  setTimeout(() => (TEXT.hidden = false), 100)
})
