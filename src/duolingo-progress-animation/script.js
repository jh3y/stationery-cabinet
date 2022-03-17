import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'
import gsap from 'https://cdn.skypack.dev/gsap'

const ROOT_NODE = document.querySelector('#app')

const WIDTH = 1000
const HEIGHT = 100
const RADIUS = HEIGHT * 0.5
const BUFF = 60
const SHINE_POS = HEIGHT * 0.32
const BUBBLE_SIZE = HEIGHT * 1
const POP = new Audio('https://assets.codepen.io/605876/pop.mp3')

gsap.defaults({
  overwrite: true,
})

const Progress = ({ progress: value, max = 100 }) => {
  const endRef = React.useRef(gsap.utils.mapRange(0, 100, RADIUS, WIDTH, value))
  const shineRef = React.useRef(Math.max(BUFF, endRef.current - BUFF))
  const shineMiniRef = React.useRef(Math.max(BUFF, shineRef.current - BUFF))
  const valueRef = React.useRef(null)
  const containerRef = React.useRef(null)
  const maskRef = React.useRef(null)
  const polishRef = React.useRef(null)
  const polishMiniRef = React.useRef(null)
  const bloomRef = React.useRef(null)
  const bloomMiniOneRef = React.useRef(null)
  const bloomMiniTwoRef = React.useRef(null)
  const bloomMiniThreeRef = React.useRef(null)
  const progressRef = React.useRef(null)
  const tweenRef = React.useRef(null)
  const playbackRef = React.useRef(null)

  React.useEffect(() => {
    gsap.set(
      [
        bloomRef.current,
        bloomMiniOneRef.current,
        bloomMiniTwoRef.current,
        bloomMiniThreeRef.current,
      ],
      {
        scale: 0,
        opacity: 0,
        transformOrigin: '50% 50%',
      }
    )
    gsap.set([document.documentElement, containerRef.current], {
      '--hue': gsap.utils.random(0, 359),
      display: 'block',
    })
  }, [])

  React.useEffect(() => {
    const newEnd = gsap.utils.mapRange(0, 100, RADIUS, WIDTH, value)
    if (tweenRef.current) tweenRef.current.kill()
    // Update the bloom position
    if (progressRef.current && progressRef.current !== value) {
      gsap.set(
        [
          bloomRef.current,
          bloomMiniOneRef.current,
          bloomMiniTwoRef.current,
          bloomMiniThreeRef.current,
        ],
        {
          clearProps: true,
          attr: {
            cx: () => newEnd + BUBBLE_SIZE * 0.5,
          },
        }
      )

      const addBloom = () => {
        return parseInt(value, 10) > parseInt(progressRef.current, 10)
          ? gsap
              .timeline()
              .fromTo(
                bloomRef.current,
                {
                  scale: 0,
                  opacity: 0,
                  transformOrigin: '50% 50%',
                  strokeWidth: BUBBLE_SIZE * 0.3,
                },
                {
                  onStart: () => {
                    POP.pause()
                    POP.currentTime = 0
                    if (playbackRef.current) clearTimeout(playbackRef.current)
                    playbackRef.current = setTimeout(() => POP.play(), 100)
                  },
                  opacity: 1,
                  overwrite: false,
                  scale: 1.35,
                }
              )
              .to(
                bloomRef.current,
                {
                  overwrite: false,
                  opacity: 0,
                  duration: 0.25,
                  strokeWidth: 0,
                },
                '>-0.25'
              )
              .fromTo(
                [
                  bloomMiniOneRef.current,
                  bloomMiniTwoRef.current,
                  bloomMiniThreeRef.current,
                ],
                {
                  overwrite: false,
                  scale: 0,
                  opacity: 0,
                  transformOrigin: '50% 50%',
                  x: 0,
                  y: 0,
                },
                {
                  scale: () => gsap.utils.random(0.5, 3),
                  opacity: 1,
                  x: () =>
                    gsap.utils.random(BUBBLE_SIZE * 0.75, BUBBLE_SIZE * 1.75) *
                    (Math.random() > 0.5 ? 1 : -1),
                  y: () =>
                    gsap.utils.random(BUBBLE_SIZE * 0.75, BUBBLE_SIZE * 1.75) *
                    (Math.random() > 0.5 ? 1 : -1),
                },
                0
              )
              .to(
                [
                  bloomMiniOneRef.current,
                  bloomMiniTwoRef.current,
                  bloomMiniThreeRef.current,
                ],
                {
                  overwrite: false,
                  opacity: 0,
                  delay: () => gsap.utils.random(0, 0.25),
                  duration: 0.25,
                  scale: 0,
                  '--alpha': () => gsap.utils.random(0.25, 1),
                },
                '>-0.25'
              )
          : gsap
              .timeline()
              .set(
                [
                  bloomRef.current,
                  bloomMiniOneRef.current,
                  bloomMiniTwoRef.current,
                  bloomMiniThreeRef.current,
                ],
                {
                  opacity: 0,
                  scale: 0,
                }
              )
      }

      tweenRef.current = gsap
        .timeline({
          onComplete: () => {
            endRef.current = newEnd
            shineRef.current = newEnd - BUFF * 2
            shineMiniRef.current = shineRef.current
          },
        })
        .add(addBloom())
        .to(
          polishRef.current,
          {
            attr: {
              x2: (index, element) => Math.max(BUFF, newEnd - BUFF * 2),
            },
            ease: 'elastic.out(1, 2)',
          },
          0
        )
        .to(
          [maskRef.current, valueRef.current],
          {
            attr: {
              x2: (index, element) => newEnd,
            },
            ease: 'elastic.out(1, 0.5)',
          },
          0
        )
        .to(
          polishMiniRef.current,
          {
            attr: {
              x1: () => Math.max(BUFF, newEnd - BUFF * 2),
              x2: () => Math.max(BUFF, newEnd - BUFF),
            },
            ease: 'elastic.out(1, 0.5)',
          },
          0
        )
    }
    // Update the ref value
    progressRef.current = value
  }, [value])

  return (
    <div className="progress" ref={containerRef}>
      <progress className="sr-only" value={value} max={max}></progress>
      <svg
        viewBox={`0 0 ${WIDTH + RADIUS} ${HEIGHT}`}
        preserveAspectRatio="none">
        <defs>
          <mask id="shine" maskUnits="userSpaceOnUse">
            <rect
              x={0}
              y={0}
              width={WIDTH + RADIUS}
              height={HEIGHT}
              fill="black"
            />
            <line
              ref={maskRef}
              x1={BUFF}
              y1={SHINE_POS}
              x2={endRef.current}
              y2={SHINE_POS}
              stroke-width={SHINE_POS}
              stroke-linecap="round"
              stroke="white"
              fill="white"
            />
          </mask>
        </defs>
        {/* Backdrop – Doesn't need changing */}
        <line
          className="progress__backdrop"
          x1={RADIUS}
          y1={RADIUS}
          x2={WIDTH}
          y2={RADIUS}
          stroke-width={HEIGHT}
          stroke-linecap="round"
        />
        {/* Value */}
        <line
          ref={valueRef}
          className="progress__value"
          x1={RADIUS}
          y1={RADIUS}
          x2={endRef.current}
          y2={RADIUS}
          stroke-width={HEIGHT}
          stroke-linecap="round"
        />
        {/* Shine */}
        <g className="progress__shines" mask="url(#shine)">
          <line
            ref={polishRef}
            className="progress__shine"
            x1={BUFF}
            y1={SHINE_POS}
            x2={shineRef.current}
            y2={SHINE_POS}
            stroke-width={SHINE_POS}
            stroke-linecap="round"
          />
          <line
            ref={polishMiniRef}
            className="progress__shine--mini"
            x1={shineMiniRef.current}
            y1={SHINE_POS}
            x2={shineRef.current}
            y2={SHINE_POS}
            stroke-width={SHINE_POS}
            stroke-linecap="round"
          />
        </g>
        <circle
          ref={bloomRef}
          className="progress__bubble"
          cx={endRef.current + BUBBLE_SIZE * 0.5}
          cy={HEIGHT * 0.5}
          r={BUBBLE_SIZE}
          stroke-width={BUBBLE_SIZE * 0.4}
          fill="none"></circle>
        <circle
          ref={bloomMiniOneRef}
          className="progress__bubble progress__bubble--mini"
          cx={endRef.current + BUBBLE_SIZE * 0.5}
          cy={HEIGHT * 0.5}
          r={BUBBLE_SIZE * 0.25}></circle>
        <circle
          ref={bloomMiniTwoRef}
          className="progress__bubble progress__bubble--mini"
          cx={endRef.current + BUBBLE_SIZE * 0.5}
          cy={HEIGHT * 0.5}
          r={BUBBLE_SIZE * 0.25}></circle>
        <circle
          ref={bloomMiniThreeRef}
          className="progress__bubble progress__bubble--mini"
          cx={endRef.current + BUBBLE_SIZE * 0.5}
          cy={HEIGHT * 0.5}
          r={BUBBLE_SIZE * 0.25}></circle>
      </svg>
    </div>
  )
}

const App = () => {
  const [value, setValue] = React.useState(gsap.utils.random(0, 100, 1))
  return (
    <>
      <Progress progress={value} />
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </>
  )
}

render(<App />, ROOT_NODE)

gsap.set('#app', { display: 'flex' })
