// import gsap from 'https://cdn.skypack.dev/gsap'
const gsap = window.gsap
const { timeline } = gsap
const TRANSFORMER = document.querySelector('.transformer')
const TTEXT = document.querySelector('.transformer__middle')
const duration = 0.2

const AUDIO = {
  CHEER: new Audio('https://assets.codepen.io/605876/kids-cheering.mp3'),
  SIGH: new Audio('https://assets.codepen.io/605876/sigh.mp3'),
  CLICK: new Audio('https://assets.codepen.io/605876/click.mp3'),
  CLAP: new Audio('https://assets.codepen.io/605876/clap.mp3'),
}

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
gsap.set('.heart__segment', {
  opacity: 0,
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
        delay: 0.15,
        duration: 0.35,
        xPercent: 0,
        yPercent: 0,
      },
    ],
  })

const RESIZE_TL = () =>
  timeline({})
    .set('.bear-paw', {
      opacity: 1,
    })
    .to(
      document.documentElement,
      {
        '--backdrop-opacity': 1,
        duration,
      },
      0
    )
    .to(
      document.documentElement,
      {
        '--stroke': 'hsl(326, 56%, 85%)',
        '--color': 'hsl(204, 6%, 16%)',
        duration,
      },
      0
    )
    .to(
      '.transformer__segment',
      {
        background: 'hsl(327, 91%, 96%)',
        duration,
      },
      0
    )
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
    .to(
      '.heart__segment',
      {
        opacity: 1,
        duration,
      },
      0
    )

const SLAP_TL = () =>
  gsap
    .timeline({
      onStart: () => {
        AUDIO.CLAP.play()
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
    .set('.slap__circle', {
      stroke: `hsl(${Math.random() * 359}, 85%, 60%)`,
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
        gsap.delayedCall(0.25, () => AUDIO.CHEER.play())
        gsap.set(['.wiggle', '.dashed__container', '.burst'], {
          display: 'block',
        })
      },
      onComplete: () => {
        gsap.set(['.wiggle', '.dashed__container', '.burst'], {
          display: 'none',
        })
      },
    })
    .set('.celebration-line', {
      stroke: () => `hsl(${Math.random() * 359}, 100%, 70%)`,
    })
    .set('.dashed__line', {
      yPercent: -120,
    })
    .set('.dashed', {
      yPercent: 0,
    })
    .set('.burst', {
      '--rotate': () => Math.random() * 360,
      '--translate': () => Math.random() * 100 + 180,
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
      ['.wiggle__line'],
      {
        strokeDashoffset: -32,
      },
      {
        delay: () => Math.random(),
        yPercent: '+=50',
        duration: 0.5,
        strokeDashoffset: 32,
      },
      0
    )
    .fromTo(
      '.burst__line path',
      {
        strokeDashoffset: -32,
      },
      {
        delay: () => Math.random() * 0.5,
        yPercent: `-=50`,
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
    // Set the hover states concretely
    .set('.transformer__feature', {
      // Setting xPercent is only going to work on desktop
      '--hovered': 1,
    })
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
    .add(SLAP_TL(), '>-0.5')
    .add(CELEBRATE_TL(), '<')
    .add(RESIZE_TL(), '<+0.5')
    .to(
      '.transformer__heart',
      {
        scale: 1.25,
        repeat: 1,
        yoyo: true,
        ease: 'elastic.in',
      },
      '>-0.2'
    )

const RESET_TL = timeline({
  paused: true,
  onStart: () => {
    AUDIO.SIGH.play()
  },
  onComplete: () => {
    gsap.set(['.transformer__heart', '.paw--left', '.bear-paw'], {
      clearProps: 'all',
    })
  },
})
  .set(['.transformer__feature', '.transformer__text'], {
    clearProps: 'all',
  })
  .to('.transformer__front', {
    x: 0,
    duration,
  })
  .to(
    '.heart__segment',
    {
      opacity: 0,
      duration,
    },
    0
  )
  .to(
    '.transformer__outline',
    {
      scaleX: 1,
      duration,
    },
    0
  )
  .to(
    '.transformer__segment',
    {
      background: 'hsl(0, 0%, 100%)',
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
    document.documentElement,
    {
      '--backdrop-opacity': 0,
      '--stroke': 'hsl(180, 3%, 94%)',
      '--color': 'hsl(180, 2%, 77%)',
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
  .to(
    '.paw--left',
    {
      opacity: 1,
      duration,
    },
    0
  )
  .to(
    '.transformer__heart',
    {
      opacity: 0,
      duration,
    },
    0
  )

TRANSFORMER.addEventListener('pointerdown', ({ x, y }) => {
  if (TRANSFORMER.hasAttribute('disabled')) return
  if (TRANSFORMER.getAttribute('aria-pressed') === 'true') {
    TRANSFORMER.setAttribute('aria-pressed', false)
    RESET_TL.restart()
  } else {
    TRANSFORMER.setAttribute('aria-pressed', true)
    TRANSFORMER.setAttribute('disabled', true)
    const SVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const CIRCLE = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    )
    gsap.set(SVG, {
      height: 50,
      width: 50,
      x: x - TRANSFORMER.getBoundingClientRect().left - 25,
      y: y - TRANSFORMER.getBoundingClientRect().top - 25,
      left: 0,
      top: 0,
      overflow: 'visible !important',
      zIndex: 12,
      transformOrigin: '50% 50%',
      position: 'absolute',
      attr: {
        viewBox: '0 0 100 100',
        fill: 'none',
      },
    })
    SVG.appendChild(CIRCLE)
    TRANSFORMER.appendChild(SVG)
    gsap.set(CIRCLE, {
      attr: {
        r: 30,
        cx: 50,
        cy: 50,
      },
      stroke: `hsl(${Math.random() * 359}, 80%, 50%)`,
      strokeWidth: 20,
    })
    gsap
      .timeline({
        onStart: () => TRANSFORMER_TL(),
        onComplete: () => SVG.remove(),
      })
      .fromTo(
        CIRCLE,
        {
          scale: 0,
          transformOrigin: '50% 50%',
        },
        {
          scale: 1.25,
          duration: 0.2,
        }
      )
      .to(
        CIRCLE,
        {
          opacity: 0,
          duration: 0.1,
        },
        '>-0.1'
      )
  }
})

const LIMIT = 5
document.addEventListener('pointermove', ({ x, y }) => {
  const posX = gsap.utils.mapRange(0, window.innerWidth, -LIMIT, LIMIT, x)
  const posY = gsap.utils.mapRange(0, window.innerHeight, -LIMIT, LIMIT, y)
  gsap.set(document.documentElement, {
    '--x': posX,
    '--mx': x,
    '--y': posY,
    '--my': y,
  })
})

gsap.set('.transformer', {
  display: 'block',
})
