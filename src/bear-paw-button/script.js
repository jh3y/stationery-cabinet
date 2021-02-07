// import gsap from 'https://cdn.skypack.dev/gsap'
const gsap = window.gsap
const { timeline } = gsap
const TRANSFORMER = document.querySelector('.transformer')
const TTEXT = document.querySelector('.transformer__middle')
const duration = 0.2

gsap.set('.number--next', {
  yPercent: -100,
  opacity: 0,
})
gsap.set('.slap__line', {
  transformOrigin: '50% 50%',
  rotate: index => -45 + index * 45,
})
gsap.set('.slap__line path', {
  transformOrigin: '50% 50%',
  yPercent: -350,
  scaleY: 0.75,
})

/**
 * The Timeline
 * 1. Move Paw to Left
 * 2. Meet to slap in the middle with right paw
 * 3. Paws disappear
 */

const LEFT_PAW_TL = () =>
  timeline({})
    .set('.transformer__feature', {
      transition: 'none',
    })
    .to('.transformer__feature', {
      keyframes: [
        {
          xPercent: -130,
          ease: 'power1.out',
          duration: 0.125,
        },
        {
          xPercent: 20,
          ease: 'power1.in',
          duration: 0.125,
        },
        {
          xPercent: -20,
          delay: 0.1,
          ease: 'power1.out',
          duration: 0.15,
        },
      ],
    })

const RIGHT_PAW_TL = () =>
  timeline().to('.paw--right', {
    keyframes: [
      {
        ease: 'power1.in',
        xPercent: -175,
        yPercent: -125,
        duration: 0.25,
      },
      {
        ease: 'power1.out',
        delay: 0.1,
        duration: 0.15,
        xPercent: 0,
        yPercent: 0,
      },
    ],
  })

const RESIZE_TL = () =>
  timeline({
    delay: 1,
  })
    .set('.bear-paw', {
      opacity: 1,
    })
    .to(
      '.transformer__heart',
      {
        opacity: 1,
        duration,
      },
      0
    )
    .to(
      '.paw--left',
      {
        opacity: 0,
        duration,
      },
      0
    )
    .to(
      '.transformer__feature',
      {
        xPercent: -100,
        duration,
      },
      0
    )
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

const SLAP_TL = () =>
  gsap
    .timeline({
      onStart: () => {
        gsap.set('.slap', {
          display: 'block',
        })
      },
      onComplete: () => {
        gsap.set('.slap', {
          display: 'none',
        })
        gsap.set('.slap__circle', { clearProps: 'all' })
      },
    })
    .to('.slap__circle', {
      strokeWidth: 0,
      scale: 2.5,
      duration: 0.15,
      transformOrigin: '50% 50%',
    })
    .fromTo(
      '.slap__line path',
      {
        strokeDashoffset: -11,
      },
      {
        yPercent: -400,
        duration: 0.15,
        strokeDashoffset: 11,
      },
      0
    )

const CELEBRATE_TL = () =>
  gsap
    .timeline({
      repeatRefresh: true,
      onStart: () => {
        gsap.set(['.wiggle', '.dashed__container'], {
          display: 'block',
        })
      },
      onComplete: () => {
        gsap.set(['.wiggle', '.dashed__container'], {
          display: 'none',
        })
      },
    })
    .set('.dashed__line', {
      yPercent: -120,
    })
    .set('.dashed', {
      yPercent: 0,
    })
    .set(['.wiggle', '.dashed__container'], {
      rotate: () => Math.random() * 360,
    })
    .set(['.wiggle__line', '.dashed'], {
      yPercent: () => Math.random() * 150 + 180,
      scaleY: () => Math.random() + 0.5,
    })
    .fromTo(
      '.dashed__line',
      {
        yPercent: -120,
      },
      {
        yPercent: 120,
        duration: 0.5,
      },
      0
    )
    .to('.dashed', {
      yPercent: 'random(20, 100)',
    })
    .fromTo(
      '.wiggle__line',
      {
        strokeDashoffset: -32,
      },
      {
        yPercent: '+=50',
        duration: 0.5,
        strokeDashoffset: 32,
      },
      0
    )

const TRANSFORMER_TL = () =>
  timeline({
    onComplete: () => {
      TRANSFORMER.removeAttribute('disabled')
    },
  })
    // NOTE:: Remove when not debugging
    // .set('.transformer__feature', {
    //   '--hovered': 1,
    // })
    // Set the hover states concretely
    .set('.bear-paw', {
      opacity: 1,
    })
    .set('.transformer__text', {
      yPercent: 80,
      opacity: 0,
    })
    // Make the left paw movement using the feature element
    // This means the heart and the paw track movement
    .add(LEFT_PAW_TL(), 0.25)
    .add(RIGHT_PAW_TL(), '<')
    .add(SLAP_TL(), '>-0.25')
    .add(CELEBRATE_TL(), '<')
    .add(RESIZE_TL())

const RESET_TL = timeline({
  paused: true,
})
  .set(['.transformer__feature', '.transformer__text', '.paw', '.bear-paw'], {
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
    TRANSFORMER.setAttribute('aria-pressed', true)
    TRANSFORMER.setAttribute('disabled', true)
    // TRANSFORMER_TL.time(0)
    // TRANSFORMER_TL.play()
    TRANSFORMER_TL()
  }
})

// GSDevTools.create({
//   animation: TRANSFORMER_TL,
// })
