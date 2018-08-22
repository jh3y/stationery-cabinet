const { PIXI, React, ReactDOM } = window
const { Component, Fragment } = React
const { render } = ReactDOM
const { Application, Graphics } = PIXI
const rootNode = document.getElementById('app')

/**
 * debounce function
 * use inDebounce to maintain internal reference of timeout to clear
 */
// const debounce = (func, delay) => {
//   let inDebounce
//   return function() {
//     const context = this
//     const args = arguments
//     clearTimeout(inDebounce)
//     inDebounce = setTimeout(() => func.apply(context, args), delay)
//   }
// }

/**
 * throttle function that catches and triggers last invocation
 * use time to see if there is a last invocation
 */
// const throttle = (func, limit) => {
//   let lastFunc
//   let lastRan
//   return function() {
//     const context = this
//     const args = arguments
//     if (!lastRan) {
//       func.apply(context, args)
//       lastRan = Date.now()
//     } else {
//       clearTimeout(lastFunc)
//       lastFunc = setTimeout(function() {
//         if (Date.now() - lastRan >= limit) {
//           func.apply(context, args)
//           lastRan = Date.now()
//         }
//       }, limit - (Date.now() - lastRan))
//     }
//   }
// }

class Timeline extends Component {
  state = {
    blobs: [],
  }
  onTick = () => {
    const {
      app,
      blobContainer,
      state: { blobs },
    } = this
    if (!blobs || !blobs.length) return
    if (app.renderer.width !== innerWidth) {
      app.renderer.resize(innerWidth, 400)
      blobContainer.removeChildren()
    }
    for (const blob of blobs) {
      if (!blob.active) {
        blob.active = true
        const blobG = new PIXI.Sprite(this.BASE)
        blobG.x = 0
        blobG.y = 0
        blobG.tint = blobs.length > 3 ? 0xe74c3c : 0xffffff
        let text = new PIXI.Text('This is a PixiJS text', {
          fontFamily: 'Arial',
          fontSize: 24,
          fill: 0xff1010,
          align: 'center',
        })
        blobG.text = 'Hello World'
        blobG.addChild(text)
        blobContainer.addChild(blobG)
        // debugger
      }
      // debugger
    }
  }
  addBlob = () => {
    this.setState({
      blobs: [...this.state.blobs, { t: new Date() }],
    })
  }
  componentDidMount = () => {
    const { onTick } = this
    const app = (this.app = new Application({
      antialias: true,
      transparent: true,
      view: this.VIEW,
      width: innerWidth,
      height: 400,
    }))
    const blobContainer = (this.blobContainer = new PIXI.particles.ParticleContainer(
      100,
      {
        scale: true,
        position: true,
        alpha: true,
      }
    ))
    app.stage.addChild(blobContainer)
    app.ticker.add(onTick)
    const p = new Graphics()
    p.beginFill(0xffffff)
    p.drawCircle(0, 0, 100)
    p.endFill()
    this.BASE = app.renderer.generateTexture(p)
  }
  render = () => {
    return <canvas ref={view => (this.VIEW = view)} />
  }
}

class App extends Component {
  addBlob = () => {
    this.TIMELINE.addBlob()
  }
  render = () => {
    const { addBlob } = this
    return (
      <Fragment>
        <h1>🌯</h1>
        <Timeline ref={timeline => (this.TIMELINE = timeline)} />
        <button onClick={addBlob}>Add</button>
      </Fragment>
    )
  }
}
render(<App />, rootNode)
