const ROOT = document.documentElement
const MIN = 10
const THRESHOLD = innerHeight * (1.2 - 0.225)
const update = (e) => {
  const scroll = Math.floor(scrollY / innerHeight * 100)
  if (scrollY > THRESHOLD) {
    const progress = Math.floor(((scrollY - THRESHOLD) / (document.body.scrollHeight - innerHeight - THRESHOLD)) * 100)
    ROOT.style.setProperty('--content', progress)
  }
  ROOT.style.setProperty('--scroll', Math.max(0, Math.min(scroll, 100 - MIN)))
}
window.addEventListener('scroll', update)