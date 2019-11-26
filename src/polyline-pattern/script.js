const { dat, gsap } = window
const { timeline, to, set } = gsap
const select = q => document.querySelector(q)
const polyline = select('polyline')
const SIZE = 280
const UNIT = 10
const BASE = SIZE / 2
const PATTERN_CONFIG = {
  DELAY: 1,
  SPEED: 0.025,
  STROKE: 4,
}
const POINTS = [
  [0, BASE],
  [UNIT * 4, BASE],
  [UNIT * 4, BASE - UNIT],
  [UNIT * 5, BASE - UNIT],
  [UNIT * 5, BASE + UNIT],
  [UNIT * 6, BASE + UNIT],
  [UNIT * 6, BASE - UNIT * 2],
  [UNIT * 7, BASE - UNIT * 2],
  [UNIT * 7, BASE + UNIT * 2],
  [UNIT * 8, BASE + UNIT * 2],
  [UNIT * 8, BASE - UNIT * 3],
  [UNIT * 9, BASE - UNIT * 3],
  [UNIT * 9, BASE + UNIT * 3],
  [UNIT * 10, BASE + UNIT * 3],
  [UNIT * 10, BASE - UNIT * 4],
  [UNIT * 11, BASE - UNIT * 4],
  [UNIT * 11, BASE + UNIT * 4],
  [UNIT * 12, BASE + UNIT * 4],
  [UNIT * 12, BASE - UNIT * 5],
  [UNIT * 13, BASE - UNIT * 5],
  [UNIT * 13, BASE + UNIT * 5],
  [UNIT * 14, BASE + UNIT * 5],
  [UNIT * 14, BASE - UNIT * 6],
  [UNIT * 16, BASE - UNIT * 6],
  [UNIT * 16, BASE - UNIT * 5],
  [UNIT * 15, BASE - UNIT * 5],
  [UNIT * 15, BASE + UNIT * 6],
  [UNIT * 16, BASE + UNIT * 6],
  [UNIT * 16, BASE - UNIT * 4],
  [UNIT * 17, BASE - UNIT * 4],
  [UNIT * 17, BASE - UNIT * 6],
  [UNIT * 18, BASE - UNIT * 6],
  [UNIT * 18, BASE - UNIT * 3],
  [UNIT * 17, BASE - UNIT * 3],
  [UNIT * 17, BASE + UNIT * 6],
  [UNIT * 18, BASE + UNIT * 6],
  [UNIT * 18, BASE - UNIT * 2],
  [UNIT * 19, BASE - UNIT * 2],
  [UNIT * 19, BASE - UNIT * 6],
  [UNIT * 20, BASE - UNIT * 6],
  [UNIT * 20, BASE - UNIT],
  [UNIT * 19, BASE - UNIT],
  [UNIT * 19, BASE + UNIT * 6],
  [UNIT * 20, BASE + UNIT * 6],
  [UNIT * 20, BASE + UNIT * 6],
  [UNIT * 20, BASE],
  [UNIT * 21, BASE],
  [UNIT * 21, BASE - UNIT * 6],
  [UNIT * 22, BASE - UNIT * 6],
  [UNIT * 22, BASE + UNIT],
  [UNIT * 21, BASE + UNIT],
  [UNIT * 21, BASE + UNIT * 6],
  [UNIT * 22, BASE + UNIT * 6],
  [UNIT * 22, BASE + UNIT * 2],
  [UNIT * 23, BASE + UNIT * 2],
  [UNIT * 23, BASE - UNIT * 6],
  [UNIT * 24, BASE - UNIT * 6],
  [UNIT * 24, BASE + UNIT * 3],
  [UNIT * 23, BASE + UNIT * 3],
  [UNIT * 23, BASE + UNIT * 6],
  [UNIT * 24, BASE + UNIT * 6],
  [UNIT * 24, BASE + UNIT * 4],
  [UNIT * 25, BASE + UNIT * 4],
  [UNIT * 25, BASE - UNIT * 6],
  [UNIT * 26, BASE - UNIT * 6],
  [UNIT * 26, BASE + UNIT * 5],
  [UNIT * 25, BASE + UNIT * 5],
  [UNIT * 25, BASE + UNIT * 6],
  [UNIT * 27, BASE + UNIT * 6],
  [UNIT * 27, BASE - UNIT * 6],
  [UNIT * 28, BASE - UNIT * 6],
]

const setPoints = points => ({ attr: { points } })
const setHue = () =>
  polyline.style.setProperty('--hue', Math.floor(Math.random() * 360))

const createTL = () => {
  const TL = new timeline({
    repeat: -1,
    repeatDelay: PATTERN_CONFIG.DELAY,
    onRepeat: setHue,
    onStart: setHue,
  })
  let UNITS_STACK = []
  let TIMELINE_POINTS = [...POINTS[0]]
  TL.add(set(polyline, setPoints([...POINTS[0]])))
  for (let p = 1; p < POINTS.length; p++) {
    const DUMMY_POINTS = [...TIMELINE_POINTS, ...POINTS[p - 1]]
    TIMELINE_POINTS = [...TIMELINE_POINTS, ...POINTS[p]]
    const UNITS = Math.max(
      Math.abs(POINTS[p][0] - POINTS[p - 1][0]),
      Math.abs(POINTS[p][1] - POINTS[p - 1][1])
    )
    UNITS_STACK.push((UNITS / UNIT) * PATTERN_CONFIG.SPEED)
    TL.add(set(polyline, setPoints(DUMMY_POINTS)))
    TL.add(
      to(
        polyline,
        (UNITS / UNIT) * PATTERN_CONFIG.SPEED,
        setPoints(TIMELINE_POINTS)
      )
    )
  }
  // Now take them away
  let WIND_DOWN_POINTS
  for (let w = 0; w < POINTS.length; w++) {
    if (!WIND_DOWN_POINTS) WIND_DOWN_POINTS = [...TIMELINE_POINTS]
    if (POINTS[w + 1]) {
      const DRAG = new Array(w + 1)
        .fill()
        .reduce(a => [...a, ...POINTS[w + 1]], [])
      const REST = WIND_DOWN_POINTS.slice(w * 2 + 2)
      WIND_DOWN_POINTS = [...DRAG, ...REST]
      TL.add(
        to(polyline, UNITS_STACK[w], {
          delay: w === 0 ? PATTERN_CONFIG.DELAY * 2 : 0,
          ...setPoints(WIND_DOWN_POINTS),
        })
      )
    }
  }
  return TL
}

let patternTL = createTL()

const GUI = new dat.GUI({ closed: false })
const controller = GUI.add(PATTERN_CONFIG, 'SPEED', 0.001, 1)
controller.onFinishChange(value => {
  PATTERN_CONFIG.SPEED = value
  patternTL.kill()
  patternTL = createTL()
})
const delayController = GUI.add(PATTERN_CONFIG, 'DELAY', 0.001, 1)
delayController.onFinishChange(value => {
  PATTERN_CONFIG.DELAY = value
  patternTL.kill()
  patternTL = createTL()
})
const strokeController = GUI.add(PATTERN_CONFIG, 'STROKE', 1, 9)
strokeController.onChange(value => {
  PATTERN_CONFIG.STROKE = value
  polyline.style.setProperty('--stroke', value)
})
