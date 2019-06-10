const {
  Zdog: { Anchor, Illustration, TAU, Shape, Group },
} = window

const Scene = new Illustration({
  element: 'canvas',
  resize: 'fullscreen',
  dragRotate: true,
  rotate: {
    x: TAU * 0.05,
    y: TAU * 0.05,
  },
})

const Clock = new Anchor({
  addTo: Scene,
})

const Digit = new Group()

// Digit line order
// M, T, L1, L2, R1, R2, B
const DIGIT_MAP = {
  '0': [false, true, true, true, true, true, true],
  '1': [false, false, false, false, true, true, false],
  '2': [true, true, false, true, true, false, true],
  '3': [true, true, false, false, true, true, true],
  '4': [true, false, true, false, true, true, false],
  '5': [true, true, true, false, false, true, true],
  '6': [true, true, true, true, false, true, true],
  '7': [false, true, false, false, true, true, false],
  '8': [true, true, true, true, true, true, true],
  '9': [true, true, true, false, true, true, false],
}
const STROKE = 8
const LENGTH = 15
const DIGIT_COLOR = 'rgba(255, 0, 0, 1)'
const Line = new Shape({
  addTo: Digit,
  path: [
    {
      x: -(LENGTH / 2),
      y: 0,
    },
    {
      x: LENGTH / 2,
      y: 0,
    },
  ],
  color: DIGIT_COLOR,
  stroke: STROKE,
})
Line.copy({
  path: [
    {
      x: -(LENGTH / 2),
      y: -(STROKE + LENGTH),
    },
    {
      x: LENGTH / 2,
      y: -(STROKE + LENGTH),
    },
  ],
})
Line.copy({
  path: [
    {
      x: -LENGTH,
      y: -(STROKE / 2),
    },
    {
      x: -LENGTH,
      y: -(LENGTH + STROKE / 2),
    },
  ],
})
Line.copy({
  path: [
    {
      x: -LENGTH,
      y: STROKE / 2,
    },
    {
      x: -LENGTH,
      y: LENGTH + STROKE / 2,
    },
  ],
})

Line.copy({
  path: [
    {
      x: LENGTH,
      y: -(STROKE / 2),
    },
    {
      x: LENGTH,
      y: -(LENGTH + STROKE / 2),
    },
  ],
})

Line.copy({
  path: [
    {
      x: LENGTH,
      y: STROKE / 2,
    },
    {
      x: LENGTH,
      y: LENGTH + STROKE / 2,
    },
  ],
})

Line.copy({
  path: [
    {
      x: -(LENGTH / 2),
      y: LENGTH + STROKE,
    },
    {
      x: LENGTH / 2,
      y: LENGTH + STROKE,
    },
  ],
})

Digit.copyGraph({
  translate: {
    x: -76,
  },
})

Digit.copyGraph({
  translate: {
    x: -20,
  },
})
Digit.copyGraph({
  translate: {
    x: 20,
  },
})
Digit.copyGraph({
  translate: {
    x: 76,
  },
})
Digit.copyGraph({
  translate: {
    x: 116,
  },
})

const Dot = new Shape({
  addTo: Scene,
  color: DIGIT_COLOR,
  stroke: 10,
  translate: {
    x: 0,
    y: -10,
  },
})

Dot.copy({
  translate: {
    x: 0,
    y: 10,
  },
})

const DigitSet = new Anchor()
Digit.copyGraph({
  addTo: DigitSet,
  translate: {
    x: -20,
  },
})
Digit.copyGraph({
  addTo: DigitSet,
  translate: {
    x: 20,
  },
})

// Hours
DigitSet.copyGraph({
  addTo: Clock,
  translate: {
    x: -45,
  },
})
// Minutes
DigitSet.copyGraph({
  addTo: Clock,
  translate: {
    x: 45,
  },
})
// Seconds
DigitSet.copyGraph({
  addTo: Clock,
  scale: 0.5,
  translate: {
    x: 110,
    y: 10,
  },
})

const DigitSets = Scene.children[0].children
const Hours = DigitSets[0].children
const Minutes = DigitSets[1].children
const Seconds = DigitSets[2].children

// Update the seconds margin and stroke width
for (const line of [...Seconds[0].children, ...Seconds[1].children]) {
  line.stroke = 4
}
Seconds[1].translate.x = 22

const draw = () => {
  Scene.updateRenderGraph()
  requestAnimationFrame(draw)
}

const setTime = () => {
  const d = new Date()
  const hours = d
    .getHours()
    .toString()
    .split('')
  const minutes = d
    .getMinutes()
    .toString()
    .split('')
  const seconds = d
    .getSeconds()
    .toString()
    .split('')

  let secondOneMap
  let secondTwoMap
  let minuteOneMap
  let minuteTwoMap
  let hourOneMap
  let hourTwoMap

  if (seconds.length > 1) {
    secondOneMap = DIGIT_MAP[seconds[0]]
    secondTwoMap = DIGIT_MAP[seconds[1]]
  } else {
    secondOneMap = DIGIT_MAP['0']
    secondTwoMap = DIGIT_MAP[seconds[0]]
  }
  if (minutes.length > 1) {
    minuteOneMap = DIGIT_MAP[minutes[0]]
    minuteTwoMap = DIGIT_MAP[minutes[1]]
  } else {
    minuteOneMap = DIGIT_MAP['0']
    minuteTwoMap = DIGIT_MAP[minutes[0]]
  }
  if (hours.length > 1) {
    hourOneMap = DIGIT_MAP[hours[0]]
    hourTwoMap = DIGIT_MAP[hours[1]]
  } else {
    hourOneMap = DIGIT_MAP['0']
    hourTwoMap = DIGIT_MAP[hours[0]]
  }

  for (let i = 0; i < secondOneMap.length; i++) {
    Seconds[0].children[i].color = `rgba(255, 0, 0, ${secondOneMap[i] ? 1 : 0})`
    Seconds[1].children[i].color = `rgba(255, 0, 0, ${secondTwoMap[i] ? 1 : 0})`
    Minutes[0].children[i].color = `rgba(255, 0, 0, ${minuteOneMap[i] ? 1 : 0})`
    Minutes[1].children[i].color = `rgba(255, 0, 0, ${minuteTwoMap[i] ? 1 : 0})`
    Hours[0].children[i].color = `rgba(255, 0, 0, ${hourOneMap[i] ? 1 : 0})`
    Hours[1].children[i].color = `rgba(255, 0, 0, ${hourTwoMap[i] ? 1 : 0})`
  }
}

setInterval(setTime, 1000)

draw()
