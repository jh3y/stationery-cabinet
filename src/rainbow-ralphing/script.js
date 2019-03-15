const input = document.querySelector('input')
const { innerHeight } = window
const onIOS = navigator.platform && /iPad|iPhone/.test(navigator.platform)
// const onIOS = true
if (!onIOS) {
  document.body.style.height = `${innerHeight * 2}px`
} else {
  document.body.classList.add('ios')
}

const THRESHOLD = onIOS ? 25 : innerHeight * 0.25
const handleScroll = e => {
  const progress = onIOS ? e.target.value : window.scrollY || window.pageYOffset
  if (progress < THRESHOLD) {
    document.documentElement.style.setProperty('--scale', progress / THRESHOLD)
    document.documentElement.style.setProperty('--scroll', 0)
  }
  if (progress > THRESHOLD) {
    document.documentElement.style.setProperty(
      '--scroll',
      (progress - THRESHOLD) * (onIOS ? 10 : 1)
    )
    document.documentElement.style.setProperty('--scale', 1)
  }
}

input.addEventListener('input', handleScroll)
document.addEventListener('scroll', handleScroll)
