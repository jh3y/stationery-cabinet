CSS.registerProperty({
  name: '--noise',
  syntax: '<number>',
  inherits: false,
  initialValue: 0,
})

CSS.registerProperty({
  name: '--noise-lower',
  syntax: '<number>',
  inherits: false,
  initialValue: 20,
})

CSS.registerProperty({
  name: '--noise-upper',
  syntax: '<number>',
  inherits: false,
  initialValue: 80,
})

const worklet = `
const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

if (typeof registerPaint !== 'undefined') {
  class Noise {
    static get inputProperties() {
      return ['--noise','--noise-lower', '--noise-upper']
    }

    paint(ctx, size, properties) {
      const LOWER = parseInt(properties.get('--noise-lower'))
      const UPPER = parseInt(properties.get('--noise-upper'))
      for (var p = 0; p < size.height * size.width; p++) {
        ctx.fillStyle = 'hsl(0, 0%, ' + getRandom(LOWER, UPPER) + '%)'
        const x = p % size.width
        const y = Math.floor(p / size.width)
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }

  registerPaint('noise', Noise)
}`

const workletBlob = URL.createObjectURL(
  new Blob([worklet], { type: 'application/javascript' })
)

window.CSS.paintWorklet.addModule(workletBlob)
