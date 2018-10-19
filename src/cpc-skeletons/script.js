const exam = document.querySelector('.exam')
const xray = document.querySelector('.xray')
const updateXray = e => {
  const y = e.touches ? e.touches[0].clientY : e.y
  const examArea = exam.getBoundingClientRect()
  const xrayArea = xray.getBoundingClientRect()
  const perc = (y - examArea.top) / examArea.height
  const pos = Math.floor(
    Math.max(
      0,
      Math.min(perc * examArea.height, examArea.height - xrayArea.height)
    )
  )
  document.documentElement.style.setProperty('--pos', pos)
}

exam.addEventListener('mousemove', updateXray)
exam.addEventListener('touchmove', updateXray)
