import Color from 'https://cdn.skypack.dev/color'
const SLIDERS = document.querySelectorAll('input[type="range"]')

const UPDATE = e => {
  document.documentElement.style.setProperty(`--${e.target.id}`, e.target.value)
  document.querySelector(`.label-${e.target.id}`).innerText = `${
    e.target.value
  }${e.target.id !== 'hue' ? '%' : ''}${e.target.id !== 'lightness' ? ',' : ''}`
  const CURRENT_COLOR = Color(
    `hsl(${SLIDERS[0].value}, ${SLIDERS[1].value}%, ${SLIDERS[2].value}%)`
  )
  document.documentElement.style.setProperty(
    '--dark',
    CURRENT_COLOR.isDark() ? 1 : 0
  )
}

for (const SLIDER of SLIDERS) {
  const UPPER = SLIDER.id === 'hue' ? 360 : 100
  SLIDER.value = Math.floor(Math.random() * UPPER)
  document.documentElement.style.setProperty(`--${SLIDER.id}`, SLIDER.value)
  UPDATE({ target: SLIDER })
  SLIDER.addEventListener('input', UPDATE)
}

const COPY = document.querySelector('#copy')
COPY.addEventListener('click', () => {
  document.querySelectorAll('.toast').forEach(toast => toast.remove())
  navigator.clipboard.writeText(
    `hsl(${SLIDERS[0].value}, ${SLIDERS[1].value}%, ${SLIDERS[2].value}%)`
  )
  const EL = document.createElement('div')
  EL.className = 'font-bold text-2xl toast p-4 rounded-md'
  EL.innerText = 'HSL Copied!'
  document.body.appendChild(EL)
})

document.querySelector('.content').classList.add('flex')
