const { TweenMax } = window
const options = {
  rootMargin: '0px',
  threshold: [0, 0.25, 0.5, 0.75, 1.0],
}
const scene = document.querySelector('.scene')
const target = document.querySelector('.target')
const bowl = document.querySelector('.bowl')
const noodles = document.querySelector('.noodles')
const score = document.querySelector('.score')
const start = noodles.offsetHeight
let resetTimeout
const onObserve = entries => {
  for (const entry of entries) {
    if (entry.isIntersecting && window.scrollY !== 0) {
      bowl.style.background = 'purple'
      bowl.classList.add('bowl--shaking')
      const newHeight = noodles.offsetHeight + target.offsetHeight
      TweenMax.to(scene, 0.1, {
        height: scene.offsetHeight + target.offsetHeight,
      })
      TweenMax.to(noodles, 0.1, {
        height: newHeight,
      })
      score.innerHTML = newHeight - start
    } else {
      // TODO: DEBOUNCE THIS
      const resetBowl = () => {
        // console.info('running ever?')
        bowl.classList.remove('bowl--shaking')
        bowl.style.background = 'red'
        resetTimeout = null
      }
      if (resetTimeout) clearTimeout(resetTimeout)
      resetTimeout = setTimeout(resetBowl, 1000)
    }
  }
}
const observer = new IntersectionObserver(onObserve, options)
observer.observe(target)
