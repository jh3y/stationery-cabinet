import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'
import { Canvas, useFrame } from 'https://cdn.skypack.dev/@react-three/fiber'
import * as THREE from 'https://cdn.skypack.dev/three'
import gsap from 'https://cdn.skypack.dev/gsap'

const ROOT_NODE = document.querySelector('#app')

const CONFIG = {
  fft: 64,
  show: true,
  duration: 0.1,
  fps: 24,
  barWidth: 4,
  barMinHeight: 0.04,
  barMaxHeight: 0.8,
  barGap: 2,
}

// Set the global FPS for the canvas...
gsap.ticker.fps(CONFIG.fps)

const usePersistentState = (key, initialValue) => {
  const [state, setState] = React.useState(
    window.localStorage.getItem(key)
      ? JSON.parse(window.localStorage.getItem(key))
      : initialValue
  )
  React.useEffect(() => {
    // Stringify so we can read it back
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])
  return [state, setState]
}

const Box = props => {
  return (
    <mesh {...props} ref={props.innerRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial map={props.texture.current} shininess={10} />
    </mesh>
  )
}

const Bars = ({ meshRef, texture }) => {
  const bars = React.useRef(
    new Array(CONFIG.fft / 2).fill().map(b => React.useRef())
  )
 
  React.useEffect(() => {
    bars.current.forEach(bar => {
      gsap.set(bar.current.scale, {
        y: 0.5,
      })
    })
    // Set the bind
    meshRef.current = bars.current
  }, [])

  return (
    <group rotation={[0, 0, 0]} position={[-10, 0, 5]}>
      {bars.current.map((bar, index) => (
        <Box
          innerRef={bar}
          texture={texture}
          position={[
            gsap.utils.distribute({
              base: bars.current.length / -2 - 2,
              amount: bars.current.length * 1.25,
            })(index, bars.current[index], bars.current),
            0,
            -0.5,
          ]}
        />
      ))}
    </group>
  )
}

const AudioVisualizationThree = ({
  timeline,
  recording,
  recorder,
  start,
  drawRef,
  scrubRef,
  metadata,
  src,
}) => {
  const canvasRef = React.useRef(null)
  const meshRef = React.useRef(null)
  const textureRef = React.useRef(null)
  const contextRef = React.useRef(null)
  const audioContextRef = React.useRef(null)
  const barsRef = React.useRef([])

  React.useEffect(() => {
    const createTexture = () => {
      const CANVAS = document.createElement('canvas')
      const CTX = CANVAS.getContext('2d')
      CANVAS.width = canvasRef.current.width
      CANVAS.height = canvasRef.current.height
      // const fillStyle = CTX.createLinearGradient(
      //   CANVAS.width / 2,
      //   0,
      //   CANVAS.width / 2,
      //   CANVAS.height
      // )
      // // Color stop is three colors
      // fillStyle.addColorStop(0.01, 'hsl(0, 80%, 50%)')
      // fillStyle.addColorStop(0.99, 'hsl(0, 80%, 50%)')
      // fillStyle.addColorStop(0.35, 'hsl(120, 100%, 50%)')
      // fillStyle.addColorStop(0.5, 'hsl(120, 100%, 50%)')
      // fillStyle.addColorStop(0.65, 'hsl(120, 100%, 50%)')
      // CTX.fillStyle = fillStyle
      CTX.fillStyle = 'hsl(180, 100%, 50%)'


      CTX.fillRect(0, 0, CANVAS.width, CANVAS.height)
      textureRef.current = new THREE.CanvasTexture(CANVAS)
      textureRef.current.wrapS = THREE.RepeatWrapping
      textureRef.current.wrapT = THREE.RepeatWrapping
      textureRef.current.mapping = THREE.EquirectangularRefractionMapping
      textureRef.current.needsUpdate = true
    }
    createTexture()
  }, [])

  const addBars = bars => {
    const BAR_DURATION = CONFIG.duration
    barsRef.current.push(bars)
    for (let b = 0; b < bars.length; b++) {
      timeline.current.to(
        meshRef.current[b].current.scale,
        {
          y: gsap.utils.clamp(0.5, 10, bars[b]),
          duration: BAR_DURATION,
        },
        barsRef.current.length * (1 / CONFIG.fps)
      )
    }
  }

  const ANALYSE = stream => {
    audioContextRef.current = new AudioContext()
    const ANALYSER = audioContextRef.current.createAnalyser()
    ANALYSER.fftSize = CONFIG.fft
    const SOURCE = audioContextRef.current.createMediaStreamSource(stream)
    const DATA_ARR = new Uint8Array(ANALYSER.frequencyBinCount)
    SOURCE.connect(ANALYSER)

    // Reset the bars and pad them out...
    if (barsRef.current.length > 0) {
      barsRef.current.length = 0
    }

    if (metadata.current && metadata.current.length > 0) {
      metadata.current.length = 0
    }

    const REPORT = () => {
      if (recorder.current && recorder.current.state === 'recording') {
        ANALYSER.getByteTimeDomainData(DATA_ARR)
        // ANALYSER.getByteFrequencyData(DATA_ARR)
        // const VOLUME = Math.floor((Math.max(...DATA_ARR) / 255) * 100)
        // console.info(DATA_ARR)

        // Each frame is 8 blocks of tweens getting added to the timeline
        // But they need to be normalized

        const BARS = [...DATA_ARR].map(value => (1 - (value / 128.0)) * 100)
        // const BARS = [...DATA_ARR].map(value => (value / 255.0))
        addBars(BARS)
        // Blocks of Arrays instead for this one.
        metadata.current.push(BARS)
      }
      // if (recording) {
      //   DRAW()
      // }
    }
    drawRef.current = REPORT
    gsap.ticker.add(drawRef.current)
  }

  React.useEffect(() => {
    if (recording && recorder.current) {
      ANALYSE(recorder.current.stream)
    }
  }, [recording, recorder.current])

  React.useEffect(() => {
    barsRef.current.length = 0
    if (src === null) {
      metadata.current.length = 0
    } else if (src && metadata.current.length) {
      metadata.current.forEach(bars => addBars(bars))
      // gsap.ticker.add(drawRef.current)
    }
  }, [src])

  return (
    <Canvas ref={canvasRef} camera={{ fov: 75, position: [8, 8, 15] }}>
      <pointLight position={[10, 20, 50]} />
      <Bars texture={textureRef} meshRef={meshRef} />
    </Canvas>
  )
}

const RecorderControls = ({ onRecord, onStop, recording, paused }) => {
  return (
    <div className="controls">
      <button
        className="record"
        id="toggle"
        onClick={onRecord}
        title={recording ? 'Pause Recording' : 'Start Recording'}
        style={{ '--active': recording && !paused ? 1 : 0 }}>
        Start Recording
        <svg viewBox="0 0 448 512" width="100" title="pause">
          <path d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z" />
        </svg>
      </button>
      {recording ? (
        <button
          className="stop"
          title="Stop Recording"
          id="stop"
          onClick={onStop}>
          Stop Recording
          <svg viewBox="0 0 448 512" width="100" title="stop">
            <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z" />
          </svg>
        </button>
      ) : null}
    </div>
  )
}

const Recordings = ({ recordings, onDelete, onPlay, onDownload }) => {
  return (
    <details className="recordings">
      <summary>{`Recordings [${recordings.length}]`}</summary>
      {!recordings ||
        (recordings.length === 0 && (
          <div className="recordings__empty-message">No Recordings</div>
        ))}
      {recordings.length > 0 ? (
        <ul className="recordings__list">
          {recordings.map(recording => (
            <li className="recordings__recording" key={recording.id}>
              <span>{recording.name}</span>
              <button
                onClick={onPlay}
                className="recordings__play recordings__control"
                data-recording={recording.id}
                title="Play Recording">
                <svg viewBox="0 0 448 512" width="100" title="play">
                  <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
                </svg>
              </button>
              <button
                onClick={onDownload}
                className="recordings__download recordings__control"
                data-recording={recording.id}
                title="Download Recording">
                <svg
                  viewBox="0 0 640 512"
                  width="100"
                  title="cloud-download-alt">
                  <path d="M537.6 226.6c4.1-10.7 6.4-22.4 6.4-34.6 0-53-43-96-96-96-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32c-88.4 0-160 71.6-160 160 0 2.7.1 5.4.2 8.1C40.2 219.8 0 273.2 0 336c0 79.5 64.5 144 144 144h368c70.7 0 128-57.3 128-128 0-61.9-44-113.6-102.4-125.4zm-132.9 88.7L299.3 420.7c-6.2 6.2-16.4 6.2-22.6 0L171.3 315.3c-10.1-10.1-2.9-27.3 11.3-27.3H248V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v112h65.4c14.2 0 21.4 17.2 11.3 27.3z" />
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="recordings__delete recordings__control"
                data-recording={recording.id}
                title="Delete Recording">
                <svg viewBox="0 0 448 512" width="100" title="trash-alt">
                  <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16                                  16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0                                  0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-                                  16V48a16 16 0 0 0-16-16z" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </details>
  )
}

// Things need to be passed into this point.
const RecorderPlayback = ({
  timeline,
  start,
  draw,
  src,
  scrub,
  audioRef: propsRef,
}) => {
  const audioRef = React.useRef(null)
  React.useEffect(() => {
    const onUpdate = e => {
      switch (e.type) {
        case 'play':
          if (draw.current) gsap.ticker.add(draw.current)
          timeline.current.totalTime(
            audioRef.current.currentTime + start.current
          )
          timeline.current.play()
          break
        case 'seeking':
        case 'seeked':
          timeline.current.totalTime(
            audioRef.current.currentTime + start.current
          )
          break
        case 'pause':
          timeline.current.pause()
          break
        case 'ended':
          timeline.current.pause()
          if (scrub) scrub(start.current)
          break
      }
    }

    ;['play', 'seeking', 'seeked', 'pause', 'ended'].forEach(event =>
      audioRef.current.addEventListener(event, onUpdate)
    )

    // Sync refs
    propsRef.current = audioRef.current

    return () => {
      ;['play', 'seeking', 'seeked', 'pause', 'ended'].forEach(event =>
        audioRef.current.removeEventListener(event, onUpdate)
      )
    }
  }, [])

  React.useEffect(() => {
    if (src && src.startsWith('data')) audioRef.current.play()
  }, [src])

  return <audio src={src} ref={audioRef} controls />
}

const App = () => {
  const timeline = React.useRef(gsap.timeline())
  const recorder = React.useRef(null)
  const start = React.useRef(0)
  const audioRef = React.useRef(null)
  const draw = React.useRef(() => {})
  const metadata = React.useRef([])

  const [{ recordings }, setRecordings] = usePersistentState('3d-recordings', {
    recordings: [],
  })
  const [src, setSrc] = React.useState(null)
  const [recording, setRecording] = React.useState(false)
  const [paused, setPaused] = React.useState(false)

  // UTILITY FUNCTION
  const reset = () => {
    metadata.current.length = 0
    gsap.ticker.remove(draw.current)
    draw.current = null
    timeline.current.clear()
    setSrc(null)
  }

  const scrub = (time = 0, trackTime = 0, onComplete) => {
    gsap.to(timeline.current, {
      totalTime: time,
      onComplete: () => {
        audioRef.current.currentTime = trackTime
        gsap.ticker.remove(draw.current)
        if (onComplete) onComplete()
      },
    })
  }

  const onStop = () => {
    recorder.current.stop()
  }

  const onDelete = e => {
    if (confirm('Delete Recording?')) {
      const idToDelete = parseInt(
        e.currentTarget.getAttribute('data-recording'),
        10
      )
      setRecordings({
        recordings: [
          ...recordings.filter(recording => recording.id !== idToDelete),
        ],
      })
      reset()
    }
  }
  const onDownload = async e => {
    const idToDownload = parseInt(
      e.currentTarget.getAttribute('data-recording'),
      10
    )
    const RECORDING = recordings.filter(
      recording => recording.id === idToDownload
    )[0]
    const BLOB = await (await fetch(RECORDING.audioBlob)).blob()
    const DOWNLOAD = document.createElement('a')
    DOWNLOAD.download = `Recording – ${RECORDING.name}`
    DOWNLOAD.href = URL.createObjectURL(BLOB)
    document.body.appendChild(DOWNLOAD)
    DOWNLOAD.click()
    DOWNLOAD.remove()
  }

  const onPlay = e => {
    const idToPlay = parseInt(
      e.currentTarget.getAttribute('data-recording'),
      10
    )
    const RECORDING = recordings.filter(
      recording => recording.id === idToPlay
    )[0]
    if (src === RECORDING.audioBlob) return
    reset()
    // Trigger this by setting a state variable or something.
    metadata.current = [...RECORDING.metadata]
    setSrc(RECORDING.audioBlob)
  }

  const onSave = async audioBlob => {
    const reader = new FileReader()
    reader.onload = e => {
      const audioSafe = e.target.result
      const timestamp = new Date()
      const name = prompt('Recording name?')
      setRecordings({
        recordings: [
          ...recordings,
          {
            audioBlob: audioSafe,
            metadata: [...metadata.current],
            name: name || timestamp.toUTCString(),
            id: timestamp.getTime(),
          },
        ],
      })
      alert('Recording Saved')
    }
    await reader.readAsDataURL(audioBlob)
  }

  const onRecord = () => {
    const toggleRecording = async () => {
      // If we aren't recording, we need to start a recording.
      if (!recording) {
        // Reset the timeline
        timeline.current.clear()
        // Reset the audio tag
        const CHUNKS = []
        const MEDIA_STREAM = await window.navigator.mediaDevices.getUserMedia({
          audio: true,
        })

        recorder.current = new MediaRecorder(MEDIA_STREAM)
        recorder.current.ondataavailable = async event => {
          // gsap.ticker.remove(draw.current)
          timeline.current.pause()

          CHUNKS.push(event.data)
          const AUDIO_BLOB = new Blob(CHUNKS, { type: 'audio/ogg' })
          const SRC = window.URL.createObjectURL(AUDIO_BLOB)
          // Tear down after recording.
          recorder.current.stream.getTracks().forEach(t => t.stop())
          recorder.current = null

          const save = confirm('Save Recording?')
          if (save) {
            onSave(AUDIO_BLOB)
          }

          scrub(start.current, 0, () => {
            setSrc(SRC)
            setRecording(false)
          })
        }
        recorder.current.start()
        timeline.current.play()
        // Trigger the changes
        setSrc(null)
        setRecording(true)
      } else {
        const RECORDING = recorder.current.state === 'recording'
        timeline.current[RECORDING ? 'pause' : 'play']()
        recorder.current[RECORDING ? 'pause' : 'resume']()
        setPaused(RECORDING)
      }
    }
    toggleRecording()
  }

  return (
    <>
      <AudioVisualizationThree
        start={start}
        recording={recording}
        recorder={recorder}
        timeline={timeline}
        drawRef={draw}
        metadata={metadata}
        src={src}
      />
      <RecorderControls
        onRecord={onRecord}
        recording={recording}
        paused={paused}
        onStop={onStop}
      />
      <RecorderPlayback
        src={src}
        timeline={timeline}
        start={start}
        draw={draw}
        audioRef={audioRef}
        scrub={scrub}
      />
      <Recordings
        recordings={recordings}
        onDownload={onDownload}
        onDelete={onDelete}
        onPlay={onPlay}
      />
    </>
  )
}

render(<App />, ROOT_NODE)
