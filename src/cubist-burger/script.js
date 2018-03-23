// Define some bounds for the animation
const awayBounds = [2, 5]
const transitionBounds = [5, 10]
const getTime = (bounds) => Math.floor(Math.random() * bounds[1] + bounds[0])
/**
 * Animates given element recursively and randomly
 * @param {Element} target
 */
const animate = target => {
  const awayDelay = getTime(awayBounds)
  const transition = getTime(transitionBounds)
  const dim = target.getBoundingClientRect()
  const distance = -(dim.x + dim.width)
  const personTl = new TimelineLite({
    delay: awayDelay,
    onStart: () => target.style.visibility = 'visible'
  })
  personTl
    .add(
      TweenMax.from(target, transition, {
        x: distance,
      })
    )
}

const visitors = document.querySelectorAll('.person')
const init = () => {
  visitors.forEach(person => animate(person))
}
setTimeout(init, 2500)
