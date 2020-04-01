const {
  gsap: { to, timeline, set },
} = window

const CONFIG = {
  SPEED: {
    CLOUD: 2,
  },
  COLORS: {
    CLOUD: {
      ON: 100,
      OFF: 65,
    },
  },
}

const CLOUD_WRAPPER = document.querySelector(
  '.cloud__wrapper:not(.cloud__wrapper--baby)'
)
const CLOUD = document.querySelector('.cloud:not(.cloud--baby)')
const RAINBOW = document.querySelector('.rainbow')

set(CLOUD_WRAPPER, { transformOrigin: '135% 55%' })
set(CLOUD, {
  transformOrigin: '50% 50%',
  '--cloud-lightness': CONFIG.COLORS.CLOUD.OFF,
})

const CLOUD_TIMELINE = new timeline()
  // Traveling over the arc
  .add(
    to(CLOUD_WRAPPER, {
      duration: CONFIG.SPEED.CLOUD,
      rotate: 180,
      ease: 'Power4.easeIn',
    })
  )
  // Counter rotating the cloud
  .add(
    to(CLOUD, {
      duration: CONFIG.SPEED.CLOUD,
      rotate: -180,
      '--cloud-lightness': CONFIG.COLORS.CLOUD.ON,
      ease: 'Power4.easeIn',
    }),
    0
  )

set(RAINBOW, { transformOrigin: '50% 100%', rotate: 180 })
const RAINBOW_TL = to(RAINBOW, {
  duration: 2,
  rotate: 360,
  ease: 'Power4.easeIn',
})

// This is the daddy
const MASTER_TL = new timeline()

// Add the cloud timeline
MASTER_TL.add(CLOUD_TIMELINE).add(RAINBOW_TL, 0)

// GSDevTools.create()
