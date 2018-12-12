const { React, ReactDOM, Draggable } = window
const { Component, Fragment } = React
const { createPortal, render } = ReactDOM

class Man extends Component {
  componentDidMount = () =>
    new Draggable(this.MAN, {
      allowContextMenu: true,
      ...this.props,
    })
  render = () => {
    return (
      <div className="man" ref={m => (this.MAN = m)} role="img">
        🏃
      </div>
    )
  }
}
const getXY = e => {
  let { pageX: x, pageY: y, touches } = e
  if (touches && touches.length === 1) {
    x = touches[0].pageX
    y = touches[0].pageY
  }
  return {
    x,
    y,
  }
}
const outsideEl = document.getElementById('outside')
const rootNode = document.getElementById('app')
class App extends Component {
  state = {
    outside: false,
  }
  isDroppedOn = (e, el) => {
    const { x, y } = getXY(e)
    const { left, top, width, height } = el.getBoundingClientRect()
    if (x > left && x < left + width && (y > top && y < top + height))
      return true
    return false
  }
  onRelease = e => {
    const {
      isDroppedOn,
      INNER_PORTAL,
      OUTER_PORTAL,
      state: { outside },
    } = this
    if (isDroppedOn(e, INNER_PORTAL) || isDroppedOn(e, OUTER_PORTAL)) {
      this.setState({ outside: !outside })
    }
  }
  render = () => {
    const {
      onRelease,
      state: { outside },
    } = this
    return (
      <Fragment>
        {!outside && <Man bounds={rootNode} onRelease={onRelease} />}
        <div className="portal portal--in" ref={i => (this.INNER_PORTAL = i)} />
        {outside &&
          createPortal(
            <Man bounds={outsideEl} onRelease={onRelease} />,
            outsideEl
          )}
        {createPortal(
          <div
            ref={o => (this.OUTER_PORTAL = o)}
            className="portal portal--out"
          />,
          outsideEl
        )}
      </Fragment>
    )
  }
}
render(<App />, rootNode)
