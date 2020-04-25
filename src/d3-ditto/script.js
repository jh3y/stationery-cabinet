const {
  d3: { curveBasisClosed, curveStep, curveCardinalClosed, lineRadial },
} = window

const CURVES = [
  curveBasisClosed,
  curveStep,
  // curveNatural,
  // curveLinearClosed,
  curveCardinalClosed,
  // curveCatmullRomClosed,
]

// Gonna say that Ditto has around 14 points
// Linear Radial goes 0 -> 360 CW from 12
const DEFAULT_POINTS = [
  [0, 100],
  [30, 150],
  [50, 95],
  [70, 140],
  [80, 150],
  [90, 130],
  [100, 90],
  [120, 160],
  [130, 170],
  [140, 160],
  [145, 130],
  [180, 150],
  [215, 130],
  [220, 160],
  [230, 180],
  [250, 90],
  [280, 180],
  [315, 80],
  [335, 180],
]
const DITTO = document.querySelector('.ditto')
const DITTO_PATH = document.querySelector('.ditto__path')
const BUTTON = document.querySelector('button')
const drawDitto = (
  points = DEFAULT_POINTS,
  curveBasis = curveBasisClosed,
  hue = 320
) => {
  const PATH = lineRadial().curve(curveBasis)(
    points.map(point => [point[0] * (Math.PI / 180), point[1]])
  )
  DITTO.style.setProperty('--hue', hue)
  DITTO_PATH.setAttribute(
    'd',
    PATH.charAt(PATH.length).toLowerCase() !== 'z' ? `${PATH}z` : PATH
  )
}

drawDitto()

BUTTON.addEventListener('click', () => {
  drawDitto(
    undefined,
    CURVES[Math.floor(Math.random() * CURVES.length)],
    Math.random() > 0.75 ? 180 : 320
  )
})
