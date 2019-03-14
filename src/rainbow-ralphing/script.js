const { innerHeight } = window
const THRESHOLD = innerHeight * 0.25

document.body.style.height = `${innerHeight * 2}px`

const handleScroll = () => {
  const scrolled = window.scrollY || window.pageYOffset
  if (scrolled < THRESHOLD) {
    document.documentElement.style.setProperty('--scale', scrolled / THRESHOLD)
    document.documentElement.style.setProperty('--scroll', 0)
  }
  if (scrolled > THRESHOLD) {
    document.documentElement.style.setProperty('--scroll', scrolled - THRESHOLD)
    document.documentElement.style.setProperty('--scale', 1)
  }
}

document.addEventListener('scroll', handleScroll)
