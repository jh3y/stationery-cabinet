const {
  gsap: { timeline, set, registerPlugin },
  ScrollTrigger,
} = window

registerPlugin(ScrollTrigger)

const setClip = () =>
  set('.logo path', {
    x: () => window.innerWidth / 2 - 12,
    y: () => window.innerHeight / 2 - 12,
    scale: 0,
    transformOrigin: '50% 50%',
  })

setClip()
ScrollTrigger.addEventListener('refresh', () => {
  setClip()
  document.documentElement.scrollTop = 0
})

const COMPLETES = [
  ...document.querySelectorAll('.apple-image--complete'),
  document.querySelector('.apple-image--complete'),
]

// Utility function - h/t to https://www.trysmudford.com/blog/linear-interpolation-functions/
const LERP = (x, y, a) => x * (1 - a) + y * a
const CLAMP = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a))
const INVLERP = (x, y, a) => CLAMP((a - x) / (y - x))
const RANGE = (x1, y1, x2, y2, a) => LERP(x2, y2, INVLERP(x1, y1, a))

// Main timeline

/**
 * Apple does nothing.
 * Overlay some text with a darker backdrop that covers the apple
 */
const INTRO_EL = document.querySelector('.section--intro')
const getPos = (el, pos) => {
  const BOUND = el.getBoundingClientRect()
  return BOUND.top + BOUND.height * pos
}
const INTRO = () =>
  timeline({
    scrollTrigger: {
      scrub: 0.5,
      trigger: '.section--intro',
      pin: '.section--intro .section__content',
      start: 'top top',
      end: 'bottom bottom',
    },
  })
    .set('.section--intro .section__content .text', { y: '+=100%', opacity: 0 })
    .set('.section--intro .section__content .blurb p', {
      y: '+=100%',
      opacity: 0,
    })
    .to('.section--intro .section__content', {
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--intro',
        start: 'top top',
        end: 'top -=25%',
        onUpdate: self =>
          document.documentElement.style.setProperty(
            '--alpha',
            self.progress / 2
          ),
      },
    })
    .to('.section--intro .section__content .text', {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--intro',
        start: () => getPos(INTRO_EL, 0.1),
        end: () => getPos(INTRO_EL, 0.2),
      },
    })
    .fromTo(
      '.section--intro .section__content .text',
      {
        y: 0,
        opacity: 1,
      },
      {
        y: '-=100%',
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.section--intro',
          start: () => getPos(INTRO_EL, 0.3),
          end: () => getPos(INTRO_EL, 0.4),
        },
      }
    )
    .to('.section--intro .section__content .blurb p', {
      y: 0,
      opacity: 1,
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--intro',
        start: () => getPos(INTRO_EL, 0.5),
        end: () => getPos(INTRO_EL, 0.6),
      },
    })
    .fromTo(
      '.section--intro .section__content .blurb p',
      {
        y: 0,
        opacity: 1,
      },
      {
        y: '-=100%',
        opacity: 0,
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.section--intro',
          start: () => getPos(INTRO_EL, 0.7),
          end: () => getPos(INTRO_EL, 0.8),
        },
      }
    )
    .to(
      '.section--intro .section__content',
      {
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.section--intro',
          start: () => getPos(INTRO_EL, 0.7),
          end: () => getPos(INTRO_EL, 0.8),
          onUpdate: self =>
            document.documentElement.style.setProperty(
              '--alpha',
              0.5 - self.progress / 2
            ),
        },
      },
      '<'
    )

/**
 * Apple stays fixed, does a dance, disappears
 */
const DANCE = () =>
  timeline({
    scrollTrigger: {
      scrub: true,
      pin: '.section--apple',
      trigger: '.section--intro',
      endTrigger: '.section--dance',
      start: 'top top',
      end: 'bottom bottom',
    },
  })
    .set('.section--apple__apple', { x: 0 })
    .set(COMPLETES[0], { display: 'block' })
    .to(
      {},
      {
        // '--clip': 0,
        scrollTrigger: {
          scrub: true,
          trigger: '.section--dance',
          // pin: '.section--dance .section__content',
          start: 'top -=55%',
          end: 'top -=65%',
          onEnter: () => {
            set('.section--apple', { zIndex: 3 })
          },
          onLeaveBack: () => {
            document
              .querySelector('.section--apple')
              .style.removeProperty('z-index')
          },
          onEnterBack: () => {
            set('.section--apple', { zIndex: 3 })
          },
          onLeave: () => {
            document
              .querySelector('.section--apple')
              .style.removeProperty('z-index')
          },
          onUpdate: self => {
            set('.section--apple .text', {
              '--clip': 100 - self.progress * 100,
            })
          },
        },
      }
    )
    .fromTo(
      '.section--apple__apple',
      {
        x: 0,
      },
      {
        x: () =>
          -document
            .querySelector('.section--apple .text')
            .getBoundingClientRect().width,
        scrollTrigger: {
          scrub: true,
          trigger: '.section--dance',
          start: 'top -=10%',
          end: 'top -=40%',
        },
      }
    )
    .fromTo(
      '.section--apple__apple',
      {
        x: -document
          .querySelector('.section--apple .text')
          .getBoundingClientRect().width,
      },
      {
        x: document
          .querySelector('.section--apple .text')
          .getBoundingClientRect().width,
        scrollTrigger: {
          scrub: true,
          trigger: '.section--dance',
          start: 'top -=50%',
          end: 'top -=80%',
        },
      }
    )
    .to(
      {},
      {
        scrollTrigger: {
          scrub: true,
          trigger: '.section--dance',
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: self => {
            let index
            const start = 0.1
            const end = 0.9
            const midStart = 0.4
            const midEnd = 0.6
            if (self.progress < start) index = 0
            else if (self.progress > end) index = COMPLETES.length - 1
            else if (self.progress > midStart && self.progress < midEnd) {
              index = 6
            } else if (self.progress > start && self.progress < midStart) {
              index = Math.floor(RANGE(start, midStart, 0, 6, self.progress))
            } else if (self.progress > midEnd && self.progress < end) {
              index = Math.floor(RANGE(midEnd, end, 7, 11, self.progress))
            }
            set(COMPLETES, { display: 'none' })
            set(COMPLETES[index], { display: 'block' })

            // change BG too?
            let l = 7
            if (self.progress > 0.9) l = RANGE(0.9, 1, 7, 0, self.progress)
            set(document.documentElement, { '--l': l })
          },
        },
      }
    )

/**
 * The clipper. This is where we intro some text.
 */
const OUTRO_EL = document.querySelector('.section--outro')
const CLIPPER = () =>
  timeline({
    scrollTrigger: {
      scrub: 0.5,
      trigger: '.section--clipper',
      endTrigger: '.section--outro',
      pin: '.section--clipper .section__content',
      start: 'top top',
      end: 'bottom -=50%',
    },
  })
    .set('.section--clipper .text', { opacity: 0, y: '100%' })
    .to('.section--clipper .text', {
      y: '-50%',
      opacity: 1,
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--clipper',
        start: 'top top',
        end: 'top -10%',
      },
    })
    .fromTo(
      '.section--clipper .text',
      {
        y: '-50%',
        opacity: 1,
      },
      {
        y: '-150%',
        opacity: 0,
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.section--clipper',
          start: 'top -20%',
          end: 'top -40%',
        },
      }
    )
    .to('.logo path', {
      ease: 'Power4.easeIn',
      scale: 800,
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--clipper',
        start: 'top -40%',
        end: 'top -95%',
      },
    })
    .to('.backdrop', {
      fill: 'transparent',
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--clipper',
        start: 'top -40%',
        end: 'top -95%',
      },
    })

/**
 * The gobbler.
 * This is where the bg fades to white and the gobble happens.
 * It's actually the last section being white.
 */
const GOBBLERS = [...document.querySelectorAll('.apple-image--gobble')]
const GOBBLE = () =>
  timeline({
    scrollTrigger: {
      scrub: 0.5,
      pin: '.section--outro .section__content',
      trigger: '.section--outro',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => {
        let index
        const start = 0.25
        const end = 0.5
        if (self.progress < start) index = 0
        else if (self.progress > end) index = GOBBLERS.length - 1
        else if (self.progress > start && self.progress < end) {
          index = Math.floor(
            RANGE(start, end, 0, GOBBLERS.length, self.progress)
          )
        }
        set(GOBBLERS, { display: 'none' })
        set(GOBBLERS[index], { display: 'block' })
      },
    },
  })
    .set(GOBBLERS[0], { display: 'block' })
    .to('.section--outro', {
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--outro',
        start: () => 'top 100%',
        end: () => 'top top',
        onLeaveBack: () =>
          document
            .querySelector('.section--outro .section__content')
            .style.removeProperty('--o'),
        onLeave: () => set('.section--outro .section__content', { '--o': 1 }),
        onUpdate: self => OUTRO_EL.style.setProperty('--a', self.progress),
      },
    })
    .to(
      {},
      {
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.section--outro',
          start: 'top -50%',
          end: 'top -60%',
          onUpdate: self =>
            document.documentElement.style.setProperty(
              '--oo',
              self.progress / 2
            ),
        },
      }
    )
    .to('.section--outro .text span', {
      stagger: 0.1,
      opacity: 1,
      y: 0,
      scrollTrigger: {
        scrub: 0.5,
        trigger: '.section--outro',
        start: 'top -70%',
        end: 'top -90%',
      },
    })
timeline()
  .add(INTRO())
  .add(DANCE())
  .add(CLIPPER())
  .add(GOBBLE())
