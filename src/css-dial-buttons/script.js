const {
  dat: { GUI },
  React,
  React: { useEffect, useRef, useState },
  ReactDOM: { render },
} = window

const copyToClipboard = (content, msg) => {
  const input = document.createElement('input')
  input.setAttribute('type', 'text')
  input.value = content
  document.body.appendChild(input)
  input.select()
  input.setSelectionRange(0, 99999)
  document.execCommand('copy')
  if (msg) alert(msg)
  input.remove()
}

const CONFIG = {
  CONFIG: {
    buttons: 5,
    radius: 40,
    offset: 25,
    bounds: 360,
  },
  SPEED: {
    delayStep: 0,
    transition: 0.2,
  },
  SIZING: {
    parent: 56,
    child: 44,
  },
  copyHTML: () => {
    copyToClipboard(
      document.querySelector('.dial-button').outerHTML,
      'Markup copied 👍'
    )
  },
  copyCSS: () => {
    const CSS = `
    .dial-button {
      --base-bg: #fff;
      position: relative;
    }
    .dial-button > label:not(.dial-button__cloak) {
      background: var(--base-bg);
      border-radius: 50%;
      display: block;
      height: calc(var(--parent, 44) * 1px);
      left: 50%;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: calc(var(--parent, 44) * 1px);
      z-index: 4;
    }
    .dial-button > input {
      left: 50%;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 3;
    }
    .dial-button > :checked ~ label:first-of-type {
      --shadow-offset: 0;
    }
    .dial-button > :checked ~ button {
      --opacity: 1;
      --scale: 1;
      --translation: calc((var(--parent) / 2) + (var(--child) / 2) + var(--radius));
      z-index: 2;
    }
    .dial-button > :checked ~ .dial-button__cloak {
      bottom: 0;
      left: 0;
      position: fixed;
      right: 0;
      top: 0;
    }
    .dial-button button {
      --opacity: 0;
      --rotation: calc(var(--offset, 0) + ((var(--bounds) / var(--kids)) * var(--index)));
      --scale: 0;
      --translation: 0;
      background: var(--base-bg);
      border: 0;
      border-radius: 100%;
      height: calc(var(--child, 44) * 1px);
      left: 50%;
      position: absolute;
      top: 50%;
      opacity: var(--opacity);
      transform: translate(-50%, -50%) rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation, 0) * 1px)) rotate(calc(var(--rotation) * -1deg)) scale(var(--scale, 1));
      transition: transform calc(var(--transition, 0.25) * 1s) calc((var(--delay, 0) * var(--index)) * 1s), opacity calc(var(--transition, 0.25) * 1s) calc((var(--delay, 0) * var(--index)) * 1s), box-shadow 0.1s;
      width: calc(var(--child, 44) * 1px);
    }
    `
    copyToClipboard(CSS, 'CSS copied 👍')
  },
}

const BOUNDS = {
  CONFIG: {
    buttons: [1, 10],
    radius: [0, 250],
    offset: [0, 360],
    bounds: [90, 360, 10],
  },
  SPEED: {
    transition: [0.1, 2, 0.01],
    delayStep: [0, 0.5, 0.01],
  },
  SIZING: {
    parent: [44, 100],
    child: [44, 100],
  },
}

const App = () => {
  const [model, setModel] = useState(0)
  const datRef = useRef(null)
  useEffect(() => {
    document.documentElement.style.setProperty('--hue', Math.random() * 360)
    if (!datRef.current) {
      datRef.current = new GUI({ name: 'Dial Button Config' })
      for (const CATEGORY in BOUNDS) {
        const FOLDER = datRef.current.addFolder(CATEGORY)
        for (const spec in BOUNDS[CATEGORY]) {
          FOLDER.add(
            CONFIG[CATEGORY],
            spec,
            BOUNDS[CATEGORY][spec][0],
            BOUNDS[CATEGORY][spec][1],
            BOUNDS[CATEGORY][spec][2] ? BOUNDS[CATEGORY][spec][2] : 1
          ).onChange(() => setModel(new Date().getTime()))
        }
      }
      datRef.current.add(CONFIG, 'copyHTML').name('COPY MARKUP')
      datRef.current.add(CONFIG, 'copyCSS').name('COPY CSS')
    }
  }, [model])

  return (
    <div
      className="dial-button"
      htmlFor="dial"
      style={{
        '--kids': CONFIG.CONFIG.buttons,
        '--radius': CONFIG.CONFIG.radius,
        '--offset': CONFIG.CONFIG.offset,
        '--bounds': CONFIG.CONFIG.bounds,
        '--delay': CONFIG.SPEED.delayStep,
        '--transition': CONFIG.SPEED.transition,
        '--child': CONFIG.SIZING.child,
        '--parent': CONFIG.SIZING.parent,
      }}>
      <input type="checkbox" id="dial" />
      {new Array(CONFIG.CONFIG.buttons).fill().map((_, index) => (
        <button
          key={`dial-button-${model}--${index}`}
          style={{
            '--index': index,
          }}>
          {index}
        </button>
      ))}
      <label htmlFor="dial">
        <svg viewBox="0 0 24 24">
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
      </label>
      <label className="dial-button__cloak" htmlFor="dial" />
    </div>
  )
}

render(<App />, document.getElementById('app'))
