const { moment, React, ReactDOM, styled } = window
const { useEffect, useState, Fragment } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const useTime = () => {
  const [time, setTime] = useState(moment())
  useEffect(() => {
    const i = setInterval(() => setTime(moment()), 1000)
    return () => clearInterval(i)
  })
  return time
}
const clip =
  'polygon(0 5%, 5% 0, 95% 0, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0 95%)'

const Strap = styled.div`
  clip-path: ${clip};
  height: 200px;
  width 100px;
  background: black;
  position: relative;
`

const Container = styled.div`
  height: 200px;
  width: 160px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:after {
    content: '';
    height: 140px;
    width: 140px;
    border-radius: 100%;
    background: linear-gradient(
      -60deg,
      transparent 0,
      transparent 20%,
      rgba(255, 255, 255, 0.35) 20%,
      rgba(255, 255, 255, 0.35) 30%,
      transparent 30%,
      transparent 35%,
      rgba(255, 255, 255, 0.35) 35%,
      rgba(255, 255, 255, 0.35) 40%,
      transparent 40%
    );
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`

const Face = styled.div`
  border-radius: 100%;
  height: 150px;
  width: 150px;
  background: #111;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 5px solid silver;
`

const Hand = styled.div`
  width: ${p => (p.type === 'seconds' ? 2 : 5)}px;
  height: ${p => (p.type ? 60 : 40)}px;
  background: ${p => (p.type === 'seconds' ? '#ee786e' : '#fafafa')};
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: bottom;
  transform: translate(-50%, -100%) rotate(${p => p.value}deg);
`

const Unit = styled.span`
  color: white;
  font-size: ${p => (p.seconds ? 1 : 2.5)}rem;
  margin: 4px;
  ${p =>
    p &&
    p.seconds &&
    `
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -70%) translateX(320%);
  `};
`

const DigitalWatch = () => {
  const time = useTime()
  const hours = time.format('HH')
  const minutes = time.format('mm')
  const seconds = time.format('ss')
  return (
    <Container>
      <Strap />
      <Face>
        <Unit>{hours}</Unit>
        <Unit>{minutes}</Unit>
        <Unit seconds>{seconds}</Unit>
      </Face>
    </Container>
  )
}

const AnalogWatch = () => {
  const time = useTime()
  const seconds = (360 / 60) * time.seconds()
  const minutes = (360 / 60) * time.minutes()
  const hours = (360 / 12) * time.format('h')
  return (
    <Container>
      <Strap />
      <Face>
        <Hand type="seconds" value={seconds} />
        <Hand type="minutes" value={minutes} />
        <Hand value={hours} />
      </Face>
    </Container>
  )
}

const App = () => {
  return (
    <Fragment>
      <AnalogWatch />
      <DigitalWatch />
    </Fragment>
  )
}

render(<App />, rootNode)
