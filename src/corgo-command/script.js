document.body.addEventListener('click', () => {
  const MARKUP = document.body.innerHTML
  document.body.innerHTML = ''
  requestAnimationFrame(() => {
    document.body.innerHTML = MARKUP
  })
})
