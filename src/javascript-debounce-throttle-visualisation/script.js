const { PIXI, PropTypes, React, ReactDOM } = window
const { Component, Fragment } = React
const { render } = ReactDOM
const { Application, Graphics, Rectangle, Sprite } = PIXI
const rootNode = document.getElementById('app')

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

class Timeline extends Component {
  state = {
    blobs: [],
  }
  static defaultProps = {
    blobSize: 20,
    height: 100,
  }
  static propTypes = {
    blobSize: PropTypes.number,
    height: PropTypes.number,
  }
  onTick = () => {
    const {
      App,
      BlobContainer,
      state: { blobs },
      props: { blobSize, height },
    } = this
    if (!blobs || !blobs.length) return
    if (App.renderer.width !== innerWidth) {
      App.renderer.resize(innerWidth, height)
      BlobContainer.removeChildren()
    }
    for (const blob of blobs) {
      // debugger
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
  getBlob = isDebounce => {
    const {
      createBlob,
      state: { blobs },
    } = this
    // Either generate a new blob or return one from state 👍
    const available = blobs.find(b => !b.active)
    if (available) {
      available.active = true
      if (isDebounce) available.tint = 0xe74c3c
      return available
    } else {
      return createBlob()
    }
  }
  createBlob = () => {
    const {
      BaseTexture,
      BlobContainer,
      props: { blobSize, height },
    } = this
    const Blob = new Sprite(BaseTexture)
    const x = Math.floor(Math.random() * innerWidth)
    const y = Math.floor(Math.random() * height)
    Blob.active = true
    Blob.x = -blobSize
    Blob.y = y
    Blob.tint = 0x2eec71
    Blob.interactive = true
    Blob.buttonMode = true
    Blob.alpha = 0.5
    Blob.hitArea = new Rectangle(x, y, blobSize, blobSize)
    Blob.on('mouseover', () => {
      Blob.alpha = 1
    })
    Blob.on('mouseout', () => {
      Blob.alpha = 0.5
    })
    Blob.data = {
      fresh: true,
      born: new Date().getTime(),
    }
    BlobContainer.addChild(Blob)
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
    const Container = new PIXI.particles.ParticleContainer(100, {
      scale: true,
      position: true,
      alpha: true,
    })
    Container.buttonMode = true
    Container.interactive = true
    Container.interactiveChildren = true
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
  createBaseTexture = PixiApp => {
    const {
      props: { blobSize },
    } = this
    const BlobGraphic = new Graphics()
    BlobGraphic.beginFill(0xffffff)
    BlobGraphic.drawCircle(0, 0, blobSize / 2)
    BlobGraphic.endFill()
    return PixiApp.renderer.generateTexture(BlobGraphic)
  }
  componentDidMount = () => {
    const {
      createBaseTexture,
      createBlobContainer,
      createPixiApp,
      onTick,
    } = this
    const App = (this.App = createPixiApp())
    const BlobContainer = (this.BlobContainer = createBlobContainer())
    App.stage.addChild(BlobContainer)
    App.ticker.add(onTick)
    this.BaseTexture = createBaseTexture(App)
  }
  render = () => {
    return <canvas ref={view => (this.VIEW = view)} />
  }
}
class App extends Component {
  state = {
    debounce: 3000,
    throttle: 2000,
  }
  showDebounce = debounce(() => {
    const { TIMELINE } = this
    TIMELINE.showBlob(true)
  }, this.state.debounce)
  showThrottle = throttle(() => {
    const { TIMELINE } = this
    TIMELINE.showBlob()
  }, this.state.throttle)
  render = () => {
    const { showDebounce, showThrottle } = this
    return (
      <Fragment>
        <Timeline ref={timeline => (this.TIMELINE = timeline)} />
        <button onClick={showDebounce}>Debounce</button>
        <button onClick={showThrottle}>Throttle</button>
      </Fragment>
    )
  }
}
render(<App />, rootNode)
