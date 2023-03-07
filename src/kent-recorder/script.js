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

function convertURIToBinary(dataURI) {
  let BASE64_MARKER = ';base64,';
  let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  let base64 = dataURI.substring(base64Index);
  let raw = window.atob(base64);
  let rawLength = raw.length;
  let arr = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    arr[i] = raw.charCodeAt(i);
  }
  let blob = new Blob([arr], {
    type: 'audio/mp3'
  });
  let blobUrl = URL.createObjectURL(blob);
  return blobUrl
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
      console.info(audioBlob, 'BLOBBY')
      return window.URL.createObjectURL(audioBlob)
    } else if (track && track.audioBlob) {
      console.info(track.audioBlob, convertURIToBinary(track.audioBlob), 'TRACKY')
      return convertURIToBinary(track.audioBlob)
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
        <audio src={audioURL} controls ref={playbackRef} preload="auto" autobuffer="true" />
        <button onClick={onComplete}>Accept</button>
        <button onClick={onRestart}>Re-record</button>
      </div>
    )
  }

  if (state.matches('playback')) {
    audioPreview = <audio src={audioURL} controls ref={playbackRef} preload="auto" autobuffer="true" />
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

const generateGradient = ({ width, height, context, fill }) => {
  const fillStyle = context.createLinearGradient(
    width / 2,
    0,
    width / 2,
    height
  )
  // Color stop is three colors
  fillStyle.addColorStop(0, fill.colors[2])
  fillStyle.addColorStop(1, fill.colors[2])
  fillStyle.addColorStop(0.35, fill.colors[1])
  fillStyle.addColorStop(0.65, fill.colors[1])
  fillStyle.addColorStop(0.5, fill.colors[0])
  return fillStyle
}

function redraw({ canvas, nodes, theme }) {
  const { minBarHeight, barWidth } = theme

  const canvasCtx = canvas.getContext('2d')

  function draw() {
    if (!canvasCtx) return
    const WIDTH = canvas.width
    const HEIGHT = canvas.height

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)
    for (let n = 0; n < nodes.current.length; n++) {
      canvasCtx.fillRect(
        nodes.current[n].x,
        HEIGHT / 2 - Math.max(minBarHeight, nodes.current[n].size) / 2,
        barWidth,
        Math.max(minBarHeight, nodes.current[n].size)
      )
    }
  }

  return draw
}

/**
 * 1. Create a node object
 * 2. Push it to an Array
 * 3. Create an insertion point
 * 4. Add to a timeline
 */

const addToTimeline = ({
  timeline,
  width,
  nodes,
  onStart,
  size,
  insert,
  theme,
}) => {
  const { shiftDelay, barWidth, growDelay, growSpeed, shiftPerSecond } = theme

  // Generate new node
  const newNode = {
    growth: size,
    size: 0,
    x: width,
  }

  // Add it in
  nodes.push(newNode)

  timeline.add(
    gsap
      .timeline()
      .to(newNode, {
        size: newNode.growth,
        delay: growDelay,
        duration: growSpeed,
      })
      .to(
        newNode,
        {
          delay: shiftDelay,
          x: `-=${width + barWidth}`,
          duration: width / shiftPerSecond,
          ease: 'none',
          onStart,
        },
        0
      ),
    insert
  )
}

function visualize({
  canvas,
  stream,
  nodes,
  metaTrack,
  animation,
  start,
  theme,
}) {
  const { minBarHeight, maxBarHeight, shiftDelay, barWidth } = theme

  const audioCtx = new AudioContext()
  const canvasCtx = canvas.getContext('2d')
  let analyser
  let bufferLength
  let source
  let add
  let dataArray
  let padCount = nodes.current.length

  // Set the time on the animation
  animation.time(start)

  // Reusable draw function
  function draw() {
    if (!canvasCtx) return
    const WIDTH = canvas.width
    const HEIGHT = canvas.height

    analyser.getByteTimeDomainData(dataArray)

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

    if (add) {
      add = false
      let avg = 0
      let min = 0
      // TODO:: For perf could you hit this in blocks like
      // dataArray.length / 70 * i and only hit it like 10 times instead of however many.
      for (let i = 0; i < bufferLength; i++) {
        if (!min || dataArray[i] < min) min = dataArray[i]
        avg += dataArray[i]
      }
      // Final size is the mapping of the size against the uInt8 bounds.
      const SIZE = Math.floor(
        gsap.utils.mapRange(
          0,
          maxBarHeight,
          0,
          HEIGHT,
          Math.max(avg / bufferLength - min, minBarHeight)
        )
      )
      /**
       * Tricky part here is that we need a metadata track as well as an animation
       * object track. One that only cares about sizing and one that cares about
       * animation.
       */
      addToTimeline({
        size: SIZE,
        width: WIDTH,
        nodes: nodes.current,
        timeline: animation,
        insert: start + (nodes.current.length - padCount) * shiftDelay,
        onStart: () => (add = true),
        theme,
      })

      // Track the metadata by making a big Array of the sizes.
      if (metaTrack) metaTrack.current = [...metaTrack.current, SIZE]
    }
    for (let n = 0; n < nodes.current.length; n++) {
      canvasCtx.fillRect(
        nodes.current[n].x,
        HEIGHT / 2 - Math.max(minBarHeight, nodes.current[n].size) / 2,
        barWidth,
        Math.max(minBarHeight, nodes.current[n].size)
      )
    }
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

const padTimeline = ({ canvas, nodes, animation, startPoint, theme }) => {
  const { minBarHeight, shiftPerSecond, shiftDelay, barWidth } = theme

  const padCount = Math.floor(canvas.current.width / barWidth)

  for (let p = 0; p < padCount; p++) {
    addToTimeline({
      size: minBarHeight,
      width: canvas.current.width,
      nodes: nodes.current,
      timeline: animation.current,
      insert: shiftDelay * p,
      onStart: () => {},
      theme,
    })
  }

  startPoint.current =
    animation.current.totalDuration() - canvas.current.width / shiftPerSecond
}

const StreamVis = (props) => {
  const { stream, paused, playback, replay, theme, metadata } = props
  const canvasRef = React.useRef(null)
  const nodesRef = React.useRef([])
  const startRef = React.useRef(null)
  const drawRef = React.useRef(null)


  /**
   * This is a GSAP timeline that either gets used by the recorder
   * or prefilled with the metadata
   */
  const animRef = React.useRef()

  // Destructure the theme
  const { shiftDelay } = theme
  /**
   * Effect handles playback of the GSAP timeline in sync
   * with audio playback controls. Pass an audio tag ref.
   */
  React.useEffect(() => {
    let playbackControl

    const updateTime = () => {
      animRef.current.time(startRef.current + playbackControl.currentTime)
      if (playbackControl.seeking) {
        animRef.current.play()
        // if (drawRef.current) gsap.ticker.add(drawRef.current)
      } else if (playbackControl.paused) {
        animRef.current.pause()
        // if (drawRef.current) gsap.ticker.remove(drawRef.current)
      } else {
        animRef.current.play()
        // if (drawRef.current) gsap.ticker.add(drawRef.current)
      }
    }
    if (playback && playback.current) {
      playbackControl = playback.current
      playbackControl.addEventListener('play', updateTime)
      playbackControl.addEventListener('pause', updateTime)
      playbackControl.addEventListener('seeking', updateTime)
      playbackControl.addEventListener('seeked', updateTime)
    }
    return () => {
      if (playbackControl) {
        playbackControl.removeEventListener('play', updateTime)
        playbackControl.removeEventListener('pause', updateTime)
        playbackControl.removeEventListener('seeking', updateTime)
        playbackControl.removeEventListener('seeked', updateTime)
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

      // Apply the fillStyle to the canvas
      const canvasCtx = canvasRef.current.getContext('2d')
      let fillStyle = theme.fill.colors[0]
      if (canvasCtx)
        fillStyle = generateGradient({
          width: canvasRef.current.width,
          height: canvasRef.current.height,
          context: canvasCtx,
          fill: theme.fill,
        })
      canvasCtx.fillStyle = fillStyle
    }
  }, [])

  /**
   * Respond to media recording being paused.
   */
  React.useEffect(() => {
    if (paused && animRef.current) {
      animRef.current.pause()
      // if (drawRef.current) gsap.ticker.remove(drawRef.current)
    } else if (animRef.current) {
      animRef.current.play()
      // if (drawRef.current) gsap.ticker.add(drawRef.current)
    }
  }, [paused])

  React.useEffect(() => {
    // pad the start of the timeline to fill out the width
    animRef.current = gsap.timeline({ paused: replay && metadata })
    padTimeline({
      canvas: canvasRef,
      nodes: nodesRef,
      animation: animRef,
      startPoint: startRef,
      theme,
    })
  }, [])

  /**
   * If the visualisation is a replay, it needs padding.
   * Need to generate the nodes from metadata and the animation.
   */
  React.useEffect(() => {
    if (replay && metadata && canvasRef.current) {

      // For every item in the metadata Array, create a node and it's animation.
      metadata.forEach((growth, index) => {
        addToTimeline({
          size: growth,
          width: canvasRef.current.width,
          nodes: nodesRef.current,
          timeline: animRef.current,
          insert: startRef.current + shiftDelay * index,
          onStart: () => {},
          theme,
        })
      })
      // This sets the animation timeline forwards to the end of padding.
      animRef.current.time(startRef.current)
    }
  }, [replay, metadata])

  React.useEffect(() => {
    // Only start the ticker if it isn't a replay
    if (canvasRef.current && stream && !replay) {
      // Generate visualisation function for streaming
      drawRef.current = visualize({
        canvas: canvasRef.current,
        stream,
        nodes: nodesRef,
        metaTrack: metadata,
        animation: animRef.current,
        start: startRef.current,
        theme,
      })
    } else if (replay && canvasRef.current) {
      drawRef.current = redraw({
        canvas: canvasRef.current,
        nodes: nodesRef,
        theme,
      })
    }

    // Add draw to the ticker – Don't worry about replay because that's
    // controlled by the playback controls.
    // if (canvasRef.current && stream) gsap.ticker.add(drawRef.current)
    gsap.ticker.add(drawRef.current)

    return () => {
      if (animRef.current) animRef.current.pause(0)
      gsap.ticker.remove(drawRef.current)
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
    shiftPerSecond: SHIFT_PER_SECOND,
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
