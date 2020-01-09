const {
  dat: { GUI },
  React,
  React: { useEffect, useRef, useState },
  ReactDOM: { render },
} = window

const CONFIG = {
  elements: 5,
  translation: 40,
  offset: 25,
  columns: 4,
  rows: 1,
  delayStep: 0,
  transition: 0.2,
}

const BOUNDS = {
  elements: [1, 10],
  translation: [0, 250],
  offset: [0, 360],
  columns: [1, 10],
  rows: [1, 5],
  transition: [0.1, 2, 0.01],
  delayStep: [0, 1, 0.01],
}

const App = () => {
  const [model, setModel] = useState(0)
  const datRef = useRef(null)
  useEffect(() => {
    if (!datRef.current) {
      datRef.current = new GUI({ name: 'Dial Button Config' })
      for (const spec in BOUNDS) {
        datRef.current
          .add(
            CONFIG,
            spec,
            BOUNDS[spec][0],
            BOUNDS[spec][1],
            BOUNDS[spec][2] ? BOUNDS[spec][2] : 1
          )
          .onFinishChange(() => setModel(new Date().getTime()))
      }
    }
  }, [model])

  return (
    <label
      className="dial-button"
      htmlFor="dial"
      style={{
        '--kids': CONFIG.elements,
        '--radius': CONFIG.translation,
        '--offset': CONFIG.offset,
        '--delay': CONFIG.delayStep,
        '--transition': CONFIG.transition,
      }}>
      <input type="checkbox" id="dial" />
      {new Array(CONFIG.elements).fill().map((_, index) => (
        <button
          key={`dial-button-${model}--${index}`}
          style={{
            '--index': index,
          }}></button>
      ))}
      <label className="off" htmlFor="dial" />
    </label>
  )
}

render(<App />, document.getElementById('app'))
