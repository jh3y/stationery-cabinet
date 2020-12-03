import { GUI } from 'https://cdn.skypack.dev/dat.gui'
import * as d3 from 'https://cdn.skypack.dev/d3'

const COLORS = {
  bg: '#366336',
  wave: '#FFFFFF',
}

const STYLE_KEYS = {
  CURVE: 'CURVE',
  STEP: 'STEP',
  LINEAR: 'LINEAR',
}
const STYLES = {
  CURVE: d3.curveBasis,
  STEP: d3.curveStep,
  LINEAR: d3.curveLinear,
}

const WAVE_CONFIG = {
  invert: false,
  uniform: false,
  style: STYLE_KEYS.LINEAR,
  width: 100,
  height: 100,
  backgroundWidth: 50,
  backgroundHeight: 100,
}

const CONFIG = [
  {
    speed: 0,
    offset: 0,
    delay: -10,
    opacity: 0.3,
    height: 12,
    width: 800,
  },
  {
    speed: 0,
    offset: 0,
    delay: 0,
    opacity: 0.6,
    height: 8,
    width: 1000,
  },
  {
    speed: 0,
    offset: 0,
    delay: 0,
    opacity: 1,
    height: 6,
    width: 600,
  },
]

const BG_IMG = document.querySelector('.vector-wave')
// const UPPER_BOUNDS = 100
// const LOWER_BOUNDS = 50
// const COORDINATES = [
//   [-10, -100],
//   [0, -50],
//   [10, -100],
//   [20, -50],
//   [30, -120],
//   [40, -50],
//   [50, -125],
//   [60, -50],
//   [70, -100],
//   [80, -50],
//   [90, -100],
//   [100, -50],
//   [110, -100],
// ]

const createWave = () => {
  BG_IMG.querySelector('path').setAttribute('fill', COLORS.wave)
  document.documentElement.style.setProperty(
    '--bg-img',
    `url(data:image/svg+xml;base64,${btoa(BG_IMG.outerHTML)}`
  )
}

let CURRENT_WAVE
const generate = (flip = false) => {
  const length = 5
  const WAVE_SCALE = d3
    .scaleLinear()
    .domain([0, length])
    .range([0, WAVE_CONFIG.width])

  const exclude = index => {
    if (WAVE_CONFIG.style === STYLE_KEYS.CURVE) {
      return (
        index === 0 || index === 1 || index === length - 1 || index === length
      )
    } else if (WAVE_CONFIG.style === STYLE_KEYS.LINEAR) {
      return index === 0 || index === length
    } else {
      return false
    }
  }

  /**
   * TODO: When the curve changes, manipulate the points, don't regenerate.
   * Regnerate when the amount of points or viewbox changes.
   */
  const MID_POINT = WAVE_CONFIG.invert
    ? WAVE_CONFIG.height / 2
    : (WAVE_CONFIG.height / 2) * -1
  const RANGE = WAVE_CONFIG.invert
    ? d3.randomUniform(0, WAVE_CONFIG.height)
    : d3.randomUniform(WAVE_CONFIG.height * -1, 0)
  if (!flip) {
    const W = Array.from({ length: length + 1 }, (_, index) => {
      return [WAVE_SCALE(index), exclude(index) ? MID_POINT : RANGE()]
    })
    CURRENT_WAVE = W
  } else if (flip) {
    // console.info('Flip all the current values')
    CURRENT_WAVE = CURRENT_WAVE.map(point => [point[0], point[1] * -1])
  }
  // console.info(CURRENT_WAVE)

  const LINE = d3.area().curve(STYLES[WAVE_CONFIG.style])(CURRENT_WAVE)

  d3.select('.vector-wave').attr(
    'viewBox',
    `0 ${WAVE_CONFIG.invert ? 0 : WAVE_CONFIG.height * -1} ${
      WAVE_CONFIG.width
    } ${WAVE_CONFIG.height}`
  )

  d3.select('#view rect')
    .attr('x', 0)
    .attr('y', WAVE_CONFIG.invert ? 0 : WAVE_CONFIG.height * -1)
    .attr('height', WAVE_CONFIG.height)
    .attr('width', WAVE_CONFIG.width)

  d3.select('g').attr('transform', `translate(${WAVE_CONFIG.width} 0)`)

  d3.select('.vector-wave path')
    .attr('d', LINE)
    .attr('clip-path', 'url(#view)')
  createWave()
}
WAVE_CONFIG.generate = generate
generate()

const WAVES = document.querySelectorAll('.wave')

const UTILS = {
  downloadCSS: () => {
    const el = document.createElement('textarea')
    el.value = grabCSS()
    el.height = el.width = 0
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    alert('CSS Saved To Clipboard!')
  },
  downloadSVG: () => {
    const el = document.createElement('textarea')
    el.value = grabCSS()
    el.height = el.width = 0
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    alert('CSS Saved To Clipboard!')
  },
}

const updateWave = index => () => {
  for (const key of Object.keys(CONFIG[index])) {
    WAVES[index].style.setProperty(`--${key}`, CONFIG[index][key])
  }
}

WAVES.forEach((_, index) => {
  updateWave(index)()
})

const grabCSS = () => `
:root {
  --wave: ${COLORS.wave};
  --bg: ${COLORS.bg};
}

.wave {
  animation: wave calc(var(--speed, 0) * 1s) calc(var(--delay, 0) * 1s) infinite linear backwards;
  background-image: url("wave.svg");
  background-size: 50% 100%;
  bottom: -1%;
  height: calc(var(--height, 0) * 1vh);
  left: 0;
  opacity: var(--opacity);
  position: absolute;
  right: 0;
  transform: translate(calc(var(--offset, 0) * 1%), 0);
  width: calc(var(--width, 0) * 1vw);
}
@keyframes wave {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(-50%, 0);
  }
}
.wave:nth-of-type(1) {
  --height: ${CONFIG[0].height};
  --opacity: ${CONFIG[0].opacity};
  --offset: ${CONFIG[0].offset};
  --speed: ${CONFIG[0].speed};
  --delay: ${CONFIG[0].delay};
  --width: ${CONFIG[0].width};
}
.wave:nth-of-type(2) {
  --height: ${CONFIG[1].height};
  --opacity: ${CONFIG[1].opacity};
  --offset: ${CONFIG[1].offset};
  --speed: ${CONFIG[1].speed};
  --delay: ${CONFIG[1].delay};
  --width: ${CONFIG[1].width};
}
.wave:nth-of-type(3) {
  --height: ${CONFIG[2].height};
  --opacity: ${CONFIG[2].opacity};
  --offset: ${CONFIG[2].offset};
  --speed: ${CONFIG[2].speed};
  --delay: ${CONFIG[2].delay};
  --width: ${CONFIG[2].width};
}
`

const CONTROLLER = new GUI({
  width: 300,
})
WAVES.forEach((_, index) => {
  const WAVE = CONTROLLER.addFolder(`Wave ${index + 1}`)
  WAVE.add(CONFIG[index], 'speed', 0, 60, 0.1)
    .name('Speed')
    .onChange(updateWave(index))
  WAVE.add(CONFIG[index], 'delay', -20, 0, 0.1)
    .name('Delay')
    .onChange(updateWave(index))
  WAVE.add(CONFIG[index], 'opacity', 0.1, 1, 0.01)
    .name('Opacity')
    .onChange(updateWave(index))
  WAVE.add(CONFIG[index], 'offset', -50, 0, 0.1)
    .name('Offset (Set 0 Speed)')
    .onChange(updateWave(index))
  WAVE.add(CONFIG[index], 'height', 5, 50, 1)
    .name('Height')
    .onChange(updateWave(index))
  WAVE.add(CONFIG[index], 'width', 100, 2000, 100)
    .name('Width')
    .onChange(updateWave(index))
})

const COLOR = CONTROLLER.addFolder('Color')
COLOR.addColor(COLORS, 'bg')
  .name('Background')
  .onChange(() => document.documentElement.style.setProperty('--bg', COLORS.bg))
COLOR.addColor(COLORS, 'wave')
  .name('Wave')
  .onChange(() => {
    document.documentElement.style.setProperty('--wave', COLORS.wave)
    createWave()
  })

const WAVE = CONTROLLER.addFolder('Wave')
WAVE.add(WAVE_CONFIG, 'invert')
  .name('Invert')
  .onChange(() => generate(true))
WAVE.add(WAVE_CONFIG, 'uniform')
  .name('Uniform')
  .onChange(() => generate())
// Dropdown for style
WAVE.add(WAVE_CONFIG, 'style', [
  STYLE_KEYS.CURVE,
  STYLE_KEYS.STEP,
  STYLE_KEYS.LINEAR,
])
  .name('Style')
  .onChange(() => generate())
const VIEWBOX = WAVE.addFolder('Viewbox')
VIEWBOX.add(WAVE_CONFIG, 'height', 10, 1000, 1)
  .name('Height')
  .onChange(() => generate())
VIEWBOX.add(WAVE_CONFIG, 'width', 10, 1000, 1)
  .name('Width')
  .onChange(() => generate())
WAVE.add(WAVE_CONFIG, 'generate').name('Generate')

const ACTIONS = CONTROLLER.addFolder('Actions')
ACTIONS.add(UTILS, 'downloadCSS').name('Download CSS')
ACTIONS.add(UTILS, 'downloadSVG').name('Download SVG')
