const {
  gsap: {
    to,
    set,
    timeline,
    utils: { random },
  },
} = window

/**
 * Audio Attribution
 * Towel Defence Ingame[https://freemusicarchive.org/music/sawsquarenoise/Towel_Defence_OST/Towel_Defence_Ingame] by sawsquarenoise[https://freemusicarchive.org/music/sawsquarenoise]. Licensed under CC BY 4.0[https://creativecommons.org/licenses/by/4.0/]
 * Keyboard Typing[https://freesound.org/people/Trollarch2/sounds/331656/] by Trollarch2[https://freesound.org/people/Trollarch2/]. Licensed under CC 0[https://creativecommons.org/publicdomain/zero/1.0/]
 * success_02.wav[https://freesound.org/people/gamer127/sounds/463067/] by gamer127[https://freesound.org/people/gamer127/]. Licensed under CC 0[http://creativecommons.org/publicdomain/zero/1.0/]
 */

const AUDIO = {
  TADA: new Audio('https://assets.codepen.io/605876/chip--success.mp3'),
  CLACKING: new Audio(
    'https://assets.codepen.io/605876/keyboard-typing-mechanical.mp3'
  ),
  TUNE: new Audio(
    'https://assets.codepen.io/605876/ChipTune-SawSquareNoise--TRIMMED.mp3'
  ),
}
AUDIO.TADA.muted = AUDIO.CLACKING.muted = AUDIO.TUNE.muted = true
AUDIO.TUNE.volume = 0.75
AUDIO.CLACKING.playbackRate = 2
AUDIO.TUNE.loop = AUDIO.CLACKING.loop = true

const toggleAudio = () => {
  AUDIO.TADA.muted = AUDIO.CLACKING.muted = AUDIO.TUNE.muted = !AUDIO.TUNE.muted
}

document.querySelector('#volume').addEventListener('input', toggleAudio)

const TIMING = {
  DOWN: 0.2,
  UP: 0.5,
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
  set('.vvg__head-group', { transformOrigin: '50% 60%' })
  set('.vvg__bulb-dashes', { transformOrigin: '50% 50%', scale: 0, opacity: 1 })
  set('.vvg__bulb', { display: 'none' })
  set('.vvg__code-block', { scale: 0 })
  set('.vvg__code-block', {
    '--block-color': () => `var(--owl-${Math.floor(random(1, 6))})`,
    rotation: () => random(-45, 45),
  })
}

const LAPTOP_ROCK = timeline({
  paused: true,
})
  .to('.vvg__laptop', {
    repeatRefresh: true,
    repeat: -1,
    yoyo: true,
    duration: 0.1,
    xPercent: () => random(-4, 4),
    yPercent: () => random(-4, -1),
  })
  .to('.vvg__head-group', {
    repeat: -1,
    yoyo: true,
    duration: 0.1,
    yPercent: '+=1',
  })

let THINK_TL
const THINK = () => {
  const delay = random(1, 3)
  const repeatDelay = random(2, 5)
  THINK_TL = timeline().to('.vvg__head-group', {
    delay,
    repeatDelay,
    onComplete: () => THINK(),
    rotate: () => random(-10, 10),
    repeat: 1,
    yoyo: true,
    duration: () => random(1, 3),
  })
}
THINK()

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
        duration: () => random(0.25, 2),
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
    .to('.vvg__head-group', {
      rotate: 0,
      duration: 0.2,
      onStart: () => {
        THINK_TL.kill()
      },
    })
    .to('.vvg__bulb-dashes', { scale: 1.5, duration: 0.35 })
    .to('.vvg__bulb-dashes', { opacity: 0, duration: 0.2 }, '>-0.1')

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
      LAPTOP_ROCK.restart()
      FIRE_BLOCKS.restart()
      AUDIO.CLACKING.play()
      AUDIO.TUNE.play()
    },
    onStart: () => {
      set(['.vvg__eyebrows', '.vvg__bulb'], { display: 'none' })
    },
  })
    .to('.vvg__head-group', { duration: TIMING.DOWN, yPercent: 10 }, 0)
    .to('.vvg__eyes', { duration: TIMING.DOWN, scaleY: 0.9, yPercent: 75 }, 0)
    .to(['.vvg__cheeks'], { duration: TIMING.DOWN, yPercent: 55 }, 0)
    .to('.vvg__cap', { duration: TIMING.DOWN, yPercent: 10 }, 0)
    .to('.vvg__moustache', { duration: TIMING.DOWN, yPercent: 20 }, 0)
    .to('.vvg__ear', { duration: TIMING.DOWN, yPercent: -40, scaleY: 0.85 }, 0)

const UP = delay =>
  timeline({
    delay,
    onStart: () => {
      EYE_ROCK.pause()
      EYE_ROCK.time(0)
      LAPTOP_ROCK.pause()
      LAPTOP_ROCK.time(0)
      FIRE_BLOCKS.pause()
      FIRE_BLOCKS.time(0)
      AUDIO.CLACKING.pause()
      AUDIO.CLACKING.currentTime = 0
      to(AUDIO.TUNE, {
        volume: 0,
        duration: 1,
        onComplete: () => {
          AUDIO.TUNE.pause()
          AUDIO.TUNE.currentTime = 0
          AUDIO.TUNE.volume = 0.75
        },
      })
      to('.vvg__eyes-group', { xPercent: 0 })
      THINK()
    },
  })
    .to('.vvg__head-group', { duration: TIMING.UP, yPercent: 0 }, 0)
    .to('.vvg__eyes', { duration: TIMING.UP, scaleY: 1 }, 0)
    .to(['.vvg__eyes', '.vvg__cheeks'], { duration: TIMING.UP, yPercent: 0 }, 0)
    .to('.vvg__cap', { duration: TIMING.UP, yPercent: 0 }, 0)
    .to('.vvg__moustache', { duration: TIMING.UP, yPercent: 0 }, 0)
    .to('.vvg__ear', { duration: TIMING.UP, yPercent: 0, scaleY: 1 }, 0)

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
