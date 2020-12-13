CSS.registerProperty({
  name: '--eq',
  syntax: '<number>',
  inherits: false,
  initialValue: 0,
})
CSS.registerProperty({
  name: '--eq-1',
  syntax: '<number>',
  inherits: false,
  initialValue: 0,
})
CSS.registerProperty({
  name: '--eq-2',
  syntax: '<number>',
  inherits: false,
  initialValue: 0,
})
CSS.registerProperty({
  name: '--eq-3',
  syntax: '<number>',
  inherits: false,
  initialValue: 0,
})
CSS.registerProperty({
  name: '--eq-4',
  syntax: '<number>',
  inherits: false,
  initialValue: 0,
})
CSS.registerProperty({
  name: '--eq-5',
  syntax: '<number>',
  inherits: false,
  initialValue: 0,
})
CSS.registerProperty({
  name: '--eq-6',
  syntax: '<number>',
  inherits: false,
  initialValue: 0,
})
CSS.registerProperty({
  name: '--eq-7',
  syntax: '<number>',
  inherits: false,
  initialValue: 0,
})

const worklet = `
const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

if (typeof registerPaint !== 'undefined') {
  class Eq {
    static get inputProperties() {
      return [
        '--eq',
        '--eq-1',
        '--eq-2',
        '--eq-3',
        '--eq-4',
        '--eq-5',
        '--eq-6',
        '--eq-7',
      ]
    }

    paint(ctx, size, properties) {
      const grd = ctx.createLinearGradient(size.width / 2, size.height, size.width / 2, 0)
      grd.addColorStop(0, 'hsl(140, 60%, 40%)')
      grd.addColorStop(0.6, 'hsl(45, 80%, 50%)')
      grd.addColorStop(1, 'hsl(0, 80%, 50%)')
      for (var p = 0; p < 7; p++) {
        ctx.fillStyle = grd
        const HEIGHT =  parseInt(properties.get('--eq-' + (p + 1)));
        ctx.fillRect(p * size.width / 7, size.height - HEIGHT, size.width / 7, HEIGHT)
      }
    }
  }

  registerPaint('eq', Eq)
}`

const workletBlob = URL.createObjectURL(
  new Blob([worklet], { type: 'application/javascript' })
)

window.CSS.paintWorklet.addModule(workletBlob)
