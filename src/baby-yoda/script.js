const { gsap, Linear } = window
const { timeline, to, set } = gsap
//register the plugin (just once)
const svg = document.querySelector('svg')
const lightsaber = document.getElementById('lightsaber')
const beam = document.getElementById('lightsaber__beam')
const eyelidsLeft = document.querySelector('.baby__eyelids--left')
const eyelidsRight = document.querySelector('.baby__eyelids--right')
const eyelidsTop = document.querySelectorAll('.baby__eyelid--top')
const eyelidsBottom = document.querySelectorAll('.baby__eyelid--bottom')
const baby = document.querySelector('.baby')
const leftArm = document.querySelector('.baby__arm--left')
const sleeve = document.querySelector('.baby__sleeve')
const hand = document.querySelectorAll('.baby__hand')
const fingers = document.querySelectorAll('.baby__finger')
const palm = document.querySelector('.baby__palm')
const ears = document.querySelectorAll('.baby__ear')
const saberShadow = document.getElementById('saberShadow')
/**
 * Set things up in the scene
 */
const BLINK_SPEED = 0.1
const EYE_OPEN = 1
const EYE_CLOSED = 0.25
const EAR_ROTATION_DEFAULT = 10
const ROCK_SPEED = 0.1
const ROCK_ROTATION = 4
const EAR_SPEED = 0.1
const EAR_DELAY = Math.floor(gsap.utils.random(1, 3))
const EAR_COMBI_DELAY = Math.floor(gsap.utils.random(2, 4))
const EAR_COMBI_REPEAT_DELAY = Math.floor(gsap.utils.random(2, 4))
const SABER_RAISE = 1
const SABER_ROTATE = 0.25
const SABER_ACTIVATE = 0.1
// Had to grab this by running the motion path. Likely a better way 🤔
const MP_HEIGHT = 28.151
/**
 * STATE
 */
let FORCE_TL
let ROCK_SABER_TL
let USING_FORCE = false // registerPlugin(MotionPathPlugin)
set(lightsaber, { transformOrigin: '20%, 50%', scale: 1.25, x: 40, y: 125 })
set(beam, { transformOrigin: 'left', scale: 0 })
set(eyelidsTop, { transformOrigin: '50%, 0%', scaleY: EYE_CLOSED })
set(eyelidsBottom, { transformOrigin: '50%, 100%', scaleY: EYE_CLOSED })
set(ears[0], { transformOrigin: '100% 0', rotate: -EAR_ROTATION_DEFAULT })
set(ears[1], { transformOrigin: '0 0', rotate: EAR_ROTATION_DEFAULT })
set(eyelidsLeft, { transformOrigin: '50% 50%', rotate: -5 })
set(eyelidsRight, { transformOrigin: '50% 50%', rotate: 5 })
set(hand, { y: -1.5, scaleX: 0.75 })
set(palm, { y: 1, transformOrigin: '50%, 50%', scaleX: 0.75 })
set(saberShadow, { transformOrigin: '50% 50%', scale: 0.36, x: -69, y: 25 })
svg.style.setProperty('opacity', '1')
/**
 * There are some recurring timelines that happen at default
 * Blinking, ear wagging
 */
const blinkTL = new timeline({
  repeat: -1,
  delay: gsap.utils.random(1, 5),
  repeatDelay: gsap.utils.random(4, 10),
})
  .add(to(eyelidsTop, BLINK_SPEED, { scaleY: EYE_OPEN }), 0)
  .add(to(eyelidsBottom, BLINK_SPEED, { scaleY: EYE_OPEN }), 0)
  .add(to(eyelidsTop, BLINK_SPEED, { scaleY: EYE_CLOSED }), BLINK_SPEED)
  .add(to(eyelidsBottom, BLINK_SPEED, { scaleY: EYE_CLOSED }), BLINK_SPEED)
const earsTL = new timeline({
  repeat: -1,
  delay: EAR_COMBI_DELAY,
  repeatDelay: EAR_COMBI_REPEAT_DELAY,
})
  .add(to(ears[0], EAR_SPEED, { rotate: 0 }))
  .add(to(ears[0], EAR_SPEED, { rotate: -10, delay: EAR_DELAY }))
  .add(to(ears[1], EAR_SPEED, { rotate: 0, delay: EAR_SPEED * 2 }), 0)
  .add(
    to(ears[1], EAR_SPEED * 1.5, {
      rotate: 10,
      delay: EAR_DELAY,
    }),
    0
  )
const earsUpTL = new timeline({
  onStart: () => earsTL.pause(),
  onReverseComplete: () => earsTL.play(0),
  paused: true,
})
  .add(
    to(ears[0], EAR_SPEED, {
      rotation: 6,
    })
  )
  .add(to(ears[1], EAR_SPEED, { rotation: -6 }), 0)
/**
 * If we mouse over yoda, make the ears perk up!
 *  */
baby.addEventListener('pointerover', () => {
  if (!USING_FORCE) earsUpTL.play()
})
baby.addEventListener('pointerout', () => {
  if (!USING_FORCE) earsUpTL.reverse()
})
const FORCE_SPEED = 0.75
const INIT_SHIFT = FORCE_SPEED * 0.1
const raiseArmTL = () =>
  new timeline({
    onStart: () => {
      earsTL.pause()
      blinkTL.pause()
    },
  })
    .add(
      to(leftArm, FORCE_SPEED, { transformOrigin: '100% 15%', rotate: 45 }),
      0
    )
    .add(to(sleeve, FORCE_SPEED, { y: -2 }), INIT_SHIFT)
    .add(to(ears[0], FORCE_SPEED, { rotation: -18 }), INIT_SHIFT)
    .add(to(ears[1], FORCE_SPEED, { rotation: 18 }), INIT_SHIFT)
    .add(to(fingers[3], FORCE_SPEED, { y: 1 }), INIT_SHIFT)
    .add(to(fingers[4], FORCE_SPEED, { y: 0 }), INIT_SHIFT)
    .add(to(fingers[5], FORCE_SPEED, { y: -1 }), INIT_SHIFT)
    .add(to(eyelidsBottom, FORCE_SPEED, { scaleY: 0.9 }), INIT_SHIFT)
    .add(to(eyelidsTop, FORCE_SPEED, { scaleY: 0.9 }), INIT_SHIFT)
const USE_FORCE_TL = new timeline({ paused: true }).add(
  to(baby, 0.065, { repeat: -1, yoyo: true, x: 0.5 })
)
const genForceTL = opts => {
  return new timeline({
    onReverseComplete: () => {
      earsTL.play(0)
      blinkTL.play(0)
    },
    ...opts,
  }).add(raiseArmTL())
}
new timeline().add(
  to(beam, 0.025, {
    scaleY: 1.25,
    repeat: -1,
    yoyo: true,
  })
)
const ROCK_SABER = () =>
  new timeline({ repeat: -1 })
    .add(
      to(lightsaber, ROCK_SPEED * 0.25, {
        rotate: -ROCK_ROTATION,
      })
    )
    .add(to(lightsaber, ROCK_SPEED * 0.25, { rotate: 0 }))
    .add(
      to(lightsaber, ROCK_SPEED * 0.25, {
        rotate: ROCK_ROTATION,
      })
    )
    .add(to(lightsaber, ROCK_SPEED * 0.25, { rotate: 0 }))
const genSwing = () => {
  const repeat = Math.floor(gsap.utils.random(1, 3))
  const duration = Math.floor(gsap.utils.random(1, 3))
  return new timeline({ delay: 0.25 })
    .add(
      new timeline({
        repeat,
        ease: Linear.easeNone,
      }).add(
        to('#lightsaber', duration, {
          ease: Linear.easeNone,
          motionPath: {
            path: '#saberpath',
            offsetX: -6.9,
          },
        })
      )
    )
    .add(
      new timeline({ repeat, yoyo: false, ease: Linear.easeNone })
        .add(to(lightsaber, duration * 0.25, { rotate: -45 }))
        .add(to(lightsaber, duration * 0.5, { rotate: -135 }))
        .add(to(lightsaber, duration * 0.25, { rotate: -90 })),
      0
    )
}
const getForce = onComplete => {
  return new timeline({
    onComplete,
  })
    .add(to(lightsaber, SABER_RAISE, { y: MP_HEIGHT }), 0)
    .add(to(saberShadow, SABER_RAISE * 0.75, { scale: 0, opacity: 0 }), 0)
    // Rotate the saber on the way up 👍
    .add(to(lightsaber, SABER_ROTATE, { rotate: -90 }), SABER_RAISE * 0.25)
    .add(to(beam, SABER_ACTIVATE, { scale: 1, delay: 0.2 }))
    .add(genSwing())
    .add(to(beam, SABER_ACTIVATE, { scale: 0, delay: 0.5 }))
    .add(
      new timeline({ delay: 0.25 })
        .add(to(lightsaber, SABER_ROTATE, { rotate: 0 }), 0)
        .add(to(lightsaber, SABER_RAISE * 0.5, { y: 125 }), 0)
        .add(
          to(saberShadow, SABER_RAISE * 0.375, { scale: 0.36, opacity: 1 }),
          SABER_RAISE * 0.25
        )
    )
}
// Start using the force to raise and activate the saber
const useTheForce = () => {
  USING_FORCE = true
  USE_FORCE_TL.timeScale(1.5)
  ROCK_SABER_TL.pause()
  set(lightsaber, { rotate: 0 })
  getForce(() => {
    // Once the force is over, reset everything back double time!
    USING_FORCE = false
    USE_FORCE_TL.pause()
    FORCE_TL.timeScale(10).reverse()
  })
}
const onStart = () => {
  if (USING_FORCE) return
  ROCK_SABER_TL = ROCK_SABER()
  USE_FORCE_TL.play()
  FORCE_TL = genForceTL({
    onComplete: useTheForce,
  })
  FORCE_TL.play()
}
const onStop = () => {
  // Only do something if the saber is still shaking
  if (ROCK_SABER_TL && !ROCK_SABER_TL.paused()) {
    ROCK_SABER_TL.pause()
    ROCK_SABER_TL = null
    USE_FORCE_TL.pause()
    FORCE_TL.timeScale(6).reverse()
    set(lightsaber, { rotate: 0 })
  }
  // Else, If we have started something, see it through as it's a nightmare to try and cancel it 👍 😅
}
document.body.addEventListener('pointerdown', onStart)
document.body.addEventListener('pointerup', onStop)
