const {
  dat: { GUI },
  React,
  React: { useEffect, useRef, useState },
  ReactDOM: { render },
} = window

const CONFIG = {
  CARD: {
    BORDER: {
      WIDTH: 0,
      RADIUS: 10,
      ALPHA: 0.1,
    },
    SHADOW: {
      REACH: 30,
      BLUR: 60,
      ALPHA: 0.65,
    },
    SIZE: {
      HEIGHT: 200,
      WIDTH: 200,
    },
  },
  BUTTON: {
    BORDER: {
      WIDTH: 0,
      RADIUS: 10,
      ALPHA: 0.1,
    },
    SHADOW: {
      REACH: 5,
      BLUR: 10,
      ALPHA: 0.5,
    },
  },
  TEXT: {
    BORDER: {
      WIDTH: 2,
      RADIUS: 6,
      ALPHA: 0.1,
    },
    SHADOW: {
      REACH: 4,
      BLUR: 8,
      ALPHA: 0.5,
    },
  },
}

const BOUNDS = {
  CARD: {
    BORDER: {
      WIDTH: [0, 10, 1],
      ALPHA: [0, 1, 0.01],
      RADIUS: [0, 50, 1],
    },
    SHADOW: {
      BLUR: [0, 100, 1],
      REACH: [0, 50, 1],
      ALPHA: [0.2, 1, 0.01],
    },
    SIZE: {
      HEIGHT: [50, 300, 1],
      WIDTH: [50, 300, 1],
    },
  },
  BUTTON: {
    BORDER: {
      WIDTH: [0, 10, 1],
      ALPHA: [0, 1, 0.01],
      RADIUS: [0, 50, 1],
    },
    SHADOW: {
      BLUR: [0, 100, 1],
      REACH: [0, 50, 1],
      ALPHA: [0.2, 1, 0.01],
    },
  },
  TEXT: {
    BORDER: {
      WIDTH: [0, 10, 1],
      RADIUS: [0, 10, 1],
      ALPHA: [0, 1, 0.01],
    },
    SHADOW: {
      REACH: [0, 20, 1],
      BLUR: [0, 40, 1],
      ALPHA: [0, 1, 0.1],
    },
  },
}

// const randomInRange = (min, max) =>
//   Math.floor(Math.random() * max - min + 1) + min

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

// const generateStyles = (index, cells) => {
//   const result = {
//     '--x': index % Math.sqrt(cells),
//     '--y': Math.floor(index / Math.sqrt(cells)),
//     '--count': randomInRange(1, CONFIG.count),
//   }
//   for (let g = 0; g < 10; g++) {
//     result[`--x-${g}`] = Math.floor(Math.random() * Math.sqrt(cells))
//     result[`--y-${g}`] = Math.floor(Math.random() * Math.sqrt(cells))
//   }
//   return result
// }

const App = () => {
  const [model, setModel] = useState(0)
  const datRef = useRef(null)
  useEffect(() => {
    if (!datRef.current) {
      datRef.current = new GUI({ name: 'Neumorphic Playground' })
      const digest = (CONFIG_OBJECT, BOUNDS_OBJECT, FOLDER) => {
        for (const category in BOUNDS_OBJECT) {
          if (Array.isArray(BOUNDS_OBJECT[category])) {
            FOLDER.add(
              CONFIG_OBJECT,
              category,
              BOUNDS_OBJECT[category][0],
              BOUNDS_OBJECT[category][1],
              BOUNDS_OBJECT[category][2] ? BOUNDS_OBJECT[category][2] : 1
            ).onChange(() => setModel(new Date().getTime()))
          } else {
            const NEW_FOLDER = FOLDER
              ? FOLDER.addFolder(category)
              : datRef.current.addFolder(category)
            digest(CONFIG_OBJECT[category], BOUNDS_OBJECT[category], NEW_FOLDER)
          }
        }
      }
      digest(CONFIG, BOUNDS)
    }
  }, [model])

  return (
    <main>
      <section
        style={{
          '--neumorphic-reach': CONFIG.CARD.SHADOW.REACH,
          '--neumorphic-blur': CONFIG.CARD.SHADOW.BLUR,
          '--neumorphic-intensity': CONFIG.CARD.SHADOW.ALPHA,
          '--border-width': CONFIG.CARD.BORDER.WIDTH,
          '--border-intensity': CONFIG.CARD.BORDER.ALPHA,
          '--border-radius': CONFIG.CARD.BORDER.RADIUS,
          '--height': CONFIG.CARD.SIZE.HEIGHT,
          '--width': CONFIG.CARD.SIZE.WIDTH,
        }}>
        <article />
      </section>
      <section
        style={{
          '--neumorphic-reach': CONFIG.BUTTON.SHADOW.REACH,
          '--neumorphic-blur': CONFIG.BUTTON.SHADOW.BLUR,
          '--neumorphic-intensity': CONFIG.BUTTON.SHADOW.ALPHA,
          '--border-width': CONFIG.BUTTON.BORDER.WIDTH,
          '--border-intensity': CONFIG.BUTTON.BORDER.ALPHA,
          '--border-radius': CONFIG.BUTTON.BORDER.RADIUS,
          '--margin': Math.max(
            CONFIG.BUTTON.SHADOW.REACH,
            CONFIG.BUTTON.SHADOW.BLUR
          ),
        }}>
        <div className="buttons">
          <button>Click</button>
          <button>Click</button>
          <button>Click</button>
        </div>
      </section>
      <section
        style={{
          '--neumorphic-reach': CONFIG.TEXT.SHADOW.REACH,
          '--neumorphic-blur': CONFIG.TEXT.SHADOW.BLUR,
          '--neumorphic-intensity': CONFIG.TEXT.SHADOW.ALPHA,
          '--border-width': CONFIG.TEXT.BORDER.WIDTH,
          '--border-intensity': CONFIG.TEXT.BORDER.ALPHA,
          '--border-radius': CONFIG.TEXT.BORDER.RADIUS,
          '--margin': Math.max(
            CONFIG.TEXT.SHADOW.REACH,
            CONFIG.TEXT.SHADOW.BLUR
          ),
        }}>
        <div className="texts">
          <div className="input">
            <label>Label</label>
            <input type="text" />
          </div>
          <div className="input">
            <label>Label</label>
            <input type="text" />
          </div>
          <div className="input">
            <label>Label</label>
            <input type="text" />
          </div>
        </div>
      </section>
    </main>
  )
}

// main
//   h1 Neumorphic Playground
//   section
//     article
//   - const TYPES = [{type: 'button', value: 'Click'}, {type: 'checkbox'}, { type: 'range'}, {type: 'text'}, {type: 'radio'}]
//   section
//     button Click
//     button Click
//     button Click
//   //- section
//   //-   label(for='checkbox') Checkbox
//   //-   input#checkbox(type='checkbox' aria-checked='false' tabindex='0')
//   //- section
//   //-   label(for='range') Range
//   //-   input#range(min='0', max='10', name='range', type='range')
//   section
//     span.input-wrap
//       label(for='text') Text
//       input#text(type='text')
//     span.input-wrap
//       label(for='text') Text
//       input#text(type='text')
//     span.input-wrap
//       label(for='text') Text
//       input#text(type='text')
//   //- section
//   //-   input(type='radio', name='neumorphic')
//   //-   input(type='radio', name='neumorphic')
//   //-   input(type='radio', name='neumorphic')
//   //-   input(type='radio', name='neumorphic')

render(<App />, document.getElementById('app'))
