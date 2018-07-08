const { Component, Fragment } = React
const { render } = ReactDOM
const keyframes = styled.keyframes
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
  ${p => p.baseStyle};
`
const getDirectionStyles = d => {
  let bottom
  let top
  let left
  let right
  let x
  let y
  switch (d) {
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
      break
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
  ${p => getDirectionStyles(p.direction)} &:after {
    background: #2eec71;
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
      this.STARTING_TOP = rootNode.offsetHeight / 2 + rootNode.scrollTop
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
      rootNode.removeEventListener('mousemove', resize)
      rootNode.removeEventListener('touchmove', resize)
      rootNode.removeEventListener('mouseup', endResize)
      rootNode.removeEventListener('touchend', endResize)
    }
    resize = e => {
      e.preventDefault()
      const { direction, startHeight, startX, startY, startWidth } = this.state
      const { x, y } = getXY(e)
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
      rootNode.addEventListener('mousemove', resize)
      rootNode.addEventListener('touchmove', resize)
      rootNode.addEventListener('mouseup', endResize)
      rootNode.addEventListener('touchend', endResize)

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
      const { diffLeft, diffTop, height, width, offsetTop, offsetLeft } = state
      return (
        <Resizable
          className={'rsizable'}
          innerRef={r => (this.__RESIZABLE = r)}
          translateX={dragX - (offsetLeft + diffLeft)}
          translateY={dragY - (offsetTop + diffTop)}
          baseStyle={Object.assign({}, options.style, {
            top: `${this.STARTING_TOP}px`,
          })}>
          {options.handles.length &&
            options.handles.map((h, idx) => (
              <ResizableHandle
                onMouseDown={e => startResize(e, h)}
                onTouchStart={e => startResize(e, h)}
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
      rootNode.addEventListener('mousemove', onDrag)
      rootNode.addEventListener('touchmove', onDrag)
      rootNode.addEventListener('mouseup', onDragEnd)
      rootNode.addEventListener('touchend', onDragEnd)
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
      e.preventDefault()
      const { onDrag, onDragEnd } = this
      rootNode.removeEventListener('mousemove', onDrag, {passive: true})
      rootNode.removeEventListener('touchmove', onDrag, {passive: true})
      rootNode.removeEventListener('mouseup', onDragEnd, {passive: true})
      rootNode.removeEventListener('touchend', onDragEnd, {passive: true})
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

const flyIn = keyframes`
  from {
    transform: translate(-50%, -50%) scale(0);
  }
`
const Container = styled.div`
  display: inline-block;
  position: relative;
  ${p =>
    !p.confirmed
      ? `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    animation: ${flyIn} .5s .25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    animation-fill-mode: backwards;
  `
      : ``};
`
const SignatureInput = styled.svg`
  background: ${p => (p.confirmed ? 'transparent' : '#fff')};
  border-radius: 6px;
  height: 200px;
  width: 300px;
`
const Action = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  ${p =>
    p.confirm
      ? `
    height: 50px;
    width: 50px;
    border-radius: 100%;
    border: 0;
    background: #3fc380;

    &:hover {
      background: #2eec71;
    }

  `
      : null} ${p =>
    p.wiper
      ? `
          background: none;
          border: 0;
          height: 44px;
          position: absolute;
          top: 0;
          right: 0;
          width: 44px;
        `
      : null} path {
    fill: ${p => p.fill};
  }

  &[disabled] {
    background: #ddd;
  }

  &:hover path {
    fill: ${p => p.hover};
  }
`
const Actions = styled.div`
  display: flex;
  align-items center;
  justify-content: center;
  padding: 10px;
`
const Icon = styled.svg.attrs({
  viewBox: '0 0 24 24',
  preserveAspectRatio: 'xMinYMin',
})`
  height: 24px;
  width: 24px;
`
const SignatureContainer = styled.div`
  position: relative;
`
const Placeholder = styled.label`
  color: #ddd;
  position: absolute;
  font-size: 1.5rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`
class Signature extends Component {
  static defaultProps = {
    confirmed: false,
  }
  state = {
    confirmed: this.props.confirmed,
    path: this.props.path || '',
  }
  startSign = e => {
    const { INPUT, endSign, sign } = this
    const { x, y } = getXY(e)
    const { left, top } = INPUT.getBoundingClientRect()
    const path = `M ${x - left}, ${y - top} `

    rootNode.addEventListener('mousemove', sign)
    rootNode.addEventListener('touchmove', sign)
    rootNode.addEventListener('mouseup', endSign)
    rootNode.addEventListener('touchend', endSign)

    this.setState({
      path: this.state.path + path,
    })
  }
  sign = e => {
    const { INPUT } = this
    const { x, y } = getXY(e)
    const { left, top } = INPUT.getBoundingClientRect()
    const path = `L ${x - left}, ${y - top} `

    this.setState({
      path: this.state.path + path,
    })
  }
  endSign = e => {
    const { endSign, sign } = this
    rootNode.removeEventListener('mousemove', sign)
    rootNode.removeEventListener('touchmove', sign)
    rootNode.removeEventListener('mouseup', endSign)
    rootNode.removeEventListener('touchend', endSign)
  }
  wipe = () => {
    this.setState({
      path: '',
    })
  }
  confirm = () => {
    if (confirm('All set?')) {
      TweenMax.to(this.CONTAINER, 0.25, {
        delay: 0.25,
        scale: 0,
        onComplete: () => {
          this.setState(
            {
              confirmed: true,
            },
            () => this.props.onConfirm(this.state.path)
          )
        },
      })
    }
  }
  render = () => {
    const { confirm, startSign, wipe } = this
    const { confirmed, path } = this.state

    return (
      <Container innerRef={c => (this.CONTAINER = c)} confirmed={confirmed}>
        <SignatureContainer>
          {path === '' && <Placeholder>Please Sign</Placeholder>}
          <SignatureInput
            confirmed={confirmed}
            innerRef={i => (this.INPUT = i)}
            onMouseDown={startSign}
            onTouchStart={startSign}>
            <path
              stroke="#111"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              d={path}
            />
          </SignatureInput>
        </SignatureContainer>
        {!confirmed && (
          <Actions>
            <Action
              fill="#fff"
              disabled={path === ''}
              confirm={true}
              onClick={confirm}>
              <Icon>
                <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
              </Icon>
            </Action>
            <Action fill="#ddd" hover="#444" wiper={true} onClick={wipe}>
              <Icon>
                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
              </Icon>
            </Action>
          </Actions>
        )}
      </Container>
    )
  }
}

const AppContainer = styled.div`
  padding: 5%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const scaleIn = keyframes`
  from {
    transform: scale(0);
  }
`
const Document = styled.div`
  background: #fafafa;
  max-width: 794px;
  padding: 30px;
  position: relative;
  width: 95%;
  animation: ${scaleIn} 0.5s 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation-fill-mode: backwards;
`

const DocumentTitle = styled.h1`
  border-radius: 4px;
  font-size: 3rem;
  text-align: center;
  margin-bottom: 40px;
`
const DocumentSection = styled.section`
  margin-bottom: 30px;
`
const DocumentSectionTitle = styled.h3``
const DocumentSectionContent = styled.ol`
  margin: 0;
  padding: 0 0 0 20px;
`
const DocumentContent = styled.li`
  margin-bottom: 30px;
`
const Signoff = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 50px repeat(2, 1fr);
  min-width: 40%;
  padding: 50px 0 50px 40%;
`
const SignoffDetail = styled.dd`
  font-weight: bold;
`
const SignoffValue = styled.dt``
const DocumentActions = styled.div`
  position: fixed;
  right: 10px;
  top: 50%;
  transform: translate(0, -50%);
  z-index: 2;
`
const Sign = styled.button`
  cursor: pointer;
  border-radius: 100%;
  border: 0;
  height: 50px;
  width: 50px;
  background: #89c4f4;
  margin-bottom: 10px;
  path {
    fill: #fff;
  }
  &:hover {
    background: #4b77be;
  }
`
const Stamp = styled.svg.attrs({
  onMouseDown: p => p.onDragStart,
  onTouchStart: p => p.onDragStart,
})`
  height: ${p => p.resizeHeight}px;
  width: ${p => p.resizeWidth}px;
  path {
    transform: scaleX(${p => p.scaleX}) scaleY(${p => p.scaleY});
  }
`
const sections = []
for (let s = 0; s < 2; s++) {
  const points = []
  const length = Math.floor(Math.random() * 4) + 1
  for (let p = 0; p < length; p++) {
    points.push(faker.lorem.paragraph())
  }
  sections.push({
    title: `${s + 1}. ${faker.lorem.sentence(3)}`,
    points,
  })
}
const content = {
  title: faker.lorem.sentence(3),
  intro: faker.lorem.paragraph(),
  date: new Date().toDateString(),
  sections,
}

const Signed = props => {
  return (
    <Stamp
      onMouseDown={props.onDragStart}
      onTouchStart={props.onDragStart}
      resizeHeight={props.resizeHeight}
      resizeWidth={props.resizeWidth}
      scaleX={props.resizeWidth / 300}
      scaleY={props.resizeHeight / 200}>
      <path
        stroke="#111"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        d={props.path}
      />
    </Stamp>
  )
}

const DraggableAndResizableSignature = makeDraggable(
  makeResizable(Signed, {
    style: {
      cursor: 'move',
      cursor: '-webkit-grab',
      position: 'absolute',
      touchAction: 'none',
      left: '50%',
      margin: '-100px 0 0 -150px',
      zIndex: 3,
    },
  })
)
class App extends Component {
  state = {
    setup: false,
    signature: undefined,
    signatures: 0,
  }
  addSignature = () => {
    if (this.state.signature) {
      this.setState({
        signatures: this.state.signatures + 1,
      })
    }
  }
  render = () => {
    const { addSignature } = this
    const { signature, signatures, setup } = this.state
    if (!setup)
      return (
        <Signature
          onConfirm={signature => this.setState({ signature, setup: true })}
          confirmed={setup}
        />
      )
    return (
      <AppContainer>
        {new Array(signatures)
          .fill()
          .map((s, idx) => (
            <DraggableAndResizableSignature
              key={`signature--${idx}`}
              path={signature}
            />
          ))}
        <DocumentActions>
          <Sign onClick={addSignature}>
            <Icon>
              <path d="M16.84,2.73C16.45,2.73 16.07,2.88 15.77,3.17L13.65,5.29L18.95,10.6L21.07,8.5C21.67,7.89 21.67,6.94 21.07,6.36L17.9,3.17C17.6,2.88 17.22,2.73 16.84,2.73M12.94,6L4.84,14.11L7.4,14.39L7.58,16.68L9.86,16.85L10.15,19.41L18.25,11.3M4.25,15.04L2.5,21.73L9.2,19.94L8.96,17.78L6.65,17.61L6.47,15.29" />
            </Icon>
          </Sign>
          <Action fill="#fff" disabled={false} confirm={true}>
            <Icon>
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
            </Icon>
          </Action>
        </DocumentActions>
        <Document>
          <DocumentTitle>{content.title}</DocumentTitle>
          <DocumentSection>{content.intro}</DocumentSection>
          {content.sections.map((s, idx) => (
            <DocumentSection key={`document-section--${idx}`}>
              <DocumentSectionTitle>{s.title}</DocumentSectionTitle>
              <DocumentSectionContent>
                {s.points.map((p, idx) => (
                  <DocumentContent key={`document-section--${idx}`}>
                    {p}
                  </DocumentContent>
                ))}
              </DocumentSectionContent>
            </DocumentSection>
          ))}
          <Signoff>
            <SignoffDetail>Signed:</SignoffDetail>
            <SignoffValue />
            <SignoffDetail>Name:</SignoffDetail>
            <SignoffValue />
            <SignoffDetail>Date:</SignoffDetail>
            <SignoffValue>{new Date().toDateString()}</SignoffValue>
          </Signoff>
        </Document>
      </AppContainer>
    )
  }
}
ReactDOM.render(<App />, rootNode)
