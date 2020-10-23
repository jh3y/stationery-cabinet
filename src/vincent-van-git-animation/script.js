const {
  gsap: {
    to,
    set,
    timeline,
    utils: { random },
  },
} = window

const AUDIO = {
  TADA: new Audio('https://assets.codepen.io/605876/trumpet-fanfare.mp3'),
}
AUDIO.TADA.muted = true

const STATE = {
  CODING: false,
}

const BLINK = () => {
  const delay = random(2, 6)
  timeline().to('.vvg__eyes', {
    delay,
    onComplete: () => BLINK(),
    scaleY: 0.1,
    repeat: 1,
    yoyo: true,
    duration: 0.05,
  })
}
BLINK()

const RESET = () => {
  set('.vvg__eyebrows', { display: 'none' })
  set(['.vvg__eyes', '.vvg__ear', '.vvg__eyes-group', '.vvg__code-block'], {
    transformOrigin: '50% 50%',
  })
  set('.vvg__bulb-dashes', { transformOrigin: '50% 50%', scale: 0, opacity: 1 })
  set('.vvg__bulb', { display: 'none' })
  set('.vvg__code-block', { scale: 0 })
  set('.vvg__code-block', {
    '--hue': () => random(0, 359),
    rotation: () => random(-45, 45),
  })
}
const FIRE_BLOCKS = timeline({
  paused: true,
})
const BLOCKS = document.querySelectorAll('.vvg__code-block')
for (const BLOCK of BLOCKS) {
  const BLOCK_TL = timeline({
    repeatRefresh: true,
    repeat: -1,
  })
    .set(BLOCK, { scale: 0, xPercent: 0, yPercent: 0 })
    .to(
      BLOCK,
      {
        duration: () => random(0.5, 2),
        scale: () => random(0.5, 2),
        xPercent: () =>
          BLOCK.classList.contains('vvg__code-block--left')
            ? random(-300, -100)
            : random(100, 300),
        yPercent: () => random(-1000, -200),
      },
      0
    )
  FIRE_BLOCKS.add(BLOCK_TL, 0)
}

RESET()
/**
 * Actual Timeline
 * 1. Chillin'
 * 2. Eurekah moment!
 * 2.a. Play sound!
 * 2.b. Show lightbulb && eyebrows
 * 2.c. Animate the lightbulb dashes and switching on the lightbulb.
 * 3.a. Move head down into coding mode - TRICKY PART :(
 * 3.b. Code blocks flying out in random directions
 *
 *
 * 3.c. Head bopping??
 * 4. Rinse and repeat?? repeatDelay of random(won't refresh) or BLINK recursion.
 */
const SHOCK_TL = () =>
  timeline()
    .set(['.vvg__bulb', '.vvg__eyebrows'], { display: 'block' })
    .to('.vvg__bulb-dashes', { scale: 1.5, duration: 1 })
    .to('.vvg__bulb-dashes', { opacity: 0 }, '>-0.25')

const EYE_MOVEMENT = 3
const EYE_ROCK = timeline({
  repeat: -1,
  paused: true,
})
  .to('.vvg__eyes-group', { xPercent: EYE_MOVEMENT })
  .to('.vvg__eyes-group', { xPercent: -EYE_MOVEMENT })

const DOWN = () =>
  timeline({
    onComplete: () => {
      EYE_ROCK.play()
      STATE.CODING = true
      FIRE_BLOCKS.restart()
    },
    onStart: () => {
      set(['.vvg__eyebrows', '.vvg__bulb'], { display: 'none' })
    },
  })
    .to('.vvg__head-group', { yPercent: 10 }, 0)
    .to('.vvg__eyes', { scaleY: 0.9, yPercent: 75 }, 0)
    .to(['.vvg__cheeks'], { yPercent: 55 }, 0)
    .to('.vvg__cap', { yPercent: 10 }, 0)
    .to('.vvg__moustache', { yPercent: 20 }, 0)
    .to('.vvg__ear', { yPercent: -40, scaleY: 0.85 }, 0)

const UP = delay =>
  timeline({
    delay,
    onStart: () => {
      EYE_ROCK.pause()
      FIRE_BLOCKS.pause()
      FIRE_BLOCKS.time(0)
      to('.vvg__eyes-group', { xPercent: 0 })
    },
  })
    .to('.vvg__head-group', { yPercent: 0 }, 0)
    .to('.vvg__eyes', { scaleY: 1 }, 0)
    .to(['.vvg__eyes', '.vvg__cheeks'], { yPercent: 0 }, 0)
    .to('.vvg__cap', { yPercent: 0 }, 0)
    .to('.vvg__moustache', { yPercent: 0 }, 0)
    .to('.vvg__ear', { yPercent: 0, scaleY: 1 }, 0)

// HEAD_TL()

const CODE = () => {
  const delay = random(2, 6)
  timeline({
    delay,
    onComplete: () => {
      RESET()
      CODE()
    },
    onStart: () => {
      AUDIO.TADA.play()
    },
  })
    .add(SHOCK_TL())
    .add(DOWN())
    .add(UP(random(3, 10)))
}

CODE()
