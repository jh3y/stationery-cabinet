import { GUI } from 'https://cdn.skypack.dev/dat.gui'

const WAVES = document.querySelectorAll('.wave')
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
const UTILS = {
  copyCSS: () => {
    const el = document.createElement('textarea')
    el.value = grabCSS()
    el.height = el.width = 0
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    alert('CSS Saved To Clipboard!')
  },
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
  copySVG: () => {
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

const COLORS = {
  bg: '#366336',
  wave: '#FFFFFF',
}
const BG_IMG = document.querySelector('.vector-wave')

const createWave = () => {
  BG_IMG.querySelector('path').setAttribute('fill', COLORS.wave)
  document.documentElement.style.setProperty(
    '--bg-img',
    `url(data:image/svg+xml;base64,${btoa(BG_IMG.outerHTML)}`
  )
}
createWave()

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
  WAVE.add(CONFIG[index], 'width', 200, 2000, 100)
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
const ACTIONS = CONTROLLER.addFolder('Actions')
ACTIONS.add(UTILS, 'copyCSS').name('Copy CSS')
ACTIONS.add(UTILS, 'downloadCSS').name('Download CSS')
ACTIONS.add(UTILS, 'copySVG').name('Copy SVG')
ACTIONS.add(UTILS, 'downloadSVG').name('Download SVG')
