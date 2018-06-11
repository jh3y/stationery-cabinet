const spans = document.querySelectorAll('span')
let ready = false
const replay = () => {
  if (ready) {
    setTimeout(() => {
      spans.forEach(s => s.classList.toggle('play'))
      ready = false
      setTimeout(() => spans.forEach(s => s.classList.toggle('play')), 0)
    }, 2000)
  }
  if (!ready) {
    ready = true
  }
}
spans[spans.length - 1].addEventListener('animationend', replay)