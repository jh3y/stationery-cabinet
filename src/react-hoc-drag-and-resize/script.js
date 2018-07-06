const { Component, Fragment } = React
const { render } = ReactDOM
const styled = styled.default
const rootNode = document.getElementById('app')

// Utility function for grabbing XY coordinates from event
const getXY = evt => {
  let { pageX: x, pageY: y, touches } = evt
  if (touches && touches.length === 1) {
    x = touches[0].pageX
    y = touches[0].pageY
  }
  return {
    x,
    y,
  }
}

/**
 * Resizable HOC
 */
const Resizable = styled.div`
  display: inline-block;
  position: relative;
  transform: translate(${p => p.translateX}px, ${p => p.translateY}px);
  ${p => p.baseStyle}
`
const getDirectionStyles = (d) => {
  let bottom
  let top
  let left
  let right
  let x
  let y
  switch(d) {
    case 'n':
      left = '50%'
      x = y = -50
      top = 0
      break
    case 's':
      bottom = 0
      left = '50%'
      x = -50
      y = 50
      break
    case 'e':
      top = '50%'
      x = 50
      right = 0
      y = -50
      break
    case 'w':
      top = '50%'
      x = -50
      left = 0
      y = -50
      break
    case 'se':
      bottom = 0
      right = 0
      x = y = 50
      break
    case 'sw':
      x = -50
      y = 50
      bottom = 0
      left = 0
      break
    case 'ne':
      x = 50
      y = -50
      top = 0
      right = 0
      break;
    case 'nw':
      x = y = -50
      top = 0
      left = 0
      break
  }
  return {
    '--x': x,
    '--y': y,
    bottom,
    top,
    left,
    right,
  }
}
const ResizableHandle = styled.div`
  height: 50px;
  width: 50px;
  display: inline-block;
  cursor: ${p => p.direction}-resize;
  position: absolute;
  transform: translate(calc(var(--x, 0) * 1%), calc(var(--y, 0) * 1%));
  ${p => getDirectionStyles(p.direction)}

  &:after {
    background: #fff;
    border-radius: 100%;
    content: '';
    height: 12px;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
  }
`
const makeResizable = (WrappedComponent, opts) => {
  const defaultOptions = {
    ghosting: true,
    handles: ['n', 's', 'e', 'w', 'se', 'sw', 'ne', 'nw'],
  }
  const options = Object.assign({}, defaultOptions, opts)
  return class extends Component {
    state = {
      offsetLeft: 0,
      diffLeft: 0,
      diffTop: 0,
      offsetTop: 0,
    }
    // Take into account if there is any drag applied
    static defaultProps = {
      dragX: 0,
      dragY: 0,
    }
    componentDidMount = () => {
      const { height, width } = this.__RESIZABLE.getBoundingClientRect()
      this.setState({
        height,
        width,
      })
    }
    endResize = e => {
      e.preventDefault()
      const { endResize, resize, state } = this
      const { offsetTop, diffTop, diffLeft, offsetLeft } = state

      this.setState({
        diffTop: 0,
        offsetTop: offsetTop + diffTop,
        offsetLeft: offsetLeft + diffLeft,
        diffLeft: 0,
      })
      document.body.removeEventListener('mousemove', resize)
      document.body.removeEventListener('touchmove', resize)
      document.body.removeEventListener('mouseup', endResize)
      document.body.removeEventListener('touchend', endResize)
    }
    resize = e => {
      e.preventDefault()
      const { direction, startHeight, startX, startY, startWidth } = this.state
      const {x, y} = getXY(e)
      // IN HERE, NEED TO ALTER THE TRANSFORM IF APPLICABLE TOO
      // SHOULD WE INSTEAD PASS DOWN THE DRAG ATTRIBUTES?
      if (direction) {
        let height = startHeight
        let width = startWidth
        let { diffLeft, diffTop } = this.state
        for (const d of direction.split('')) {
          switch (d) {
            case 'n':
              // If position absolute, set top to Y
              diffTop = startY - y
              height = startHeight + diffTop
              break
            case 's':
              height = startHeight + (y - startY)
              break
            case 'e':
              width = startWidth + (x - startX)
              break
            case 'w':
              // If position absolute, set left to X
              diffLeft = startX - x
              width = startWidth + diffLeft
              break
          }
        }
        this.setState({
          diffLeft,
          diffTop,
          height,
          width,
        })
      }
    }
    startResize = (e, direction) => {
      e.preventDefault()
      const { __RESIZABLE, endResize, resize } = this
      const { x: startX, y: startY } = getXY(e)
      const {
        height: startHeight,
        width: startWidth,
      } = __RESIZABLE.getBoundingClientRect()
      document.body.addEventListener('mousemove', resize)
      document.body.addEventListener('touchmove', resize)
      document.body.addEventListener('mouseup', endResize)
      document.body.addEventListener('touchend', endResize)

      this.setState({
        direction,
        startHeight,
        startWidth,
        startX,
        startY,
      })
    }

    render = () => {
      const { props, startResize, state } = this
      const { dragX, dragY } = props
      const {
        diffLeft,
        diffTop,
        height,
        width,
        offsetTop,
        offsetLeft,
      } = state
      return (
        <Resizable
          className={'rsizable'}
          innerRef={r => (this.__RESIZABLE = r)}
          translateX={dragX - (offsetLeft + diffLeft)}
          translateY={dragY - (offsetTop + diffTop)}
          baseStyle={options.style}>
          {options.handles.length &&
            options.handles.map((h, idx) => (
              <ResizableHandle
                onMouseDown={(e) => startResize(e, h)}
                onTouchStart={(e) => startResize(e, h)}
                className={`rsizable__handle rsizable__handle--${h}`}
                direction={h}
                key={`resize-handle--${idx}`}
              />
            ))}
          <WrappedComponent
            resizeHeight={height}
            resizeWidth={width}
            {...props}
          />
        </Resizable>
      )
    }
  }
}
/**
 * Draggable HOC
 * Applies mousedown and touchstart event listener
 * Passes drag props to component
 */
const makeDraggable = (WrappedComponent, options) => {
  return class extends Component {
    state = {
      dragX: 0,
      dragY: 0,
      x: undefined,
      y: undefined,
      startX: undefined,
      startY: undefined,
    }

    onDragStart = e => {
      const { onDrag, onDragEnd } = this
      e.preventDefault()
      document.body.addEventListener('mousemove', onDrag)
      document.body.addEventListener('touchmove', onDrag)
      document.body.addEventListener('mouseup', onDragEnd)
      document.body.addEventListener('touchend', onDragEnd)
      const { x: startX, y: startY } = getXY(e)
      const bounds = e.target.getBoundingClientRect()
      this.setState({
        x: bounds.left,
        y: bounds.top,
        startX,
        startY,
        startDragX: this.state.dragX,
        startDragY: this.state.dragY,
      })
    }

    onDrag = e => {
      const { startDragX, startDragY, startX, startY } = this.state
      const { x, y } = getXY(e)
      this.setState({
        dragX: startDragX + (x - startX),
        dragY: startDragY + (y - startY),
      })
    }

    onDragEnd = e => {
      const { onDrag, onDragEnd } = this
      document.body.removeEventListener('mousemove', onDrag)
      document.body.removeEventListener('touchmove', onDrag)
      document.body.removeEventListener('mouseup', onDragEnd)
      document.body.removeEventListener('touchend', onDragEnd)
    }
    render = () => {
      const { dragX: x, dragY: y } = this.state
      return (
        <WrappedComponent
          onDragStart={this.onDragStart}
          dragX={x}
          dragY={y}
          {...this.props}
        />
      )
    }
  }
}

// Tie it all up!
const Bear = styled.img.attrs({
  onMouseDown: p => p.onDragStart,
  onTouchStart: p => p.onDragStart,
  src:
    'https://source.unsplash.com/random/300x300?bear'
})`

  cursor: move;
  cursor: -webkit-grab;
  height: ${p => p.resizeHeight ? p.resizeHeight : 150}px;
  width: ${p => p.resizeWidth ? p.resizeWidth : 150}px;
  object-fit: cover;
`
const DraggableAndResizableBear = makeDraggable(
  makeResizable(Bear, {
    style: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      margin: '-75px 0 0 -75px',
    },
  })
)

class App extends Component {
  render = () => {
    return <DraggableAndResizableBear />
  }
}
ReactDOM.render(<App />, rootNode)
