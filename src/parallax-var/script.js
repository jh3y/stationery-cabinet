const root = document.documentElement

const update = (e) => {
  if (e.acceleration && e.acceleration.x !== null) {
    root.style.setProperty('--X', e.acceleration.x)
    root.style.setProperty('--Y', e.acceleration.y)
  } else {
    root.style.setProperty('--X', (e.pageX / innerWidth) - 0.5)
    root.style.setProperty('--Y', (e.pageY / innerHeight) - 0.5)
  }
}

document.body.addEventListener('mousemove', update)
window.ondevicemotion = update
