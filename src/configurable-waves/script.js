import { GUI } from 'https://cdn.skypack.dev/dat.gui'

const WAVES = document.querySelectorAll('.wave')
const CONFIG = [
  {
    speed: 30,
    opacity: 0.3,
    height: 12,
    width: 800,
  },
  {
    speed: 45,
    opacity: 0.6,
    height: 12,
    width: 800,
  },
  {
    speed: 15,
    opacity: 1,
    height: 6,
    width: 400,
  },
]
const UTILS = {
  copy: () => {
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

const BG = {
  value: '#543663',
}

const updateWave = index => () => {
  for (const key of Object.keys(CONFIG[index])) {
    WAVES[index].style.setProperty(`--${key}`, CONFIG[index][key])
  }
}

WAVES.forEach((_, index) => updateWave(index)())

const grabCSS = () => `
.wave {
  animation: wave calc(var(--speed, 0) * 1s) infinite linear;
  background-image: url("https://assets.codepen.io/605876/wave--infinite.svg");
  background-size: 50% 100%;
  bottom: -5%;
  height: calc(var(--height, 0) * 1vh);
  left: 0;
  opacity: var(--opacity);
  position: absolute;
  right: 0;
  width: calc(var(--width, 0) * 1vw);
}
@keyframes wave {
  to {
    transform: translate(-50%, 0);
  }
}
.wave:nth-of-type(1) {
  --height: ${CONFIG[0].height};
  --opacity: ${CONFIG[0].opacity};
  --speed: ${CONFIG[0].speed};
  --width: ${CONFIG[0].width};
}
.wave:nth-of-type(2) {
  --height: ${CONFIG[1].height};
  --opacity: ${CONFIG[1].opacity};
  --speed: ${CONFIG[1].speed};
  --width: ${CONFIG[1].width};
}
.wave:nth-of-type(3) {
  --height: ${CONFIG[2].height};
  --opacity: ${CONFIG[2].opacity};
  --speed: ${CONFIG[2].speed};
  --width: ${CONFIG[2].width};
}
`

const CONTROLLER = new GUI({
  width: 300,
})
WAVES.forEach((_, index) => {
  const WAVE = CONTROLLER.addFolder(`Wave ${index + 1}`)
  WAVE.add(CONFIG[index], 'speed', 0.5, 100, 0.1)
    .name('Speed')
    .onChange(updateWave(index))
  WAVE.add(CONFIG[index], 'opacity', 0.1, 1, 0.1)
    .name('Opacity')
    .onChange(updateWave(index))
  WAVE.add(CONFIG[index], 'height', 5, 50, 1)
    .name('Height')
    .onChange(updateWave(index))
  WAVE.add(CONFIG[index], 'width', 200, 1000, 100)
    .name('Width')
    .onChange(updateWave(index))
})
CONTROLLER.addColor(BG, 'value')
  .name('Background Color')
  .onChange(() => document.documentElement.style.setProperty('--bg', BG.value))
CONTROLLER.add(UTILS, 'copy').name('Copy CSS')
