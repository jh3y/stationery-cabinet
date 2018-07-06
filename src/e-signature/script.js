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
const makeResizable = (WrappedComponent, opts) => {
  const defaultOptions = {
    ghosting: true,
    handles: ['n', 's', 'e', 'w', 'se', 'sw', 'ne', 'nw'],
  }
  const options = Object.assign({}, defaultOptions, opts)
  return class extends Component {
    state = {
      handleSize: 10,
      offsetLeft: 0,
      diffLeft: 0,
      diffTop: 0,
      offsetTop: 0,
    }
    componentDidMount = () => {
      const { height, width } = this.__RESIZABLE.getBoundingClientRect()
      const handleSize = Math.min(Math.max(height / 10, 10), 50)
      this.setState({
        handleSize,
        height,
        width,
      })
    }
    endResize = e => {
      e.preventDefault()
      const { endResize, resize, state } = this
      const { offsetTop, diffTop, diffLeft, offsetLeft } = state
      console.info('END')
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
      const { direction } = this.state
      let { pageX: X, pageY: Y, touches } = e
      if (touches && touches.length === 1) {
        X = touches[0].pageX
        Y = touches[0].pageY
      }
      const { startHeight, startX, startY, startWidth } = this.state
      console.info('RESIZING')
      // IN HERE, NEED TO ALTER THE TRANSFORM IF APPLICABLE TOO
      // SHOULD WE INSTEAD PASS DOWN THE DRAG ATTRIBUTES?
      if (direction) {
        let height
        let width
        let { diffLeft, diffTop } = this.state
        for (const d of direction.split('')) {
          switch (d) {
            case 'n':
              // If position absolute, set top to Y
              diffTop = startY - Y
              height = startHeight + diffTop
              break
            case 's':
              height = startHeight + (Y - startY)
              break
            case 'e':
              width = startWidth + (X - startX)
              break
            case 'w':
              // If position absolute, set left to X
              diffLeft = startX - X
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
    startResize = e => {
      e.preventDefault()
      const { __RESIZABLE, endResize, resize } = this
      let { pageX: startX, pageY: startY, touches } = e

      if (touches && touches.length === 1) {
        startX = touches[0].pageX
        startY = touches[0].pageY
      }

      const {
        height: startHeight,
        width: startWidth,
      } = __RESIZABLE.getBoundingClientRect()
      console.info('START')
      document.body.addEventListener('mousemove', resize)
      document.body.addEventListener('touchmove', resize)
      document.body.addEventListener('mouseup', endResize)
      document.body.addEventListener('touchend', endResize)
      const direction = e.target.getAttribute('data-rsize-direction')
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
        handleSize,
        height,
        width,
        offsetTop,
        offsetLeft,
      } = state
      return (
        <div
          className={'rsizable'}
          ref={r => (this.__RESIZABLE = r)}
          style={{
            transform: `translate(${dragX -
              (offsetLeft + diffLeft)}px, ${dragY - (offsetTop + diffTop)}px)`,
          }}>
          {options.handles.length &&
            options.handles.map((h, idx) => (
              <div
                onMouseDown={startResize}
                onTouchStart={startResize}
                className={`rsizable__handle rsizable__handle--${h}`}
                data-rsize-direction={h}
                size={10}
                style={{
                  '--handleSize': handleSize,
                  '--cursor': `${h}-resize`,
                }}
                key={`resize-handle--${idx}`}
              />
            ))}
          <WrappedComponent
            style={{
              height: `${height}px`,
              width: `${width}px`,
            }}
            {...props}
          />
        </div>
      )
    }
  }
}
/**
 * Draggable HOC
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
const Burger = styled.img.attrs({
  onMouseDown: p => p.onDragStart,
  onTouchStart: p => p.onDragStart,
  src:
    'https://images.unsplash.com/photo-1516774266634-15661f692c19?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=300&h=300&fit=crop&ixid=eyJhcHBfaWQiOjF9&s=dba61d07d9356e22c26750ed5ad68c3d',
})`
  cursor: move;
  cursor: -webkit-grab;
  height: 100px;
  width: 100px;
  object-fit: cover;
`
const DraggableAndResizableBurger = makeDraggable(makeResizable(Burger, {}))
// const DraggableAndResizableBurger = makeResizable(makeDraggable(Burger), {})
class App extends Component {
  render = () => {
    return <DraggableAndResizableBurger />
  }
}
ReactDOM.render(<App />, rootNode)
