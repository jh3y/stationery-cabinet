import gsap from 'https://cdn.skypack.dev/gsap'
import T from 'https://cdn.skypack.dev/prop-types'

const { XState, XStateReact, React, ReactDOM } = window

const { createMachine, assign, send: sendUtil } = XState
const { useMachine } = XStateReact

// Play around with these values to affect the audio visualisation.
// Should be able to stream the visualisation back no problem.
const MIN_BAR_HEIGHT = 4
const MAX_BAR_HEIGHT = 255
const SHIFT_SPEED = 8
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
        on: {
          changeDevice: 'selecting',
          start: 'recording',
        },
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
      }),
    },
  }
)

function CallRecorder({ onRecordingComplete }) {
  const [state, send] = useMachine(recorderMachine, {})
  const metadataRef = React.useRef([])
  const playbackRef = React.useRef(null)
  const { audioBlob } = state.context

  const audioURL = React.useMemo(() => {
    if (audioBlob) {
      return window.URL.createObjectURL(audioBlob)
    } else {
      return null
    }
  }, [audioBlob])

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
        <audio src={audioURL} preload="auto" controls ref={playbackRef} />
        {/* <StreamVis
          recording={audioBlob}
          playback={playbackRef}
          paused={state.matches("recording.paused")}
        /> */}
        <button onClick={() => onRecordingComplete(audioBlob)}>Accept</button>
        <button onClick={() => send({ type: 'restart' })}>Re-record</button>
      </div>
    )
  }

  // TODO:: Wipe out the metaTrack when we restart or accept the recording.
  // TODO:: Throw it into localStorage too so we can replay it from a list.
  console.info(metadataRef.current, 'META')

  return (
    <div>
      {state.matches('ready') ? (
        <button onClick={() => send({ type: 'changeDevice' })}>
          Change audio device from{' '}
          {state.context.selectedAudioDevice?.label ?? 'default'}
        </button>
      ) : null}
      {deviceSelection}
      {state.matches('ready') ? (
        <button onClick={() => send({ type: 'start' })}>Start</button>
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
          <button onClick={() => send({ type: 'stop' })}>Stop</button>
          <button onClick={() => send({ type: 'pause' })}>Pause</button>
        </>
      ) : state.matches('recording.paused') ? (
        <>
          <button onClick={() => send({ type: 'stop' })}>Stop</button>
          <button onClick={() => send({ type: 'resume' })}>Resume</button>
        </>
      ) : state.matches('recording.stopping') ? (
        <div>Processing...</div>
      ) : null}
      {state.matches('done') && (
        <StreamVis playback={playbackRef} replay={[]} />
      )}
      {audioPreview}
    </div>
  )
}

function visualize({ canvas, stream, nodes, metaTrack, animation }) {
  const audioCtx = new AudioContext()
  const canvasCtx = canvas.getContext('2d')
  let analyser
  let bufferLength
  let source
  let add
  let dataArray
  let fillStyle = 'hsl(210, 80%, 50%)'

  function draw() {
    // console.info(new Date().toUTCString());
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

      animation.add(
        gsap
          .timeline({
            onComplete: () => {
              // console.info("ending");
              // newNode.alive = false
            },
          })
          .to(newNode, {
            size: newNode.growth,
            delay: GROW_DELAY,
            duration: GROW_SPEED,
          })
          .to(
            newNode,
            {
              delay: SHIFT_DELAY,
              // x: -BAR_WIDTH,
              // Using -WIDTH should allow us to prefill the canvas if needed.
              x: `-=${WIDTH + BAR_WIDTH}`,
              duration: SHIFT_SPEED,
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
        animation.time()
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
      animRef.current.time(playbackControl.currentTime)
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
   * TODO::
   * and prefill the GSAP timeline to pad the start?
   */
  React.useEffect(() => {
    if (canvasRef.current) {
      // Set the correct canvas dimensions
      canvasRef.current.width = canvasRef.current.offsetWidth
      canvasRef.current.height = canvasRef.current.offsetHeight
    }
  }, [stream])

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
   * TODO:: If there is a replay. Just pad out the animation with it
   * and don't start the draw with the stream.
   */

  React.useEffect(() => {
    let draw
    console.info('running effect')
    // Only start the ticker if it isn't a replay
    if (canvasRef.current && stream && !replay) {
      // Don't need to pass in paused as we can only trigger
      // new tweens once the previous has completed/removed.
      animRef.current = gsap.timeline()
      draw = visualize({
        canvas: canvasRef.current,
        stream,
        nodes: nodesRef,
        metaTrack: metadata,
        animation: animRef.current,
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
