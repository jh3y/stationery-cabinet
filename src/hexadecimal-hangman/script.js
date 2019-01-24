const { React, ReactDOM, styled } = window
const { useEffect, useState } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const Container = styled.div`
  display: grid;
  width: 300px;
  min-height: 460px;
`

const Options = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 44px);
  grid-template-rows: repeat(4, 44px);
  grid-column: 1 / -1;
  align-content: center;
  justify-content: center;
  animation: enter 0.25s ${p => (p.games > 0 ? 0 : 2)}s ease both;
`

const Result = styled.div`
  grid-column: 1 / -1;
`

const Char = styled.div`
  font-size: 2rem;
  text-align: center;
  color: ${p =>
    p.dark
      ? `rgba(0, 0, 0, ${p.fade ? 0.5 : 1})`
      : `rgba(255, 255, 255, ${p.fade ? 0.5 : 1})`};
  transition: color 0.25s ease;
  ${p =>
    p &&
    p.underline &&
    `
    border-bottom: 5px solid ${p.dark ? '#000' : '#FFF'};
  `};
`
const HangingMan = styled.svg`
  height: 200px;

  @media (min-width: 768px) {
    height: auto;
  }

  path,
  circle {
    animation-fill-mode: forwards;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 5px;
    fill: none;
    stroke: ${p => (p.dark ? '#000' : '#FFF')};
  }
`
const HangZone = styled.div`
  display: flex;
  grid-column: 1 / -1;
  justify-content: center;
  @media (min-width: 768px) {
    display: block;
  }
`
const swing = styled.keyframes`
  0%,
  50%,
  100% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(-1deg);
  }
  75% {
    transform: rotate(1deg);
  }
`

const Swingers = styled.g`
  transform-origin: 50% 0;
  animation: ${swing} 3s infinite linear paused;
  ${p =>
    p.animate &&
    `
    animation-play-state: running;
  `};
`
const draw = styled.keyframes`
  to {
    stroke-dashoffset: 0;
  }
`
const Frame = styled.path`
  d: path('M 5 195 L 5 5 L 100 5 M 50 5 L 5 50');
  stroke-dashoffset: 400;
  stroke-dasharray: 400;
  animation: ${draw} 2s 1s ease;
`
const Rope = styled.path`
  d: path('M 100 5 L 100 30');
`
const Head = styled.circle``
const Arms = styled.path`
  d: path('M 90 110 L 100 80 L 110 110');
`
const Body = styled.path`
  d: path('M 100 70 L 100 120');
`
const Legs = styled.path`
  d: path('M 96 140 L 100 120 L 104 140');
`
/**
 * Hexadecimal Hangman
 * Built w/ React Hooks + CSS Grid
 * @author Jhey
 */
const chars = '0123456789ABCDEF'
const getHex = () =>
  new Array(6)
    .fill()
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join('')

const getRgbFromHex = hex => {
  let i = 0
  let result = []
  while (i < 5) {
    result.push(parseInt(hex.substring(i, i + 2), 16))
    i += 2
  }
  return result
}

const Game = () => {
  const [games, setGames] = useState(0)
  const [fails, setFails] = useState([])
  const [successes, setSuccesses] = useState([])
  const [dark, setDark] = useState(false)
  const [hex, setHex] = useState(getHex())
  /**
   * When a character is selected
   * Check it against the hex in state
   * If it's there, awesome, add to solved, else failed
   * @param {String} selected
   */
  const selectChar = char => {
    if (hex.includes(char)) {
      // How many times does char appear?
      const count = hex.match(new RegExp(char, 'g')).length
      const matches = new Array(count).fill().map(() => char)
      setSuccesses([...successes, ...matches])
    } else {
      setFails([...fails, char])
    }
  }
  /**
   * Resets the game and starts new 👍
   */ const newGame = () => {
    setHex(getHex())
    setFails([])
    setSuccesses([])
    setGames(games + 1)
  }
  useEffect(
    () => {
      // If 2 out of 3 RGB values are over 200 then switch container
      // to dark mode 👍
      const rgb = getRgbFromHex(hex)
      document.body.style.background = `rgb(${rgb.join(',')})`
      // CHEAT 😅
      // document.body.style.background = `#${hex}`
      setDark(rgb.filter(c => c > 200).length >= 2)
    },
    [hex]
  )
  return (
    <Container className="container">
      <HangZone>
        <HangingMan
          dark={dark}
          preserveAspectRatio="xMinYMin"
          viewBox="0 0 200 200">
          <Frame />
          <Swingers animate={fails.length > 1}>
            {fails.length >= 1 && <Rope />}
            {fails.length >= 2 && <Head cx="100" cy="50" r="20" />}
            {fails.length >= 3 && <Body />}
            {fails.length >= 4 && <Arms />}
            {fails.length >= 5 && <Legs />}
          </Swingers>
        </HangingMan>
      </HangZone>
      <Char dark={dark} className="char">
        #
      </Char>
      {hex &&
        hex.split('').map((c, i) => {
          return (
            <Char
              className="char"
              key={`char--${i}`}
              underline={true}
              fade={fails.length === 5 && !successes.includes(c)}
              dark={dark}>
              {(successes.includes(c) || fails.length === 5) && c}
            </Char>
          )
        })}
      {hex &&
        fails.length !== 5 &&
        successes.length !== 6 && (
          <Options games={games} className="options">
            {chars.split('').map(c => (
              <button
                disabled={successes.includes(c) || fails.includes(c)}
                key={`key--${c}`}
                onClick={() => selectChar(c)}>
                {c}
              </button>
            ))}
          </Options>
        )}
      {(fails.length === 5 || successes.length === 6) && (
        <Result>
          {fails.length === 5 && <h1>Unlucky!</h1>}
          {successes.length === 6 && <h1>Well Done! 🎉</h1>}
          <button onClick={newGame}>New Game</button>
        </Result>
      )}
    </Container>
  )
}
render(<Game />, rootNode)
