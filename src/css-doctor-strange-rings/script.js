const PLAY_BUTTONS = document.querySelectorAll('.play')
const SECTIONS = document.querySelectorAll('section')

const PLAY = e => {
  if (e.currentTarget.parentNode.classList.contains('playing')) {
    e.currentTarget.parentNode.classList.remove('playing')
  } else {
    SECTIONS.forEach(section => {
      section.className = ''
      // Clone and replace the section ring
      const RING = section.querySelector('.sling-ring')
      const NEW_RING = RING.cloneNode(true)
      RING.remove()
      section.appendChild(NEW_RING)
    })
    const TRANSITIONS_RING = document.querySelector('.sling-ring--transitions')
    if ([...e.currentTarget.parentNode.children].indexOf(TRANSITIONS_RING) !== -1) {
      TRANSITIONS_RING.addEventListener('animationend', e => {
        if (e.animationName === 'reveal') {
          // Set a new class on the ring ready for transitions
          TRANSITIONS_RING.classList.add('sling-ring--revealed')
        }
      })
    }
    e.currentTarget.parentNode.classList.add('playing')
  }
}

PLAY_BUTTONS.forEach(button => {
  button.addEventListener('click', PLAY)
})