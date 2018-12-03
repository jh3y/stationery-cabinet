const { moment, PropTypes, styled, React, ReactDOM } = window
const { Component, Fragment } = React
const { render } = ReactDOM

const Strap = styled.div`
  background: purple;
  height: 300px;
  overflow: hidden;
  position: relative;
  width: 100px;
`
const Bezel = styled.div`
  background: silver;
  height: 60%;
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
`

const watchfacePropTypes = {
  date: PropTypes.object,
}

const Default = ({ date }) => {
  const seconds = date.format('ss')
  return <h1>{seconds}</h1>
}
Default.propTypes = watchfacePropTypes

const Full = ({ date }) => {
  const formatted = date.format('HH:MM:ss')
  return <h1>{formatted}</h1>
}
Full.propTypes = watchfacePropTypes

class Watch extends Component {
  state = {
    date: moment(),
  }
  componentDidMount = () => (this.TICK = setInterval(this.update, 1000))
  componentWillUnmount = () => clearInterval(this.TICK)
  update = () => this.setState({ date: moment() })
  render = () => {
    return (
      <Strap>
        <Bezel>
          {this.props.watchface && this.props.watchface(this.state.date)}
          {!this.props.watchface && <Default date={this.state.date} />}
        </Bezel>
      </Strap>
    )
  }
}
Watch.propTypes = {
  watchface: PropTypes.func,
}

class App extends Component {
  render = () => (
    <Fragment>
      <Watch />
      <Watch watchface={date => <Full date={date} />} />
      <Watch />
      <Watch />
    </Fragment>
  )
}

const rootNode = document.getElementById('app')
render(<App />, rootNode)
