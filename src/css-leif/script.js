const restart = () => {
  const MARKUP = document.body.innerHTML
  document.body.innerHTML = ''
  requestAnimationFrame(() => (document.body.innerHTML = MARKUP))
}
document.body.addEventListener('click', restart)
