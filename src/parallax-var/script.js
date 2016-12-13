const updateX = (e) => {
  console.info(e)
  document.documentElement.style.setProperty('--offsetX', e.pageX)
  document.documentElement.style.setProperty('--offsetY', e.pageY)
  document.documentElement.style.setProperty('--clientX', window.innerWidth)
  document.documentElement.style.setProperty('--clientY', window.innerHeight)
}
document.body.addEventListener('mousemove', updateX)
