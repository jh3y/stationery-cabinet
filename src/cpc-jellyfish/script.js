const { TweenMax, Draggable, Elastic } = window
const box = document.querySelector('.box')
let start
let x
let y

const getVelocity = e => {
  const { clientX, clientY } = e
  const now = Date.now()
  const distX = clientX - x
  const distY = clientY - y
  const interval = now - start
  const velocity = Math.sqrt(distX * distX + distY * distY) / interval
  // What I should likely do here is calculate the amount of velocity in each direction.
  // So if it went up and left, the velocity times the distance in each then skew?
  return distX < 0 ? -velocity : velocity
}

const onDragStart = e => {
  // record a timestamp to track velocity
  start = Date.now()
  x = e.clientX
  y = e.clientY
}
const onDrag = e => {
  // Update some variable based on calculated velocity
  // console.info(getVelocity(e))
  const upper = 1
  const v = Math.max(-upper, Math.min(getVelocity(e), upper)) || 0
  const skewX = (20 / upper) * v
  // mark it against a scale of 5 and then proportional to like skeWX of 50
  TweenMax.to(box, 0.1, { skewX })
}
const onDragEnd = () => {
  // Animate back to 0 with some bounce and wobble?
  // Reset the timestamp
  start = undefined
  x = undefined
  y = undefined
  TweenMax.to(box, 2, { skewX: 0, ease: Elastic.easeOut.config(1, 0.3) })
}

Draggable.create(box, {
  type: 'x,y',
  edgeResistance: 0.65,
  bounds: 'body',
  onDrag,
  onDragStart,
  onDragEnd,
})
