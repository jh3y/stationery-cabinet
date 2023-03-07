import ReactDOM from "react-dom";
import * as React from "react";
import gsap from "gsap";
import { createMachine, assign, send as sendUtil } from "xstate";
import { useMachine } from "@xstate/react";
import { inspect } from "@xstate/inspect";
import "./styles.css";

// Play around with these values to affect the audio visualisation.
// Should be able to stream the visualisation back no problem.
const MIN_BAR_HEIGHT = 4;
const MAX_BAR_HEIGHT = 255;
const SHIFT_SPEED = 8;
const SHIFT_DELAY = 0.05;
const GROW_SPEED = 0.5;
const GROW_DELAY = 0.075;
const BAR_WIDTH = 4;
const COLOR_ONE = "hsl(185, 73%, 90%)";
const COLOR_TWO = "hsl(206, 47%, 50%)";
const COLOR_THREE = "hsl(205, 42%, 31%)";

function assertNonNull<PossibleNullType>(
  possibleNull: PossibleNullType,
  errorMessage: string
): asserts possibleNull is Exclude<PossibleNullType, null> {
  if (possibleNull === null) throw new Error(errorMessage);
}

const devTools = false;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (devTools && typeof window !== "undefined") {
  inspect({ iframe: false });
}

function stopMediaRecorder(mediaRecorder: MediaRecorder) {
  if (mediaRecorder.state !== "inactive") mediaRecorder.stop();

  for (const track of mediaRecorder.stream.getAudioTracks()) {
    if (track.enabled) track.stop();
  }
  mediaRecorder.ondataavailable = null;
}

interface RecorderContext {
  mediaRecorder: MediaRecorder | null;
  audioDevices: Array<MediaDeviceInfo>;
  selectedAudioDevice: MediaDeviceInfo | null;
  audioBlob: Blob | null;
}

const recorderMachine = createMachine<RecorderContext>(
  {
    id: "recorder",
    context: {
      mediaRecorder: null,
      audioDevices: [],
      selectedAudioDevice: null,
      audioBlob: null
    },
    initial: "gettingDevices",
    states: {
      gettingDevices: {
        invoke: {
          src: "getDevices",
          onDone: { target: "ready", actions: "assignAudioDevices" },
          onError: "" // TODO
        }
      },
      selecting: {
        on: {
          selection: { target: "ready", actions: "assignSelectedAudioDevice" }
        }
      },
      ready: {
        on: {
          changeDevice: "selecting",
          start: "recording"
        }
      },
      recording: {
        invoke: { src: "mediaRecorder" },
        initial: "playing",
        states: {
          playing: {
            on: {
              mediaRecorderCreated: {
                actions: ["assignMediaRecorder"]
              },
              pause: {
                target: "paused",
                actions: sendUtil("pause", { to: "mediaRecorder" })
              },
              stop: "stopping"
            }
          },
          paused: {
            on: {
              resume: {
                target: "playing",
                actions: sendUtil("resume", { to: "mediaRecorder" })
              },
              stop: "stopping"
            }
          },
          stopping: {
            entry: sendUtil("stop", { to: "mediaRecorder" }),
            on: {
              chunks: { target: "#recorder.done", actions: "assignAudioBlob" }
            }
          }
        }
      },
      done: {
        on: {
          restart: "ready"
        }
      }
    }
  },
  {
    services: {
      getDevices: async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(({ kind }) => kind === "audioinput");
      },
      mediaRecorder: (context) => (sendBack, receive) => {
        let mediaRecorder: MediaRecorder;

        async function go() {
          const chunks: Array<BlobPart> = [];
          const deviceId = context.selectedAudioDevice?.deviceId;
          const audio = deviceId ? { deviceId: { exact: deviceId } } : true;
          const mediaStream = await window.navigator.mediaDevices.getUserMedia({
            audio
          });
          mediaRecorder = new MediaRecorder(mediaStream);
          sendBack({ type: "mediaRecorderCreated", mediaRecorder });

          mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data);
            if (mediaRecorder.state === "inactive") {
              sendBack({
                type: "chunks",
                blob: new Blob(chunks, {
                  type: "audio/mp3"
                })
              });
            }
          };

          mediaRecorder.start();

          receive((event) => {
            if (event.type === "pause") {
              mediaRecorder.pause();
            } else if (event.type === "resume") {
              mediaRecorder.resume();
            } else if (event.type === "stop") {
              mediaRecorder.stop();
            }
          });
        }

        void go();

        return () => {
          stopMediaRecorder(mediaRecorder);
        };
      }
    },
    actions: {
      assignAudioDevices: assign({
        audioDevices: (context, event) => event.data
      }),
      assignSelectedAudioDevice: assign({
        selectedAudioDevice: (context, event) => event.selectedAudioDevice
      }),
      assignMediaRecorder: assign({
        mediaRecorder: (context, event) => event.mediaRecorder
      }),
      assignAudioBlob: assign({
        audioBlob: (context, event) => event.blob
      })
    }
  }
);

function CallRecorder({
  onRecordingComplete
}: {
  onRecordingComplete: (audio: Blob) => void;
}) {
  const [state, send] = useMachine(recorderMachine, { devTools });
  const playbackRef = React.useRef(null);
  const { audioBlob } = state.context;

  const audioURL = React.useMemo(() => {
    if (audioBlob) {
      return window.URL.createObjectURL(audioBlob);
    } else {
      return null;
    }
  }, [audioBlob]);

  let deviceSelection = null;
  if (state.matches("gettingDevices")) {
    deviceSelection = <div>Loading devices</div>;
  }

  if (state.matches("selecting")) {
    deviceSelection = (
      <div>
        Select your device:
        <ul>
          {state.context.audioDevices.length
            ? state.context.audioDevices.map((device) => (
                <li key={device.deviceId}>
                  <button
                    onClick={() => {
                      send({
                        type: "selection",
                        selectedAudioDevice: device
                      });
                    }}
                    style={{
                      fontWeight:
                        state.context.selectedAudioDevice === device
                          ? "bold"
                          : "normal"
                    }}
                  >
                    {device.label}
                  </button>
                </li>
              ))
            : "No audio devices found"}
        </ul>
      </div>
    );
  }

  let audioPreview = null;
  if (state.matches("done")) {
    assertNonNull(
      audioURL,
      `The state machine is in "stopped" state but there's no audioURL. This should be impossible.`
    );
    assertNonNull(
      audioBlob,
      `The state machine is in "stopped" state but there's no audioBlob. This should be impossible.`
    );
    audioPreview = (
      <div>
        <audio src={audioURL} preload="auto" controls ref={playbackRef} />
        {/* <StreamVis
          recording={audioBlob}
          playback={playbackRef}
          paused={state.matches("recording.paused")}
        /> */}
        <button onClick={() => onRecordingComplete(audioBlob)}>Accept</button>
        <button onClick={() => send({ type: "restart" })}>Re-record</button>
      </div>
    );
  }

  return (
    <div>
      {state.matches("ready") ? (
        <button onClick={() => send({ type: "changeDevice" })}>
          Change audio device from{" "}
          {state.context.selectedAudioDevice?.label ?? "default"}
        </button>
      ) : null}
      {deviceSelection}
      {state.matches("ready") ? (
        <button onClick={() => send({ type: "start" })}>Start</button>
      ) : null}
      {(state.matches("recording") && state.context.mediaRecorder) ||
      state.matches("done") ? (
        <StreamVis
          playback={playbackRef}
          stream={state.context.mediaRecorder.stream}
          complete={state.matches("done")}
          paused={state.matches("recording.paused")}
        />
      ) : null}
      {state.matches("recording.playing") ? (
        <>
          <button onClick={() => send({ type: "stop" })}>Stop</button>
          <button onClick={() => send({ type: "pause" })}>Pause</button>
        </>
      ) : state.matches("recording.paused") ? (
        <>
          <button onClick={() => send({ type: "stop" })}>Stop</button>
          <button onClick={() => send({ type: "resume" })}>Resume</button>
        </>
      ) : state.matches("recording.stopping") ? (
        <div>Processing...</div>
      ) : null}
      {audioPreview}
    </div>
  );
}

function visualize(
  canvas: HTMLCanvasElement,
  stream: MediaStream | null,
  nodes: any,
  animations: any,
  recording: any,
  audioContext: any
) {
  const audioCtx = new AudioContext();
  const canvasCtx = canvas.getContext("2d");
  let fillStyle: string | any = "hsl(210, 80%, 50%)";
  if (canvasCtx) {
    fillStyle = canvasCtx.createLinearGradient(
      canvas.width / 2,
      0,
      canvas.width / 2,
      canvas.height
    );
    // Color stop is three colors
    fillStyle.addColorStop(0, COLOR_THREE);
    fillStyle.addColorStop(1, COLOR_THREE);
    fillStyle.addColorStop(0.25, COLOR_TWO);
    fillStyle.addColorStop(0.75, COLOR_TWO);
    fillStyle.addColorStop(0.5, COLOR_ONE);
  }

  if (stream) {
    const source = audioCtx.createMediaStreamSource(stream);

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    let add = true;
    function draw() {
      // console.info(new Date().toUTCString());
      if (!canvasCtx) return;
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = fillStyle;
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      if (add) {
        add = false;
        let avg = 0;
        let min = 0;
        for (let i = 0; i < bufferLength; i++) {
          if (!min || dataArray[i] < min) min = dataArray[i];
          avg += dataArray[i];
        }
        // Final size is the mapping of the size against the uInt8 bounds.
        const SIZE = gsap.utils.mapRange(
          0,
          MAX_BAR_HEIGHT,
          0,
          HEIGHT,
          Math.max(avg / bufferLength - min, MIN_BAR_HEIGHT)
        );
        // Each time around create a new Node with the new size and tween it's size. THen render all the ndoes.
        let newNode: any;

        if (nodes.current.filter((node) => node.alive === false).length === 0) {
          newNode = {
            alive: true,
            growth: SIZE,
            size: 0,
            x: WIDTH
          };
        } else {
          // console.info("Recyling");
          newNode = nodes.current.filter((node) => node.alive === false)[0] = {
            alive: true,
            growth: SIZE,
            size: 0,
            x: WIDTH
          };
        }

        nodes.current = [...nodes.current, newNode];

        animations.add(
          gsap
            .timeline({
              onComplete: () => {
                // console.info("ending");
                newNode.alive = false;
              }
            })
            .to(newNode, {
              size: newNode.growth,
              delay: GROW_DELAY,
              duration: GROW_SPEED
            })
            .to(
              newNode,
              {
                delay: SHIFT_DELAY,
                // x: -BAR_WIDTH,
                // Using -WIDTH should allow us to prefill the canvas if needed.
                x: `-=${WIDTH + BAR_WIDTH}`,
                duration: SHIFT_SPEED,
                ease: "none",
                onStart: () => {
                  // This allows us to create gaps in between the bars by skipping frames.
                  // console.info("starting");
                  add = true;
                }
              },
              0
            ),
          // Add the tween at the current time in the timeline
          animations.time()
        );
        // console.info(animations);
      }
      for (let n = 0; n < nodes.current.length; n++) {
        canvasCtx.fillStyle = fillStyle;
        // const barHeight = nodes[n] % 2 === 0 ? nodes[n] : nodes[n] - 1;
        canvasCtx.fillRect(
          nodes.current[n].x,
          HEIGHT / 2 - Math.max(MIN_BAR_HEIGHT, nodes.current[n].size) / 2,
          BAR_WIDTH,
          Math.max(MIN_BAR_HEIGHT, nodes.current[n].size)
        );
      }
    }

    return draw;
  }
}

function StreamVis({
  stream,
  paused,
  playback,
  complete
}: {
  stream: MediaStream;
  paused: Boolean;
  playback: any;
  complete: Boolean;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const nodesRef = React.useRef<Array<any>>([]);
  const animRef = React.useRef<any>();

  React.useEffect(() => {
    let playbackControl: any;

    const updateTime = () => {
      animRef.current.time(playbackControl.currentTime);
      if (playbackControl.paused) {
        animRef.current.pause();
      } else {
        animRef.current.play();
      }
    };
    if (playback && playback.current && complete) {
      playbackControl = playback.current;
      playbackControl.addEventListener("play", updateTime);
      playbackControl.addEventListener("pause", updateTime);
      playbackControl.addEventListener("seeking", updateTime);
    }
    return () => {
      if (playbackControl) {
        playbackControl.removeEventListener("play", updateTime);
        playbackControl.removeEventListener("pause", updateTime);
        playbackControl.removeEventListener("seeking", updateTime);
      }
    };
  }, [playback, complete]);

  React.useEffect(() => {
    if (canvasRef.current) {
      // Set the correct canvas dimensions
      canvasRef.current.width = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;
    }
  }, [stream]);

  React.useEffect(() => {
    if (paused && animRef.current) {
      animRef.current.pause();
    } else if (complete && animRef.current) {
      animRef.current.pause(0);
    } else {
      animRef.current.play();
    }
  }, [paused, complete]);

  React.useEffect(() => {
    let replay: () => void | undefined;
    if (complete && animRef.current && nodesRef.current && canvasRef.current) {
      // Here is where we want to re-render the visualisation.
      // Start the ticker and run it.
      const canvasCtx = canvasRef.current.getContext("2d");
      let fillStyle: any = "red";
      let canvas = canvasRef.current;
      if (canvasCtx) {
        fillStyle = canvasCtx.createLinearGradient(
          canvas.width / 2,
          0,
          canvas.width / 2,
          canvas.height
        );
        // Color stop is three colors
        fillStyle.addColorStop(0, COLOR_THREE);
        fillStyle.addColorStop(1, COLOR_THREE);
        fillStyle.addColorStop(0.25, COLOR_TWO);
        fillStyle.addColorStop(0.75, COLOR_TWO);
        fillStyle.addColorStop(0.5, COLOR_ONE);
      }

      const replay = () => {
        // Actually working. Just need to link up the animation to the playback...
        if (!canvasCtx) return;
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        canvasCtx.fillStyle = fillStyle;
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        for (let n = 0; n < nodesRef.current.length; n++) {
          canvasCtx.fillStyle = fillStyle;
          // const barHeight = nodes[n] % 2 === 0 ? nodes[n] : nodes[n] - 1;
          canvasCtx.fillRect(
            nodesRef.current[n].x,
            HEIGHT / 2 - Math.max(MIN_BAR_HEIGHT, nodesRef.current[n].size) / 2,
            BAR_WIDTH,
            Math.max(MIN_BAR_HEIGHT, nodesRef.current[n].size)
          );
        }
      };
      gsap.ticker.add(replay);
    }
    return () => {
      gsap.ticker.remove(replay);
    };
  }, [complete]);

  React.useEffect(() => {
    let draw: () => void | undefined;
    if (canvasRef.current && stream && !complete) {
      // Don't need to pass in paused as we can only trigger
      // new tweens once the previous has completed/removed.
      console.info("new timeline!");
      animRef.current = gsap.timeline();
      draw = visualize(
        canvasRef.current,
        stream,
        nodesRef,
        animRef.current,
        null,
        null
      );
      // Needs to be 60FPS for smooth scale up.
      // gsap.ticker.fps(16);
      gsap.ticker.add(draw);
    }
    if (complete && draw) {
      gsap.ticker.remove(draw);
    }
    return () => {
      if (animRef.current) animRef.current.pause(0);
      gsap.ticker.remove(draw);
    };
  }, [stream, complete]);

  return <canvas ref={canvasRef} />;
}

ReactDOM.render(
  <CallRecorder
    onRecordingComplete={(...args) => console.log("complete", ...args)}
  />,
  document.getElementById("root")
);
