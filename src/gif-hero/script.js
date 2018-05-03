const root = document.documentElement
const RAF = requestAnimationFrame

let updating = false
// The threshold at which parallax effect should take place
const threshold = window.innerHeight * 0.05
// Distance that effect should take place across
const travel = window.innerHeight * 0.15

const handleScroll = () => {
  if ((window.scrollY >= threshold || window.pageYOffset >= threshold) && ((window.scrollY <= (threshold + travel)) || (window.pageYOffset <= (threshold + travel)))) {
    // At this point work out the travel and send that through to the CSS variables as a ratio
    root.style.setProperty('--ratio', (window.scrollY - threshold) / travel)
  } else if (window.scrollY < threshold) {
    root.style.setProperty('--ratio', 0)
  } else {
    root.style.setProperty('--ratio', 1)
  }
  updating = false
}

window.onscroll = () => {
  if (updating) return
  else {
    updating = true
    RAF(handleScroll)
  }
}