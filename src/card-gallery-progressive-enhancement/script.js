import gsap from 'https://cdn.skypack.dev/gsap'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap/ScrollTrigger'

const {
  to,
  set,
  registerPlugin,
  utils: { mapRange, pipe },
} = gsap
registerPlugin(ScrollTrigger)

const CARDS = [...document.querySelectorAll('.gallery__card')]
const NEXT = document.querySelector('.gallery__next')
const PREV = document.querySelector('.gallery__prev')

const getIndex = pipe(mapRange(0, 1, 0, CARDS.length), Math.floor)

// Set the body
set(document.body, {
  width: CARDS.length * CARDS[0].offsetWidth,
})

let INDEX = 20

set(CARDS, {
  opacity: 1,
  scale: 0.01,
})

const AUDIO = {
  WHOOSH: new Audio('https://assets.codepen.io/605876/whoosh-two.mp3'),
}

AUDIO.WHOOSH.volume = 0.5

const playWhoosh = () => {
  AUDIO.WHOOSH.currentTime = 0
  AUDIO.WHOOSH.play()
}

const STATE_MAP = {
  duration: 0.1,
  alpha: [1, 1, 0.75, 0.5, 0, 0.5, 0.75, 1, 1],
  xPercent: [-75, -100, -75, -50, 0, 50, 75, 100, 75],
  scale: [0, 0, 0.25, 0.5, 1, 0.5, 0.25, 0, 0],
  rotateY: [180, 140, 100, 90, 0, -90, -100, -140, -180],
  zIndex: [0, 0, 1, 2, 3, 2, 1, 0, 0],
}

const RENDER = (scroller, initial) => {
  const NEW_INDEX = getIndex(scroller.progress)
  INDEX = NEW_INDEX
  const L1 = INDEX - 1 < 0 ? null : INDEX - 1
  const L2 = INDEX - 2 < 0 ? null : INDEX - 2
  const L3 = INDEX - 3 < 0 ? null : INDEX - 3
  const U1 = INDEX + 1 > CARDS.length - 1 ? null : INDEX + 1
  const U2 = INDEX + 2 > CARDS.length - 1 ? null : INDEX + 2
  const U3 = INDEX + 3 > CARDS.length - 1 ? null : INDEX + 3

  const MAP = [L3, L2, L1, INDEX, U1, U2, U3]

  const addProperty = (index, prop) => {
    // Plus One is important to avoid the padding
    if (MAP.indexOf(index) !== -1)
      return STATE_MAP[prop][MAP.indexOf(index) + 1]
    else
      return index < INDEX
        ? STATE_MAP[prop][0]
        : STATE_MAP[prop][STATE_MAP[prop].length - 1]
  }

  to(CARDS, {
    onComplete: () => {
      if (initial) to('.gallery', { onStart: () => playWhoosh(), opacity: 1 })
      else playWhoosh()
      set(CARDS, {
        attr: { 'data-current': index => (index === INDEX ? 'true' : 'false') },
      })
      set('.gallery__prev', { display: INDEX === 0 ? 'none' : 'block' })
      set('.gallery__next', {
        display: INDEX === CARDS.length - 1 ? 'none' : 'block',
      })
    },
    duration: 0.1,
    scale: index => addProperty(index, 'scale'),
    xPercent: index => addProperty(index, 'xPercent'),
    zIndex: index => addProperty(index, 'zIndex'),
    '--overlay-alpha': index => addProperty(index, 'alpha'),
  })
}
const SCROLLER = ScrollTrigger.create({
  horizontal: true,
  scroller: document.body,
  snap: {
    snapTo: 1 / (CARDS.length - 1),
    duration: 0.1,
  },
  onUpdate: self => {
    const NEW_INDEX = getIndex(self.progress)
    if (CARDS[NEW_INDEX] && NEW_INDEX !== INDEX) RENDER(self)
  },
})
RENDER(SCROLLER, true)
set(document.body, {
  scrollLeft: document.body.scrollWidth * 0.5,
})

// Hook up Next/Prev buttons.
NEXT.addEventListener('click', () => {
  const DESTINATION = (INDEX + 1) * ((SCROLLER.end - 0.1) / (CARDS.length - 1))
  SCROLLER.scroll(DESTINATION)
})
PREV.addEventListener('click', () => {
  SCROLLER.scroll((INDEX - 1) * ((SCROLLER.end - 0.1) / (CARDS.length - 1)))
})
