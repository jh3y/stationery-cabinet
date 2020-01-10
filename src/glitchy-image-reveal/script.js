const {
  dat: { GUI },
  React,
  React: { useEffect, useRef, useState },
  ReactDOM: { render },
} = window

const ALT = 'jh3y logo - cartoon bear with snapback cap on'
const SRC =
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/bear-with-cap.svg'

const CONFIG = {
  cells: 5,
  count: 5,
  size: 300,
  speed: 0.2,
  delay: 0.5,
}

const BOUNDS = {
  cells: [2, 20],
  count: [2, 20],
  size: [50, 300],
  speed: [0.1, 1, 0.01],
  delay: [0, 1, 0.01],
}

const randomInRange = (min, max) =>
  Math.floor(Math.random() * max - min + 1) + min

// const generateStyles = (index, cells) => {
//   const X = index % Math.sqrt(cells)
//   const Y = Math.floor(index / Math.sqrt(cells))
//   const COUNT = randomInRange(1, CONFIG.count)
//   const glitches = new Array(10)
//     .fill()
//     .map(
//       (_, index) =>
//         `--x-${index}: ${Math.floor(
//           Math.random() * Math.sqrt(cells)
//         )}; --y-${index}: ${Math.floor(Math.random() * Math.sqrt(cells))};`
//     )
//   return `--x: ${X}; --y: ${Y}; --count: ${COUNT}; ${glitches.join(' ')}`
// }

const generateStyles = (index, cells) => {
  const result = {
    '--x': index % Math.sqrt(cells),
    '--y': Math.floor(index / Math.sqrt(cells)),
    '--count': randomInRange(1, CONFIG.count),
  }
  for (let g = 0; g < 10; g++) {
    result[`--x-${g}`] = Math.floor(Math.random() * Math.sqrt(cells))
    result[`--y-${g}`] = Math.floor(Math.random() * Math.sqrt(cells))
  }
  return result
}

const App = () => {
  const [model, setModel] = useState(0)
  const datRef = useRef(null)
  useEffect(() => {
    if (!datRef.current) {
      datRef.current = new GUI({ name: 'Glitchy Image Config' })
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
    <div
      className="glitch-image"
      style={{
        '--src': `url(${SRC})`,
        '--size': CONFIG.size,
        '--columns': CONFIG.cells,
        '--rows': CONFIG.cells,
        '--speed': CONFIG.speed,
        '--delay': CONFIG.delay,
      }}>
      {new Array(CONFIG.cells * CONFIG.cells).fill().map((_, index) => (
        <div
          className="glitch-image__cell"
          key={`glitch-image-cell-${model}--${index}`}
          ariaHidden={true}
          style={generateStyles(index, CONFIG.cells * CONFIG.cells)}></div>
      ))}
      <img src={SRC} alt={ALT} />
    </div>
  )
}

render(<App />, document.getElementById('app'))
