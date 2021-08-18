import gsap from 'https://cdn.skypack.dev/gsap'
import T from 'https://cdn.skypack.dev/prop-types'

const { XState, XStateReact, React, ReactDOM } = window

const { createMachine, assign, send: sendUtil } = XState
const { useMachine } = XStateReact

// Play around with these values to affect the audio visualisation.
// Should be able to stream the visualisation back no problem.
const MIN_BAR_HEIGHT = 4
const MAX_BAR_HEIGHT = 255
const SHIFT_SPEED = 4
const SHIFT_PER_SECOND = 130
const SHIFT_DELAY = 0.05
const GROW_SPEED = 0.5
const GROW_DELAY = 0.075
const BAR_WIDTH = 4
const COLOR_ONE = 'hsl(185, 73%, 90%)'
const COLOR_TWO = 'hsl(206, 47%, 50%)'
const COLOR_THREE = 'hsl(205, 42%, 31%)'

function assertNonNull(possibleNull, errorMessage) {
  if (possibleNull === null) throw new Error(errorMessage)
}

function stopMediaRecorder(mediaRecorder) {
  if (mediaRecorder.state !== 'inactive') mediaRecorder.stop()

  for (const track of mediaRecorder.stream.getAudioTracks()) {
    if (track.enabled) track.stop()
  }
  mediaRecorder.ondataavailable = null
}

const recorderMachine = createMachine(
  {
    id: 'recorder',
    context: {
      mediaRecorder: null,
      audioDevices: [],
      selectedAudioDevice: null,
      audioBlob: null,
      track: null,
    },
    initial: 'gettingDevices',
    states: {
      gettingDevices: {
        invoke: {
          src: 'getDevices',
          onDone: { target: 'ready', actions: 'assignAudioDevices' },
          onError: '', // TODO
        },
      },
      selecting: {
        on: {
          selection: { target: 'ready', actions: 'assignSelectedAudioDevice' },
        },
      },
      ready: {
        entry: ['cleanSlate'],
        on: {
          changeDevice: 'selecting',
          start: 'recording',
          track: {
            target: 'playback',
            actions: 'assignTrack',
          },
        },
      },
      playback: {
        on: {
          restart: { target: 'ready' },
        },
        states: {},
      },
      recording: {
        invoke: { src: 'mediaRecorder' },
        initial: 'playing',
        states: {
          playing: {
            on: {
              mediaRecorderCreated: {
                actions: ['assignMediaRecorder'],
              },
              pause: {
                target: 'paused',
                actions: sendUtil('pause', { to: 'mediaRecorder' }),
              },
              stop: 'stopping',
            },
          },
          paused: {
            on: {
              resume: {
                target: 'playing',
                actions: sendUtil('resume', { to: 'mediaRecorder' }),
              },
              stop: 'stopping',
            },
          },
          stopping: {
            entry: sendUtil('stop', { to: 'mediaRecorder' }),
            on: {
              chunks: { target: '#recorder.done', actions: 'assignAudioBlob' },
            },
          },
        },
      },
      done: {
        on: {
          restart: 'ready',
        },
      },
    },
  },
  {
    services: {
      getDevices: async () => {
        const devices = await navigator.mediaDevices.enumerateDevices()
        return devices.filter(({ kind }) => kind === 'audioinput')
      },
      mediaRecorder: context => (sendBack, receive) => {
        let mediaRecorder

        async function go() {
          const chunks = []
          const deviceId = context.selectedAudioDevice?.deviceId
          const audio = deviceId ? { deviceId: { exact: deviceId } } : true
          const mediaStream = await window.navigator.mediaDevices.getUserMedia({
            audio,
          })
          mediaRecorder = new MediaRecorder(mediaStream)
          sendBack({ type: 'mediaRecorderCreated', mediaRecorder })

          mediaRecorder.ondataavailable = event => {
            chunks.push(event.data)
            if (mediaRecorder.state === 'inactive') {
              sendBack({
                type: 'chunks',
                blob: new Blob(chunks, {
                  type: 'audio/mp3',
                }),
              })
            }
          }

          mediaRecorder.start()

          receive(event => {
            if (event.type === 'pause') {
              mediaRecorder.pause()
            } else if (event.type === 'resume') {
              mediaRecorder.resume()
            } else if (event.type === 'stop') {
              mediaRecorder.stop()
            }
          })
        }

        void go()

        return () => {
          stopMediaRecorder(mediaRecorder)
        }
      },
    },
    actions: {
      assignAudioDevices: assign({
        audioDevices: (context, event) => event.data,
      }),
      assignSelectedAudioDevice: assign({
        selectedAudioDevice: (context, event) => event.selectedAudioDevice,
      }),
      assignMediaRecorder: assign({
        mediaRecorder: (context, event) => event.mediaRecorder,
      }),
      assignAudioBlob: assign({
        audioBlob: (context, event) => event.blob,
        track: null,
      }),
      assignTrack: assign({
        audioBlob: null,
        track: (context, event) => event.track,
      }),
      cleanSlate: assign({
        audioBlob: null,
        track: null,
      }),
    },
  }
)

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

function CallRecorder({ onRecordingComplete }) {
  const [state, send] = useMachine(recorderMachine, {})
  const [recordings, setRecordings] = usePersistentState('recordings', {
    recordings: [],
  })
  const metadataRef = React.useRef([])
  const playbackRef = React.useRef(null)
  const { audioBlob, track } = state.context

  const audioURL = React.useMemo(() => {
    if (audioBlob) {
      return window.URL.createObjectURL(audioBlob)
    } else if (track && track.audioBlob) {
      return track.audioBlob
    } else {
      return null
    }
  }, [audioBlob, track])

  const onComplete = () => {
    let metadata = metadataRef.current
    if (onRecordingComplete)
      onRecordingComplete({ audioBlob, metadata: metadataRef.current })
    metadataRef.current = []
    if (window.confirm('Save recording?')) {
      // eslint-disable-next-line
      ;(async function() {
        // Convert audio to base64 and save it.
        const reader = new FileReader()
        reader.onload = function(e) {
          const audioSafe = e.target.result
          // playbackURLRef.current = srcUrl
          setRecordings({
            recordings: [
              ...recordings.recordings,
              {
                // TODO:: Record theming so can have different viz.
                audioBlob: audioSafe,
                metadata,
                timestamp: new Date().toUTCString(),
              },
            ],
          })
        }
        reader.readAsDataURL(audioBlob)
        send({ type: 'restart' })
      })()
    }
  }

  const onRestart = () => {
    metadataRef.current = []
    send({ type: 'restart' })
  }

  const onStop = () => {
    send({ type: 'stop' })
  }

  let deviceSelection = null
  if (state.matches('gettingDevices')) {
    deviceSelection = <div>Loading devices</div>
  }

  if (state.matches('selecting')) {
    deviceSelection = (
      <div>
        Select your device:
        <ul>
          {state.context.audioDevices.length
            ? state.context.audioDevices.map(device => (
                <li key={device.deviceId}>
                  <button
                    onClick={() => {
                      send({
                        type: 'selection',
                        selectedAudioDevice: device,
                      })
                    }}
                    style={{
                      fontWeight:
                        state.context.selectedAudioDevice === device
                          ? 'bold'
                          : 'normal',
                    }}>
                    {device.label}
                  </button>
                </li>
              ))
            : 'No audio devices found'}
        </ul>
      </div>
    )
  }

  let audioPreview = null
  if (state.matches('done')) {
    assertNonNull(
      audioURL,
      `The state machine is in "stopped" state but there's no audioURL. This should be impossible.`
    )
    assertNonNull(
      audioBlob,
      `The state machine is in "stopped" state but there's no audioBlob. This should be impossible.`
    )
    audioPreview = (
      <div>
        <audio src={audioURL} controls ref={playbackRef} />
        <button onClick={onComplete}>Accept</button>
        <button onClick={onRestart}>Re-record</button>
      </div>
    )
  }

  if (state.matches('playback')) {
    audioPreview = <audio src={audioURL} controls ref={playbackRef} />
  }

  return (
    <div>
      {state.matches('ready') ? (
        <button
          className="bg-blue-800 text-white font-bold p-4 rounded-md"
          onClick={() => send({ type: 'changeDevice' })}>
          Change audio device from{' '}
          {state.context.selectedAudioDevice?.label ?? 'default'}
        </button>
      ) : null}
      {deviceSelection}
      {state.matches('ready') ? (
        <button
          className="bg-blue-800 text-white font-bold p-4 rounded-md"
          onClick={() => send({ type: 'start' })}>
          Start
        </button>
      ) : null}
      {state.matches('ready') && recordings.recordings.length > 0 ? (
        <React.Fragment>
          <h2>Recordings</h2>
          <ul>
            {recordings.recordings.map(recording => (
              <li key={recording.timestamp}>
                <button
                  onClick={() =>
                    send({
                      type: 'track',
                      track: recording,
                    })
                  }>
                  {recording.timestamp}
                </button>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ) : null}
      {state.matches('playback') && state.context.track ? (
        <React.Fragment>
          <h2>Play Track</h2>
          {audioPreview}
          <StreamVis
            replay
            playback={playbackRef}
            metadata={state.context.track.metadata}
          />
          <span>{state.context.track.timestamp}</span>
          <button onClick={() => send({ type: 'restart' })}>Back</button>
        </React.Fragment>
      ) : null}
      {state.matches('recording') && state.context.mediaRecorder ? (
        <StreamVis
          metadata={metadataRef}
          stream={state.context.mediaRecorder.stream}
          paused={state.matches('recording.paused')}
        />
      ) : null}
      {state.matches('recording.playing') ? (
        <>
          <button onClick={onStop}>Stop</button>
          <button onClick={() => send({ type: 'pause' })}>Pause</button>
        </>
      ) : state.matches('recording.paused') ? (
        <>
          <button onClick={onStop}>Stop</button>
          <button onClick={() => send({ type: 'resume' })}>Resume</button>
        </>
      ) : state.matches('recording.stopping') ? (
        <div>Processing...</div>
      ) : null}
      {state.matches('done') && (
        <React.Fragment>
          {audioPreview}
          <StreamVis
            replay
            playback={playbackRef}
            metadata={metadataRef.current}
          />
        </React.Fragment>
      )}
    </div>
  )
}

function redraw({ canvas, nodes }) {
  const canvasCtx = canvas.getContext('2d')
  let fillStyle = 'red'
  if (canvasCtx) {
    fillStyle = canvasCtx.createLinearGradient(
      canvas.width / 2,
      0,
      canvas.width / 2,
      canvas.height
    )
    // Color stop is three colors
    fillStyle.addColorStop(0, COLOR_THREE)
    fillStyle.addColorStop(1, COLOR_THREE)
    fillStyle.addColorStop(0.25, COLOR_TWO)
    fillStyle.addColorStop(0.75, COLOR_TWO)
    fillStyle.addColorStop(0.5, COLOR_ONE)
  }

  // TODO:: Turn off the ticker when we pause/play?? Requires keeping a ref of the draw function
  function draw() {
    if (!canvasCtx) return
    const WIDTH = canvas.width
    const HEIGHT = canvas.height
    canvasCtx.fillStyle = fillStyle
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)
    for (let n = 0; n < nodes.current.length; n++) {
      // const barHeight = nodes[n] % 2 === 0 ? nodes[n] : nodes[n] - 1;
      canvasCtx.fillRect(
        nodes.current[n].x,
        HEIGHT / 2 - Math.max(MIN_BAR_HEIGHT, nodes.current[n].size) / 2,
        BAR_WIDTH,
        Math.max(MIN_BAR_HEIGHT, nodes.current[n].size)
      )
    }
  }

  return draw
}

function visualize({ canvas, stream, nodes, metaTrack, animation, start }) {
  const audioCtx = new AudioContext()
  const canvasCtx = canvas.getContext('2d')
  let analyser
  let bufferLength
  let source
  let add
  let dataArray
  let fillStyle = 'hsl(210, 80%, 50%)'
  let padCount = nodes.current.length

  // Set the time on the animation
  animation.time(start)

  function draw() {
    if (!canvasCtx) return
    const WIDTH = canvas.width
    const HEIGHT = canvas.height

    analyser.getByteTimeDomainData(dataArray)

    canvasCtx.fillStyle = fillStyle
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

    if (add) {
      add = false
      let avg = 0
      let min = 0
      for (let i = 0; i < bufferLength; i++) {
        if (!min || dataArray[i] < min) min = dataArray[i]
        avg += dataArray[i]
      }
      // Final size is the mapping of the size against the uInt8 bounds.
      const SIZE = Math.floor(
        gsap.utils.mapRange(
          0,
          MAX_BAR_HEIGHT,
          0,
          HEIGHT,
          Math.max(avg / bufferLength - min, MIN_BAR_HEIGHT)
        )
      )
      // Each time around create a new Node with the new size and tween it's size. THen render all the ndoes.
      // let newNode

      /**
       * Tricky part here is that we need a metadata track as well as an animation
       * object track. One that only cares about sizing and one that cares about
       * animation.
       */

      const newNode = {
        growth: SIZE,
        size: 0,
        x: WIDTH,
      }
      // Track the metadata by making a big Array of the sizes.
      if (metaTrack) metaTrack.current = [...metaTrack.current, SIZE]
      nodes.current = [...nodes.current, newNode]

      const STEP = SHIFT_DELAY
      // const INS = animation.time()
      const INS = start + (nodes.current.length - padCount - 1) * STEP
      animation.add(
        gsap
          .timeline()
          .to(newNode, {
            size: newNode.growth,
            delay: GROW_DELAY,
            duration: GROW_SPEED,
          })
          .to(
            newNode,
            {
              delay: STEP,
              // x: -BAR_WIDTH,
              // Using -WIDTH should allow us to prefill the canvas if needed.
              x: `-=${WIDTH + BAR_WIDTH}`,
              duration: WIDTH / SHIFT_PER_SECOND,
              ease: 'none',
              onStart: () => {
                // This allows us to create gaps in between the bars by skipping frames.
                // console.info("starting");
                add = true
              },
            },
            0
          ),
        // Add the tween at the current time in the timeline
        INS
      )
      // console.info(animations);
    }
    for (let n = 0; n < nodes.current.length; n++) {
      canvasCtx.fillStyle = fillStyle
      // const barHeight = nodes[n] % 2 === 0 ? nodes[n] : nodes[n] - 1;
      canvasCtx.fillRect(
        nodes.current[n].x,
        HEIGHT / 2 - Math.max(MIN_BAR_HEIGHT, nodes.current[n].size) / 2,
        BAR_WIDTH,
        Math.max(MIN_BAR_HEIGHT, nodes.current[n].size)
      )
    }
  }

  if (canvasCtx) {
    fillStyle = canvasCtx.createLinearGradient(
      canvas.width / 2,
      0,
      canvas.width / 2,
      canvas.height
    )
    // Color stop is three colors
    fillStyle.addColorStop(0, COLOR_THREE)
    fillStyle.addColorStop(1, COLOR_THREE)
    fillStyle.addColorStop(0.25, COLOR_TWO)
    fillStyle.addColorStop(0.75, COLOR_TWO)
    fillStyle.addColorStop(0.5, COLOR_ONE)
  }

  if (stream) {
    add = true
    source = audioCtx.createMediaStreamSource(stream)

    analyser = audioCtx.createAnalyser()
    analyser.fftSize = 2048
    bufferLength = analyser.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)

    source.connect(analyser)

    return draw
  }
}

const padTimeline = (canvas, nodes, animation, startPoint) => {
  const padCount = Math.floor(canvas.current.width / BAR_WIDTH)

  for (let p = 0; p < padCount; p++) {
    const newNode = {
      growth: MIN_BAR_HEIGHT,
      size: 0,
      x: canvas.current.width,
    }

    nodes.current.push(newNode)

    const INSERT = SHIFT_DELAY * p

    animation.current.add(
      gsap
        .timeline()
        .to(newNode, {
          size: newNode.growth,
          delay: GROW_DELAY,
          duration: GROW_SPEED,
        })
        .to(
          newNode,
          {
            delay: SHIFT_DELAY,
            x: `-=${canvas.current.width + BAR_WIDTH}`,
            duration: canvas.current.width / SHIFT_PER_SECOND,
            ease: 'none',
          },
          0
        ),
      // Add the tween at the current time in the timeline
      INSERT
    )
  }

  startPoint.current =
    animation.current.totalDuration() - canvas.current.width / SHIFT_PER_SECOND
}

const StreamVis = ({
  stream,
  paused,
  playback,
  complete,
  replay,
  theme,
  metadata,
}) => {
  const canvasRef = React.useRef(null)
  const nodesRef = React.useRef([])
  let startRef = React.useRef(null)
  /**
   * This is a GSAP timeline that either gets used by the recorder
   * or prefilled with the metadata
   */
  const animRef = React.useRef(gsap.timeline())
  /**
   * Effect handles playback of the GSAP timeline in sync
   * with audio playback controls. Pass an audio tag ref.
   */
  React.useEffect(() => {
    let playbackControl

    const updateTime = () => {
      animRef.current.time(startRef.current + playbackControl.currentTime)
      if (playbackControl.paused) {
        animRef.current.pause()
      } else {
        animRef.current.play()
      }
    }
    if (playback && playback.current) {
      playbackControl = playback.current
      playbackControl.addEventListener('play', updateTime)
      playbackControl.addEventListener('pause', updateTime)
      playbackControl.addEventListener('seeking', updateTime)
    }
    return () => {
      if (playbackControl) {
        playbackControl.removeEventListener('play', updateTime)
        playbackControl.removeEventListener('pause', updateTime)
        playbackControl.removeEventListener('seeking', updateTime)
      }
    }
  }, [playback])

  /**
   * Set the canvas to the correct size
   */
  React.useEffect(() => {
    if (canvasRef.current) {
      // Set the correct canvas dimensions
      canvasRef.current.width = canvasRef.current.offsetWidth
      canvasRef.current.height = canvasRef.current.offsetHeight
    }
  }, [])

  /**
   * Respond to media recording being paused.
   */
  React.useEffect(() => {
    if (paused && animRef.current) {
      animRef.current.pause()
    } else {
      animRef.current.play()
    }
  }, [paused])

  /**
   * If the visualisation is a replay, it needs padding.
   */
  React.useEffect(() => {
    if (replay && metadata && canvasRef.current) {
      const STEP = SHIFT_DELAY

      nodesRef.current = []
      animRef.current = gsap.timeline({
        paused: true,
      })

      padTimeline(canvasRef, nodesRef, animRef, startRef)

      // For every item in the metadata Array, create a node and it's animation.
      metadata.forEach((growth, index) => {
        // Create a new node and timeline that gets added to the main timeline
        const newNode = {
          growth: growth,
          size: 0,
          x: canvasRef.current.width,
        }

        nodesRef.current.push(newNode)
        // Track the metadata by making a big Array of the sizes.
        const INSERT = startRef.current + STEP * index
        // const INSERT = STEP * index

        animRef.current.add(
          gsap
            .timeline()
            .to(newNode, {
              size: newNode.growth,
              delay: GROW_DELAY,
              duration: GROW_SPEED,
            })
            .to(
              newNode,
              {
                delay: STEP,
                // x: -BAR_WIDTH,
                // Using -WIDTH should allow us to prefill the canvas if needed.
                x: `-=${canvasRef.current.width + BAR_WIDTH}`,
                duration: canvasRef.current.width / SHIFT_PER_SECOND,
                ease: 'none',
              },
              0
            ),
          // Add the tween at the current time in the timeline
          INSERT
        )
      })
      // This sets the animation timeline forwards to the end of padding.
      animRef.current.time(startRef.current)
    }
  }, [replay, metadata])

  React.useEffect(() => {
    let draw
    // Only start the ticker if it isn't a replay
    if (canvasRef.current && stream && !replay) {
      // Don't need to pass in paused as we can only trigger
      // new tweens once the previous has completed/removed.
      animRef.current = gsap.timeline()
      // TODO:: Need to pad out the start of the timeline and set the start point.

      padTimeline(canvasRef, nodesRef, animRef, startRef)

      draw = visualize({
        canvas: canvasRef.current,
        stream,
        nodes: nodesRef,
        metaTrack: metadata,
        animation: animRef.current,
        start: startRef.current,
      })
      gsap.ticker.add(draw)
    } else if (replay && canvasRef.current) {
      draw = redraw({
        canvas: canvasRef.current,
        nodes: nodesRef,
      })
      gsap.ticker.add(draw)
    }
    return () => {
      if (animRef.current) animRef.current.pause(0)
      gsap.ticker.remove(draw)
    }
  }, [stream, replay, metadata])

  return <canvas ref={canvasRef} />
}

StreamVis.defaultProps = {
  metadata: {
    current: [],
  },
  theme: {
    minBarHeight: MIN_BAR_HEIGHT,
    maxBarHeight: MAX_BAR_HEIGHT,
    shiftSpeed: SHIFT_SPEED,
    shiftDelay: SHIFT_DELAY,
    growSpeed: GROW_SPEED,
    growDelay: GROW_DELAY,
    barWidth: BAR_WIDTH,
    fill: {
      colors: [COLOR_ONE, COLOR_TWO, COLOR_THREE],
    },
  },
}

StreamVis.propTypes = {
  stream: T.any,
  paused: T.bool,
  playback: T.any,
  complete: T.bool,
  replay: T.bool,
  metadata: T.any,
  theme: T.any,
}

ReactDOM.render(
  /* eslint-disable-next-line */
  <CallRecorder onRecordingComplete={console.info} />,
  document.getElementById('root')
)
