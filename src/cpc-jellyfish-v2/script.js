const { TweenMax, Draggable, Elastic } = window
class Jelly {
  constructor(el, opts) {
    const { onDrag, onDragStart, onDragEnd } = this
    this.__OPTS = opts
    this.state = opts.initialState
    Draggable.create(el, {
      bounds: 'body',
      edgeResistance: 0.65,
      onDrag,
      onDragEnd,
      onDragStart,
      type: 'x,y',
    })
  }
  getXY = e => {
    let { pageX: x, pageY: y, touches } = e
    if (touches && touches.length === 1) {
      x = touches[0].pageX
      y = touches[0].pageY
    }
    return {
      x,
      y,
    }
  }
  getVelocity = e => {
    const {
      getXY,
      state: { startX, startY, startDrag },
    } = this
    const { x, y } = getXY(e)
    const now = Date.now()
    const distX = x - startX
    const distY = y - startY
    const interval = now - startDrag
    const velocityX = distX / interval || 0
    const velocityY = distY / interval || 0
    return {
      velocityX,
      velocityY,
    }
  }
  getDirection = e => {
    const {
      getXY,
      state: { x, y },
    } = this
    const { x: clientX, y: clientY } = getXY(e)
    return {
      x: clientX < x ? -1 : 1,
      y: clientY < y ? -1 : 1,
    }
  }
  onDragStart = e => {
    const { x: startX, y: startY } = this.getXY(e)
    this.state = {
      ...this.state,
      startDrag: Date.now(),
      startX,
      startY,
    }
  }
  onDrag = e => {
    const {
      getXY,
      getVelocity,
      getDirection,
      onDragStart,
      __OPTS,
      state: { direction: currentDirection },
    } = this
    const { x, y } = getXY(e)
    const velocity = getVelocity(e)
    const direction = getDirection(e)
    if (
      currentDirection &&
      (currentDirection.x !== direction.x || currentDirection.y !== direction.y)
    )
      onDragStart(e)

    this.state = {
      ...this.state,
      x,
      y,
      direction,
      velocity,
    }
    if (__OPTS.onDrag) __OPTS.onDrag(this.state)
  }
  onDragEnd = () => {
    this.state = {
      ...this.state,
      ...initialState,
    }
    if (this.__OPTS.onDragEnd) this.__OPTS.onDragEnd(this.state)
  }
}

const jel = document.querySelector('.jellyfish')
const initialState = {
  direction: undefined,
  startDrag: undefined,
  startX: undefined,
  startY: undefined,
  velocity: undefined,
}
const onDrag = d => {
  const {
    velocity: { velocityX, velocityY },
  } = d
  const scale =
    velocityY < 0
      ? Math.abs((0.25 / 1) * velocityY)
      : (0.25 / 1) * velocityY * -1
  const skewX =
    velocityX < 0
      ? Math.abs(Math.max(-50, 20 * velocityX))
      : Math.min(20 * velocityX, 50) * -1
  TweenMax.to(jel, 0.1, { skewX, scaleY: 1 + scale, scaleX: 1 - scale })
}
const onDragEnd = () => {
  TweenMax.to(jel, 2, {
    skewX: 0,
    scaleY: 1,
    scaleX: 1,
    ease: Elastic.easeOut.config(1, 0.3),
  })
}
new Jelly(jel, {
  initialState,
  onDrag,
  onDragEnd,
})
