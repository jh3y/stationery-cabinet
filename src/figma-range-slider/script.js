import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'
import gsap from 'https://cdn.skypack.dev/gsap'
import { GUI } from 'https://cdn.skypack.dev/dat.gui'

const ROOT_NODE = document.querySelector('#app')

const getDigitTimeline = (
  digit,
  digitIndex,
  range,
  sliderRef,
  liveRegionRef
) => {
  const TL = gsap.timeline({
    paused: true,
  })
  const DIGITS = gsap.utils.toArray(digit.children)
  // Work out if it's a single, tne, hundred, etc.
  const COEFF = Math.pow(10, `${range}`.length - (digitIndex + 1))
  const REPEAT = Math.pow(10, digitIndex)

  const PADDED_DIGITS = [...DIGITS, ...DIGITS, ...DIGITS]
  for (let i = 0; i < PADDED_DIGITS.length; i++) {
    const DIGIT = PADDED_DIGITS[i]
    const DIGI_TIMELINE = gsap
      .timeline()
      .set(DIGIT, {
        yPercent: 0,
      })
      .to(DIGIT, {
        yPercent: 100,
        delay: i * COEFF,
        duration: 1,
        onComplete: () => {
          liveRegionRef.current.innerText = sliderRef.current.value
        },
      })
      .to(DIGIT, {
        delay: COEFF - 1,
        yPercent: 200,
        duration: 1,
        clearProps: 'all',
      })
    TL.add(DIGI_TIMELINE, 0)
  }
  // Return a timeline that animates through the repeating window.
  // Let the main timeline scrub it.
  const TIME_WINDOW = gsap.timeline().fromTo(
    TL,
    {
      totalTime: 10 * COEFF,
    },
    {
      totalTime: 20 * COEFF,
      repeat: REPEAT,
      ease: 'none',
      duration: COEFF * 10,
    }
  )

  return TIME_WINDOW
}

const Ranger = ({ defaultValue = 0, max = 100, min = 0, step = 1 }) => {
  const digits = React.useRef(null)
  const sliderRef = React.useRef(null)
  const liveRegionRef = React.useRef(null)
  const timeline = React.useRef(gsap.timeline({ paused: true }))

  React.useEffect(() => {
    // Want to set up a master timeline that we scrub with the range slider
    if (timeline.current && digits.current) {
      timeline.current.kill()
      timeline.current = gsap.timeline({ paused: true })
      // Need to iterate over the digits in reverse and create an animation for them.
      // Iterate over digits.current.children in reverse.
      for (let i = digits.current.children.length - 1; i >= 0; i--) {
        const CURRENT_DIGIT = digits.current.children[i]
        const digitTimeline = getDigitTimeline(
          CURRENT_DIGIT,
          i,
          max,
          sliderRef,
          liveRegionRef
        )
        timeline.current.add(digitTimeline, 0)
        // Chained progress to show the initial state.
        timeline.current.progress(1).progress(0)
        /**
         * Always +1 to the slot you want to go to.
         * Range is (min + 1) -> (max + 1)
         */
        timeline.current.totalTime(defaultValue + 1)
        // Set the slider value to make sure
        sliderRef.current.value = defaultValue
      }
    }
  }, [min, max, defaultValue])

  const scrub = e => {
    gsap.to(timeline.current, {
      totalTime: parseInt(e.target.value, 10) + 1,
      duration: 0.5,
    })
  }

  return (
    <div className="ranger">
      <label htmlFor="ranger">
        <span aria-live="polite" role="region" ref={liveRegionRef} className="sr-only" />
        <span aria-hidden="true" ref={digits} className="ranger__digits">
          {max
            .toString()
            .split('')
            .map(d => (
              <span className="ranger__digit">
                {new Array(10).fill().map((c, index) => (
                  <span>{index}</span>
                ))}
              </span>
            ))}
        </span>
      </label>
      <input
        ref={sliderRef}
        id="ranger"
        type="range"
        className="ranger__slider"
        min={min}
        step={step}
        max={max}
        defaultValue={defaultValue}
        onChange={scrub}
      />
    </div>
  )
}

const App = () => {
  const CONFIG = {
    min: 0,
    max: 1000,
    step: 1,
    defaultValue: 100,
  }

  const [max, setMax] = React.useState(CONFIG.max)
  const [min, setMin] = React.useState(CONFIG.min)
  const [step, setStep] = React.useState(CONFIG.step)
  const [defaultValue, setDefaultValue] = React.useState(CONFIG.defaultValue)
  const minController = React.useRef(null)
  const maxController = React.useRef(null)
  const stepController = React.useRef(null)
  const defaultValueController = React.useRef(null)

  React.useEffect(() => {
    const UPDATE = () => {
      minController.current.max(CONFIG.max - 1)
      maxController.current.min(CONFIG.min + 1)
      stepController.current.max(CONFIG.max)
      defaultValueController.current.min(CONFIG.min)
      defaultValueController.current.max(CONFIG.max)
      setMin(CONFIG.min)
      setMax(CONFIG.max)
      setStep(CONFIG.step)
      setDefaultValue(CONFIG.defaultValue)
    }
    // Set up the controller.
    const CTRL = new GUI()
    minController.current = CTRL.add(CONFIG, 'min', 0, CONFIG.max - 1, 1)
      .name('Min')
      .onChange(UPDATE)
    maxController.current = CTRL.add(CONFIG, 'max', CONFIG.min + 1, 10000, 1)
      .name('Max')
      .onChange(UPDATE)
    stepController.current = CTRL.add(CONFIG, 'step', 1, CONFIG.max, 1)
      .name('Step')
      .onChange(UPDATE)
    defaultValueController.current = CTRL.add(
      CONFIG,
      'defaultValue',
      CONFIG.min,
      CONFIG.max,
      1
    )
      .name('Default Value')
      .onChange(UPDATE)
  }, [])

  return <Ranger defaultValue={defaultValue} min={min} step={step} max={max} />
}

render(<App />, ROOT_NODE)
