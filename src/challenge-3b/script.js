window.addEventListener('click', () => {
  document.body.hidden = true
  setTimeout(() => (document.body.hidden = false), 100)
})
