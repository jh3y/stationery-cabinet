const {
  legra,
  drawingContext,
  image,
  createCapture,
  VIDEO,
  createCanvas,
} = window

const CONTAINER = document.querySelector('.container')
let capture
let littleCapture
let legraRenderer
// eslint-disable-next-line
function setup() {
  createCanvas(640, 480).parent(CONTAINER)
  capture = createCapture(VIDEO).parent(CONTAINER)
  littleCapture = createCapture(VIDEO).parent(CONTAINER)
  capture.size(640, 480)
  littleCapture.size(640, 480)
}
// eslint-disable-next-line
function draw() {
  legraRenderer = new legra(drawingContext, 10, { color: 'red' })

  capture.loadPixels()
  for (let y = 0; y < capture.height; y++) {
    for (let x = 0; x < capture.width; x++) {
      let index = (x + y * capture.width) * 4
      let r = capture.pixels[index + 0]
      let g = capture.pixels[index + 1]
      let b = capture.pixels[index + 2]

      // #2374c6
      // #c20f00
      // #000000
      // #ffdd22
      // #ffffff

      const isWhite = r > 170 && g > 170 && b > 170
      const isBlack = r < 85 && g < 85 && b < 85
      const isRed = r > 170
      const isBlue = b > 170
      if (isWhite) {
        capture.pixels[index] = 255
        capture.pixels[index + 1] = 255
        capture.pixels[index + 2] = 255
      } else if (isBlack) {
        capture.pixels[index] = 0
        capture.pixels[index + 1] = 0
        capture.pixels[index + 2] = 0
      } else if (isRed) {
        capture.pixels[index] = 194
        capture.pixels[index + 1] = 15
        capture.pixels[index + 2] = 0
      } else if (isBlue) {
        capture.pixels[index] = 35
        capture.pixels[index + 1] = 116
        capture.pixels[index + 2] = 198
      } else {
        capture.pixels[index] = 255
        capture.pixels[index + 1] = 221
        capture.pixels[index + 2] = 34
      }
    }
  }
  capture.updatePixels()

  image(capture, 0, 0, 640, 480)
  legraRenderer.drawImage(document.querySelector('canvas'), [0, 0])
}

const CHECKER = document.querySelector('input')
CHECKER.addEventListener('change', () => {
  CONTAINER.classList.toggle('show')
})
