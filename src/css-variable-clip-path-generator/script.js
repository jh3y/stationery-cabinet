const { Component, Fragment } = React
const { render } = ReactDOM

const getClipPath = (nodes, size, mode) => {
  let path = ''
  let centerX
  let centerY
  let dragX
  let dragY
  const getRatio = d => Math.floor(d / size * 100)
  if (!nodes.length) return null
  switch (mode) {
    case MODES.POLYGON:
      for (let n = 0; n < nodes.length; n++) {
        const { x, y } = nodes[n]
        path += `${getRatio(x)}% ${getRatio(y)}%${
          n === nodes.length - 1 ? '' : `, `
        }`
      }
      break
    case MODES.INSET:
      for (let n = 0; n < nodes.length; n++) {
        const { x, y } = nodes[n]
        switch (n) {
          case 0:
            path += `${getRatio(y)}% `
            break
          case 1:
            path += `${100 - getRatio(x)}% `
            break
          case 2:
            path += `${100 - getRatio(y)}% `
            break
          case 3:
            path += `${getRatio(x)}%`
            break
        }
      }
      break
    case MODES.ELLIPSE:
      ;({ x: centerX, y: centerY } = nodes[0])
      dragX = nodes[1].x
      dragY = nodes[2].y
      const xDistance = Math.abs(getRatio(dragX - centerX))
      const yDistance = Math.abs(getRatio(dragY - centerY))
      path = `${xDistance}% ${yDistance}% at ${getRatio(centerX)}% ${getRatio(
        centerY
      )}%`
      break
    case MODES.CIRCLE:
      ;({ x: centerX, y: centerY } = nodes[0])
      dragX = nodes[1].x
      dragY = nodes[1].y
      const distX = dragX - centerX
      const distY = dragY - centerY
      const distance = getRatio(Math.sqrt(distX * distX + distY * distY))
      path = `${distance}% at ${getRatio(centerX)}% ${getRatio(centerY)}%`
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
    const { el, startMove, removeNode } = this
    el.addEventListener('mousedown', startMove)
    el.addEventListener('touchstart', startMove)
    el.addEventListener('click', removeNode)
  }
  removeNode = () => {
    const { id, removing, onRemove } = this.props
    if (removing && onRemove) onRemove(id)
  }
  getPageXY = e => {
    let { pageX: x, pageY: y, touches } = e
    if (touches && touches.length === 1) {
      x = touches[0].pageX
      y = touches[0].pageY
    }
    y -= window.pageYOffset
    return {
      x,
      y,
    }
  }
  startMove = e => {
    const { onMove, removing, restrictX, restrictY } = this.props
    if (removing) return
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
          x: restrictX ? oldX : x,
          y: restrictY ? oldY : y,
        },
        () => onMove(this)
      )
    }
    const endMove = () => {
      this.setState(
        {
          moving: false,
        },
        () => {
          onMove(this)
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
      x: 195,
      y: 105,
    },
    {
      x: 140,
      y: 50,
    },
  ],
  ELLIPSE: [
    {
      x: 195,
      y: 150,
    },
    {
      x: 285,
      y: 150,
    },
    {
      x: 195,
      y: 30,
    },
  ],
  INSET: [
    {
      x: 195,
      y: 30,
    },
    {
      x: 270,
      y: 165,
    },
    {
      x: 195,
      y: 300,
    },
    {
      x: 120,
      y: 165,
    },
  ],
  POLYGON: [
    {
      x: 255,
      y: 20,
    },
    {
      x: 210,
      y: 45,
    },
    {
      x: 90,
      y: 45,
    },
    {
      x: 45,
      y: 15,
    },
    {
      x: 0,
      y: 75,
    },
    {
      x: 30,
      y: 135,
    },
    {
      x: 30,
      y: 225,
    },
    {
      x: 75,
      y: 270,
    },
    {
      x: 120,
      y: 285,
    },
    {
      x: 180,
      y: 285,
    },
    {
      x: 225,
      y: 275,
    },
    {
      x: 270,
      y: 225,
    },
    {
      x: 270,
      y: 135,
    },
    {
      x: 300,
      y: 75,
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
    const {id: updatedId} = n.props
    const {x: updatedX, y: updatedY} = n.state
    const { mode, nodes: currentNodes } = this.state
    const getHandlePoint = (node, axis) => {
      const movement = n.state[axis] - currentNodes[0][axis]
      let newPoint = node[axis] + movement
      if (newPoint > SIZE || newPoint < 0) {
        newPoint = currentNodes[0][axis] + currentNodes[0][axis] - newPoint
      }
      return Math.min(SIZE, Math.max(0, newPoint))
    }
    // Create a new set of nodes by mapping through the current node set
    const nodes = currentNodes.map((o, idx) => {
      // If it's the node that's being moved, just update it with new values
      if (idx === updatedId) {
        o = Object.assign({}, o, {
          x: updatedX,
          y: updatedY,
        })
      }
      // Else if in INSET mode update the corresponding axis so the nodes are center aligned
      else if (mode === MODES.INSET) {
        // Need to update the opposite axis to still be centrally aligned in the clip

        const getCenterPoint = (start, end, axis) =>
          currentNodes[start][axis] +
          (currentNodes[end][axis] - currentNodes[start][axis]) / 2
        // UPDATING X
        if (updatedId % 2 && !(idx % 2)) {
          o = Object.assign({}, o, {
            x:
              updatedId === 1
                ? getCenterPoint(3, 1, 'x')
                : getCenterPoint(1, 3, 'x'),
          })
        } else if (!(updatedId % 2) && idx % 2) {
          o = Object.assign({}, o, {
            y:
              updatedId === 2
                ? getCenterPoint(0, 2, 'y')
                : getCenterPoint(2, 0, 'y'),
          })
        }
      } else if (mode === MODES.ELLIPSE && updatedId === 0 && idx !== 0) {
        o = Object.assign({}, o, {
          y: idx === 1 ? updatedY : getHandlePoint(o, 'y'),
          x: idx === 1 ? getHandlePoint(o, 'x') : updatedX,
        })
      } else if (mode === MODES.CIRCLE && updatedId === 0 && idx !== 0) {
        o = Object.assign({}, o, {
          x: getHandlePoint(o, 'x'),
          y: getHandlePoint(o, 'y'),
        })
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
          x: SIZE / 2,
          y: SIZE / 2,
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
    if (this.path) {
      this.path.select()
      document.execCommand('Copy')
      this.setState({
        copied: true,
      })
    }
  }
  wipeNodes = () => {
    this.setState({
      nodes: []
    })
  }
  render = () => {
    const {
      addNode,
      copy,
      switchMode,
      onUpdate,
      removeNode,
      removeNodes,
      wipeNodes,
    } = this
    const { copied, mode, nodes, removing, size } = this.state
    const clipPath = getClipPath(nodes, size, mode)
    return (
      <Fragment>
        <div className="clip-path-generator__container">
          <div className="clip-path-generator" ref={c => (this.el = c)}>
            <div
              className="clip-path-generator__clipped"
              style={{
                '--path': clipPath,
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
          <div className="clip-path__value">{clipPath ? `clip-path: ${clipPath};` : 'No clip path set'}</div>
          <input
            className="clip-path__input"
            readOnly
            ref={p => (this.path = p)}
            value={`clip-path: ${clipPath};`}
          />
          <button
            disabled={removing || !clipPath}
            className="clip-path__copy button"
            onClick={copy}>
            {copied ? 'Copied 👍' : 'Copy'}
          </button>
        </div>
        <div className="clip-path-options">
          {Object.keys(MODES).map((m, idx) => (
            <div key={`clip-path-option--${idx}`} className="clip-path-option">
              <input
                disabled={removing}
                className="clip-path-option__input"
                type="radio"
                name="shape"
                value={m}
                id={`clip-path-option--${m}`}
                onChange={switchMode}
                checked={m === mode}
              />
              <label
                className="clip-path-option__label"
                htmlFor={`clip-path-option--${m}`}>
                <div className="clip-path-option__check" />
                {`${m.charAt(0)}${m.toLowerCase().substr(1)}`}
              </label>
            </div>
          ))}
        </div>
        {mode === MODES.POLYGON && (
          <div className="polygon-actions">
            <button
              className="polygon-action polygon-action--add button"
              disabled={removing}
              onClick={addNode}>
              Add Node
            </button>
            <button
              className={`polygon-action ${
                removing ? 'polygon-action--removing' : 'polygon-action--remove'
              } button`}
              onClick={removeNodes}>
              {removing ? 'Done' : 'Remove Node'}
            </button>
            <button
              disabled={removing}
              className='polygon-action polygon-action--wipe button'
              onClick={wipeNodes}>
              {'Wipe Nodes'}
            </button>
          </div>
        )}
      </Fragment>
    )
  }
}
render(<ClipPathGenerator />, document.getElementById('app'))
