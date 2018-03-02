const root = document.documentElement
const tunnel = document.querySelector('.tunnel')

const updateTransformOrigin = (e) => {
  const {
    x,
    y,
  } = e
  const {
    height,
    width,
    x: elX,
    y: elY,
  } = tunnel.getBoundingClientRect()
  const xOrigin = Math.floor(((x - elX) / width) * 100)
  const yOrigin = Math.floor(((y - elY) / height) * 100)
  root.style.setProperty('--xOrigin', xOrigin)
  root.style.setProperty('--yOrigin', yOrigin)
}

tunnel.addEventListener('mouseover', updateTransformOrigin)