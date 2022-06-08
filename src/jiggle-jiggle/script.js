const START = document.querySelector('.start')
const RESTART = document.querySelector('.restart')

const AUDIO = new Audio(
  'https://assets.codepen.io/605876/my-money-dont-jiggle-jiggle.mp3'
)

const TIMINGS = {
  '--show': 0.25,
  '--hide': 0,
}

Object.keys(TIMINGS).forEach(key =>
  document.documentElement.style.setProperty(key, TIMINGS[key])
)

const JIGGLE = () => {
  // If START is in the DOM, REMOVE
  document.querySelector('.start')?.remove()

  // Now copy the money element into the DOM and reset the attribute on the body
  const MONEY = document.querySelector('.money')
  const MONEY_BAG = document.cloneNode(true)

  document.body.removeAttribute('data-wigglin')

  requestAnimationFrame(() => {
    // Add some class that kicks off the audio and a timeline?
    document.body.setAttribute('data-wigglin', true)
    setTimeout(() => {
      AUDIO.pause()
      AUDIO.currentTime = 0
      AUDIO.play()
    }, (TIMINGS['--show'] + TIMINGS['--hide']) * 1000)
    // The combo of show/hide which we can either set here or grab from the CSS.
  })
}

START.addEventListener('click', JIGGLE)
RESTART.addEventListener('click', JIGGLE)
