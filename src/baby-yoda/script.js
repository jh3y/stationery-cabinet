const { gsap, Linear, MotionPathPlugin } = window
//register the plugin (just once)
// const svg = document.querySelector('svg')
// const saberPath = document.getElementById('saberPath')
const lightsaber = document.getElementById('lightsaber')
const beam = document.getElementById('lightsaber__beam')
// const eyelidTop = document.querySelectorAll('.baby__eyelid--top')
// const eyelidBottom = document.querySelectorAll('.baby__eyelid--bottom')
gsap.registerPlugin(MotionPathPlugin)
/**
 * Set things up in the scene
 */
gsap.set(lightsaber, { scale: 1.25, x: 40, y: 125 })
gsap.set(beam, { transformOrigin: 'left', scale: 0 })

gsap.set('.baby__eyelid--top', { transformOrigin: '50%, 0%', scaleY: 0.1 })
gsap.set('.baby__eyelid--bottom', { transformOrigin: '50%, 100%', scaleY: 0.1 })
// Get that timeline started
const TL = new gsap.timeline()
TL.add(
  gsap.to(beam, 0.25, {
    scale: 1,
    yoyo: true,
    repeat: -1,
    repeatDelay: 1,
  })
)

TL.add(
  gsap.to('#lightsaber', {
    duration: 4,
    repeat: -1,
    repeatDelay: 0,
    ease: Linear.easeNone,
    motionPath: {
      path: '#saberpath',
    },
  })
)
TL.add(
  gsap.to('#lightsaber', {
    duration: 4,
    repeat: -1,
    repeatDelay: 0,
    ease: Linear.easeNone,
    rotate: 720,
  }),
  0
)
