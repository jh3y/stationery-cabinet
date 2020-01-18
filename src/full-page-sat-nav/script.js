const {
  gsap,
  gsap: { set, to },
  MotionPathPlugin,
} = window

if (MotionPathPlugin) gsap.registerPlugin(MotionPathPlugin)

const POSITION_MARKER = document.querySelector('.position-marker')

// Could use this to get the motion path positions??
// Or does GSAP expose a get position method that we can use?
// const LOCATIONS = {
//   HOME: {
//     x: 0,
//     y: 0,
//   },
//   ABOUT: {
//     x: 69,
//     y: 34,
//   },
//   CONTACT: {
//     x: 0,
//     y: 0,
//   },
//   WORK: {
//     x: 0,
//     y: 0,
//   },
// }

set(POSITION_MARKER, { transformOrigin: '50% 50%' })

const ROUTES = {
  HOME: {
    CONTACT: {
      path: '#homeToContact',
      offsetY: -180,
      offsetX: -42.05,
    },
  },
  CONTACT: {
    ABOUT: {
      path: '#contactToAbout',
      offsetY: -180,
      offsetX: -42.05,
    },
  },
}

to(POSITION_MARKER, 5, {
  runBackwards: true,
  onComplete: () => {
    to(POSITION_MARKER, 5, {
      runBackwards: true,
      motionPath: ROUTES.CONTACT.ABOUT,
    })
  },
  motionPath: ROUTES.HOME.CONTACT,
})
