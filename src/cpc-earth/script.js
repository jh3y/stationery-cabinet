const { React, ReactDOM, Linear, Elastic, TimelineMax } = window
const { Component } = React
const { render } = ReactDOM

const shake = (el, dur) => {
  const TL = new TimelineMax({ repeat: 1 })
  const shakes = [
    [1, 1, 0],
    [-1, -2, -1],
    [-3, 0, 1],
    [3, 2, 0],
    [1, -1, 1],
    [-1, 2, -1],
    [-3, 1, 0],
    [3, 1, -1],
    [-1, -1, 1],
    [1, 2, 0],
    [1, -2, -1],
    [0, 0, 0],
  ]
  for (const shake of shakes) {
    TL.to(el, dur / 12, {
      x: shake[0],
      y: shake[1],
      rotation: shake[2],
    })
  }
  return TL
}

class Earth extends Component {
  state = {
    spinning: false,
    shrinking: false,
    extended: false,
    extending: false,
  }
  toggleT = []
  spin = () => {
    const {
      state: { extending, spinning, extended, width },
    } = this
    if (spinning || extended || extending) return
    this.setState(
      {
        spinning: true,
      },
      () => {
        for (let toggle of this.toggleT) clearInterval(toggle)
        const TL = new TimelineMax({
          onComplete: () => this.setState({ spinning: false }),
        })
        TL.to(this.map, 0.25, {
          x: -(width * 3),
          repeat: 4,
          ease: Linear.easeNone,
        })
        TL.to(this.map, 0, {
          x: 0,
        })
      }
    )
  }
  componentDidMount = () => {
    this.reset()
    window.addEventListener('resize', this.reset())
  }
  reset = () => {
    this.earth.removeAttribute('style')
    const { height, width } = this.earth.getBoundingClientRect()
    this.setState({
      height,
      width,
    })
  }
  extend = () => {
    const {
      earth,
      state: { height, width, extended },
    } = this
    const TL = new TimelineMax({
      onStart: () =>
        this.setState({
          shrinking: extended,
          extending: !extended,
        }),
      onComplete: () =>
        this.setState({
          extended: !extended,
          extending: false,
          shrinking: false,
        }),
    })
    // If not expanded, do a little shake then a shrink then a blimp
    if (!extended) TL.add(shake(earth, 0.5))
    TL.to(earth, 0.5, {
      ease: Elastic.easeOut.config(1, 0.3),
      width: !extended ? width * 3 : width,
      borderRadius: !extended ? height / 10 : height / 2,
    })
  }
  toggle = () => {
    const {
      extend,
      state: { extending, spinning },
    } = this
    if (extending || spinning) return
    this.toggleT = [...this.toggleT, setTimeout(extend, 200)]
  }
  render = () => {
    const {
      spin,
      toggle,
      state: { extended, extending, spinning, shrinking },
    } = this
    return (
      <div
        onClick={toggle}
        onDoubleClick={spin}
        ref={e => (this.earth = e)}
        className="earth">
        <div ref={m => (this.map = m)} className="earth__map" />
        <div className="earth__clouds" />
        <div
          className={`earth__face ${
            extending ? 'earth__face--straining' : ''
          }`}>
          <div
            className={`earth__eye ${spinning ? 'earth__eye--spinning' : ''} ${
              extending ? 'earth__eye--straining' : ''
            } ${!spinning && !extending ? 'earth__eye--blinking' : ''}`}
          />
          <div
            className={`earth__eye ${spinning ? 'earth__eye--spinning' : ''} ${
              extending ? 'earth__eye--straining' : ''
            } ${!spinning && !extending ? 'earth__eye--blinking' : ''}`}
          />
          <div
            className={`earth__mouth ${
              (extended && !shrinking) || spinning
                ? 'earth__mouth--extended'
                : ''
            } ${extending ? 'earth__mouth--straining' : ''}`}
          />
        </div>
      </div>
    )
  }
}
const rootNode = document.getElementById('app')
render(<Earth />, rootNode)
