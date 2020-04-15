const {
  Splitting,
  gsap: { timeline, set },
} = window

const CLIP = new Audio(
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/t-shirt-cannon-pop.mp3'
)
// Split the order letter
Splitting()

const SHIRT_SEGMENTS = [...document.querySelectorAll('.t-shirt')]
const SHIRT = document.querySelector('.t-shirt__wrapper')
const LEFT_ARM = SHIRT_SEGMENTS[1]
const RIGHT_ARM = SHIRT_SEGMENTS[2]
const FOLD = SHIRT_SEGMENTS[3].querySelector('.t-shirt__fold')
const CLIPS = [...document.querySelectorAll('clipPath rect')]
const BUTTON = document.querySelector('button')

document.documentElement.style.setProperty('--hue', Math.random() * 360)

set(FOLD, { transformOrigin: '50% 100%', scaleY: 0 })
set(CLIPS, { transformOrigin: '50% 0' })
set('.cannon__shirt', { opacity: 0 })
set('.cannon', { y: 28 })
set('.text--ordered .char', { y: '100%' })

const SPEED = 0.15
const FOLD_TL = () =>
  new timeline()
    .to(
      LEFT_ARM,
      {
        duration: SPEED,
        rotateY: -180,
        transformOrigin: `${(22 / 65.3) * 100}% 50%`,
      },
      0
    )
    .to(
      RIGHT_ARM,
      {
        duration: SPEED,
        rotateY: -180,
        transformOrigin: `${((65.3 - 22) / 65.3) * 100}% 50%`,
      },
      SPEED
    )
    .to(FOLD, { duration: SPEED / 4, scaleY: 1 }, SPEED * 2)
    .to(FOLD, { duration: SPEED, y: -47 }, SPEED * 2 + 0.01)
    .to(CLIPS, { duration: SPEED, scaleY: 0.2 }, SPEED * 2)
    .to('.cannon', { duration: SPEED, y: 0 }, SPEED * 2)

// FOLD_TL()

const LOAD_TL = () =>
  new timeline()
    .to('.button__shirt', {
      transformOrigin: '50% 13%',
      rotate: 90,
      duration: 0.15,
    })
    .to('.button__shirt', {
      duration: 0.15,
      y: 60,
    })
    .to('.t-shirt__cannon', {
      y: 5,
      repeat: 1,
      yoyo: true,
      duration: 0.1,
    })
    .to('.t-shirt__cannon', {
      y: 50,
      duration: 0.5,
      delay: 0.1,
    })

const FIRE_TL = () =>
  new timeline()
    .set('.t-shirt__cannon', {
      rotate: 48,
      x: -85,
      scale: 2.5,
    })
    .set('.cannon__shirt', { opacity: 1 })
    .to('.t-shirt__cannon-content', { duration: 1, y: -35 })
    .to('.t-shirt__cannon-content', { duration: 0.25, y: -37.5 })
    .to('.t-shirt__cannon-content', { duration: 0.015, y: -30.5 })
    .to(
      '.cannon__shirt',
      { onStart: () => CLIP.play(), duration: 0.5, y: '-25vmax' },
      '<'
    )
    .to('.text--ordered .char', { duration: 0.15, stagger: 0.1, y: '0%' })
    .to('button', { duration: 7 * 0.15, '--hue': 116, '--lightness': 55 }, '<')

const ORDER_TL = new timeline({ paused: true })
ORDER_TL.set('.cannon__shirt', { opacity: 0 })
ORDER_TL.set('button', { '--hue': 260, '--lightness': 20 })
ORDER_TL.to('button', { scale: 300 / BUTTON.offsetWidth, duration: SPEED })
ORDER_TL.to('.text--order .char', { stagger: 0.1, y: '100%', duration: 0.1 })
ORDER_TL.to(SHIRT, {
  // Based on styling. 25px + 0.5rem
  x: BUTTON.offsetWidth / 2 - 33,
  duration: 0.2,
})
// ORDER_TL.to(BUTTON, { scale: 3 })
ORDER_TL.add(FOLD_TL())
ORDER_TL.add(LOAD_TL())
ORDER_TL.add(FIRE_TL())
BUTTON.addEventListener('click', () => {
  if (ORDER_TL.progress() === 1) {
    // ORDER_TL.restart()
    document.documentElement.style.setProperty('--hue', Math.random() * 360)
    ORDER_TL.time(0)
    ORDER_TL.pause()
  } else if (ORDER_TL.progress() === 0) {
    ORDER_TL.play()
  }
})
