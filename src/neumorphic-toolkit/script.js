const {
  dat: { GUI },
  React,
  React: { useEffect, useRef, useState, Fragment },
  ReactDOM: { render },
  ScrollOut,
} = window

const CONFIG = {
  COLOR: {
    HUE: 225,
    SATURATION: 40,
    LIGHTNESS: 65,
  },
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
      RADIUS: 10,
      ALPHA: 0.1,
    },
    SHADOW: {
      REACH: 4,
      BLUR: 8,
      ALPHA: 0.5,
    },
  },
  RANGE: {
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
  COLOR: {
    HUE: [0, 360, 1],
    SATURATION: [0, 100, 1],
    LIGHTNESS: [0, 100, 1],
  },
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
      RADIUS: [0, 40, 1],
      ALPHA: [0, 1, 0.01],
    },
    SHADOW: {
      REACH: [0, 20, 1],
      BLUR: [0, 40, 1],
      ALPHA: [0, 1, 0.1],
    },
  },
  RANGE: {
    BORDER: {
      WIDTH: [0, 10, 1],
      RADIUS: [0, 40, 1],
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
const CARD_ID = '#cards'
const BUTTON_ID = '#buttons'
const TEXT_ID = '#texts'
const RANGE_ID = '#ranges'
const IDS = [CARD_ID, BUTTON_ID, TEXT_ID, RANGE_ID]
const App = () => {
  const [model, setModel] = useState(0)
  const [active, setActive] = useState(window.location.hash || IDS[0])
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
    // Set HSL on document
    document.documentElement.style.setProperty('--hue', CONFIG.COLOR.HUE)
    document.documentElement.style.setProperty(
      '--saturation',
      CONFIG.COLOR.SATURATION
    )
    document.documentElement.style.setProperty(
      '--lightness',
      CONFIG.COLOR.LIGHTNESS
    )
  }, [model])

  // Set up scroll out
  useEffect(() => {
    ScrollOut({
      scrollingElement: document.querySelector('main'),
      targets: 'section',
      threshold: 0.9,
      onShown: element => {
        setActive(`#${element.getAttribute('id')}`)
      },
    })
  }, [])

  return (
    <Fragment>
      <main>
        <section
          id="cards"
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
          id="buttons"
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
          id="texts"
          style={{
            '--neumorphic-reach': CONFIG.TEXT.SHADOW.REACH,
            '--neumorphic-blur': CONFIG.TEXT.SHADOW.BLUR,
            '--neumorphic-intensity': CONFIG.TEXT.SHADOW.ALPHA,
            '--border-width': CONFIG.TEXT.BORDER.WIDTH,
            '--border-intensity': CONFIG.TEXT.BORDER.ALPHA,
            '--border-radius': CONFIG.TEXT.BORDER.RADIUS,
            '--margin': 6,
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
        <section
          id="ranges"
          style={{
            '--neumorphic-reach': CONFIG.RANGE.SHADOW.REACH,
            '--neumorphic-blur': CONFIG.RANGE.SHADOW.BLUR,
            '--neumorphic-intensity': CONFIG.RANGE.SHADOW.ALPHA,
            '--border-width': CONFIG.RANGE.BORDER.WIDTH,
            '--border-intensity': CONFIG.RANGE.BORDER.ALPHA,
            '--border-radius': CONFIG.RANGE.BORDER.RADIUS,
            '--margin': 6,
          }}>
          <div className="ranges">
            <div className="input">
              <label>Label</label>
              <input type="range" min="0" max="10" step="1" />
            </div>
            <div className="input">
              <label>Label</label>
              <input type="range" min="0" max="10" step="1" />
            </div>
            <div className="input">
              <label>Label</label>
              <input type="range" min="0" max="10" step="1" />
            </div>
          </div>
        </section>
      </main>
      <footer>
        {IDS.map(ID => {
          return (
            <a href={ID} key={ID} className={`${active === ID && 'active'}`}>
              {`${ID.charAt(1).toUpperCase()}${ID.substr(2)}`}
            </a>
          )
        })}
      </footer>
    </Fragment>
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
