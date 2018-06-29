const video = document.querySelector('#frame')
const shades = document.querySelector('.shades')
const lenses = shades.querySelectorAll('.shades__lens')
const mouthes = new tracking.ObjectTracker('eye')
mouthes.on('track', (e) => {
  if (e.data.length === 2) {
    // which eye is left and which is right?
    let left
    let right
    if (e.data[0].x < e.data[1].x) {
      left = e.data[0]
      right = e.data[1]
    } else {
      right = e.data[0]
      left = e.data[1]
    }
    const shadesHeight = left.height
    const shadesWidth = ((right.x + right.width) - (left.x))
    const shadesX = (left.x + video.getBoundingClientRect().left)
    const shadesY = (left.y + video.getBoundingClientRect().top)
    // This is all just what has been working on my own face 😓
    shades.style.setProperty('--height', (shadesWidth * 1.5) * 0.3)
    shades.style.setProperty('--width', shadesWidth * 1.5)
    shades.style.setProperty('--x', shadesX - (shadesWidth * 0.25))
    shades.style.setProperty('--y', shadesY + (shadesHeight * 0.1))
  }
})
tracking.track('#frame', mouthes, {camera: true})
