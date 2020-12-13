CSS.registerProperty({
  name: '--noise',
  syntax: '<number>',
  inherits: false,
  initialValue: 0,
})

CSS.registerProperty({
  name: '--noise-cell-size',
  syntax: '<number>',
  inherits: false,
  initialValue: 2,
})

CSS.registerProperty({
  name: '--noise-hue-lower',
  syntax: '<number>',
  inherits: false,
  initialValue: 20,
})

CSS.registerProperty({
  name: '--noise-hue-upper',
  syntax: '<number>',
  inherits: false,
  initialValue: 80,
})

CSS.registerProperty({
  name: '--noise-saturation-lower',
  syntax: '<number>',
  inherits: false,
  initialValue: 80,
})
CSS.registerProperty({
  name: '--noise-saturation-upper',
  syntax: '<number>',
  inherits: false,
  initialValue: 80,
})

CSS.registerProperty({
  name: '--noise-lightness-lower',
  syntax: '<number>',
  inherits: false,
  initialValue: 20,
})

CSS.registerProperty({
  name: '--noise-lightness-upper',
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
      return [
        '--noise',
        '--noise-cell-size',
        '--noise-hue-lower',
        '--noise-hue-upper',
        '--noise-saturation-lower',
        '--noise-saturation-upper',
        '--noise-lightness-lower',
        '--noise-lightness-upper',
      ]
    }

    paint(ctx, size, properties) {
      const CELL_SIZE = parseInt(properties.get('--noise-cell-size'));
      const HUE_LOWER = parseInt(properties.get('--noise-hue-lower'));
      const HUE_UPPER = parseInt(properties.get('--noise-hue-upper'));
      const SATURATION_LOWER = parseInt(properties.get('--noise-saturation-lower'));
      const SATURATION_UPPER = parseInt(properties.get('--noise-saturation-upper'));
      const LIGHTNESS_LOWER = parseInt(properties.get('--noise-lightness-lower'));
      const LIGHTNESS_UPPER = parseInt(properties.get('--noise-lightness-upper'));
      for (var p = 0; p < size.height * size.width; p++) {
        const x = p % size.width
        const y = Math.floor(p / size.width)
        if (x % CELL_SIZE === 0 && y % CELL_SIZE === 0) {
          ctx.fillStyle = 'hsl(' + getRandom(HUE_LOWER, HUE_UPPER) + ', ' + getRandom(SATURATION_LOWER, SATURATION_UPPER) + '%, ' + getRandom(LIGHTNESS_LOWER, LIGHTNESS_UPPER) + '%)'
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
        }
      }
    }
  }

  registerPaint('noise', Noise)
}`

const workletBlob = URL.createObjectURL(
  new Blob([worklet], { type: 'application/javascript' })
)

window.CSS.paintWorklet.addModule(workletBlob)
