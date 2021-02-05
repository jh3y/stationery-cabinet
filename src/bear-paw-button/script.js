import gsap from 'https://cdn.skypack.dev/gsap'
const { timeline } = gsap

const LIKE_TL = timeline({
  paused: true,
  onStart: () => {
    // Ensure hover is back to 0
    gsap.set(['.like__feature', '.like__text--traveller'], { '--hovered': 0 })
  },
  onReverseComplete: () => {
    // Ensure we remove the set hover.
    gsap.set(['.like__feature', '.like__text--traveller'], {
      clearProps: 'all',
    })
  },
})
  .to('.like__text--spacer', {
    width: 0,
    margin: 0,
    duration: 0.2,
  })
  .to(
    '.like__text--traveller',
    {
      duration: 0.2,
      opacity: 0,
      yPercent: 100,
    },
    0
  )

const BUTTON = document.querySelector('button')
BUTTON.addEventListener('click', () => {
  if (LIKE_TL.progress() === 1) {
    gsap.set(['.like__feature', '.like__text--traveller'], {
      clearProps: 'all',
    })
    LIKE_TL.reverse()
  } else {
    LIKE_TL.restart()
    BUTTON.setAttribute('aria-pressed', true)
  }
})
