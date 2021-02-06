import gsap from 'https://cdn.skypack.dev/gsap'
const { timeline } = gsap
const TRANSFORMER = document.querySelector('.transformer')
const TTEXT = document.querySelector('.transformer__middle')
const duration = 0.2

/**
 * The Timeline
 * 1. Move Paw to Left
 * 2. Meet to slap in the middle with right paw
 * 3. Paws disappear
 */

const LEFT_PAW_TL = timeline()
  .to('.paw--left', {
    xPercent: -100,
    duration: 0.5,
  })
  .to('.paw--left', {
    xPercent: 20,
    duration: 0.5,
  })
  .to('.paw--left', {
    xPercent: -50,
    duration: 0.5,
  })

const RIGHT_PAW_TL = timeline().to('.paw--right', {
  xPercent: 10,
  yPercent: 0,
  repeat: 1,
  yoyo: true,
  duration: 0.5,
})

gsap.set('.paw--right', {
  yPercent: 175,
  xPercent: 15,
})

gsap.set('.number--next', {
  yPercent: -100,
  opacity: 0,
})

const RESIZE_TL = timeline()
  .set('.transformer__feature', {
    xPercent: -100,
  })
  .to(
    '.transformer__outline',
    {
      scaleX: 0.6,
      duration,
    },
    0
  )
  .to(
    '.transformer__front',
    {
      x: TTEXT.offsetWidth / 2,
      duration,
    },
    0
  )
  .to(
    '.transformer__back',
    {
      x: -(TTEXT.offsetWidth / 2),
      duration,
    },
    0
  )
  .to(
    '.number.number--current.number--single',
    {
      yPercent: 100,
      opacity: 0,
      duration,
    },
    0
  )
  .to(
    '.number.number--next.number--single',
    {
      yPercent: 0,
      duration,
      opacity: 1,
    },
    0
  )

const TRANSFORMER_TL = timeline({
  paused: true,
})
  .set('.transformer__feature', {
    xPercent: 0,
  })
  .set('.transformer__text', {
    yPercent: 100,
    opacity: 0,
  })
  .add(LEFT_PAW_TL)
  .add(RIGHT_PAW_TL, 0.5)
  .add(RESIZE_TL)

const RESET_TL = timeline({
  paused: true,
})
  .set(['.transformer__feature', '.transformer__text'], {
    clearProps: 'all',
  })
  .to('.transformer__front', {
    x: 0,
    duration,
  })
  .to(
    '.transformer__outline',
    {
      scaleX: 1,
      duration,
    },
    0
  )
  .to(
    '.transformer__back',
    {
      x: 0,
      duration,
    },
    0
  )
  .to(
    '.number.number--current.number--single',
    {
      yPercent: 0,
      duration,
      opacity: 1,
    },
    0
  )
  .to(
    '.number.number--next.number--single',
    {
      yPercent: -100,
      duration,
      opacity: 0,
    },
    0
  )

TRANSFORMER.addEventListener('click', () => {
  if (TRANSFORMER.getAttribute('aria-pressed') === 'true') {
    TRANSFORMER.setAttribute('aria-pressed', false)
    RESET_TL.restart()
  } else {
    TRANSFORMER_TL.restart()
    TRANSFORMER.setAttribute('aria-pressed', true)
  }
})
