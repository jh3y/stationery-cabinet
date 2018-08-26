const { moment, PIXI, PropTypes, React, ReactDOM } = window
const { Component, Fragment } = React
const { render } = ReactDOM
const { Application, Rectangle, Sprite } = PIXI
const rootNode = document.getElementById('app')
const BLOB_SIZE = 40
const DEBOUNCE = 'DEBOUNCE'
const THROTTLE = 'THROTTLE'
const TIME_FORMAT = 'hh:mm:ss'
const TIME_BASE = moment().format(TIME_FORMAT)
/**
 * debounce function
 * use inDebounce to maintain internal reference of timeout to clear
 */
const debounce = (func, delay) => {
  let inDebounce
  return function() {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}

/**
 * throttle function that catches and triggers last invocation
 * use time to see if there is a last invocation
 */
const throttle = (func, limit) => {
  let lastFunc
  let lastRan
  return function() {
    const context = this
    const args = arguments
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function() {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}

const getShape = (size, isDiamond) => {
  const d = document.createElement('canvas')
  const c = d.getContext('2d')
  const side = Math.sqrt((size * size) / 2)
  d.height = size
  d.width = size
  c.fillStyle = '#ffffff'
  if (isDiamond) {
    c.translate(size / 2, 0)
    c.rotate((45 * Math.PI) / 180)
    c.fillRect(0, 0, side, side)
  } else {
    c.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
    c.fill()
  }
  return d
}
const Circle = getShape(BLOB_SIZE)
const Diamond = getShape(BLOB_SIZE, true)
class Timeline extends Component {
  state = {
    blobs: [],
  }
  static defaultProps = {
    blobSize: BLOB_SIZE,
    height: innerHeight,
    debounceColor: 0x4ecdc4,
    throttleColor: 0xf64747,
    blobOpacity: 0.75,
    onBlobSelect: () => {},
  }
  static propTypes = {
    blobSize: PropTypes.number,
    height: PropTypes.number,
    debounceColor: PropTypes.number,
    throttleColor: PropTypes.number,
    blobOpacity: PropTypes.number,
    onBlobSelect: PropTypes.func,
  }
  onTick = () => {
    const {
      App,
      BlobContainer,
      BlobTwoContainer,
      state: { blobs },
      props: { blobSize },
    } = this
    if (!blobs || !blobs.length) return
    if (
      App.renderer.width !== innerWidth ||
      App.renderer.height !== innerHeight
    ) {
      App.renderer.resize(innerWidth, innerHeight)
      BlobContainer.removeChildren()
      BlobTwoContainer.removeChildren()
      this.setState({ blobs: [] })
    } else {
      for (const blob of blobs) {
        if (blob.active) {
          blob.x += 1
          blob.hitArea = new Rectangle(blob.x, blob.y, blobSize, blobSize)
        }
        if (blob.x > innerWidth) {
          blob.active = false
          blob.x = -blobSize
          blob.data.fresh = false
        }
      }
    }
  }
  getBlob = isDebounce => {
    const {
      createBlob,
      state: { blobs },
    } = this
    // Either generate a new blob or return one from state 👍
    const available = blobs.find(
      b => !b.active && (isDebounce ? b.type === DEBOUNCE : b.type === THROTTLE)
    )
    if (available) {
      available.active = true
      return available
    } else {
      return createBlob(isDebounce)
    }
  }
  createBlob = isDebounce => {
    const {
      BlobContainer,
      BlobTwoContainer,
      props: { blobSize, debounceColor, height, throttleColor },
    } = this
    const Blob = new Sprite.from(isDebounce ? Circle : Diamond)
    const y = Math.floor(Math.random() * (height - blobSize))
    Blob.active = true
    Blob.x = -blobSize
    Blob.y = y
    Blob.tint = isDebounce ? debounceColor : throttleColor
    Blob.alpha = 1
    Blob.data = {
      fresh: true,
      born: new Date().getTime(),
      type: isDebounce ? DEBOUNCE : THROTTLE,
    }
    if (isDebounce) BlobContainer.addChild(Blob)
    else BlobTwoContainer.addChild(Blob)
    return Blob
  }
  showBlob = isDebounce => {
    const {
      getBlob,
      state: { blobs: oldBlobs },
    } = this
    const newBlob = getBlob(isDebounce)
    const blobs = newBlob.data.fresh
      ? [...oldBlobs, newBlob]
      : oldBlobs.map(b => (b.data.born === newBlob.data.born ? newBlob : b))
    this.setState({ blobs })
  }
  createBlobContainer = () => {
    const Container = new PIXI.particles.ParticleContainer(10000, {
      scale: true,
      position: true,
      alpha: true,
    })
    return Container
  }
  createPixiApp = () => {
    const {
      VIEW: view,
      props: { height },
    } = this
    const App = new Application({
      antialias: true,
      height,
      transparent: true,
      view,
      width: innerWidth,
    })
    return App
  }
  componentDidMount = () => {
    const { createBlobContainer, createPixiApp, onTick } = this
    const App = (this.App = createPixiApp())
    const BlobContainer = (this.BlobContainer = createBlobContainer())
    const BlobTwoContainer = (this.BlobTwoContainer = createBlobContainer())
    App.stage.addChild(BlobContainer)
    App.stage.addChild(BlobTwoContainer)
    App.ticker.add(onTick)
  }
  render = () => {
    return <canvas ref={view => (this.VIEW = view)} />
  }
}
class App extends Component {
  state = {
    time: TIME_BASE,
    debounceRate: 2000,
    throttleRate: 1000,
    showInfo: true,
  }
  showBlob = isDebounce => {
    return () => {
      this.TIMELINE.showBlob(isDebounce)
    }
  }
  tick = () => {
    this.setState({
      time: moment().format(TIME_FORMAT),
    })
  }
  showThrottle = throttle(this.showBlob(), this.state.throttleRate)
  showDebounce = debounce(this.showBlob(true), this.state.debounceRate)
  componentDidMount = () => {
    window.addEventListener('mousemove', this.showDebounce)
    window.addEventListener('mousemove', this.showThrottle)
    window.addEventListener('touchmove', this.showDebounce)
    window.addEventListener('touchmove', this.showThrottle)
    this.INTERVAL = setInterval(this.tick, 1000)
  }
  componentWillUnmount = () => {
    window.removeEventListener('mousemove', this.showDebounce)
    window.removeEventListener('mousemove', this.showThrottle)
    window.removeEventListener('touchmove', this.showDebounce)
    window.removeEventListener('touchmove', this.showThrottle)
    clearInterval(this.INTERVAL)
  }
  updateHandlers = debounce(() => {
    const {
      state: { debounceRate, throttleRate },
    } = this
    window.removeEventListener('mousemove', this.showDebounce)
    window.removeEventListener('mousemove', this.showThrottle)
    window.removeEventListener('touchmove', this.showDebounce)
    window.removeEventListener('touchmove', this.showThrottle)
    this.showThrottle = throttle(this.showBlob(), throttleRate)
    this.showDebounce = debounce(this.showBlob(true), debounceRate)
    window.addEventListener('mousemove', this.showDebounce)
    window.addEventListener('mousemove', this.showThrottle)
    window.addEventListener('touchmove', this.showDebounce)
    window.addEventListener('touchmove', this.showThrottle)
  }, 500)
  onOptionChange = e => {
    e.persist()
    const newState = {}
    newState[e.target.name] = e.target.value
    this.setState(newState, () => this.updateHandlers(e.target.value))
  }
  discardIntro = () => {
    this.setState({ showInfo: false })
  }
  render = () => {
    const {
      discardIntro,
      onOptionChange,
      state: { debounceRate, showInfo, throttleRate, time },
    } = this
    return (
      <Fragment>
        {showInfo && (
          <div className="show-info">
            <h2>What is happening here?</h2>
            <p>
              This demo is visualising when throttled and debounced functions
              are fired.
            </p>
            <p>
              We are throttling and debouncing <code>mousemove</code> and{' '}
              <code>touchmove</code> event handling on <code>window</code>. Move
              your mouse or finger around to start throttling and debouncing an
              event handler. Throttled function calls are represented by a red
              diamond. A debounced function call is represented by a green
              circle.
            </p>
            <p>
              You can read about throttling and debouncing in this post:{' '}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf">
                Throttling and Debouncing in JavaScript
              </a>
            </p>
            <button onClick={discardIntro}>Got it! 👍</button>
          </div>
        )}
        <div className="timeline__container">
          <div className="time">{time}</div>
          <Timeline ref={timeline => (this.TIMELINE = timeline)} />
        </div>
        <div className="actions">
          <label>{`Debounce for ${debounceRate}ms`}</label>
          <input
            type="range"
            min="50"
            max="10000"
            step="50"
            name="debounceRate"
            onChange={onOptionChange}
            value={debounceRate}
          />
          <label>{`Throttle every ${throttleRate}ms`}</label>
          <input
            type="range"
            min="50"
            max="10000"
            step="50"
            name="throttleRate"
            onChange={onOptionChange}
            value={throttleRate}
          />
        </div>
      </Fragment>
    )
  }
}
render(<App />, rootNode)
