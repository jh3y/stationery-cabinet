import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'
import gsap from 'https://cdn.skypack.dev/gsap'

const ROOT_NODE = document.querySelector('#app')

const Ranger = ({ defaultValue = 0, max = 10, min = 0, step = 1 }) => {
  const digits = React.useRef(null)
  const timeline = React.useRef(gsap.timeline())

  React.useEffect(() => {
    // Want to set up a master timeline that we scrub with the range slider and snap.
    if (timeline.current && digits.current) {
      // Need to iterate over the digits in reverse and create an animation for them.
      // Iterate over digits.current.children in reverse.
      for (let i = digits.current.children.length - 1; i >= 0; i--) {
        console.info(digits.current.children[i], i)
        // If we aren't dealing with the last number then we create a slider for all ten numbers.
        // Actually, does this even matter?

        // Based on the index we know whether we are dealing with singles, tens, hundreds, thousands.
        console.info(Math.pow(10, digits.current.children.length - 1 - i))

        const digitTimeline = gsap.timeline()
        digitTimeline
          .to(digits.current.children[i].querySelectorAll('span'), {
            yPercent: 100,
            delay: index =>
              index * Math.pow(10, digits.current.children.length - 1 - i),
            duration: 1,
          })
          .to(
            digits.current.children[i].querySelectorAll('span'),
            {
              yPercent: 200,
              delay: index =>
                (index + 1) *
                Math.pow(10, digits.current.children.length - 1 - i),
              duration: 1,
            },
            0
          )

        const runner = gsap.timeline()
        runner.add(digitTimeline)
        if (i !== 0)
          runner.fromTo(
            digitTimeline,
            {
              totalTime: 0,
            },
            {
              totalTime: 1,
              duration: 1,
            },
            10
          )
        timeline.current.add(digitTimeline, 0)
      }
    }
  }, [])

  return (
    <div className="ranger">
      <label htmlFor="ranger">
        <span ref={digits} className="ranger__digits">
          {max
            .toString()
            .split('')
            .map((d, index) => {
              // Need to map up to the max digit or do the full loop from 0-9
              const AMOUNT = index === 0 ? parseInt(d, 10) + 1 : 10
              return (
                <span className="ranger__digit">
                  {new Array(AMOUNT).fill().map((c, index) => (
                    <span>{index}</span>
                  ))}
                </span>
              )
            })}
        </span>
      </label>
      <input
        id="ranger"
        type="range"
        min={min}
        step={step}
        max={max}
        defaultValue={defaultValue}
      />
    </div>
  )
}

const App = () => <Ranger />

render(<App />, ROOT_NODE)
