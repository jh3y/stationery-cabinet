const { Component, Fragment } = React
const { render } = ReactDOM

const Container = ({ children }) => <div className="clip">{children}</div>

class ClipPathNode extends Component {
  state = {
    moving: false,
    x: this.props.x,
    y: this.props.y,
  }
  componentDidMount = () => {
    const { el } = this
    el.addEventListener('mousedown', this.startMove)
    el.addEventListener('touchstart', this.startMove)
    el.addEventListener('click', this.removeNode)
  }
  removeNode = () => {
    const { id, removing, onRemove } = this.props
    if (removing && onRemove) onRemove(id)
  }
  getXY = e => {
    let { pageX: x, pageY: y, touches } = e
    // If a touch move then use the touches property 👍
    if (touches && touches.length === 1) {
      x = touches[0].pageX
      y = touches[0].pageY
    }
    return {
      x,
      y,
    }
  }
  startMove = e => {
    if (this.props.removing) return
    const { x, y } = this.getXY(e)
    const move = e => {
      const { x: oldX, y: oldY } = this.getXY(e)
      const {
        height,
        top,
        left,
        width,
      } = this.el.parentNode.getBoundingClientRect()
      const x = Math.min(Math.max(0, oldX - left), width)
      const y = Math.min(Math.max(0, oldY - top), height)
      this.setState(
        {
          x,
          y,
        },
        () => this.props.onMove(this)
      )
    }
    const endMove = () => {
      this.setState(
        {
          moving: false,
        },
        () => {
          this.props.onMove(this)
          document.body.removeEventListener('mousemove', move)
          document.body.removeEventListener('mouseup', endMove)
          if (e.touches && e.touches.length === 1) {
            document.body.removeEventListener('touchmove', move)
            document.body.removeEventListener('touchend', endMove)
          }
        }
      )
    }
    const initMove = () => {
      document.body.addEventListener('mousemove', move)
      document.body.addEventListener('mouseup', endMove)
      if (e.touches && e.touches.length === 1) {
        document.body.addEventListener('touchmove', move)
        document.body.addEventListener('touchend', endMove)
      }
    }
    this.setState(
      {
        moving: true,
      },
      initMove
    )
  }
  componentWillReceiveProps = nextProps => {
    if (nextProps.x !== this.props.x) {
      this.setState({ x: nextProps.x, y: nextProps.y })
    }
  }
  render = () => {
    const { moving, x, y } = this.state
    const { removing } = this.props
    return (
      <div
        className={`clip__node ${moving ? 'clip__node--moving' : ''} ${
          removing ? 'clip__node--removing' : ''
        }`}
        ref={n => (this.el = n)}
        style={{
          '--x': x,
          '--y': y,
        }}>
        {removing && (
          <svg className="clip__node-remove" viewBox="0 0 24 24">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        )}
      </div>
    )
  }
}
class ClipPath extends Component {
  getClipPath = () => {
    const { height, nodes, width } = this.props
    let path = ''
    for (let n = 0; n < nodes.length; n++) {
      const node = nodes[n]
      path += `${Math.floor(node.x / width * 100)}% ${Math.floor(
        node.y / height * 100
      )}%${n === nodes.length - 1 ? '' : `, `}`
    }
    return `polygon(${path})`
  }
  render = () => {
    const { nodes, removalMode, onRemove, onUpdate } = this.props
    const clipPath = this.getClipPath()
    return (
      <div className="clip__container" ref={c => (this.el = c)}>
        <div
          className="clip__mask"
          style={{
            clipPath,
          }}
        />
        {nodes.map((n, idx) => (
          <ClipPathNode
            id={idx}
            key={`clip-node--${idx}`}
            x={n.x}
            y={n.y}
            removing={removalMode}
            onMove={onUpdate}
            onRemove={onRemove}
          />
        ))}
        <footer className="clip__path">{`clip-path: ${clipPath}`}</footer>
      </div>
    )
  }
}
const MODES = {
  CIRCLE: 'circle',
  ELLIPSE: 'ellipse',
  INSET: 'inset',
  POLYGON: 'polygon',
}
const PRESETS = {
  CIRCLE: [],
  ELLIPSE: [],
  INSET: [],
  POLYGON: [
    {
      x: 40,
      y: 100,
    },
    {
      x: 75,
      y: 120,
    },
    {
      x: 0,
      y: 45,
    },
  ],
}
class App extends Component {
  state = {
    nodes: PRESETS.CIRCLE,
    removing: false,
    mode: MODES.CIRCLE,
  }
  onUpdate = n => {
    const nodes = this.state.nodes.map((o, idx) => {
      if (idx === n.props.id) {
        o = Object.assign({}, o, {
          x: n.state.x,
          y: n.state.y,
        })
      }
      return o
    })
    this.setState({
      nodes,
    })
  }
  addNode = () => {
    this.setState({
      nodes: [
        ...this.state.nodes,
        {
          x: 150,
          y: 150,
        },
      ],
    })
  }
  removeNode = id => {
    const nodes = this.state.nodes.filter((n, i) => i !== id)
    this.setState({
      nodes,
    })
  }
  removeNodes = () => {
    this.setState({
      removing: !this.state.removing,
    })
  }
  render = () => {
    const { addNode, onUpdate, removeNode, removeNodes } = this
    const { mode, nodes, removing } = this.state
    return (
      <Fragment>
        <Container>
          <ClipPath
            height={300}
            nodes={nodes}
            onUpdate={onUpdate}
            onRemove={removeNode}
            removalMode={removing}
            width={300}
          />
        </Container>
        {mode === MODES.POLYGON && (
          <Fragment>
            <button disabled={removing} onClick={addNode}>
              Add Node
            </button>
            <button onClick={removeNodes}>
              {removing ? 'Done' : 'Remove Nodes'}
            </button>
          </Fragment>
        )}
      </Fragment>
    )
  }
}
render(<App />, document.getElementById('app'))
