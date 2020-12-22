const IFRAME = document.querySelector('iframe')
let time = 13
let timer
window.addEventListener('click', () => {
  // console.info(timer, time)
  if (!timer)
    IFRAME.setAttribute(
      'src',
      `https://www.youtube.com/embed/8NLLAeNhH3k?start=${time}&autoplay=1`
    )
  clearTimeout(timer)
  timer = null
  time += 1
  timer = setTimeout(() => {
    IFRAME.removeAttribute('src')
  }, 3000)
})
