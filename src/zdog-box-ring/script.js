const {
  TimelineMax,
  TweenMax,
  Power0,
  Zdog: { Anchor, Box, Illustration, TAU },
} = window

const Scene = new Illustration({
  element: 'canvas',
  resize: 'fullscreen',
  dragRotate: true,
  rotate: {
    x: TAU / 8,
  },
})
const BOX_COUNT = 12
const BOX_SIZE = 50
for (let b = 0; b < BOX_COUNT; b++) {
  const BoxAnchor = new Anchor({
    addTo: Scene,
    rotate: {
      z: (TAU / 12) * b,
    },
  })
  const Node = new Box({
    addTo: BoxAnchor,
    width: BOX_SIZE,
    height: BOX_SIZE,
    depth: BOX_SIZE,
    color: 'rgb(96, 252, 255)',
    bottomFace: 'rgb(143, 83, 255)',
    rightFace: '#111',
    leftFace: '#111',
    stroke: false,
    rearFace: 'rgb(94, 250, 176)',
    topFace: 'rgb(248, 81, 98)',
    translate: {
      y: -150,
    },
  })
  new TimelineMax({ repeat: -1, delay: b / 20 }).add(
    TweenMax.to(Node.rotate, 5, {
      x: TAU,
      ease: Power0.easeNone,
    })
  )
}

Scene.updateRenderGraph()
const draw = () => {
  Scene.updateRenderGraph()
  requestAnimationFrame(draw)
}
draw()
