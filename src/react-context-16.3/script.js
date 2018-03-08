const { createContext, Component } = React

const { render } = ReactDOM

const keyframes = styled.keyframes
const styled = styled.default

const THEME_CONSTANTS = {
  NIGHT: 'night',
  DAY: 'day',
}

/**
 * Create a basic theme context
 *
 * do a dirty getHours to determine the defaultValue
 */
const d = new Date()
const defaultValue =
  d > 6 && d > 19 ? THEME_CONSTANTS.NIGHT : THEME_CONSTANTS.DAY
const ThemeContext = createContext(defaultValue)

const $night = '#111'
const $day = '#7ec0ee'
const $starColor = '#fefcd7'
const $sunColor = '#f9fa57'
const $size = 25
const $transitionDuration = 0.75
const $skyChangeDuration = 0.5
const $positionX = 20
const $positionY = 10

const Container = styled.div`
  background-color: ${p => (p.theme === THEME_CONSTANTS.NIGHT ? $night : $day)};
  height: 100vh;
  transition: background ${$skyChangeDuration} ease;
  width: 100vw;
`

const BigStar = styled.div`
  border-radius: 100%;
  height: ${$size}vh;
  left: ${$positionX}vw;
  position: absolute;
  top: ${$positionY}vh;
  transition transform ${$transitionDuration}s ease 0s;
  width: ${$size}vh;
  z-index: 2;
`

const Moon = BigStar.extend`
  background-color: ${$starColor};
  box-shadow: 0px 0px 50px #eee;
  overflow: hidden;
  transform: ${p =>
    p.theme === THEME_CONSTANTS.NIGHT
      ? 'scale(1)'
      : 'scale(0.5) translateX(-75vw) translateY(-120vh)'};
  &:after {
    box-shadow: inset 10px 10px 10px #bbb;
    border-radius: 100%;
    content: '';
    display: block;
    height: 100%;
    width: 100%;
  }
`

const Craters = styled.div`
  background-color: #ddd;
  border-radius: 100%;
  opacity: 0.5;
  position: absolute;
  top: 15%;
  left: 15%;
  height: ${$size * 0.25}vh;
  width: ${$size * 0.25}vh;

  &:before {
    background-color: #ddd;
    content: '';
    display: block;
    border-radius: 100%;
    height: 50%;
    width: 50%;
    position: absolute;
    top: 110%;
  }

  &:after {
    background-color: #ddd;
    content: '';
    display: block;
    border-radius: 100%;
    height: 30%;
    width: 30%;
    position: absolute;
    top: 80%;
    right: 110%;
  }
`

const CloudMove = keyframes`
  0% {
    transform: translateX(300%);
    opacity: 0;
  }
  50% {
    opacity: .75;
  }
  25%, 75% {
    opacity: 0;
  }
  100% {
    transform: translateX(-300%);
    opacity: 0;
  }
`

const Star = styled.div`
  background: ${p => (p.theme === THEME_CONSTANTS.NIGHT ? $starColor : $day)};
  border-radius: 100%;
  height: ${p => p.size}px;
  left: ${p => p.x}vw;
  position: absolute;
  top: ${p => p.y}vh;
  opacity: ${p => (p.theme === THEME_CONSTANTS.NIGHT ? 1 : 0)};
  transition: background ${$transitionDuration}s ease 0s,
    opacity ${$transitionDuration}s ease 0s;
  width: ${p => p.size}px;
  z-index: 1;
`

const Sun = BigStar.extend`
  background-color: ${$sunColor};
  box-shadow: 0px 0px 150px yellow;
  transform: ${p =>
    p.theme === THEME_CONSTANTS.NIGHT
      ? 'scale(0.5) translateX(75vw) translateY(200vh)'
      : 'scale(1)'};
`

const Features = styled.div`
  height: 50%;
  width: 50%;
  position: absolute;
  right: 15%;
  bottom: 15%;
  transition: opacity 0.15s ease 0s;
  transition-delay: 0.75s;
  opacity: ${p => (p.show ? '1' : '0')};
`

const Blink = keyframes`
  0%, 5%, 7%, 100% {
    transform: scaleY(1);
  }
  6% {
    transform scaleY(0);
  }
`

const Eye = styled.div`
  border-radius: 100%;
  height: 15%;
  width: 15%;
  background-color: black;
  position: absolute;
  top: 25%;
  animation: ${Blink} 10s infinite 1s;
  transform-origin: center;

  &:after {
    background-color: #fff;
    border-radius: 100%;
    content: '';
    height: 40%;
    width: 40%;
    position: absolute;
    top: 5%;
    right: 30%;
    display: block;
  }
`

const LeftEye = Eye.extend`
  left: 25%;
`

const RightEye = Eye.extend`
  left: 75%;
`

const Smile = styled.div`
  width: 55%;
  height: 25%;
  border-style: solid;
  border-width: 15%;
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  border-radius: 100%;
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translateX(-50%);
`

const Face = ({ show }) => (
  <Features show={show}>
    <LeftEye />
    <RightEye />
    <Smile />
  </Features>
)

const ThemeToggleInput = styled.input`
  cursor: pointer;
  z-index: 3;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  &:checked ~ div {
    transform: translateX(20px);
  }
`

const ThemeToggleContainer = styled.div`
  left: 10px;
  position: fixed;
  top: 10px;
  width: 50px;
  height: 30px;
  border: 4px solid
    ${p => (p.theme === THEME_CONSTANTS.NIGHT ? '#fff' : 'dodgerblue')};
  border-radius: 30px;
  transition: border-color 0.25s ease 0s;
`

const ThemeToggleSwitch = styled.div`
  height: 20px;
  width: 20px;
  background: ${p =>
    p.theme === THEME_CONSTANTS.NIGHT ? $starColor : $sunColor};
  border-radius: 100%;
  position: absolute;
  top: 50%;
  margin-top: -10px;
  left: 1px;
  transform: translateX(0px);
  transition: background 0.25s ease 0s, transform 0.25s ease 0s;
`

const ThemeToggle = ({ onChange, checked }) => (
  <ThemeContext.Consumer>
    {theme => (
      <ThemeToggleContainer theme={theme}>
        <ThemeToggleInput
          type="checkbox"
          onChange={onChange}
          checked={checked}
          title="Toggle theme"
        />
        <ThemeToggleSwitch theme={theme} />
      </ThemeToggleContainer>
    )}
  </ThemeContext.Consumer>
)

// BackDrop component just to have a separation for context use 😅
const BackDrop = ({ stars }) => (
  <ThemeContext.Consumer>
    {theme => (
      <Container theme={theme}>
        <Sun theme={theme}>
          <Face show={theme === THEME_CONSTANTS.DAY} />
        </Sun>
        <Moon theme={theme}>
          <Face show={theme === THEME_CONSTANTS.NIGHT} />
          <Craters />
        </Moon>
        {stars.map((star, idx) => (
          <Star key={`star--${idx}`} {...star} theme={theme} />
        ))}
      </Container>
    )}
  </ThemeContext.Consumer>
)
const generateItems = (
  numberOfItems = 5,
  sizeLimit = 10,
  animationDuration = 10
) => {
  const items = []
  for (let i = 0; i < numberOfItems; i++) {
    items.push({
      animated: Math.random() > 0.75,
      delay: Math.floor(Math.random() * animationDuration),
      duration: Math.floor(Math.random() * animationDuration + 5),
      size: Math.floor(Math.random() * sizeLimit + 1),
      x: Math.floor(Math.random() * 100 + 1),
      y: Math.floor(Math.random() * 100 + 1),
    })
  }
  return items
} // Root component where we can provide/update context for child components 👍
class App extends Component {
  state = {
    theme: defaultValue,
  }
  static defaultProps = {
    stars: generateItems(20, 4),
  }
  toggle = e => {
    const { theme } = this.state
    this.setState({
      theme:
        theme === THEME_CONSTANTS.NIGHT
          ? THEME_CONSTANTS.DAY
          : THEME_CONSTANTS.NIGHT,
    })
  }
  render = () => {
    const { stars } = this.props
    const { theme } = this.state
    return (
      <ThemeContext.Provider value={theme}>
        <BackDrop stars={stars} />
        <ThemeToggle checked={theme === defaultValue} onChange={this.toggle} />
      </ThemeContext.Provider>
    )
  }
}
// Render the app 😎
render(<App />, root)
