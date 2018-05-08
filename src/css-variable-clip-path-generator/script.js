const { Component, Fragment } = React
const { render } = ReactDOM

const getClipPath = (nodes, size, mode) => {
  let centerX
  let centerY
  let path = ''
  switch (mode) {
    case MODES.POLYGON:
      for (let n = 0; n < nodes.length; n++) {
        const node = nodes[n]
        path += `${Math.floor(node.x / size * 100)}% ${Math.floor(
          node.y / size * 100
        )}%${n === nodes.length - 1 ? '' : `, `}`
      }
      break
    case MODES.INSET:
      // iterate through nodes TRBL
      for (let n = 0; n < nodes.length; n++) {
        switch (n) {
          case 0:
            path += `${Math.floor(nodes[n].y / size * 100)}% `
            break
          case 1:
            path += `${100 - Math.floor(nodes[n].x / size * 100)}% `
            break
          case 2:
            path += `${100 - Math.floor(nodes[n].y / size * 100)}% `
            break
          case 3:
            path += `${Math.floor(nodes[n].x / size * 100)}%`
            break
        }
      }
      break
    case MODES.ELLIPSE:
      const xDistance = Math.abs(
        Math.floor((nodes[1].x - nodes[0].x) / size * 100)
      )
      const yDistance = Math.abs(
        Math.floor((nodes[2].y - nodes[0].y) / size * 100)
      )
      path = `${xDistance}% ${yDistance}% at ${Math.floor(
        nodes[0].x / size * 100
      )}% ${Math.floor(nodes[0].y / size * 100)}%`
      break
    case MODES.CIRCLE:
      const { x: centerX, y: centerY } = nodes[0]
      const { x, y } = nodes[1]
      const distY = y - centerY
      const distX = x - centerX
      const distance = Math.floor(
        Math.sqrt(distX * distX + distY * distY) / size * 100
      )
      path = `${distance}% at ${Math.floor(centerX / size * 100)}% ${Math.floor(
        centerY / size * 100
      )}%`
      break
    default:
      path = 'No mode selected'
  }
  return `${mode.toLowerCase()}(${path})`
}

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
  getPageXY = e => {
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
    const { x, y } = this.getPageXY(e)
    const move = e => {
      const { x: oldX, y: oldY } = this.state
      const { x: pageX, y: pageY } = this.getPageXY(e)
      const {
        height,
        top,
        left,
        width,
      } = this.el.parentNode.getBoundingClientRect()
      const x = Math.min(Math.max(0, pageX - left), width)
      const y = Math.min(Math.max(0, pageY - top), height)
      this.setState(
        {
          x: this.props.restrictX ? oldX : x,
          y: this.props.restrictY ? oldY : y,
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
    if (nextProps.x !== this.props.x || nextProps.y !== this.props.y) {
      this.setState({ x: nextProps.x, y: nextProps.y })
    }
  }
  render = () => {
    const { moving, x, y } = this.state
    const { removing } = this.props
    return (
      <div
        className={`clip-path-node ${moving ? 'clip-path-node--moving' : ''} ${
          removing ? 'clip-path-node--removing' : ''
        }`}
        ref={n => (this.el = n)}
        style={{
          '--x': x,
          '--y': y,
        }}>
        {removing && (
          <svg className="clip-path-node__remove" viewBox="0 0 24 24">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        )}
      </div>
    )
  }
}
const SIZE = 300
const PRESETS = {
  CIRCLE: [
    {
      x: SIZE / 2,
      y: SIZE / 2,
    },
    {
      x: 250,
      y: 250,
    },
  ],
  ELLIPSE: [
    {
      x: SIZE / 2,
      y: SIZE / 2,
    },
    {
      x: 200,
      y: SIZE / 2,
    },
    {
      x: SIZE / 2,
      y: 25,
    },
  ],
  INSET: [
    {
      x: SIZE / 2,
      y: 25,
    },
    {
      x: 275,
      y: SIZE / 2,
    },
    {
      x: SIZE / 2,
      y: 275,
    },
    {
      x: 25,
      y: SIZE / 2,
    },
  ],
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
const MODES = {
  CIRCLE: 'CIRCLE',
  ELLIPSE: 'ELLIPSE',
  INSET: 'INSET',
  POLYGON: 'POLYGON',
}
class ClipPathGenerator extends Component {
  state = {
    removing: false,
    mode: MODES.POLYGON,
    size: SIZE,
    nodes: PRESETS[MODES.POLYGON],
  }
  onUpdate = n => {
    const nodes = this.state.nodes.map((o, idx) => {
      if (idx === n.props.id) {
        o = Object.assign({}, o, {
          x: n.state.x,
          y: n.state.y,
        })
      } else if (this.state.mode === MODES.ELLIPSE && n.props.id === 0) {
        if (idx === 1) {
          const xMove = n.state.x - this.state.nodes[0].x
          let newX = o.x + xMove
          if (newX > 300 || newX < 0) {
            newX = this.state.nodes[0].x + this.state.nodes[0].x - newX
          }
          o = Object.assign({}, o, {
            y: n.state.y,
            x: Math.min(300, Math.max(0, newX)),
          })
        } else if (idx === 2) {
          const yMove = n.state.y - this.state.nodes[0].y
          let newY = o.y + yMove
          if (newY > 300 || newY < 0) {
            newY = this.state.nodes[0].y + this.state.nodes[0].y - newY
          }
          o = Object.assign({}, o, {
            x: n.state.x,
            y: Math.min(300, Math.max(0, newY)),
          })
        }
      } else if (this.state.mode === MODES.CIRCLE && n.props.id === 0) {
        if (idx === 1) {
          const xMove = n.state.x - this.state.nodes[0].x
          let newX = o.x + xMove
          if (newX > 300 || newX < 0) {
            newX = this.state.nodes[0].x + this.state.nodes[0].x - newX
          }
          const yMove = n.state.y - this.state.nodes[0].y
          let newY = o.y + yMove
          if (newY > 300 || newY < 0) {
            newY = this.state.nodes[0].y + this.state.nodes[0].y - newY
          }
          o = Object.assign({}, o, {
            x: Math.min(300, Math.max(0, newX)),
            y: Math.min(300, Math.max(0, newY)),
          })
        }
      }
      return o
    })
    this.setState({
      copied: false,
      nodes,
    })
  }
  addNode = () => {
    this.setState({
      copied: false,
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
      copied: false,
      removing: !this.state.removing,
    })
  }
  switchMode = e => {
    this.setState({
      copied: false,
      mode: MODES[e.target.value.toUpperCase()],
      nodes: PRESETS[e.target.value.toUpperCase()],
    })
  }
  copy = () => {
    const path = this.path
    if (this.path) {
      this.path.select()
      document.execCommand('Copy')
      this.setState({
        copied: true,
      })
    }
  }
  render = () => {
    const { addNode, switchMode, onUpdate, removeNode, removeNodes } = this
    const { copied, mode, nodes, removing, size } = this.state
    const clipPath = getClipPath(nodes, size, mode)
    return (
      <Fragment>
        <div className="clip-path-generator__container">
          <div className="clip-path-generator" ref={c => (this.el = c)}>
            <div
              className="clip-path-generator__clipped"
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
                removing={removing}
                onMove={onUpdate}
                onRemove={removeNode}
                restrictX={
                  (mode === MODES.INSET && !(idx % 2)) ||
                  (mode === MODES.ELLIPSE && idx === 2)
                    ? true
                    : false
                }
                restrictY={
                  (mode === MODES.INSET && idx % 2) ||
                  (mode === MODES.ELLIPSE && idx === 1)
                    ? true
                    : false
                }
              />
            ))}
          </div>
        </div>
        <div className="clip-path">
          <div className="clip-path__value">{`clip-path: ${clipPath};`}</div>
          <input
            className="clip-path__input"
            readOnly
            ref={p => (this.path = p)}
            value={`clip-path: ${clipPath};`}
          />
          <button className="clip-path__copy button" onClick={this.copy}>
            {copied ? 'Copied 👍' : 'Copy'}
          </button>
        </div>
        <div className="clip-path-options">
          {Object.keys(MODES).map((m, idx) => (
            <div key={`clip-path-option--${idx}`} className="clip-path-option">
              <input
                className="clip-path-option__input"
                type="radio"
                name="shape"
                value={m}
                id={`clip-path-option--${m}`}
                onChange={switchMode}
                checked={m === mode}
              />
              <label className='clip-path-option__label' htmlFor={`clip-path-option--${m}`}>
                <div className="clip-path-option__check" />
                {`${m.charAt(0)}${m.toLowerCase().substr(1)}`}
              </label>
            </div>
          ))}
        </div>
        {mode === MODES.POLYGON && (
          <div className="polygon-actions">
            <button className="polygon-action polygon-action--add button" disabled={removing} onClick={addNode}>
              Add Node
            </button>
            <button className="polygon-action--remove polygon-action button" onClick={removeNodes}>
              {removing ? 'Done' : 'Remove Node'}
            </button>
          </div>
        )}
      </Fragment>
    )
  }
}
render(<ClipPathGenerator />, document.getElementById('app'))
