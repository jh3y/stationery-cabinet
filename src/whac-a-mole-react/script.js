import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
} from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'
import gsap from 'https://cdn.skypack.dev/gsap'

const TIME_LIMIT = 30000
const MOLE_SCORE = 100
const POINTS_MULTIPLIER = 0.9
const TIME_MULTIPLIER = 1.5
const MOLES = 5

const usePersistentState = (key, initialValue) => {
  const [state, setState] = useState(
    window.localStorage.getItem(key) || initialValue
  )
  useEffect(() => {
    window.localStorage.setItem(key, state)
  }, [key, state])
  return [state, setState]
}

const useAudio = src => {
  const [audio, setAudio] = useState(null)
  useEffect(() => {
    setAudio(new Audio(src))
  }, [src])
  return {
    play: () => audio.play(),
    pause: () => audio.pause(),
    stop: () => {
      audio.pause()
      audio.currentTime = 0
    },
  }
}

const Board = ({ children }) => <main>{children}</main>

const Score = ({ value }) => <span>{`Score: ${value}`}</span>

const HighScore = ({ value }) => <span>{`Hi Score: ${value}`}</span>

const Result = ({ value }) => <span>{`Result: ${value}`}</span>

const Mole = ({ onWhack, speed, delay, points, pointsMin = 10 }) => {
  const { play } = useAudio('https://assets.codepen.io/605876/pop.mp3')
  const [whacked, setWhacked] = useState(false)
  const pointsRef = useRef(points)
  const buttonRef = useRef(null)
  const bobRef = useRef(null)

  useEffect(() => {
    bobRef.current = gsap.to(buttonRef.current, {
      yPercent: -100,
      duration: speed,
      yoyo: true,
      repeat: -1,
      delay: delay,
      repeatDelay: delay,
      onRepeat: () => {
        pointsRef.current = Math.floor(
          Math.max(pointsRef.current * POINTS_MULTIPLIER, pointsMin)
        )
      },
    })
    return () => {
      bobRef.current.kill()
    }
  }, [delay, pointsMin, speed])

  useEffect(() => {
    if (whacked) {
      pointsRef.current = 100
      bobRef.current.pause()
      gsap.to(buttonRef.current, {
        yPercent: 0,
        duration: 0.1,
        onComplete: () => {
          gsap.delayedCall(gsap.utils.random(1, 3), () => {
            setWhacked(false)
            bobRef.current
              .restart()
              .timeScale(bobRef.current.timeScale() * TIME_MULTIPLIER)
          })
        },
      })
    }
  }, [whacked])

  const whack = () => {
    play()
    setWhacked(true)
    onWhack(pointsRef.current)
  }

  return (
    <div className="mole__hole">
      <button className="mole" ref={buttonRef} onClick={whack}>
        Mole
      </button>
    </div>
  )
}

const Timer = ({ time, interval = 1000, onEnd }) => {
  const [internalTime, setInternalTime] = useState(time)
  const timerRef = useRef(time)
  const timeRef = useRef(time)
  useEffect(() => {
    if (internalTime === 0 && onEnd) {
      onEnd()
    }
  }, [internalTime, onEnd])
  useEffect(() => {
    timerRef.current = setInterval(
      () => setInternalTime((timeRef.current -= interval)),
      interval
    )
    return () => {
      clearInterval(timerRef.current)
    }
  }, [interval])
  return <span>{`Time: ${internalTime}`}</span>
}

const generateMoles = () =>
  new Array(MOLES).fill().map(() => ({
    speed: gsap.utils.random(0.5, 1),
    delay: gsap.utils.random(0.5, 4),
    points: MOLE_SCORE,
  }))

const Game = () => {
  const [moles, setMoles] = useState(generateMoles())
  const [playing, setPlaying] = useState(false)
  const [finished, setFinished] = useState(false)
  const [newHighScore, setNewHighScore] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = usePersistentState('whac-high-score', 0)

  const onWhack = points => {
    if (score + points > highScore) {
      setNewHighScore(true)
      setHighScore(score + points)
    }
    setScore(score + points)
  }

  const endGame = () => {
    if (score > parseInt(highScore, 10)) setHighScore(score)
    setPlaying(false)
    setFinished(true)
  }

  const startGame = () => {
    setScore(0)
    setNewHighScore(false)
    setMoles(generateMoles())
    setPlaying(true)
    setFinished(false)
  }

  return (
    <Fragment>
      <h1>Whac a Mole</h1>
      {/* Fresh */}
      {!playing && !finished && <button onClick={startGame}>Start</button>}
      <Board>
        {/* Playing */}
        {playing && (
          <Fragment>
            <button onClick={endGame}>End Game</button>
            <Score value={score} />
            <HighScore value={highScore} />
            <Timer time={TIME_LIMIT} onEnd={endGame} />
            <div className="moles">
              {moles.map(({ speed, delay, points }, id) => (
                <Mole
                  key={id}
                  onWhack={onWhack}
                  speed={speed}
                  delay={delay}
                  points={points}
                />
              ))}
            </div>
          </Fragment>
        )}
        {/* Finished */}
        {finished && (
          <Fragment>
            <Result value={score} />
            {newHighScore && <span>NEW</span>}
            <HighScore value={highScore} />
            <button onClick={startGame}>Start Again</button>
          </Fragment>
        )}
      </Board>
    </Fragment>
  )
}

render(<Game />, document.getElementById('app'))
