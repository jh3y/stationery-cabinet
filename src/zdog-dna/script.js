const {
  Zdog: { Illustration, TAU, Shape },
} = window
const MARGIN = 15
const SPAN = 40
const STRAND_STROKE = 4
const BALL_PADDING = 5
const BALL_DIAMETER = 10
const STRANDS = 23
const STRAND = 'silver'
const COLORS = [
  'rgb(252, 254, 248)',
  'rgb(251, 164, 82)',
  'rgb(37, 175, 186)',
  'rgb(225, 7, 130)',
]
const randomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)]
const YSTART = -(((STRANDS - 1) * MARGIN) / 2)

const Scene = new Illustration({
  element: 'canvas',
  dragRotate: true,
  resize: 'fullscreen',
})

const Strand = new Shape({
  stroke: STRAND_STROKE,
  color: STRAND,
  path: [
    {
      x: -SPAN,
    },
    {
      x: SPAN,
    },
  ],
})
const Ball = new Shape({
  color: randomColor(),
  stroke: BALL_DIAMETER * 2,
  translate: {
    x: -(BALL_DIAMETER + SPAN + BALL_PADDING),
  },
})

new Array(STRANDS).fill().map((s, i) => {
  const strand = Strand.copy({
    addTo: Scene,
    rotate: {
      y: (TAU / STRANDS) * i,
    },
    translate: {
      y: YSTART + i * MARGIN,
    },
  })
  Ball.copy({
    addTo: strand,
    color: randomColor(),
  })
  Ball.copy({
    addTo: strand,
    color: randomColor(),
    translate: {
      x: BALL_DIAMETER + SPAN + BALL_PADDING,
    },
  })
})

const update = () => {
  Scene.rotate.y -= 0.1
  Scene.updateRenderGraph()
  requestAnimationFrame(update)
}

update()
