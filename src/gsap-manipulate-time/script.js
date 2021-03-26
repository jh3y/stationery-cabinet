import gsap from 'https://cdn.skypack.dev/gsap'
import React, {
  useEffect,
  useRef,
  useState,
} from 'https://cdn.skypack.dev/react'
import T from 'https://cdn.skypack.dev/prop-types'
import { Range } from 'https://cdn.skypack.dev/react-range'
import { render } from 'https://cdn.skypack.dev/react-dom'
import Prism from 'https://cdn.skypack.dev/prismjs'

const ROOT_NODE = document.querySelector('#app')
const SPEED = 12
const getCode = (timeWindow, duration) => `/**
 * LOOP is a timeline moving the hands
 * It has repeat: -1 set
 * Use "fromTo" to animate a time window
 * This is "Meta GSAP" 😎
 */
gsap.fromTo(LOOP, {
  totalTime: ${timeWindow[0]},
}, {
  totalTime: ${timeWindow[1]},
  duration: ${duration[0]},
  ease: 'none',
  repeat: -1,
})
`

const getCodeMarkup = (timeWindow, duration) => {
  const code = getCode(timeWindow, duration)
  return Prism.highlight(code, Prism.languages.javascript, 'javascript')
}

const Watch = ({ timeWindow, duration }) => {
  const minuteRef = useRef(null)
  const hourRef = useRef(null)
  const rawRef = useRef(null)
  const loopRef = useRef(null)
  // Sets up the timeline.
  useEffect(() => {
    rawRef.current = gsap
      .timeline({
        repeat: -1,
        paused: true,
      })
      .to(
        minuteRef.current,
        {
          rotate: 360,
          repeat: 12,
          duration: SPEED / 13,
          transformOrigin: '50% 100%',
          ease: 'none',
          immediateRender: false,
        },
        0
      )
      .to(
        hourRef.current,
        {
          rotate: 360,
          immediateRender: false,
          duration: SPEED,
          transformOrigin: '50% 100%',
          ease: 'none',
        },
        0
      )
  }, [])
  useEffect(() => {
    loopRef.current = gsap.fromTo(
      rawRef.current,
      {
        totalTime: timeWindow[0],
      },
      {
        duration: duration[0],
        totalTime: timeWindow[1],
        ease: 'none',
        repeat: -1,
      }
    )
  }, [duration, timeWindow])
  // useEffect(() => {})
  return (
    <svg
      className="watch"
      viewBox="0 0 574 707"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink">
      <rect
        x={526}
        y={328}
        width={41}
        height={53}
        rx={9}
        fill="hsl(35, 90%, 65%)"
      />
      <rect x={168} width={238} height={707} rx={12} fill="hsl(0, 0%, 85%)" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M168 608.916V169.084C203.384 149.897 243.92 139 287 139s83.616 10.897 119 30.084v439.832C370.616 628.103 330.08 639 287 639s-83.616-10.897-119-30.084z"
        fill="hsla(0, 0%, 45%, 0.65)"
      />
      <circle
        cx={287}
        cy={354}
        r={249}
        fill="hsl(0, 0%, 74%)"
        stroke="#fff"
        strokeWidth={2}
      />
      <circle
        cx={287}
        cy={354}
        r={207.5}
        fill="hsl(0, 0%, 42%)"
        stroke="#4F4F4F"
        strokeWidth={5}
      />
      <circle
        cx={287}
        cy={354}
        r={207.5}
        fill="hsl(0, 0%, 42%)"
        stroke="#4F4F4F"
        strokeWidth={5}
      />
      <path
        d="M285 176h4v15h-4v-15zM374.268 198.847l3.464 2-7.5 12.991-3.464-2 7.5-12.991zM440.153 263.268l2 3.464-12.991 7.5-2-3.464 12.991-7.5zM465 352v4h-15v-4h15zM442.153 441.268l-2 3.464-12.991-7.5 2-3.464 12.991 7.5zM377.732 507.153l-3.464 2-7.5-12.991 3.464-2 7.5 12.991zM289 532h-4v-15h4v15zM199.732 509.153l-3.464-2 7.5-12.991 3.464 2-7.5 12.991zM133.847 444.732l-2-3.464 12.991-7.5 2 3.464-12.991 7.5zM109 356v-4h15v4h-15zM131.847 266.732l2-3.464 12.991 7.5-2 3.464-12.991-7.5zM196.268 200.847l3.464-2 7.5 12.991-3.464 2-7.5-12.991z"
        fill="#000"
      />
      <path fill="url(#prefix__pattern0)" d="M267 234h40v40h-40z" />
      <rect
        ref={minuteRef}
        x={283}
        y={245}
        width={8}
        height={109}
        rx={4}
        fill="hsl(0, 0%, 0%)"
      />
      <rect
        ref={hourRef}
        x={281}
        y={263}
        width={12}
        height={91}
        rx={6}
        fill="hsl(0, 0%, 0%)"
      />
      <circle cx={287} cy={354} r={12} fill="#000" />
      <defs>
        <pattern
          id="prefix__pattern0"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}>
          <use xlinkHref="#prefix__image0" transform="scale(.00333)" />
        </pattern>
        <image
          id="prefix__image0"
          width={300}
          height={300}
          xlinkHref="https://assets.codepen.io/605876/watch-branding-bear.png"
        />
      </defs>
    </svg>
  )
}
Watch.propTypes = {
  timeWindow: T.array,
  duration: T.array,
}

const App = () => {
  const [timeWindow, setTimeWindow] = useState([0, 12])
  const [duration, setDuration] = useState([12])
  const jsRef = useRef(getCodeMarkup(timeWindow, duration))
  return (
    <div className="container">
      <div className="code-block">
        <pre>
          <code
            className="language-javascript"
            dangerouslySetInnerHTML={{ __html: jsRef.current }}
          />
        </pre>
      </div>
      <Watch timeWindow={timeWindow} duration={duration} />
      <div className="controls">
        <label>Time Window</label>
        <Range
          step={1}
          min={0}
          max={36}
          values={timeWindow}
          onChange={values => {
            jsRef.current = getCodeMarkup(values, duration)
            setTimeWindow(values)
          }}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="slider-track"
              style={{
                ...props.style,
              }}>
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="slider-thumb"
              style={{
                ...props.style,
                borderRadius: '50%',
                outline: 'transparent',
                height: '44px',
                width: '44px',
              }}
            />
          )}
        />
        <label>Duration</label>
        <Range
          step={1}
          min={1}
          max={36}
          values={duration}
          onChange={values => {
            jsRef.current = getCodeMarkup(timeWindow, values)
            setDuration(values)
          }}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="slider-track"
              style={{
                ...props.style,
              }}>
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="slider-thumb"
              style={{
                ...props.style,
                borderRadius: '50%',
                outline: 'transparent',
                height: '44px',
                width: '44px',
              }}
            />
          )}
        />
      </div>
    </div>
  )
}

render(<App />, ROOT_NODE)
