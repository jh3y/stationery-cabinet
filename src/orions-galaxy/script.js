const {
  gsap: { set, timeline },
} = window

let zoomed = false

const ORION = document.querySelector('.orion')
// const TURTLE = document.querySelector('.turtle')
const RESET = () => {
  set(ORION, { attr: { viewBox: '0 0 5246.1504 7462.2642' } })
  ORION.removeAttribute('style')
  zoomed = false
}
document.body.addEventListener('click', () => {
  // At this point work out the bigger of viewport dimensions

  const UP = Math.max(window.innerHeight, window.innerWidth)

  // Work out the scale to make the SVG that big

  const BOX = ORION.getBoundingClientRect()

  // Needs to be by the smallest dimension to work
  const SCALE = Math.ceil((UP / BOX.width) * 1.25)

  if (zoomed) {
    timeline({
      ease: 'none',
      onComplete: () => (zoomed = false),
    })
      .to(ORION, {
        ease: 'none',
        attr: {
          viewBox: '0 0 5246.1504 7462.2642',
        },
      })
      .to(ORION, {
        ease: 'none',
        scale: 1,
      })
  } else {
    timeline({
      onComplete: () => (zoomed = true),
    })
      .set(ORION, {
        scale: 1,
        attr: {
          viewBox: '0 0 5246.1504 7462.2642',
        },
      })
      .to(ORION, {
        ease: 'none',
        scale: SCALE,
        duration: 1,
      })
      .to(
        ORION,
        {
          ease: 'none',
          attr: {
            viewBox: '3146.446 4215.751 56.335 6.775',
          },
          duration: 4,
        },
        0
      )
  }
})

// On Resize, reset to non-zoomed for ease.
window.addEventListener('resize', RESET)
