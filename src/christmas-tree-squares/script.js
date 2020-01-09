const {
  React,
  ReactDOM: { render },
  gsap: { to, fromTo, timeline },
} = window

const { useEffect, useState, useRef, Fragment } = React

const randomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const TIERS = 11
const STAGGER = 0.015
const DURATION = 0.25
const ROOT_NODE = document.getElementById('app')
const ROTATIONS = new Array(TIERS - 1).fill().map(() => randomInRange(-30, 30))
const SHADES = new Array(TIERS).fill().map(() => randomInRange(20, 30))

const genBranches = () =>
  new Array(TIERS).fill().reduce((a, c, i) => {
    return [...a, a[i - 1] ? a[i - 1] + Math.floor(Math.random() * 2) : 1]
  }, [])

const App = () => {
  const [branches, setBranches] = useState(genBranches())
  const ranRef = useRef(0)
  const generatorRef = useRef(null)
  const regen = () => {
    new timeline({
      onStart: () => {
        generatorRef.current.disabled = true
      },
      onComplete: () => {
        ranRef.current++
        setBranches(genBranches())
      },
    })
      .add(
        to('.christmas-tree__star', DURATION, {
          rotation: 'random(720, 1440)',
          scale: 0,
        })
      )
      .add(
        to(
          [...document.querySelectorAll('.christmas-tree__bauble')].sort(
            () => 0.5 - Math.random()
          ),
          DURATION,
          {
            scale: 0,
            stagger: STAGGER,
          }
        )
      )
      .add(
        to(
          [...document.querySelectorAll('.christmas-tree__leaf')].sort(
            () => 0.5 - Math.random()
          ),
          DURATION,
          {
            x: '100vw',
            y: 'random(-1000, 1000)',
            stagger: STAGGER,
            rotation: 'random(720, 1440)',
          }
        )
      )
  }
  useEffect(() => {
    new timeline({
      onStart: () => (generatorRef.current.disabled = true),
      onComplete: () => (generatorRef.current.disabled = false),
    })
      .add(
        fromTo(
          [...document.querySelectorAll('.christmas-tree__log')].reverse(),
          {
            y: ranRef.current > 0 ? 0 : '-100vh',
          },
          {
            stagger: STAGGER,
            y: 0,
            duration: DURATION,
          }
        )
      )
      .add(
        fromTo(
          [...document.querySelectorAll('.christmas-tree__leaf')].sort(
            () => 0.5 - Math.random()
          ),
          {
            x: '-100vw',
            y: 'random(-1000, 1000)',
            rotation: 'random(-720, -1080)',
          },
          {
            duration: DURATION,
            x: 0,
            y: 0,
            stagger: STAGGER,
          }
        )
      )
      .add(
        fromTo(
          [...document.querySelectorAll('.christmas-tree__bauble')].sort(
            () => 0.5 - Math.random()
          ),
          {
            scale: 0,
            rotation: 'random(0, 360)',
          },
          {
            ease: 'elastic.out(1, 0.3)',
            stagger: STAGGER * 2,
            scale: 'random(0.75, 1.25)',
            duration: DURATION * 2,
          }
        )
      )
      .add(
        fromTo(
          '.christmas-tree__star',
          {
            rotation: 'random(-720, -1440)',
            scale: 0,
          },
          {
            duration: DURATION,
            rotation: 'random(0, 360)',
            scale: 'random(1.2, 2.5, 0.1)',
          }
        )
      )
  }, [branches])
  const hueBase = randomInRange(0, 360)
  const hueRange = randomInRange(0, 39)
  const saturated = Math.random() > 0.5
  const BAUBLE_PROB = Math.random()
  const PARTY_HUE = Math.random() > 0.5
  return (
    <Fragment>
      <ul className="christmas-tree">
        <li
          className="christmas-tree__star"
          style={{ '--shade': randomInRange(40, 80) }}
        />
        {branches.map((leaves, index) => (
          <ul
            key={`branch--${index}--${ranRef.current}`}
            className="christmas-tree__branch">
            <li
              className="christmas-tree__log"
              style={{
                '--shade': SHADES[index],
                '--scale': index + 1,
                '--rotation': ROTATIONS[index],
              }}
            />
            {new Array(leaves).fill().map((leaf, leafIndex) => (
              <Fragment key={`leaf--${index}--${leafIndex}`}>
                <li
                  className="christmas-tree__leaf"
                  style={{
                    '--shade': saturated
                      ? randomInRange(20, 65)
                      : randomInRange(60, 100),
                    '--saturation': saturated ? 80 : 0,
                    '--rotation': randomInRange(0, 360),
                  }}
                />
                {Math.random() > BAUBLE_PROB && (
                  <li
                    className="christmas-tree__bauble"
                    style={{
                      '--x': (leafIndex - leaves / 2) * 100,
                      '--hue': PARTY_HUE
                        ? randomInRange(0, 360)
                        : randomInRange(hueBase - hueRange, hueBase + hueRange),
                    }}
                  />
                )}
              </Fragment>
            ))}
          </ul>
        ))}
        <li
          className="christmas-tree__log christmas-tree__log--base"
          style={{ '--shade': SHADES[10] }}
        />
      </ul>
      <button
        className="christmas-tree__regenerate"
        ref={generatorRef}
        title="Regenerate tree"
        onClick={regen}>
        <svg viewBox="0 0 24 24">
          <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
        </svg>
      </button>
    </Fragment>
  )
}
render(<App />, ROOT_NODE)
