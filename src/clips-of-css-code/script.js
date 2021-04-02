import React, {
  useRef,
  useEffect,
  useState,
} from 'https://cdn.skypack.dev/react'

import { render } from 'https://cdn.skypack.dev/react-dom'

const { Prism } = window

const ROOT_NODE = document.querySelector('#app')

const CLIPS = [
  {
    label: 'Triangle Up',
    code: `polygon(50% 0, 7% 75%,
            93% 75%)`,
    clip:
      'polygon(50% 0, 7% 75%, 93% 75%, 93% 75%, 93% 75%, 93% 75%, 93% 75%, 93% 75%, 93% 75%, 93% 75%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Triangle Left',
    code: `polygon(75% 7%, 0% 50%,
            75% 93%)`,
    clip:
      'polygon(75% 7%, 0% 50%, 75% 93%, 75% 93%, 75% 93%, 75% 93%, 75% 93%, 75% 93%, 75% 93%, 75% 93%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Triangle Down',
    code: `polygon(93% 25%, 7% 25%,
            50% 100%)`,
    clip:
      'polygon(93% 25%, 7% 25%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Triangle Right',
    code: `polygon(100% 50%, 25% 7%,
            25% 93%)`,
    clip:
      'polygon(100% 50%, 25% 7%, 25% 93%, 25% 93%, 25% 93%, 25% 93%, 25% 93%, 25% 93%, 25% 93%, 25% 93%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Triangle Top Left',
    code: `polygon(87.5% 12.5%, 12.5% 12.5%,
            12.5% 87.5%)`,
    clip:
      'polygon(87.5% 12.5%, 12.5% 12.5%, 12.5% 87.5%, 12.5% 87.5%, 12.5% 87.5%, 12.5% 87.5%, 12.5% 87.5%, 12.5% 87.5%, 12.5% 87.5%, 12.5% 87.5%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Triangle Top Right',
    code: `polygon(87.5% 12.5%, 12.5% 12.5%,
            87.5% 87.5%)`,
    clip:
      'polygon(87.5% 12.5%, 12.5% 12.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Triangle Bottom Left',
    code: `polygon(12.5% 12.5%, 12.5% 87.5%,
            87.5% 87.5%)`,
    clip:
      'polygon(12.5% 12.5%, 12.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Triangle Bottom Right',
    code: `polygon(87.5% 12.5%, 12.5% 87.5%,
            87.5% 87.5%)`,
    clip:
      'polygon(87.5% 12.5%, 12.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%, 87.5% 87.5%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Square',
    code: `polygon(15% 15%, 15% 85%,
            85% 85%, 85% 15%)`,
    clip:
      'polygon(15% 15%, 15% 85%, 85% 85%, 85% 85%, 85% 85%, 85% 85%, 85% 85%, 85% 85%, 85% 85%, 85% 15%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Rectangle',
    code: `polygon(0% 25%, 0% 75%,
            100% 75%, 100% 25%)`,
    clip:
      'polygon(0% 25%, 0% 75%, 100% 75%, 100% 75%, 100% 75%, 100% 75%, 100% 75%, 100% 75%, 100% 75%, 100% 25%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Trapezoid',
    code: `polygon(25% 20%, 5% 80%,
            95% 80%, 75% 20%)`,
    clip:
      'polygon(25% 20%, 5% 80%, 95% 80%, 95% 80%, 95% 80%, 95% 80%, 95% 80%, 95% 80%, 95% 80%, 75% 20%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Parallelogram',
    code: `polygon(5% 20%, 25% 80%,
            95% 80%, 75% 20%)`,
    clip:
      'polygon(5% 20%, 25% 80%, 95% 80%, 95% 80%, 95% 80%, 95% 80%, 95% 80%, 95% 80%, 95% 80%, 75% 20%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Diamond Square',
    code: `polygon(15% 50%, 50% 85%,
            85% 50%, 50% 15%)`,
    clip:
      'polygon(15% 50%, 50% 85%, 85% 50%, 85% 50%, 85% 50%, 85% 50%, 85% 50%, 85% 50%, 85% 50%, 50% 15%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Diamond Shield',
    code: `polygon(15% 35%, 50% 85%,
            85% 35%, 50% 15%)`,
    clip:
      'polygon(15% 35%, 50% 85%, 85% 35%, 85% 35%, 85% 35%, 85% 35%, 85% 35%, 85% 35%, 85% 35%, 50% 15%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Diamond Narrow',
    code: `polygon(25% 50%, 50% 85%,
            75% 50%, 50% 15%)`,
    clip:
      'polygon(25% 50%, 50% 85%, 75% 50%, 75% 50%, 75% 50%, 75% 50%, 75% 50%, 75% 50%, 75% 50%, 50% 15%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Pentagon',
    code: `polygon(2% 35%, 21% 90%,
            79% 90%, 98% 35%,
            50% 0%)`,
    clip:
      'polygon(2% 35%, 21% 90%, 79% 90%, 79% 90%, 79% 90%, 79% 90%, 79% 90%, 79% 90%, 98% 35%, 50% 0%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Cut Diamond',
    code: `polygon(2% 35%, 50% 90%,
            98% 35%, 75% 0%,
            25% 0%)`,
    clip:
      'polygon(2% 35%, 50% 90%, 98% 35%, 98% 35%, 98% 35%, 98% 35%, 98% 35%, 98% 35%, 75% 0%, 25% 0%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Base',
    code: `polygon(2% 35%, 2% 85%,
            98% 85%, 98% 35%,
            50% 0%)`,
    clip:
      'polygon(2% 35%, 2% 85%, 98% 85%, 98% 35%, 98% 35%, 98% 35%, 98% 35%, 98% 35%, 98% 35%, 50% 0%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Flag',
    code: `polygon(2% 15%, 2% 85%,
            50% 65%, 98% 85%,
            98% 15%)`,
    clip:
      'polygon(2% 15%, 2% 85%, 50% 65%, 98% 85%, 98% 85%, 98% 85%, 98% 85%, 98% 85%, 98% 85%, 98% 15%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Hexagon',
    code: `polygon(0% 50%, 25% 93%,
            75% 93%, 100% 50%,
            75% 7%, 25% 7%)`,
    clip:
      'polygon(0% 50%, 25% 93%, 75% 93%, 100% 50%, 100% 50%, 100% 50%, 100% 50%, 100% 50%, 75% 7%, 25% 7%)',
    hue: Math.random() * 360,
  },
  {
    label: 'House',
    code: `polygon(0% 50%, 0% 93%,
            100% 93%, 100% 50%,
            75% 7%, 25% 7%)`,
    clip:
      'polygon(0% 50%, 0% 93%, 100% 93%, 100% 50%, 100% 50%, 100% 50%, 100% 50%, 100% 50%, 75% 7%, 25% 7%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Pointer',
    code: `polygon(25% 50%, 0% 75%,
            75% 75%, 100% 50%,
            75% 25%, 0% 25%)`,
    clip:
      'polygon(25% 50%, 0% 75%, 75% 75%, 100% 50%, 100% 50%, 100% 50%, 100% 50%, 100% 50%, 75% 25%, 0% 25%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Chevron',
    code: `polygon(0% 50%, 0% 75%,
            50% 55%, 100% 75%,
            100% 50%, 50% 25%)`,
    clip:
      'polygon(0% 50%, 0% 75%, 50% 55%, 100% 75%, 100% 75%, 100% 75%, 100% 75%, 100% 75%, 100% 50%, 50% 25%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Isotoxal Star',
    code: `polygon(40% 45%, 7% 75%,
            50% 60%, 93% 75%,
            60% 45%, 50% 0%)`,
    clip:
      'polygon(40% 45%, 7% 75%, 50% 60%, 50% 60%, 50% 60%, 50% 60%, 50% 60%, 93% 75%, 60% 45%, 50% 0%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Heptagon',
    code: `polygon(1% 61%, 28% 95%,
            72% 95%, 99% 61%,
            89% 19%, 50% 0%,
            11% 19%)`,
    clip:
      'polygon(1% 61%, 28% 95%, 72% 95%, 99% 61%, 99% 61%, 99% 61%, 99% 61%, 89% 19%, 50% 0%, 11% 19%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Talk Bubble',
    code: `polygon(0% 50%, 15% 60%,
            15% 85%, 85% 85%,
            85% 15%, 15% 15%,
            15% 40%)`,
    clip:
      'polygon(0% 50%, 15% 60%, 15% 85%, 85% 85%, 85% 85%, 85% 85%, 85% 85%, 85% 15%, 15% 15%, 15% 40%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Octagon',
    code: `polygon(4% 69%, 31% 96%,
            69% 96%, 96% 69%,
            96% 31%, 69% 4%,
            31% 4%, 4% 31%)`,
    clip:
      'polygon(4% 69%, 31% 96%, 69% 96%, 96% 69%, 96% 31%, 96% 31%, 96% 31%, 69% 4%, 31% 4%, 4% 31%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Nonagon',
    code: `polygon(7% 75%, 33% 97%,
            67% 97%, 93% 75%,
            99% 41%, 82% 12%,
            50% 0%, 18% 12%,
            1% 41%)`,
    clip:
      'polygon(7% 75%, 33% 97%, 67% 97%, 93% 75%, 99% 41%, 99% 41%, 82% 12%, 50% 0%, 18% 12%, 1% 41%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Decagon',
    code: `polygon(10% 79%, 35% 98%,
            65% 98%, 90% 79%,
            100% 50%, 90% 21%,
            65% 2%, 35% 2%,
            10% 21%, 0% 50%)`,
    clip:
      'polygon(10% 79%, 35% 98%, 65% 98%, 90% 79%, 100% 50%, 90% 21%, 65% 2%, 35% 2%, 10% 21%, 0% 50%)',
    hue: Math.random() * 360,
  },
  {
    label: 'Star',
    code: `polygon(20% 87%, 50% 66%,
            80% 87%, 67% 54%,
            96% 35%, 60% 35%,
            50% 5%, 40% 35%,
            4% 35%, 33% 54%)`,
    clip:
      'polygon(20% 87%, 50% 66%, 80% 87%, 67% 54%, 96% 35%, 60% 35%, 50% 5%, 40% 35%, 4% 35%, 33% 54%)',
    hue: Math.random() * 360,
  },
]

const getCode = clip => {
  let RESULT = `.clipped {\n`
  RESULT += `  clip-path:\n`
  RESULT += `    ${CLIPS[clip].code};`
  return (RESULT += '\n}')
}

const getCodeMarkup = code => {
  return Prism.highlight(code, Prism.languages.css, 'css')
}

const App = () => {
  const [clip, setClip] = useState(0)
  const cssRef = useRef(getCodeMarkup(getCode(clip)))

  useEffect(() => {
    document.documentElement.style.setProperty('--hue', CLIPS[clip].hue)
  }, [clip])

  const selectClip = e => {
    cssRef.current = getCodeMarkup(getCode(e.target.value))
    setClip(e.target.value)
  }

  return (
    <div className="scene">
      <div className="result">
        <pre>
          <code
            className="language-css"
            dangerouslySetInnerHTML={{ __html: cssRef.current }}
          />
        </pre>
        <div
          className="result__render"
          style={{
            '--clip': CLIPS[clip].clip,
            '--hue': CLIPS[clip].hue,
          }}>
          <div className="clipped"></div>
        </div>
      </div>
      <div className="controls">
        <div className="select-wrapper">
          <select onChange={selectClip} value={clip}>
            {CLIPS.map(({ label }, index) => (
              <option key={index} value={index}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

render(<App />, ROOT_NODE)
