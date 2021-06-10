import 'https://cdn.skypack.dev/regenerator-runtime'
import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
} from 'https://cdn.skypack.dev/react'
import Color from 'https://cdn.skypack.dev/color'
import { render } from 'https://cdn.skypack.dev/react-dom'
const rootNode = document.getElementById('app')

const useCamera = fps => {
  const media = useRef(navigator.mediaDevices)
  const [stream, setStream] = useState(null)
  const [active, setActive] = useState(true)
  const [rearAvailable, setRearAvailable] = useState(undefined)
  const [useRear, setUseRear] = useState(undefined)
  const fpsRef = useRef(fps)

  const hasMultipleCameras = async () => {
    let multiple = false
    if (!navigator.mediaDevices.enumerateDevices) {
      alert(
        'Sorry, enumerate devices is not supported, can only use front camera'
      )
    } else {
      const devices = await navigator.mediaDevices.enumerateDevices()
      multiple =
        devices.filter(d => d.kind === 'videoinput').length > 1 ? true : false
    }
    setRearAvailable(multiple)
    setUseRear(multiple)
  }

  const stopCamera = () => {
    stream.getTracks()[0].stop()
    setStream(null)
  }

  useEffect(() => {
    hasMultipleCameras()
  }, [rearAvailable])

  const toggleCamera = () => {
    setUseRear(!useRear)
    if (stream) stopCamera()
  }

  const toggleStream = () => {
    if (active) stopCamera()
    setActive(!active)
  }

  useEffect(() => {
    if (!media.current.getUserMedia) {
      alert('getUserMedia() not supported')
    }
    if (
      (active &&
        rearAvailable !== undefined &&
        media.current.getUserMedia &&
        !stream) ||
      (stream && fpsRef.current !== fps)
    ) {
      // Look into how to do this properly at some point
      // const facingMode =
      //   (useRear !== undefined && rearAvailable) || useRear
      //     ? { exact: 'environment' }
      //     : 'user'
      fpsRef.current = fps
      const updateStream = async () => {
        const stream = await media.current.getUserMedia({
          video: {
            frameRate: fpsRef.current,
          },
        })
        setStream(stream)
      }
      updateStream()
    }
  }, [stream, rearAvailable, useRear, active, fps])
  return {
    stream,
    toggleCamera: rearAvailable ? toggleCamera : undefined,
    toggleStream,
    usingRear: useRear,
  }
}

const useColorGrab = stream => {
  const canvas = useRef(document.createElement('canvas'))
  const context = canvas.current.getContext('2d')
  const loop = useRef(null)
  const video = useRef(document.createElement('video'))
  video.current.setAttribute('autoplay', true)
  canvas.current.height = 1
  canvas.current.width = 1
  const [hex, setHex] = useState(null)
  const [rgb, setRgb] = useState(null)
  const [hsl, setHsl] = useState(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    video.current.srcObject = stream
    const update = () => {
      context.drawImage(
        video.current,
        0,
        0,
        canvas.current.width,
        canvas.current.height
      )
      const [r, g, b] = context.getImageData(
        0,
        0,
        canvas.current.width,
        canvas.current.height
      ).data
      const NewColor = Color({ r, g, b })
      setRgb({ r, g, b })
      setHex(NewColor.hex())
      setHsl(NewColor.hsl())
      setIsDark(NewColor.isDark())
      loop.current = requestAnimationFrame(update)
    }
    update()
    return () => {
      cancelAnimationFrame(loop.current)
      loop.current = null
    }
  }, [context, stream])

  return {
    isDark,
    hex,
    rgb,
    hsl,
  }
}

const App = () => {
  const webcam = useRef(null)
  const copyBox = useRef(null)
  const copyTimeout = useRef(null)
  const [debug, setDebug] = useState(true)
  const [copied, setCopied] = useState(null)
  const [fps, setFps] = useState(24)
  const [colors, setColors] = useState(
    localStorage.getItem('jh3y-colors')
      ? JSON.parse(localStorage.getItem('jh3y-colors'))
      : []
  )
  // Use input stream hook to pass into color grabber
  const { stream } = useCamera(fps)
  // If there's a stream and a webcam element, stream the input
  const { hex, hsl, isDark } = useColorGrab(stream)
  const clear = () => {
    setColors([])
    localStorage.removeItem('jh3y-colors')
  }
  const saveColor = () => {
    const newColors = [
      {
        hsl: `hsl(${Math.round(hsl.color[0])}, ${Math.round(
          hsl.color[1]
        )}%, ${Math.round(hsl.color[2])}%)`,
        hex,
        dark: isDark,
      },
      ...colors,
    ]
    setColors(newColors)
    localStorage.setItem('jh3y-colors', JSON.stringify(newColors))
  }

  const copyToCb = colorIndex => () => {
    const input = document.createElement('input')
    document.body.appendChild(input)
    const { hex } = colors[colorIndex]
    input.value = hex.toUpperCase()
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    setCopied(colors[colorIndex])
  }

  useEffect(() => {
    if (stream && webcam.current) {
      const VIDEO = document.createElement('video')
      VIDEO.setAttribute('autoPlay', true)
      VIDEO.playsInline = true
      webcam.current.innerHTML = ''
      webcam.current.appendChild(VIDEO)
      VIDEO.srcObject = stream
    }
  }, [stream, webcam, debug])
  // If two values in the rgb are over 200 set dark mode
  useEffect(() => {
    document.documentElement.style.setProperty('--bg', hsl)
  }, [hsl])
  const wipeClipboard = () => setCopied(null)
  useEffect(() => {
    copyTimeout.current = setTimeout(wipeClipboard, 2000)
    return () => {
      clearTimeout(copyTimeout.current)
    }
  }, [copied])
  return (
    <Fragment>
      {copied && (
        <div
          className="copy-box"
          ref={copyBox}
          style={{
            '--bg': copied.hex,
            '--dark': !copied.dark ? '#000000' : '#FFFFFF',
          }}>
          {`Copied ${copied.hsl} to clipboard!`}
        </div>
      )}
      {hex && (
        <div
          className="hex"
          style={{
            '--bg': hex,
            '--selected': hex,
            '--set': !isDark ? '#000000' : '#FFFFFF',
          }}>
          <h1>{`hsl(${Math.round(hsl.color[0])}, ${Math.round(
            hsl.color[1]
          )}%, ${Math.round(hsl.color[2])}%)`}</h1>
          <button onClick={saveColor}>Save</button>
        </div>
      )}
      <nav
        className="menu"
        style={{
          '--selected': hex,
          '--set': !isDark ? '#000000' : '#FFFFFF',
          '--bg': !isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
        }}>
        <input id="menu__toggle" type="checkbox" className="menu__toggle" />
        <label htmlFor="menu__toggle" className="menu__toggle-label">
          <svg preserveAspectRatio="xMinYMin" viewBox="0 0 24 24">
            <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
          </svg>
          <svg preserveAspectRatio="xMinYMin" viewBox="0 0 24 24">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </label>
        <ol className="menu__content">
          <div>
            <label>Stream FPS</label>
            <input
              type="range"
              min="1"
              max="24"
              step="1"
              value={fps}
              onChange={e => {
                setFps(e.target.value)
              }}
            />
          </div>
          <button onClick={() => setDebug(!debug)}>{`${
            debug ? 'Hide' : 'Show'
          } stream`}</button>
          {debug && stream && <div ref={webcam} className="debug-video" />}
          {colors && colors.length > 0 && (
            <button onClick={clear}>Clear</button>
          )}
          {colors && colors.length > 0 && (
            <div className="colors">
              {colors.map((c, i) => (
                <div
                  className="colors__color"
                  onClick={copyToCb(i)}
                  key={`color--${i}`}
                  style={{
                    '--bg': c.hsl.toString(),
                    '--color': !c.dark ? '#000000' : '#FFFFFF',
                  }}>
                  {c.hsl.toString()}
                </div>
              ))}
            </div>
          )}
        </ol>
      </nav>
    </Fragment>
  )
}

render(<App />, rootNode)
