import 'https://cdn.skypack.dev/regenerator-runtime'
import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
} from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'

const ROOT = document.querySelector('#app')

const getMedia = async constraints => {
  let stream = null
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints)
  } catch (err) {
    // console.error(err)
  }
  return stream
}

const CANVAS_HEIGHT = 256
const App = () => {
  const [fft, setFft] = useState(1024)
  const [stream, setStream] = useState(null)
  const audioRef = useRef(null)
  const contextRef = useRef(null)
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
    const SET = () => {
      audioRef.current = new AudioContext()
      analyserRef.current = audioRef.current.createAnalyser()
      analyserRef.current.fftSize = fft
      // Hook the content up to a source. We're going to use a MediaStreamSource (Mic)
      const SOURCE = audioRef.current.createMediaStreamSource(stream)
      // Connect the analyser to the source
      SOURCE.connect(analyserRef.current)
      REPORT()
    }
    if (audioRef.current && stream) {
      audioRef.current.close().then(() => {
        cancelAnimationFrame(rafRef)
        SET()
      })
    } else if (stream) {
      SET()
    }
  }, [fft, stream])

  useEffect(() => {
    getMedia({
      audio: true,
    }).then(stream => setStream(stream))
  }, [])

  // 128, 256, 512, 1024, 2048
  const FFTS = [128, 256, 512, 1024, 2048]
  return (
    <Fragment>
      <canvas ref={canvasRef} />
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
    </Fragment>
  )
}

render(<App />, ROOT)
