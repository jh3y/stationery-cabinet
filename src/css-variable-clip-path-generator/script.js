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
      this.setState({
        x,
        y,
      }, () => this.props.onMove(this))
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
  render = () => {
    const { moving, x, y } = this.state
    return (
      <div
        className={`clip__node ${moving ? 'clip__node--moving' : ''}`}
        ref={n => (this.el = n)}
        style={{
          '--x': x,
          '--y': y,
        }}
      />
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
    const { nodes } = this.props
    const clipPath = this.getClipPath()
    return (
      <div className="clip__container" ref={c => (this.el = c)}>
        <div className="clip__mask" style={{
          clipPath
        }}/>
        {nodes.map((n, idx) => (
          <ClipPathNode
            id={idx}
            key={`clip-node--${idx}`}
            x={n.x}
            y={n.y}
            onMove={this.props.onUpdate}
          />
        ))}
        <footer className="clip__path">{`clip-path: ${clipPath}`}</footer>
      </div>
    )
  }
}
class App extends Component {
  state = {
    nodes: [
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
        y: 45
      }
    ],
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
      nodes: [...this.state.nodes, {
        x: 150,
        y: 150
      }]
    })
  }
  render = () => {
    const { onUpdate } = this
    const { nodes } = this.state
    return (
      <Fragment>
        <Container>
          <ClipPath height={300} nodes={nodes} onUpdate={onUpdate} width={300} />
        </Container>
        <button onClick={this.addNode}>Add Node</button>
      </Fragment>
    )
  }
}
render(<App />, document.getElementById('app'))
