const { React, ReactDOM, styled } = window
const { useEffect, useRef, useState } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')
/**
 * Keyframes animations used for elements
 */

/**
 * CHEAT CODES 😅
 * "SHAKE A LEG" - draw each leg individually
 * "GIVE ME A HAND" - draw each arm individually
 */ const swing = styled.keyframes`
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
const draw = styled.keyframes`
  to {
    stroke-dashoffset: 0;
  }
`
const enter = styled.keyframes`
  from {
    opacity: 0;
  }
`
const fly = styled.keyframes`
  0% {
    opacity: 0
    transform: translate(0, 0);
  }
  15%, 75% {
    opacity: 1;
  }
`
const Container = styled.div`
  display: grid;
  width: 280px;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: 180px 3rem 200px;
  grid-gap: 10px 0;
  align-items: center;
  @media (min-width: 375px) and (min-height: 660px) {
    grid-gap: 20px 0;
    grid-template-rows: 320px 3rem 200px;
    width: 320px;
  }
`
const fadeAway = styled.keyframes`
  to {
    opacity: 0;
  }
`
const Activation = styled.div`
  padding: 8px 12px;
  position: absolute;
  top: 5px;
  right: 5px;
  color: white;
  font-size: 1.25rem;
  color: ${p => (p.dark ? '#000' : '#FFF')};
  border: 2px solid ${p => (p.dark ? '#000' : '#FFF')};
  animation: ${fadeAway} 0.25s 2s ease forwards;
`
const Button = styled.button`
  cursor: pointer;
  background: transparent;
  font-size: 1.25rem;
  color: ${p => (p.dark ? '#000' : '#FFF')};
  border: 2px solid ${p => (p.dark ? '#000' : '#FFF')};

  &:hover {
    background: rgba(${p => (p.dark ? '0, 0, 0' : '255, 255, 255')}, 0.2);
  }

  &:disabled {
    background: transparent;
    opacity: 0.2;
  }
`
const NewGameButton = styled(Button)`
  padding: 0 16px;
  height: 44px;
`
const Options = styled.div`
  display: grid;
  grid-gap: 2px;
  grid-template-columns: repeat(4, 44px);
  grid-template-rows: repeat(4, 44px);
  grid-column: 1 / -1;
  align-content: center;
  justify-content: center;
  animation: ${enter} 0.25s ${p => (p.games > 0 ? 0 : 2)}s ease both;
`
const Result = styled.div`
  color: ${p => (p.dark ? '#000' : '#FFF')};
  grid-column: 1 / -1;
  animation: ${enter} 0.25s ${p => (p.lost ? 0.5 : 0)}s ease both;
  text-align: center;
  position: relative;
`
const Char = styled.div`
  font-size: 2rem;
  line-height: 3rem;
  height: 3rem;
  text-align: center;
  margin: 0 5px;
  height: 100%;
  opacity: ${p => (p.fade ? 0.3 : 1)};
  transform: translate(calc((280 / 14) * -1px), 0);
  transition: opacity 0.25s ease;
  @media (min-width: 375px) and (min-height: 660px) {
    transform: translate(calc((320 / 14) * -1px), 0);
  }
  color: ${p => (p.dark ? '#000' : '#FFF')};
  ${p =>
    p &&
    p.underline &&
    `
    border-bottom: 5px solid ${p.dark ? '#000' : '#FFF'};
  `};
`
const HangingMan = styled.svg`
  height: 180px;
  @media (min-width: 375px) and (min-height: 660px) {
    height: 320px;
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
  display: block;
  grid-column: 1 / -1;
  text-align: center;
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
const Frame = styled.path`
  stroke-dashoffset: 400;
  stroke-dasharray: 400;
  animation: ${draw} 2s 1s ease;
`
const Rope = styled.path`
  d: path('M 100 5 L 100 30');
  stroke-dashoffset: 100;
  stroke-dasharray: 100;
  animation: ${draw} 1s ease;
`
const Head = styled.circle`
  stroke-dashoffset: 150;
  stroke-dasharray: 150;
  animation: ${draw} 1s ease;
`
const Arms = styled.path`
  d: path(${p => p.d});
  stroke-dashoffset: 300;
  stroke-dasharray: 300;
  animation: ${draw} 2s ease;
`
const Body = styled.path`
  d: path('M 100 70 L 100 120');
  stroke-dashoffset: 200;
  stroke-dasharray: 200;
  animation: ${draw} 1s ease;
`
const Legs = styled.path`
  d: path(${p => p.d});
  stroke-dashoffset: 300;
  stroke-dasharray: 300;
  animation: ${draw} 2s ease;
`
const Tada = styled.span`
  animation: ${fly} 0.5s 0.25s ease both;
  position: absolute;
  left: 50%;
  top: 50%;
  opacity: 0;
  transform: rotate(calc(var(--r) * 1deg)) translate(0, calc(var(--l) * 1px));
`
/**
 * A hook that provides a way to hook into users typing out easter egg codes 😅
 * @param {String} code - Cheat code for user to enter on keypress
 */
const useCheatCode = (code, insensitive) => {
  const [active, setActive] = useState(false)
  const keyed = useRef([])
  const splitCode = useRef(code.split(''))
  const handlePress = e => {
    keyed.current = keyed.current.length ? [...keyed.current, e.key] : [e.key]
    if (
      splitCode.current.slice(0, keyed.current.length).every((v, i) => {
        const match = insensitive
          ? v.toLowerCase() === keyed.current[i].toLowerCase()
          : v === keyed.current[i]
        return match && keyed.current.length === splitCode.current.length
      })
    ) {
      // We got a match, let's do something cool 🎉
      window.removeEventListener('keypress', handlePress)
      setActive(true)
    } else if (
      !splitCode.current
        .slice(0, keyed.current.length)
        .every(
          (v, i) =>
            insensitive
              ? v.toLowerCase() === keyed.current[i].toLowerCase()
              : v === keyed.current[i]
        )
    ) {
      // No match so reset 👎
      keyed.current = []
    }
  }
  useEffect(() => {
    window.addEventListener('keypress', handlePress)
    return () => {
      window.removeEventListener('keypress', handlePress)
    }
  }, [])
  return active
}
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
  const threshold = useRef(5)
  const [hex, setHex] = useState(getHex())
  const hand = useCheatCode('GIVE ME A HAND', true)
  const leg = useCheatCode('SHAKE A LEG', true)
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
      document.body.style.background = `rgb(${rgb.join(',')})` // console.info(hex) // document.body.style.background = `#${hex}`
      // CHEAT 😅
      setDark(rgb.filter(c => c > 200).length >= 2)
    },
    [hex]
  )
  useEffect(
    () => {
      if (hand || leg) threshold.current = threshold.current + 1
    },
    [hand, leg]
  )
  return (
    <Container className="container">
      {hand && <Activation dark={dark}>Help activated!</Activation>}
      {leg && <Activation dark={dark}>Help activated!</Activation>}
      <HangZone>
        <HangingMan
          dark={dark}
          preserveAspectRatio="xMinYMin"
          viewBox="0 0 200 200">
          <Frame d="M 5 195 L 5 5 L 100 5 M 50 5 L 5 50" />
          <Swingers animate={fails.length > 1}>
            {fails.length >= 1 && <Rope d="M 100 5 L 100 30" />}
            {fails.length >= 2 && <Head cx="100" cy="50" r="20" />}
            {fails.length >= 3 && <Body d="M 100 70 L 100 120" />}
            {/** NO CHEATS ACTIVATED = FINISH IN 5 */}
            {!hand &&
              !leg &&
              fails.length >= 4 && <Arms d="M 90 110 L 100 80 L 110 110" />}
            {!hand &&
              !leg &&
              fails.length >= 5 && <Legs d="M 96 140 L 100 120 L 104 140" />}
            {/** ACTIVATED HAND + NOT LEG = FINISH IN 6 */}
            {hand &&
              !leg &&
              fails.length >= 4 && <Arms d="M 90 110 L 100 80" />}
            {hand &&
              !leg &&
              fails.length >= 5 && <Arms d="M 100 80 L 110 110" />}
            {hand &&
              !leg &&
              fails.length >= 6 && <Legs d="M 96 140 L 100 120 L 104 140" />}
            {/** ACTIVATED LEG + NOT HAND = FINISH IN 6 */}
            {!hand &&
              leg &&
              fails.length >= 4 && <Arms d="M 90 110 L 100 80 L 110 110" />}
            {!hand &&
              leg &&
              fails.length >= 5 && <Legs d="M 96 140 L 100 120" />}
            {!hand &&
              leg &&
              fails.length >= 6 && <Legs d="M 100 120 L 104 140" />}
            {/** ACTIVATED LEG + HAND = FINISH IN 7 */}
            {hand && leg && fails.length >= 4 && <Arms d="M 90 110 L 100 80" />}
            {hand &&
              leg &&
              fails.length >= 5 && <Arms d="M 100 80 L 110 110" />}
            {hand &&
              leg &&
              fails.length >= 6 && <Legs d="M 96 140 L 100 120" />}
            {hand &&
              leg &&
              fails.length >= 7 && <Legs d="M 100 120 L 104 140" />}
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
              fade={!successes.includes(c)}
              dark={dark}>
              {(successes.includes(c) || fails.length === threshold.current) &&
                c}
            </Char>
          )
        })}
      {hex &&
        fails.length !== threshold.current &&
        successes.length !== 6 && (
          <Options dark={dark} games={games} className="options">
            {chars.split('').map(c => (
              <Button
                dark={dark}
                disabled={successes.includes(c) || fails.includes(c)}
                key={`key--${c}`}
                onClick={() => selectChar(c)}>
                {c}
              </Button>
            ))}
          </Options>
        )}
      {(fails.length === threshold.current || successes.length === 6) && (
        <Result dark={dark} lost={fails.length === 5}>
          <h1>{`${successes.length === 6 ? 'Well Done!' : 'Unlucky!'}`}</h1>
          <NewGameButton dark={dark} onClick={newGame}>
            New Game
          </NewGameButton>
          {successes.length === 6 &&
            new Array(15).fill().map((f, i) => (
              <Tada
                style={{
                  '--r': Math.floor(Math.random() * 180) - 270,
                  '--l': Math.floor(Math.random() * 300) + 100,
                }}
                key={`tada--${i}`}
                role="img">
                🎉
              </Tada>
            ))}
        </Result>
      )}
    </Container>
  )
}
render(<Game />, rootNode)
