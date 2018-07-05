const { Component, Fragment } = React
const { render } = ReactDOM
const styled = styled.default
const rootNode = document.getElementById('app')

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
    }
    componentDidMount = () => {
      const {height, width} = this.__RESIZABLE.getBoundingClientRect()
      const handleSize = Math.min(
        Math.max(height / 10, 10),
        50
      )
      this.setState({
        handleSize,
        height,
        width
      })
    }
    endResize = e => {
      const {
        endResize,
        resize,
      } = this
      console.info('END')
      document.body.removeEventListener('mousemove', resize)
      document.body.removeEventListener('touchmove', resize)
      document.body.removeEventListener('mouseup', endResize)
      document.body.removeEventListener('touchend', endResize)
    }
    resize = e => {
      const {direction} = this.state
      let { pageX: X, pageY: Y, touches } = e
      if (touches && touches.length === 1) {
        X = touches[0].pageX
        Y = touches[0].pageY
      }
      const {
        startHeight,
        startX,
        startY,
        startWidth,
      } = this.state
      console.info('RESIZING')
      // IN HERE, NEED TO ALTER THE TRANSFORM IF APPLICABLE TOO
      // SHOULD WE INSTEAD PASS DOWN THE DRAG ATTRIBUTES?
      if (direction) {
        for (const d of direction.split('')) {
          let height
          let width
          switch(d) {
            case 'n':
              // If position absolute, set top to Y
              height = startHeight + (startY - Y)
              break
            case 's':
              height = startHeight + (Y - startY)
              break
            case 'e':
              width = startWidth + (X - startX)
              break
            case 'w':
              // If position absolute, set left to X
              width = startWidth + (startX - X)
              break
          }
          this.setState({
            height,
            width
          })
        }
      }
    }
    startResize = e => {
      const {
        __RESIZABLE,
        endResize,
        resize,
      } = this
      let { pageX: startX, pageY: startY, touches } = e

      if (touches && touches.length === 1) {
        startX = touches[0].pageX
        startY = touches[0].pageY
      }

      const { height: startHeight, width: startWidth } = __RESIZABLE.getBoundingClientRect()
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
      const { handleSize, height, width } = state
      return (
        <div className={'rsizable'} ref={r => (this.__RESIZABLE = r)}>
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
const makeDraggable = WrappedComponent => {
  return class extends Component {
    state = {
      dragX: 0,
      dragY: 0,
      x: undefined,
      y: undefined,
      startX: undefined,
      startY: undefined,
    }
    componentDidMount = () => {
      const { __DRAG_WRAPPER: wrap, onDragStart } = this
      if (this.__DRAG_WRAPPER) console.info('lets make a dragger')
      wrap.addEventListener('mousedown', onDragStart)
    }
    onDragStart = e => {
      e.preventDefault()
      console.info(e.target, e.currentTarget, this.__DRAG_WRAPPER)
      if (e.target.hasAttribute('data-rsize-direction')) return
      const { __DRAG_WRAPPER: wrap, onDrag, onDragEnd } = this
      document.body.addEventListener('mousemove', onDrag)
      document.body.addEventListener('mouseup', onDragEnd)
      const bounds = wrap.getBoundingClientRect()
      this.setState({
        x: bounds.left,
        y: bounds.top,
        startX: e.x,
        startY: e.y,
        startDragX: this.state.dragX,
        startDragY: this.state.dragY,
      })
    }
    onDrag = e => {
      const { startDragX, startDragY, startX, startY } = this.state
      this.setState({
        dragX: startDragX + (e.x - startX),
        dragY: startDragY + (e.y - startY),
      })
    }
    onDragEnd = e => {
      const { onDrag, onDragEnd } = this
      document.body.removeEventListener('mousemove', onDrag)
      document.body.removeEventListener('mouseup', onDragEnd)
    }
    render = () => {
      const { dragX: x, dragY: y } = this.state
      return (
        <div
          className={'drggable'}
          ref={w => (this.__DRAG_WRAPPER = w)}
          style={{
            '--dragX': x,
            '--dragY': y,
          }}>
          <WrappedComponent {...this.props} />
        </div>
      )
    }
  }
}

// Tie it all up!
const Burger = styled.img.attrs({
  src:
    'https://images.unsplash.com/photo-1516774266634-15661f692c19?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=300&h=300&fit=crop&ixid=eyJhcHBfaWQiOjF9&s=dba61d07d9356e22c26750ed5ad68c3d',
})`
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
