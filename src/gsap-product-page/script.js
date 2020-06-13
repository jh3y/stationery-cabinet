const {
  gsap: { timeline, set, registerPlugin },
  ScrollTrigger,
} = window

registerPlugin(ScrollTrigger)

set('.section', { display: 'block' })

const TEXT_DROP = () =>
  timeline({
    scrollTrigger: {
      scrub: true,
      trigger: '.section--intro',
      pin: '.section--intro .section__content',
      start: 'top top',
      end: 'bottom bottom',
    },
  })
    .to({}, { duration: 0.25 })
    .from('.section--intro .section__content h1', {
      y: '+=100%',
      opacity: 0,
      stagger: 0.1,
      duration: 0.1,
    })
    .to({}, { duration: 0.25 })

const setClip = () =>
  set('.logo path', {
    x: () => window.innerWidth / 2 - 12,
    y: () => window.innerHeight / 2 - 12,
    scale: 3,
    transformOrigin: '50% 50%',
  })
setClip()
ScrollTrigger.addEventListener('refresh', () => setClip())

const CLIPPER = () =>
  timeline({
    scrollTrigger: {
      scrub: true,
      trigger: '.section--clipper',
      pin: '.section--clipper .section__content',
      start: 'top top',
      end: 'bottom bottom',
    },
  })
    .to(
      '.logo path',
      {
        ease: 'Power4.easeIn',
        scale: 800,
        duration: 0.5,
      },
      0
    )
    .to(
      '.backdrop',
      {
        duration: 0.25,
        fill: 'transparent',
      },
      0
    )
    .to({}, { duration: 0.25 })

const ROTATE_TL = () =>
  timeline({
    scrollTrigger: {
      scrub: true,
      trigger: '.section--rotater',
      pin: '.section--rotater .section__content',
      start: 'top top',
      end: 'bottom bottom',
    },
  })
    .to({}, { duration: 0.25 })
    .to('.section--rotater h1', { rotate: 360, duration: 0.5 })
    .to({}, { duration: 0.25 })

const COMPLETES = [...document.querySelectorAll('.apple-image--complete')]
const APPLE_SPIN = () =>
  timeline({
    scrollTrigger: {
      scrub: true,
      trigger: '.section--intro',
      endTrigger: '.section--rotater',
      pin: '.section--apple',
      start: 'top top',
      end: 'bottom bottom',
    },
  })
    .set(COMPLETES[0], { opacity: 0, display: 'block' })
    .to(
      {},
      {
        scrollTrigger: {
          scrub: true,
          start: 'top top',
          trigger: '.section--intro',
          end: 'top -=50%',
          onUpdate: self => {
            set([COMPLETES[0]], { opacity: self.progress })
          },
        },
      }
    )
    .to(
      {},
      {
        scrollTrigger: {
          scrub: true,
          trigger: '.section--rotater',
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: self => {
            // Each image is an eleventh of the whole 1 / 11
            const INDEX = Math.min(Math.floor(self.progress / (1 / 11)), 9)
            // console.info(Math.floor(self.progress / (1 / 11)))
            set(COMPLETES, { display: 'none' })
            set(COMPLETES[INDEX], { display: 'block' })
          },
        },
      }
    )

// set('.apple-image--complete', { attr: { src: () => IMG_STRING() }, opacity: 0 })

// Main timeline
timeline()
  .add(APPLE_SPIN())
  .add(TEXT_DROP())
  .add(ROTATE_TL())
  .add(CLIPPER())
