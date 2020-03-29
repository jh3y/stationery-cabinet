const {
  gsap,
  gsap: { set, to, timeline },
  MorphSVGPlugin,
} = window

gsap.registerPlugin(MorphSVGPlugin)

const MOON_GROUP = document.querySelector('.sunny-moony__moon')
const MOON = document.querySelector('.moon')
const SUN_GROUP = document.querySelector('.sunny-moony__sun')
const SUN_RAY_WRAPS = document.querySelectorAll('.sun__ray-wrap')
const SUN_RAYS = document.querySelectorAll('.sun__ray')
const SUN = document.querySelector('.sun')
const CLOUDS = document.querySelectorAll('.clouds')
const STARS = document.querySelectorAll('.stars')
const CLOUD_AND_STARS = document.querySelectorAll('.cloud-and-stars')

const ANGLE = 70
const SWING_SPEED = 0.45
const TRANSFORM_ORIGIN = '50% -150%'
const CENTERED = '50% 50%'

set(document.body, { '--saturation': 80, '--lightness': 50 })
set('.cloud--static', { '--lightness': 100 })
set([SUN, SUN_RAYS], { '--lightness': 50, '--saturation': 85 })
set(SUN_GROUP, { transformOrigin: TRANSFORM_ORIGIN })
set(MOON_GROUP, { transformOrigin: '50% -150%' })
set(MOON, { morphSVG: '.moon__cloud', '--lightness': 100 })
set(SUN_RAY_WRAPS, {
  transformOrigin: CENTERED,
  rotate: index => (360 / 8) * index + 5,
})

set(CLOUD_AND_STARS, { rotate: 0, transformOrigin: '50% -50%' })
set([CLOUDS, STARS], { transformOrigin: '50% 50%', rotate: 0 })
set(CLOUDS, { scale: 0 })
set(STARS, { opacity: 0, scale: 0 })

set(SUN_GROUP, { rotate: -ANGLE })
set(SUN, { morphSVG: '.sun' })
set(SUN_RAYS, { y: 10 })

// Create a swinging sun timeline
const getSunSwing = () =>
  new timeline()
    .add(
      to(SUN, {
        morphSVG: '.sun__cloud',
        duration: SWING_SPEED,
        ease: 'Power4.easeIn',
      }),
      0
    )
    .add(
      to(SUN_GROUP, {
        rotate: 0,
        duration: SWING_SPEED,
        ease: 'Power4.easeIn',
      }),
      0
    )
    .add(
      to(SUN_RAYS, { y: 0, duration: SWING_SPEED, ease: 'Power4.easeIn' }),
      0
    )

// Create a swinging moon timeline
const getMoonSwing = () =>
  new timeline()
    .add(
      to(MOON, {
        morphSVG: '.moon',
        duration: SWING_SPEED,
        ease: 'Power4.easeOut',
      }),
      0
    )
    .add(
      to([MOON_GROUP, CLOUD_AND_STARS], {
        rotate: ANGLE,
        duration: SWING_SPEED,
        ease: 'Power4.easeOut',
      }),
      0
    )
    .add(
      to(STARS, {
        rotate: -ANGLE,
        opacity: 1,
        scale: 1,
        duration: SWING_SPEED,
        ease: 'Power4.easeOut',
      }),
      0
    )
    .add(
      to(CLOUDS, {
        rotate: -ANGLE,
        scale: 1,
        duration: SWING_SPEED,
        ease: 'Power4.easeOut',
      }),
      0
    )

const SWINGERS = new timeline().add(getSunSwing()).add(getMoonSwing())

const COLORISER = new timeline()
  .add(
    to(document.body, {
      '--saturation': 25,
      '--lightness': 20,
      duration: SWING_SPEED * 2,
      ease: 'Power4.easeInOut',
    }),
    0
  )
  .add(
    to([SUN_RAYS, SUN], {
      '--lightness': 75,
      '--saturation': 0,
      duration: SWING_SPEED,
      ease: 'Power4.easeIn',
    }),
    0
  )
  .add(
    to('.cloud--static', {
      '--lightness': 75,
      duration: 0,
      delay: SWING_SPEED,
      ease: 'Power4.easeIn',
    }),
    0
  )

// Sun is a different case if we want to on/off the cloud color. We could do a timeline that spans two iterations
// turning the colors on and off correctly. But it kinda looks better without transitions.
// const SUN_COLOR_TL = new timeline()
//   .add(to([SUN_RAYS, SUN], {'--lightness': 75, '--saturation': 0, duration: SWING_SPEED, ease: 'Power4.easeIn'}), 0)

new timeline({ repeatRefresh: true, repeat: -1, yoyo: true })
  .add(SWINGERS)
  .add(COLORISER, 0)

// GSDevTools.create()
