const {
  dat: { GUI },
} = window

const CONFIG = {
  SHADES: false,
}

const CONTROLLER = new GUI()
CONTROLLER.add(CONFIG, 'SHADES')
  .name('Shades?')
  .onChange(() => {
    document
      .querySelector('hr')
      .style.setProperty('--shades', CONFIG.SHADES ? 1 : 0)
    const LABEL = document.querySelector('label')
    LABEL.innerText = `--shades: ${CONFIG.SHADES ? 1 : 0};`
  })

const COLORS = {
  LIPSTICK: [
    'hsl(5, 90%, 50%)',
    'hsl(2, 72%, 31%)',
    'hsl(235, 27%, 30%)',
    'hsl(328, 91%, 47%)',
    'hsl(212, 18%, 60%)',
  ],
  TIE: [
    'hsl(232, 4%, 35%)',
    'hsl(2, 72%, 31%)',
    'hsl(55, 74%, 52%)',
    'hsl(56, 33%, 84%)',
    'hsl(224, 51%, 29%)',
    'hsl(60, 2%, 64%)',
    'hsl(157, 20%, 40%)',
  ],
  CAP_BASE: [
    'hsl(232, 4%, 35%)',
    'hsl(232, 4%, 99%)',
    'hsl(232, 4%, 5%)',
    'hsl(232, 4%, 65%)',
  ],
  BEANIE: [
    'hsl(349, 100%, 59%)',
    'hsl(241, 61%, 59%)',
    'hsl(211, 100%, 50%)',
    'hsl(199, 94%, 67%)',
    'hsl(130, 65%, 57%)',
    'hsl(48, 100%, 50%)',
    'hsl(35, 100%, 50%)',
    'hsl(3, 100%, 59%)',
  ],
  CAP_PEAK: [
    'hsl(349, 100%, 59%)',
    'hsl(241, 61%, 59%)',
    'hsl(211, 100%, 50%)',
    'hsl(199, 94%, 67%)',
    'hsl(130, 65%, 57%)',
    'hsl(48, 100%, 50%)',
    'hsl(35, 100%, 50%)',
    'hsl(3, 100%, 59%)',
  ],
  TRILBY: [
    'hsl(232, 4%, 35%)',
    'hsl(33, 43%, 54%)',
    'hsl(55, 74%, 52%)',
    'hsl(56, 33%, 84%)',
    'hsl(60, 2%, 64%)',
    'hsl(30, 55%, 34%)',
    'hsl(195, 27%, 56%)',
  ],
  EYES: [
    'hsl(32, 29%, 40%)',
    'hsl(32, 29%, 30%)',
    'hsl(32, 29%, 20%)',
    'hsl(206, 40%, 40%)',
    'hsl(206, 40%, 50%)',
    'hsl(206, 40%, 60%)',
    'hsl(95, 51%, 40%)',
    'hsl(137, 68%, 40%)',
    'hsl(157, 20%, 40%)',
  ],
  MOUTH: [
    'hsl(18, 65%, 81%)',
    'hsl(18, 47%, 73%)',
    'hsl(15, 45%, 67%)',
    'hsl(8, 42%, 63%)',
    'hsl(354, 69%, 63%)',
  ],
  SHIRT: [
    'hsl(0, 0%, 100%)',
    'hsl(212, 95%, 8%)',
    'hsl(0, 0%, 81%)',
    'hsl(25, 67%, 90%)',
    'hsl(203, 39%, 65%)',
  ],
  SKIN: [
    'hsl(49, 100%, 75%)',
    'hsl(23, 85%, 90%)',
    'hsl(38, 75%, 78%)',
    'hsl(26, 56%, 70%)',
    'hsl(26, 42%, 52%)',
    'hsl(18, 38%, 37%)',
  ],
  TOPS: [
    'hsl(20, 27%, 39%)',
    'hsl(47, 100%, 65%)',
    'hsl(343, 68%, 56%)',
    'hsl(337, 100%, 79%)',
    'hsl(151, 97%, 29%)',
    'hsl(65, 15%, 29%)',
    'hsl(75, 5%, 16%)',
    'hsl(0, 0%, 94%)',
    'hsl(0, 0%, 37%)',
    'hsl(207, 57%, 15%)',
    'hsl(206, 45%, 79%)',
    'hsl(197, 100%, 38%)',
    'hsl(216, 46%, 64%)',
    'hsl(274, 17%, 50%)',
    'hsl(275, 36%, 33%)',
    'hsl(344, 97%, 89%)',
    'hsl(37, 100%, 60%)',
    'hsl(12, 92%, 60%)',
    'hsl(124, 27%, 19%)',
    'hsl(93, 52%, 61%)',
    'hsl(354, 63%, 52%)',
    'hsl(352, 35%, 28%)',
    'hsl(214, 53%, 43%)',
    'hsl(149, 41%, 51%)',
    'hsl(72, 5%, 82%)',
  ],
  BEARD: [
    'hsl(35, 36%, 0%)',
    'hsl(17, 81%, 23%)',
    'hsl(43, 90%, 54%)',
    'hsl(26, 0%, 82%)',
  ],
  SPECS: [
    'hsl(0, 0%, 10%)',
    'hsl(0, 0%, 90%)',
    'hsl(0, 0%, 100%)',
    'hsl(0, 20%, 50%)',
    'hsl(210, 20%, 50%)',
    'hsl(0, 80%, 50%)',
    'hsl(200, 80%, 50%)',
  ],
  BOTTOMS: [
    'hsl(34, 45%, 45%)',
    'hsl(0, 0%, 20%)',
    'hsl(216, 20%, 25%)',
    'hsl(37, 23%, 46%)',
    'hsl(0, 13%, 16%)',
    'hsl(203, 35%, 25%)',
    'hsl(70, 10%, 30%)',
  ],
  HAIR: [
    'hsl(30, 28%, 34%)',
    'hsl(32, 50%, 74%)',
    'hsl(18, 90%, 16%)',
    'hsl(35, 36%, 10%)',
    'hsl(17, 81%, 33%)',
    'hsl(43, 90%, 64%)',
    'hsl(26, 0%, 92%)',
  ],
  HAIR_VIBRANT: [
    'hsl(300, 66%, 50%)',
    'hsl(235, 80%, 50%)',
    'hsl(165, 72%, 40%)',
  ],
  FEET: [
    'hsl(42, 69%, 53%)',
    'hsl(41, 72%, 32%)',
    'hsl(241, 99%, 40%)',
    'hsl(62, 80%, 98%)',
    'hsl(14, 96%, 79%)',
    'hsl(359, 63%, 45%)',
    'hsl(211, 75%, 61%)',
    'hsl(0, 5%, 15%)',
  ],
}

const RANDOM_IN_RANGE = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)
const RANDOM_FROM_ARR = ARR => ARR[Math.floor(Math.random() * ARR.length)]

const GENERATE_HR = () => {
  // Clear the body
  document.querySelector('main').innerHTML = ''
  for (let i = 0; i < 1; i++) {
    const MEMBER = document.createElement('hr')
    // Create Hulk
    if (Math.random() > 0.99) {
      // Green skin, black hair, big teeth, purple shorts, different shade green for arms
      MEMBER.style.setProperty('--skin', 'green')
      MEMBER.style.setProperty('--hair-top-width', 0)
      MEMBER.style.setProperty('--hair-color', 'black')
      MEMBER.style.setProperty('--bottoms', 'purple')
      MEMBER.style.setProperty('--footwear', 'green')
      MEMBER.style.setProperty('--mouth-width', 4)
      MEMBER.style.setProperty('--mouth-position', 8)
      MEMBER.style.setProperty('--shorts', 1)
      MEMBER.style.setProperty('--top', 'green')
      MEMBER.style.setProperty('--sleeves', 3)
      MEMBER.style.setProperty('--sleeve', 'hsl(90, 60%, 20%)')
    } else {
      // Set a skin tone
      MEMBER.style.setProperty('--skin', RANDOM_FROM_ARR(COLORS.SKIN))
      // Set eye color
      MEMBER.style.setProperty('--eye', RANDOM_FROM_ARR(COLORS.EYES))
      /**
       * Choices...
       * Hat, hair
       * Hair color
       * Hulk
       */

      const FEMALE = Math.random() > 0.5
      const SHORT = Math.random() > 0.75
      const GLASSES = Math.random() > 0.85
      if (SHORT) {
        MEMBER.style.setProperty('--short', 0.5)
      }
      if (GLASSES) {
        MEMBER.style.setProperty('--glasses', 1)
        MEMBER.style.setProperty('--specs', RANDOM_FROM_ARR(COLORS.SPECS))
      }
      if (!GLASSES && Math.random() > 0.9) {
        CONFIG.SHADES = true
        CONTROLLER.updateDisplay()
        MEMBER.style.setProperty('--shades', 1)
        MEMBER.style.setProperty('--specs', 'hsl(0, 0%, 0%)')
      } else {
        CONFIG.SHADES = false
        CONTROLLER.updateDisplay()
      }
      // Give them trousers or shorts
      if ((FEMALE && Math.random() > 0.1) || !FEMALE) {
        MEMBER.style.setProperty('--bottoms', RANDOM_FROM_ARR(COLORS.BOTTOMS))
        if (Math.random() > 0.9) {
          MEMBER.style.setProperty('--shorts', 1)
        } else {
          // Give them trousers
          MEMBER.style.setProperty('--trousers', 1)
        }
      }
      const TOP_COLOR = RANDOM_FROM_ARR(COLORS.TOPS)
      MEMBER.style.setProperty(
        '--sleeves',
        RANDOM_IN_RANGE(FEMALE && Math.random() > 0.5 ? 0 : 1, 3)
      )
      MEMBER.style.setProperty(
        '--sleeve',
        Math.random() > 0.9 ? 'white' : TOP_COLOR
      )
      MEMBER.style.setProperty('--top', TOP_COLOR)
      MEMBER.style.setProperty('--left-turn', Math.random() > 0.5 ? 1 : 0)
      MEMBER.style.setProperty('--right-turn', Math.random() > 0.5 ? 1 : 0)
      MEMBER.style.setProperty(
        '--left-eye',
        Math.random() > 0.5 && !GLASSES ? 1 : 0
      )
      MEMBER.style.setProperty(
        '--right-eye',
        Math.random() > 0.5 && !GLASSES ? 1 : 0
      )
      MEMBER.style.setProperty('--neck-shift', Math.random() > 0.5 ? 1 : 0)
      // Slim neck looked a little weird
      // MEMBER.style.setProperty('--neck-slim', Math.random() > 0.5 ? 1 : 0)
      MEMBER.style.setProperty('--footwear', RANDOM_FROM_ARR(COLORS.FEET))
      // Beard comes in various forms. Moustache, Sides, Chinstrap, Full
      if (!FEMALE && Math.random() > 0.9 && !SHORT) {
        const BEARD_COLOR = RANDOM_FROM_ARR(COLORS.BEARD)
        MEMBER.style.setProperty('--beard-color', BEARD_COLOR)
        // Needs a width and to be centered. Default is 4 at 8.
        // But we can go 6 at 7
        MEMBER.style.setProperty('--moustache', Math.random() > 0.2 ? 1 : 0)
        if (Math.random() > 0.75) {
          MEMBER.style.setProperty('--moustache-full', 1)
        }
        const CHINSTRAP = Math.random() > 0.2
        MEMBER.style.setProperty('--chinstrap', CHINSTRAP ? 1 : 0)
        MEMBER.style.setProperty('--sideburns', Math.random() > 0.2 ? 1 : 0)
        // Needs a width and to be centered
        MEMBER.style.setProperty('--beard', Math.random() > 0.2 ? 1 : 0)
        MEMBER.style.setProperty(
          '--beard-long',
          Math.random() > 0.8 && CHINSTRAP ? 1 : 0
        )
        // Mouth is tricky. Default 9 and 2.
        // Could be 1, 2, 3, 4
        // Width determines the left.
      }
      const MOUTH_WIDTH = RANDOM_IN_RANGE(2, 4)
      const MOUTH_POSITION = 7 + RANDOM_IN_RANGE(1, 4 - MOUTH_WIDTH)
      MEMBER.style.setProperty('--mouth-width', MOUTH_WIDTH)
      MEMBER.style.setProperty('--mouth-position', MOUTH_POSITION)
      MEMBER.style.setProperty('--mouth-color', RANDOM_FROM_ARR(COLORS.MOUTH))
      if (FEMALE && Math.random() > 0.8) {
        MEMBER.style.setProperty(
          '--mouth-color',
          RANDOM_FROM_ARR(COLORS.LIPSTICK)
        )
      }
      // Are they wearing an undershirt. If so make that sleeve length long.
      if (Math.random() > 0.75) {
        MEMBER.style.setProperty('--sleeves', 3)
        MEMBER.style.setProperty('--shirt-color', RANDOM_FROM_ARR(COLORS.SHIRT))
        MEMBER.style.setProperty('--shirt', 1)
        if (Math.random() > 0.5) {
          MEMBER.style.setProperty('--tie-color', RANDOM_FROM_ARR(COLORS.TIE))
          MEMBER.style.setProperty('--tie', 1)
        }
      }
      // Hair is a different bag. Need to work out different parts.
      // Top of the hair Up to 8 in length starting at 6
      const HAIR_WIDTH = RANDOM_IN_RANGE(0, 8)
      const HAIR_POSITION = RANDOM_IN_RANGE(0, 8 - HAIR_WIDTH)
      MEMBER.style.setProperty('--hair-top-width', HAIR_WIDTH)
      MEMBER.style.setProperty('--hair-top-position', HAIR_POSITION)
      //Fringe left
      if (Math.random() > 0.75) {
        const FRINGE_WIDTH = RANDOM_IN_RANGE(0, 4)
        const FRINGE_POSITION = RANDOM_IN_RANGE(0, 4 - FRINGE_WIDTH)
        MEMBER.style.setProperty('--fringe-width-left', FRINGE_WIDTH)
        MEMBER.style.setProperty('--fringe-position-left', FRINGE_POSITION)
      }
      // Fringe right
      if (Math.random() > 0.75) {
        const FRINGE_WIDTH = RANDOM_IN_RANGE(0, 4)
        const FRINGE_POSITION = 4 + RANDOM_IN_RANGE(0, 4 - FRINGE_WIDTH)
        MEMBER.style.setProperty('--fringe-width-right', FRINGE_WIDTH)
        MEMBER.style.setProperty('--fringe-position-right', FRINGE_POSITION)
      }
      // Sides
      MEMBER.style.setProperty('--sides', 1)
      const SIDE_LENGTH = RANDOM_IN_RANGE(0, 4)
      const HAIR_LENGTH = RANDOM_IN_RANGE(1, 6)
      const BANG_LENGTH = RANDOM_IN_RANGE(1, 4 + HAIR_LENGTH)
      const BANGS_POSITION = RANDOM_IN_RANGE(0, 4 + (HAIR_LENGTH - BANG_LENGTH))
      MEMBER.style.setProperty('--side-length', SIDE_LENGTH)
      const LONG_HAIR =
        Math.random() > 0.5 && (SIDE_LENGTH === 0 || SIDE_LENGTH === 4)
      if (LONG_HAIR) {
        MEMBER.style.setProperty('--hair-length', HAIR_LENGTH)
        if (SIDE_LENGTH === 4 && LONG_HAIR && Math.random() > 0.5) {
          MEMBER.style.setProperty('--hair-bangs-length', BANG_LENGTH)
          MEMBER.style.setProperty('--hair-bangs-position', BANGS_POSITION)
        } else if (Math.random() > 0.5 && HAIR_LENGTH > 4) {
          // Ponytail? Offset the left and width to accomodate.
          MEMBER.style.setProperty('--ponytail', 1)
        }
      }
      // Add bangs
      // Hair length
      // Do color last. If balding, make transparent
      MEMBER.style.setProperty('--hair-color', RANDOM_FROM_ARR(COLORS.HAIR))
      if (Math.random() > 0.9) {
        MEMBER.style.setProperty(
          '--hair-color',
          RANDOM_FROM_ARR(COLORS.HAIR_VIBRANT)
        )
      }
      if (Math.random() > 0.9) {
        MEMBER.style.setProperty('--hair-color', 'transparent')
      }
      // Cap, Trilby, or Beanie? Set the hair color and create a hair shape.
      // Only thing different will be the peak.
      if (Math.random() > 0.8) {
        // You get a hat!
        if (Math.random() > 0.5) {
          // Cap
          const CAP_BASE = RANDOM_FROM_ARR(COLORS.CAP_BASE)
          const CAP_PEAK = RANDOM_FROM_ARR(COLORS.CAP_PEAK)
          MEMBER.style.setProperty('--hat-color', CAP_BASE)
          MEMBER.style.setProperty('--cap', 1)
          MEMBER.style.setProperty(
            '--hat-peak-color',
            Math.random() > 0.5 ? CAP_PEAK : CAP_BASE
          )
          MEMBER.style.setProperty('--hat-peak-offset', RANDOM_IN_RANGE(0, 4))
          MEMBER.style.setProperty('--sides-position', 1)
          MEMBER.style.setProperty('--side-length', SIDE_LENGTH - 1)
        } else if (Math.random() > 0.5) {
          // Trilby
          const HAT_COLOR = RANDOM_FROM_ARR(COLORS.TRILBY)
          MEMBER.style.setProperty('--hat-color', HAT_COLOR)
          MEMBER.style.setProperty('--trilby', 1)
          MEMBER.style.setProperty('--hat-peak-color', HAT_COLOR)
          MEMBER.style.setProperty('--hat-peak-offset', 1)
          MEMBER.style.setProperty('--sides-position', 1)
          MEMBER.style.setProperty('--side-length', SIDE_LENGTH - 1)
        } else {
          // Beanie
          const HAT_COLOR = RANDOM_FROM_ARR(COLORS.BEANIE)
          MEMBER.style.setProperty('--hat-color', HAT_COLOR)
          MEMBER.style.setProperty('--beanie', 1)
          MEMBER.style.setProperty('--hat-peak-color', HAT_COLOR)
          MEMBER.style.setProperty('--hair-bangs-position', BANGS_POSITION + 3)
        }
      }
    }
    MEMBER.style.setProperty('--delay', i * 0.01)
    const LABEL = document.createElement('label')
    LABEL.innerText = `--shades: ${CONFIG.SHADES ? 1 : 0};`
    document.querySelector('main').appendChild(MEMBER)
    document.querySelector('main').appendChild(LABEL)
  }
}

GENERATE_HR()

window.addEventListener('click', GENERATE_HR)
