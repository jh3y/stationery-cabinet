const {
  dat: { GUI },
  React,
  React: { useEffect, useRef, useState },
  ReactDOM: { render },
} = window

const CONFIG = {
  COLOR: {
    HUE: 255,
    SATURATION: 40,
    LIGHTNESS: 65,
    ALPHA: 0.5,
  },
  SHADOW: {
    REACH: 4,
    BLUR: 10,
    INTENSITY: 1,
    CONTRAST: 20,
  },
  TEXT: {
    VALUE: 'HEY!',
    FILTER: {
      BLUR: 2,
    },
    FONT: {
      FAMILY: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
      SIZE: 10,
      WEIGHT: 940,
    },
  },
}

const BOUNDS = {
  COLOR: {
    HUE: [0, 360, 1],
    SATURATION: [0, 100, 1],
    LIGHTNESS: [0, 100, 1],
    ALPHA: [0, 1, 0.01],
  },
  SHADOW: {
    REACH: [-50, 50, 1],
    BLUR: [-50, 50, 1],
    INTENSITY: [0, 1, 0.01],
    CONTRAST: [0, 100, 1],
  },
  TEXT: {
    VALUE: 'HEY!',
    FILTER: {
      BLUR: [0, 10, 1],
    },
    FONT: {
      FAMILY: 'Arial',
      SIZE: [0, 10, 1],
      WEIGHT: [0, 2000, 1],
    },
  },
}

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
          } else if (typeof BOUNDS_OBJECT[category] === 'string') {
            FOLDER.add(CONFIG_OBJECT, category).onChange(() =>
              setModel(new Date().getTime())
            )
          } else {
            const NEW_FOLDER = FOLDER
              ? FOLDER.addFolder(category)
              : datRef.current.addFolder(category)
            digest(CONFIG_OBJECT[category], BOUNDS_OBJECT[category], NEW_FOLDER)
          }
        }
      }
      digest(CONFIG, BOUNDS, datRef.current)
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
    document.documentElement.style.setProperty(
      '--alpha',
      CONFIG.COLOR.LIGHTNESS
    )
  }, [model])

  return (
    <h1
      style={{
        '--font-size': CONFIG.TEXT.FONT.SIZE,
        '--font-family': CONFIG.TEXT.FONT.FAMILY,
        '--font-weight': CONFIG.TEXT.FONT.WEIGHT,
        '--text-blur': CONFIG.TEXT.FILTER.BLUR,
        '--hue': CONFIG.COLOR.HUE,
        '--saturation': CONFIG.COLOR.SATURATION,
        '--lightness': CONFIG.COLOR.LIGHTNESS,
        '--neumorphic-contrast': CONFIG.SHADOW.CONTRAST,
        '--neumorphic-reach': CONFIG.SHADOW.REACH,
        '--neumorphic-blur': CONFIG.SHADOW.BLUR,
        '--neumorphic-intensity': CONFIG.SHADOW.INTENSITY,
      }}>
      {CONFIG.TEXT.VALUE}
    </h1>
  )
}
render(<App />, document.getElementById('app'))
