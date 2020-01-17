const {
  gsap: {
    to,
    set,
    utils: { random },
  },
  dat: { GUI },
  React,
  React: { useEffect, useRef, useState },
  ReactDOM: { render },
} = window

const CONFIG = {
  CONFIG: {
    dots: 20,
    size: 0.5,
    text: 'Hey!',
    font_size: 3,
    font_family: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
    viewbox_width: 240,
    viewbox_height: 80,
    debug: false,
  },
  ANIMATION: {
    scale_speed: 2,
    scale_delay: 5,
    lighten_speed: 0.2,
    lighten_delay: 2,
  },
  PROBABILITY: {
    scale: 0.9,
    lighten: 0.25,
  },
}

const BOUNDS = {
  CONFIG: {
    dots: [2, 30],
    size: [0.1, 5, 0.1],
    font_family: true,
    font_size: [1, 10, 0.1],
    viewbox_width: [0, 500, 1],
    viewbox_height: [0, 500, 1],
    debug: true,
  },
  ANIMATION: {
    scale_speed: [0.1, 3, 0.01],
    scale_delay: [0, 10, 0.01],
    lighten_speed: [0.1, 2, 0.01],
    lighten_delay: [0, 10, 0.01],
  },
  PROBABILITY: {
    scale: [0, 1, 0.01],
    lighten: [0, 1, 0.01],
  },
}

const ANIMATE = (element, props, config) => {
  to(element, config.duration, {
    yoyo: true,
    repeat: 1,
    delay: `random(0, ${config.delay})`,
    onComplete: () => ANIMATE(element, props, config),
    ...props,
  })
}

const App = () => {
  const [model, setModel] = useState(0)
  const datRef = useRef(null)
  const {
    size,
    dots,
    text,
    debug,
    font_family: fontFamily,
    font_size: fontSize,
    viewbox_width: width,
    viewbox_height: height,
  } = CONFIG.CONFIG
  useEffect(() => {
    if (!datRef.current) {
      datRef.current = new GUI({ name: 'Shimmer Text Config' })
      for (const CATEGORY in BOUNDS) {
        const FOLDER = datRef.current.addFolder(CATEGORY)
        for (const spec in BOUNDS[CATEGORY]) {
          if (spec === 'debug' || spec === 'font_family') {
            FOLDER.add(CONFIG[CATEGORY], spec)
              .name(spec.replace('_', ' ').toUpperCase())
              .onChange(() => setModel(new Date().getTime()))
          } else {
            FOLDER.add(
              CONFIG[CATEGORY],
              spec,
              BOUNDS[CATEGORY][spec][0],
              BOUNDS[CATEGORY][spec][1],
              BOUNDS[CATEGORY][spec][2] ? BOUNDS[CATEGORY][spec][2] : 1
            )
              .name(spec.replace('_', ' ').toUpperCase())
              .onFinishChange(() => setModel(new Date().getTime()))
          }
        }
      }
      datRef.current
        .add(CONFIG.CONFIG, 'text')
        .name('TEXT')
        .onChange(() => setModel(new Date().getTime()))
    }
    // Need to animate all the new circles.
    set(document.querySelectorAll('circle'), { transformOrigin: '50% 50%' })
    const CIRCLES = document.querySelectorAll('circle')
    const SCALERS = [...CIRCLES].filter(
      () => Math.random() > CONFIG.PROBABILITY.scale
    )
    SCALERS.forEach(el =>
      ANIMATE(
        el,
        { scale: 0 },
        {
          duration: random(0.1, CONFIG.ANIMATION.scale_speed),
          delay: CONFIG.ANIMATION.scale_delay,
        }
      )
    )

    const BRIGHTS = [...CIRCLES].filter(
      () => Math.random() > CONFIG.PROBABILITY.lighten
    )
    BRIGHTS.forEach(el =>
      ANIMATE(
        el,
        { '--lightness': 100 },
        {
          duration: random(0.1, CONFIG.ANIMATION.lighten_speed),
          delay: CONFIG.ANIMATION.lighten_delay,
        }
      )
    )
  }, [model])

  const HUE = Math.random() * 360

  return (
    <div className="shimmer-text">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          '--debug': debug ? 1 : 0,
        }}>
        <pattern
          id="shimmer-text__pattern"
          viewBox={`-${size / 2} -${size / 2} ${size * dots} ${size * dots}`}
          patternUnits="userSpaceOnUse"
          width={`${size * (dots * 2) - size / 2}`}
          height={`${size * (dots * 2) - size / 2}`}
          x="0"
          y="0">
          {new Array(dots * dots).fill().map((_, index) => (
            <circle
              key={`circle--${index}--${model}`}
              r={`${size / 2}`}
              cx={`${(index % dots) * size}`}
              cy={`${Math.floor(index / dots) * size}`}
              style={{
                '--lightness': 40 + Math.random() * 30,
                '--hue': HUE,
              }}></circle>
          ))}
        </pattern>
        <text
          className="shimmer-text__text"
          textAnchor="middle"
          style={{
            '--font-size': fontSize,
            '--font-family': fontFamily,
          }}
          x="50%"
          y="50%"
          dy=".35em">
          {text}
        </text>
      </svg>
    </div>
  )
}

render(<App />, document.getElementById('app'))
