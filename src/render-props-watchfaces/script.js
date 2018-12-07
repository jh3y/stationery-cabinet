const { moment, PropTypes, styled, React, ReactDOM } = window
const { Component, Fragment } = React
const { render } = ReactDOM

const clip =
  'polygon(0 5%, 5% 0, 95% 0, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0 95%)'

const Strap = styled.div`
  clip-path: ${clip};
  height: 300px;
  overflow: hidden;
  position: relative;
  width: 100px;
`

const Hand = styled.div`
  width: ${p => (p.type === 'seconds' ? 2 : 5)}px;
  height: ${p => (p.type ? 40 : 20)}px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: bottom;
  transform: translate(-50%, -100%) rotate(${p => p.value}deg);
`

const Bezel = styled.div`
  background: silver;
  height: 60%;
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  clip-path: ${clip};
  width: 102%;
`
const Screen = styled.div`
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  overflow: hidden;
  transform: translate(-50%, -50%);
  width: 90%;
  background: #000;
  color: #fff;
`

const Face = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const Value = styled.div`
  font-size: ${p => (p.small ? 2 : 3)}rem;
  line-height: ${p => (p.small ? 2 : 3)}rem;
  text-transform: uppercase;
  text-align: center;
  opacity: ${p => (p.opaque ? 0.5 : 1)};
`

const Day = styled.div`
  text-transform: uppercase;
  text-align: center;
`

const watchfacePropTypes = {
  date: PropTypes.object,
}

const DefaultFace = ({ date }) => (
  <Fragment>
    <Value>{date.format('HH')}</Value>
    <Value>{date.format('mm')}</Value>
  </Fragment>
)
DefaultFace.propTypes = watchfacePropTypes

const DateFace = ({ date }) => {
  const hours = date.format('HH')
  const minutes = date.format('mm')
  const monthYear = date.format('MMM DD')
  return (
    <Fragment>
      <Value>{hours}</Value>
      <Day>{monthYear}</Day>
      <Value>{minutes}</Value>
    </Fragment>
  )
}
DateFace.propTypes = watchfacePropTypes

const SecondsFace = ({ date }) => {
  const hours = date.format('HH')
  const minutes = date.format('mm')
  const seconds = date.format('ss')
  return (
    <Fragment>
      <Value>{hours}</Value>
      <Value>{minutes}</Value>
      <Value>{seconds}</Value>
    </Fragment>
  )
}
SecondsFace.propTypes = watchfacePropTypes

const AnalogFace = ({ date }) => {
  const seconds = (360 / 60) * date.seconds()
  const minutes = (360 / 60) * date.minutes()
  const hours = (360 / 12) * date.format('h')
  return (
    <Fragment>
      <Hand type="seconds" value={seconds} />
      <Hand type="minutes" value={minutes} />
      <Hand value={hours} />
    </Fragment>
  )
}
AnalogFace.propTypes = watchfacePropTypes

const DayFace = ({ date }) => {
  const hours = date.format('H')
  const minutes = date.format('mm')
  const dayN = date.format('dd')
  const day = date.format('DD')
  return (
    <Fragment>
      <Value small>{hours}</Value>
      <Value small>{minutes}</Value>
      <Value small opaque>
        {dayN}
      </Value>
      <Value small opaque>
        {day}
      </Value>
    </Fragment>
  )
}
DayFace.propTypes = watchfacePropTypes

class Watch extends Component {
  state = {
    date: moment(),
  }
  static propTypes = {
    face: PropTypes.func,
  }
  static defaultProps = {
    face: date => <DefaultFace date={date} />,
  }
  componentDidMount = () => (this.TICK = setInterval(this.update, 1000))
  componentWillUnmount = () => clearInterval(this.TICK)
  update = () => this.setState({ date: moment() })
  render = () => (
    <Strap>
      <Bezel>
        <Screen>
          <Face>{this.props.face(this.state.date)}</Face>
        </Screen>
      </Bezel>
    </Strap>
  )
}

class App extends Component {
  render = () => (
    <Fragment>
      <Watch face={date => <DayFace date={date} />} />
      <Watch />
      <Watch face={date => <AnalogFace date={date} />} />
      <Watch face={date => <DateFace date={date} />} />
      <Watch face={date => <SecondsFace date={date} />} />
    </Fragment>
  )
}

const rootNode = document.getElementById('app')
render(<App />, rootNode)
