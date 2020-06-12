const {
  gsap: { timeline, set },
  gsap,
  ScrollTrigger,
} = window

gsap.registerPlugin(ScrollTrigger)

const SOUNDS = {
  CAP: new Audio(
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/cap-gun.mp3'
  ),
  HORN: new Audio(
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/horn.mp3'
  ),
}

SOUNDS.HORN.muted = SOUNDS.CAP.muted = true

const toggleAudio = () => {
  SOUNDS.HORN.muted = SOUNDS.CAP.muted = !SOUNDS.HORN.muted
}

document.querySelector('#volume').addEventListener('input', toggleAudio)

const GUN = document.querySelector('.gun')

set('.gun__barrel-set--one', { y: -20, transformOrigin: '50% 50%' })
set('.gun__flag-flag', { transformOrigin: '50% 0', scaleY: 0 })
set('.gun__flag-post', { transformOrigin: '0 50%', scaleX: 0.15 })
set('.gun__flag-post-end', { transformOrigin: '50% 50%', scale: 0.75 })
set(GUN, { transformOrigin: '50% 0%' })

let config = { strength: 0 }

set('.gun__hammer', { transformOrigin: '50% 75%' })
set('.gun__trigger', { transformOrigin: '40% 15%' })
set('.gun__wrapper', { display: 'block' })

const BASE_DURATION = 0.1
const XLIMIT = 4
const YLIMIT = 4
const RLIMIT = 5
gsap.to(GUN, {
  repeat: -1,
  yoyo: true,
  x: 1,
  y: 1,
  rotation: 0.5,
  duration: BASE_DURATION,
  ease: 'power1.inOut',
  modifiers: {
    y: gsap.utils.unitize(
      value => value * (YLIMIT * (config.strength / 100)),
      'px'
    ),
    // y: () => YLIMIT * config.strength,
    x: gsap.utils.unitize(
      value => value * (XLIMIT * (config.strength / 100)),
      'px'
    ),
    // x: value => (XLIMIT * config.strength) / 100,
    rotation: gsap.utils.unitize(
      value => value * (RLIMIT * (config.strength / 100)),
      'deg'
    ),
    duration: value => BASE_DURATION * (config.strength / 10000),
  },
})

gsap.to('.gun__hammer', {
  rotate: -30,
  scrollTrigger: {
    scrub: true,
    start: 100,
    end: () => window.innerHeight * 2,
  },
})
gsap.to('.gun__trigger', {
  rotate: 30,
  scrollTrigger: {
    scrub: true,
    start: 100,
    end: () => window.innerHeight * 2,
  },
})
gsap.to('.gun__barrel-chamber', {
  y: 10,
  scrollTrigger: {
    scrub: true,
    start: 100,
    end: () => window.innerHeight * 2,
  },
})

gsap.to(config, {
  strength: 100,
  ease: 'none',
  scrollTrigger: {
    // defaults to using the window as the trigger, starting at the top, ending at the bottom.
    scrub: true,
    start: 100,
    end: () => window.innerHeight * 2,
    onEnterBack: () => {
      timeline()
        .to('.gun__flag-flag', { duration: 0.05, scaleY: 0 })
        .to('.gun__flag-post', { duration: 0.05, scaleX: 0.15 })
    },
    onLeave: () => {
      config.strength = 0
      timeline({
        onStart: () => {
          SOUNDS.CAP.play()
          SOUNDS.HORN.play()
        },
      })
        .to('.gun__hammer', { duration: 0.05, rotate: 0 })
        .to('.gun__trigger', { duration: 0.05, rotate: 0 }, 0)
        .to('.gun__barrel-chamber', { duration: 0.05, y: 20 }, 0)
        .to('.gun__flag-post', { duration: 0.05, scaleX: 1 })
        .to('.gun__flag-flag', { duration: 0.05, scaleY: 1 })
    },
  },
})

gsap
  .timeline({
    scrollTrigger: {
      start: () => window.innerHeight * 2,
    },
  })
  .to('.gun__hammer', { duration: 0.1, rotate: 0 })

// Get the scribbles running
const duration = 0.025
const filter = `#scribble`
timeline({ ease: 'steps(1)', repeat: -1 })
  .to(['.gun__flag', '.gun__gun'], {
    duration,
    filter: `url("${filter}A")`,
  })
  .to(['.gun__flag', '.gun__gun'], {
    duration,
    filter: `url("${filter}B")`,
  })
  .to(['.gun__flag', '.gun__gun'], {
    duration,
    filter: `url("${filter}C")`,
  })
  .to(['.gun__flag', '.gun__gun'], {
    duration,
    filter: `url("${filter}D")`,
  })
  .to(['.gun__flag', '.gun__gun'], {
    duration,
    filter: `url("${filter}E")`,
  })
