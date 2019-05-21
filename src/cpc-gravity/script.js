const MAX_DURATION = 1000
const MAX_DISTANCE = 120
const MAX_HEIGHT = 50
const {
  ReactDOM: { render },
  React,
  React: { useEffect, useReducer, useRef, Fragment },
  TweenMax,
  TimelineMax,
  Power0,
  Power4,
} = window
const rootNode = document.getElementById('root')
const randomInRange = (max, min) =>
  Math.floor(Math.random() * (max - min)) + min
const genRGB = (alpha = 1) =>
  `rgba(${randomInRange(1, 255)}, ${randomInRange(1, 255)}, ${randomInRange(
    1,
    255
  )}, ${alpha})`

const initialState = {
  planet: 0,
  stars: randomInRange(50, 100),
  planetSize: randomInRange(
    Math.min(window.innerWidth, window.innerHeight) * 0.15,
    Math.min(window.innerWidth, window.innerHeight) * 0.3
  ),
  planetColor: genRGB(),
  planetSpeed: randomInRange(5, 25),
  atmosphere: genRGB(0.75),
  spots: randomInRange(1, 5),
  bumps: randomInRange(0, 4),
  spotColor: genRGB(),
  spotAlpha: Math.random(),
  clouds: randomInRange(15, 25),
  astronautAngle: randomInRange(0, 180),
  flagAngle: randomInRange(0, 360),
  flagColor: genRGB(),
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'REGENERATE':
      return {
        ...state,
        planet: (state.planet += 1),
        stars: randomInRange(50, 100),
        planetSize: randomInRange(
          Math.min(window.innerWidth, window.innerHeight) * 0.15,
          Math.min(window.innerWidth, window.innerHeight) * 0.3
        ),
        bumps: randomInRange(0, 4),
        planetColor: genRGB(),
        planetSpeed: randomInRange(5, 25),
        atmosphere: genRGB(0.75),
        spots: randomInRange(1, 5),
        spotColor: genRGB(),
        spotAlpha: Math.random(),
        clouds: randomInRange(15, 25),
        astronautAngle: randomInRange(0, 180),
        flagAngle: randomInRange(0, 360),
        flagColor: genRGB(),
      }
    default:
      return state
  }
}

const App = () => {
  const [
    {
      bumps,
      stars,
      clouds,
      atmosphere,
      planet,
      planetSize,
      planetColor,
      planetSpeed,
      spots,
      spotColor,
      spotAlpha,
      astronautAngle,
      flagAngle,
      flagColor,
    },
    dispatch,
  ] = useReducer(reducer, initialState)

  const astronaut = useRef({
    angle: 0,
    starting: false,
    jumping: false,
  })

  const astronautEl = useRef(null)
  const astronautWrapper = useRef(null)
  const sceneEl = useRef(null)

  const start = ({ type, keyCode }) => {
    if (
      (type.includes('key') && keyCode !== 32) ||
      astronaut.current.jumping ||
      astronaut.current.starting
    )
      return
    astronaut.current = {
      ...astronaut.current,
      starting: true,
      start: new Date().getTime(),
    }
  }

  useEffect(
    () => {
      astronaut.current = {
        ...astronaut.current,
        angle: astronautAngle,
      }
    },
    [astronautAngle]
  )

  /**
   * Animate in/out the pieces in this order
   * 1. stars
   * 2. planet
   * 3. atmosphere
   * 4. clouds
   * 5. astronaut
   */
  useEffect(
    () => {
      new TimelineMax({ delay: 0.5 })
        .add(TweenMax.to('.stars', 0.25, { opacity: 1 }))
        .add(TweenMax.to('.planet', 0.25, { scale: 1 }))
        .add(TweenMax.to('.atmosphere', 0.25, { scale: 1 }))
        .add(
          TweenMax.staggerTo('.cloud', 0.25, { scale: 1 }, 0.025, () =>
            document
              .querySelector('.planet__clouds')
              .classList.add('planet__clouds--loaded')
          )
        )
        .add(TweenMax.from('.astronaut', 0.5, { y: -planetSize, scale: 0 }))
        .add(TweenMax.from('.planet__flag', 0.25, { scale: 0 }))
    },
    [
      bumps,
      stars,
      clouds,
      atmosphere,
      planetSize,
      planetColor,
      planetSpeed,
      spots,
      spotColor,
      spotAlpha,
      flagAngle,
      flagColor,
    ]
  )

  const regenerate = () => {
    new TimelineMax({
      delay: 0.5,
      onComplete: () => dispatch({ type: 'REGENERATE' }),
    })
      .call(() => {
        document
          .querySelector('.planet__clouds')
          .classList.remove('planet__clouds--loaded')
        astronaut.current = {
          angle: 0,
          starting: false,
          jumping: false,
        }
      })
      .add(TweenMax.to('.planet__flag', 0.25, { scale: 0 }))
      .add(TweenMax.to('.astronaut', 0.25, { scale: 0, y: -planetSize }))
      .add(TweenMax.staggerTo('.cloud', 0.25, { scale: 0 }, 0.025))
      .add(TweenMax.to('.atmosphere', 0.25, { scale: 0 }))
      .add(TweenMax.to('.planet', 0.25, { scale: 0 }))
      .add(TweenMax.to('.stars', 0.25, { opacity: 0 }))
  }

  const jump = ({ type, keyCode }) => {
    if (
      astronaut.current.jumping ||
      (type.includes('key') && keyCode !== 32) ||
      (keyCode === 32 && !astronaut.current.starting)
    )
      return
    astronaut.current = {
      ...astronaut.current,
      jumping: true,
    }
    const jumpTime = new Date().getTime() - astronaut.current.start
    const DIFF = Math.min(1, jumpTime / MAX_DURATION)
    const DURATION = DIFF.toFixed(1)
    const ANGLE = Math.floor(Math.min(MAX_DISTANCE, DURATION * MAX_DISTANCE))
    const HEIGHT = Math.floor(Math.min(MAX_HEIGHT, DURATION * MAX_HEIGHT))
    new TimelineMax({
      onComplete: () => {
        astronaut.current = {
          ...astronaut.current,
          jumping: false,
          starting: false,
        }
      },
    })
      .add(
        TweenMax.to(astronautWrapper.current, DURATION, {
          rotation: (astronaut.current.angle += ANGLE),
          ease: Power0.easeNone,
        }),
        0
      )
      .add(
        TweenMax.to(astronautEl.current, DURATION / 2, {
          y: -HEIGHT,
          ease: Power4.easeOut,
          yoyo: true,
          repeat: 1,
        }),
        0
      )
  }

  /**
   * Set up event listeners in an effect
   */
  useEffect(() => {
    sceneEl.current.addEventListener('mousedown', start)
    sceneEl.current.addEventListener('touchstart', start)
    sceneEl.current.addEventListener('mouseup', jump)
    sceneEl.current.addEventListener('touchend', jump)
    document.addEventListener('keydown', start)
    document.addEventListener('keyup', jump)
  }, [])

  return (
    <Fragment>
      <button title="Regenerate" onClick={regenerate}>
        <svg viewBox="0 0 24 24">
          <path
            fill="#FFFFFF"
            d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"
          />
        </svg>
      </button>
      <div className="scene" ref={sceneEl}>
        <div
          className="atmosphere"
          key={`atmosphere--${planet}`}
          style={{
            '--atmosphere': atmosphere,
            '--size': Math.max(window.innerWidth, window.innerHeight),
            '--radius': Math.floor((planetSize / window.innerWidth) * 100),
          }}
        />
        <div className="stars">
          {new Array(stars).fill().map((s, i) => {
            const size = randomInRange(1, 4)
            const alpha = Math.random()
            const x = randomInRange(0, 100)
            const y = randomInRange(0, 100)
            return (
              <div
                className="star"
                key={`star--${planet}--${i}`}
                style={{
                  '--size': size,
                  '--alpha': alpha,
                  '--x': x,
                  '--y': y,
                }}
              />
            )
          })}
        </div>
        <div
          className="planet__clouds"
          style={{
            '--size': planetSize * 2,
          }}>
          {new Array(clouds).fill().map((c, i) => {
            const angle = randomInRange(0, 360)
            const delay = randomInRange(1, 5)
            const alpha = Math.random()
            const size = randomInRange(10, 80)
            const speed = randomInRange(5, 10)
            const translate = Math.floor(
              randomInRange(planetSize * 1.25, planetSize * 1.55)
            )
            return (
              <div
                className="cloud"
                key={`cloud--${planet}--${i}`}
                style={{
                  '--angle': angle,
                  '--delay': delay,
                  '--alpha': alpha,
                  '--size': size,
                  '--speed': speed,
                  '--translate': translate,
                }}
              />
            )
          })}
        </div>
        <div
          className="planet"
          key={planet}
          style={{
            '--size': planetSize,
          }}>
          <div
            className="planet__planet"
            style={{
              '--speed': planetSpeed,
            }}>
            <div
              className="planet__surface"
              style={{ '--bg': planetColor, '--atmosphere': atmosphere }}>
              <div className="planet__bumps">
                {new Array(bumps).fill().map((b, i) => {
                  const size = randomInRange(
                    planetSize * 0.1,
                    planetSize * 0.45
                  )
                  const angle = randomInRange(0, 360)
                  const curve = randomInRange(0, 100)
                  return (
                    <div
                      className="bump"
                      key={`bump--${i}`}
                      style={{
                        '--bg': planetColor,
                        '--size': size,
                        '--angle': angle,
                        '--radius': planetSize / 2,
                        '--curve': curve,
                      }}
                    />
                  )
                })}
              </div>
              <div
                className="planet__spots"
                style={{
                  '--spotColor': spotColor,
                  '--alpha': spotAlpha,
                }}>
                {new Array(spots).fill().map((s, i) => {
                  const size = randomInRange(0, 100)
                  const x = randomInRange(0, 100)
                  const y = randomInRange(0, 100)
                  return (
                    <div
                      className="planet__spot"
                      key={`spot--${planet}--${i}`}
                      style={{
                        '--size': size,
                        '--x': x,
                        '--y': y,
                      }}
                    />
                  )
                })}
              </div>
            </div>
            <div
              ref={astronautWrapper}
              style={{ '--angle': astronautAngle }}
              className="astronaut__wrapper">
              <div ref={astronautEl} className="astronaut" />
            </div>
            <div
              className="planet__flag"
              style={{
                '--angle': flagAngle,
                '--color': flagColor,
                '--radius': planetSize / 2,
              }}
            />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

render(<App />, rootNode)
