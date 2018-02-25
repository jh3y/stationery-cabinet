const generateCanvasImageUrl = () => {
  const {
    innerHeight,
    innerWidth,
  } = window
  const pixels = (innerHeight / 1) * (innerWidth / 1)
  // create a canvas element
  const $canvas = document.createElement('canvas')
  const context = $canvas.getContext('2d')
  $canvas.height = innerHeight / 1
  $canvas.width = innerWidth / 1
  for (let pixel = 0; pixel < pixels; pixel++) {
    const x = pixel % innerWidth
    const y = Math.floor(pixel / innerWidth)
    const size = Math.floor(Math.random() * 3 + 1)
    context.fillStyle = '#fff'
    if (Math.random() > 0.9999) context.fillRect(x, y, size, size)
  }
  return $canvas.toDataURL()
}

const $snowSlides = document.querySelectorAll('.snow')
for (let $slide of $snowSlides) $slide.style.background = `url(${generateCanvasImageUrl()})`

