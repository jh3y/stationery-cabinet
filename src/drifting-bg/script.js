const $loadingScreen = document.querySelector('.loading-screen')
const $lastToGo = document.querySelector(
  '.loading-screen .bg:nth-of-type(6) div:nth-of-type(1)'
)
const $colorPicker = document.querySelector('input')
let count = 0
const loop = () => {
  count++
  if (count % 2 === 0) {
    $loadingScreen.classList.remove('loading-screen--loading')
    setTimeout(
      () => $loadingScreen.classList.add('loading-screen--loading'),
      750
    )
  }
}
const updateColor = e => {
  // Need four colors here
  const c = net.brehaut.Color(e.target.value)
  document.documentElement.style.setProperty('--bg1', e.target.value)
  document.documentElement.style.setProperty(
    '--bg2',
    c.lightenByAmount(0.2).toCSSHex()
  )
  document.documentElement.style.setProperty(
    '--bg3',
    c.lightenByAmount(0.4).toCSSHex()
  )
  document.documentElement.style.setProperty(
    '--bg4',
    c.lightenByAmount(0.6).toCSSHex()
  )
}

$lastToGo.addEventListener('animationend', loop)
$colorPicker.addEventListener('input', updateColor)
