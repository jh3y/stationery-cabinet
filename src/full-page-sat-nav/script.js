const {
  gsap,
  gsap: { set, to, timeline },
  MotionPathPlugin,
  ScrollToPlugin,
} = window

const mirror = (keys, prefix = '', suffix = '') =>
  Object.freeze(
    keys.reduce(
      (obj, key) => ({
        ...obj,
        [`${prefix}${key}${suffix}`]: `${prefix}${key}${suffix}`,
      }),
      {}
    )
  )

const LOCATIONS = mirror(['HOME', 'ABOUT', 'CONTACT', 'WORK'])

if (MotionPathPlugin) gsap.registerPlugin(MotionPathPlugin)
if (ScrollToPlugin) gsap.registerPlugin(ScrollToPlugin)

const DURATION = 0.25
const POSITION_MARKER = (window.POSITION_MARKER = document.querySelector(
  '.sat-nav__position-marker'
))
const SAT_NAV_SCREEN = document.querySelector('.sat-nav__lcd')
const POWER_LED = document.querySelector('.sat-nav__power-led')
const SAT_NAV_OPEN = document.querySelector('.sat-nav__open')
const SAT_NAV_CLOSE = document.querySelector('.sat-nav__close')
const SAT_NAV_BACKDROP = document.querySelector('.sat-nav__backdrop')
const SAT_NAV = document.querySelector('.sat-nav')
const LOCATION_LINKS = document.querySelectorAll('.sat-nav__destination-link')

let STATE = {
  OPEN: false,
  LOCATION: LOCATIONS.HOME,
  TRAVELLING: false,
}

const OFFSET = {
  offsetY: -180,
  offsetX: -42.05,
}
const ROUTES = {
  HOME: {
    CONTACT: {
      path: '#homeToContact',
      reverse: true,
    },
    WORK: {
      path: '#homeToWork',
      reverse: false,
    },
    ABOUT: {
      path: '#homeToAbout',
      reverse: false,
    },
  },
  WORK: {
    HOME: {
      path: '#homeToWork',
      reverse: true,
    },
    CONTACT: {
      path: '#contactToWork',
      reverse: true,
    },
    ABOUT: {
      path: '#workToAbout',
      reverse: true,
    },
  },
  ABOUT: {
    CONTACT: {
      path: '#contactToAbout',
      reverse: true,
    },
    WORK: {
      path: '#workToAbout',
      reverse: false,
    },
    HOME: {
      path: '#homeToAbout',
      reverse: true,
    },
  },
  CONTACT: {
    HOME: {
      path: '#homeToContact',
      reverse: false,
    },
    ABOUT: {
      path: '#contactToAbout',
    },
    WORK: {
      path: '#contactToWork',
    },
  },
}

// Could use this to get the motion path positions??
// Or does GSAP expose a get position method that we can use?
const COORDS = {
  HOME: {
    x: 0,
    y: 0,
  },
  ABOUT: {
    x: '68.9055px',
    y: '34.39497px',
  },
  CONTACT: {
    x: '188.35176px',
    y: '88.64948px',
  },
  WORK: {
    x: '169.067067px',
    y: '18.70866px',
  },
}

set(POSITION_MARKER, { transformOrigin: '50% 50%' })

let OPEN_TL
const close = () => {
  if (OPEN_TL && !STATE.TRAVELLING) OPEN_TL.reverse()
}
OPEN_TL = new timeline({
  onStart: () => {
    SAT_NAV_OPEN.style.display = 'none'
    SAT_NAV_BACKDROP.style.display = 'block'
  },
  onReverseComplete: () => {
    SAT_NAV_BACKDROP.removeEventListener('click', close)
    SAT_NAV_OPEN.style.display = 'block'
    SAT_NAV_BACKDROP.style.display = 'none'
  },
  onComplete: () => {
    SAT_NAV_BACKDROP.addEventListener('click', close)
  },
})
  .add(
    to(SAT_NAV, DURATION, {
      scale: 1,
      left: '50%',
      bottom: '50%',
      x: '-50%',
      y: '50%',
    })
  )
  .add(
    to(SAT_NAV_SCREEN, DURATION / 2, {
      opacity: 1,
    }),
    0
  )
  .add(
    to(POWER_LED, DURATION / 10, {
      '--hue': 115,
    }),
    0
  )
  .add(
    to(SAT_NAV_BACKDROP, DURATION, {
      opacity: 1,
    }),
    0
  )
  .paused(true)
SAT_NAV_OPEN.addEventListener('click', () => OPEN_TL.play())
SAT_NAV_CLOSE.addEventListener('click', () => {
  if (!STATE.TRAVELLING) OPEN_TL.reverse()
})
for (const LINK of LOCATION_LINKS)
  LINK.addEventListener('click', e => {
    if (LINK.dataset.location !== STATE.LOCATION && !STATE.TRAVELLING) {
      const DURATION = Math.random() + 0.5
      new timeline({
        onStart: () => {
          STATE.TRAVELLING = true
          document.querySelector('.page-content').style.scrollSnapType = 'none'
          document
            .querySelector(ROUTES[STATE.LOCATION][LINK.dataset.location].path)
            .style.setProperty('--active', 0.85)
          document
            .querySelector(
              `.sat-nav__destination-link[data-location="${LINK.dataset.location}"]`
            )
            .classList.add('sat-nav__destination-link--active')
          SAT_NAV_CLOSE.style.setProperty('--opacity', 0)
          for (const TITLE of document.querySelectorAll(
            '.sat-nav__destination-title'
          ))
            TITLE.style.setProperty(
              '--opacity',
              TITLE.dataset.location === LINK.dataset.location ? 1 : 0
            )
        },
        onComplete: () => {
          document.querySelector('.page-content').style.scrollSnapType =
            'y mandatory'
          document
            .querySelector(ROUTES[STATE.LOCATION][LINK.dataset.location].path)
            .style.setProperty('--active', 0)
          document
            .querySelector(
              `.sat-nav__destination-link[data-location="${STATE.LOCATION}"]`
            )
            .classList.remove('sat-nav__destination-link--active')
          SAT_NAV_CLOSE.style.setProperty('--opacity', 1)
          for (const TITLE of document.querySelectorAll(
            '.sat-nav__destination-title'
          ))
            TITLE.style.removeProperty('--opacity')
          STATE.TRAVELLING = false
          STATE.LOCATION = LINK.dataset.location
        },
      })
        .add(
          to(POSITION_MARKER, DURATION, {
            runBackwards: ROUTES[STATE.LOCATION][LINK.dataset.location].reverse,
            motionPath: {
              path: ROUTES[STATE.LOCATION][LINK.dataset.location].path,
              ...OFFSET,
            },
          }),
          0
        )
        .add(
          to('.page-content', {
            duration: DURATION,
            scrollTo: {
              y: `section[data-location="${LINK.dataset.location}"]`,
            },
          }),
          0
        )
    }
  })

let options = {
  root: document.querySelector('.page-content'),
  rootMargin: '0px',
  threshold: 1.0,
}

let observer = new IntersectionObserver(e => {
  set(POSITION_MARKER, COORDS[e[0].target.dataset.location])
  if (!STATE.TRAVELLING) STATE.LOCATION = e[0].target.dataset.location
  document
    .querySelector('.sat-nav__destination-link--active')
    .classList.remove('sat-nav__destination-link--active')
  document
    .querySelector(
      `.sat-nav__destination-link[data-location="${e[0].target.dataset.location}"]`
    )
    .classList.add('sat-nav__destination-link--active')
}, options)

for (const SECTION of document.querySelectorAll('section')) {
  observer.observe(SECTION)
}
