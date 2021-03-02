import 'https://cdn.skypack.dev/regenerator-runtime'
import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
} from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'

const ROOT = document.querySelector('#app')

const CANVAS_HEIGHT = 256
const App = () => {
  const [url, setUrl] = useState(null)
  const [fft, setFft] = useState(1024)
  const [buffer, setBuffer] = useState(null)
  const audioRef = useRef(null)
  const bufferRef = useRef(null)
  const gainRef = useRef(null)
  const contextRef = useRef(null)
  const sourceRef = useRef(null)
  const canvasRef = useRef(null)
  const analyserRef = useRef(null)
  const rafRef = useRef(null)
  const eqRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current) {
      contextRef.current = canvasRef.current.getContext('2d')
      eqRef.current = contextRef.current.createLinearGradient(
        fft,
        CANVAS_HEIGHT,
        fft,
        0
      )
      eqRef.current.addColorStop(0, 'hsl(280, 60%, 40%)')
      eqRef.current.addColorStop(0.4, 'hsl(95, 80%, 60%)')
      eqRef.current.addColorStop(1, 'hsl(0, 80%, 50%)')
      canvasRef.current.width = fft
      contextRef.current.width = fft
      canvasRef.current.height = CANVAS_HEIGHT
      contextRef.current.height = CANVAS_HEIGHT
      contextRef.current.fillStyle = eqRef.current
    }
  }, [fft])

  useEffect(() => {
    // Set up the audio visualiser here.
    const REPORT = () => {
      const BUFFER_LENGTH = analyserRef.current.frequencyBinCount
      // Create a data array
      const DATA_ARR = new Uint8Array(BUFFER_LENGTH)
      analyserRef.current.getByteFrequencyData(DATA_ARR)
      contextRef.current.clearRect(0, 0, fft, CANVAS_HEIGHT)
      for (var p = 0; p < fft / 2; p++) {
        const HEIGHT = DATA_ARR[p]
        contextRef.current.fillRect(p * 2, CANVAS_HEIGHT - HEIGHT, 2, HEIGHT)
      }
      requestAnimationFrame(REPORT)
    }
    const SET = async () => {
      audioRef.current = new AudioContext()
      if (!bufferRef.current)
        bufferRef.current = await audioRef.current.decodeAudioData(buffer)
      // Create a gain node
      gainRef.current = audioRef.current.createGain()
      gainRef.current.gain.value = 0.5
      gainRef.current.connect(audioRef.current.destination)
      sourceRef.current = audioRef.current.createBufferSource()
      sourceRef.current.buffer = bufferRef.current
      sourceRef.current.connect(gainRef.current)
      analyserRef.current = audioRef.current.createAnalyser()
      analyserRef.current.fftSize = fft
      sourceRef.current.connect(analyserRef.current)
      sourceRef.current.start()
      REPORT()
    }
    if (audioRef.current && buffer) {
      audioRef.current.close().then(() => {
        cancelAnimationFrame(rafRef)
        SET()
      })
    } else if (buffer) {
      SET()
    }
  }, [fft, buffer])

  useEffect(() => {
    const grabAudio = async url => {
      const buffer = await (await fetch(url)).arrayBuffer()
      setBuffer(buffer)
    }
    grabAudio(url)
  }, [url])

  // 128, 256, 512, 1024, 2048
  const FFTS = [128, 256, 512, 1024, 2048]
  return (
    <Fragment>
      <canvas ref={canvasRef} />
      <div className="controls">
        <div className="fft">
          <label htmlFor="fft">FFT</label>
          <input
            id="fft"
            type="range"
            min={0}
            max={4}
            defaultValue={3}
            onChange={e => setFft(FFTS[e.target.value])}
          />
        </div>
        <div className="volume">
          <label htmlFor="volume">Gain</label>
          <input
            id="volume"
            type="range"
            min={0}
            max={1}
            defaultValue={0.5}
            step={0.05}
            onChange={e => (gainRef.current.gain.value = e.target.value)}
          />
        </div>
        <div className="url">
          <label htmlFor="url">URL</label>
          <input
            type="text"
            placeholder="Enter audio URL"
            onChange={e => {
              bufferRef.current = null
              setUrl(e.target.value)
            }}
          />
        </div>
      </div>
    </Fragment>
  )
}

render(<App />, ROOT)
