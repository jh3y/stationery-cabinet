import * as React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'
import gsap from 'https://cdn.skypack.dev/gsap'

const AUDIO_URL =
  'https://assets.codepen.io/605876/flex-vector-bord-ready-instrumental.mp3'
const MIN_BAR_HEIGHT = 4
const MAX_BAR_HEIGHT = 255
const SHIFT_SPEED = 8
const SHIFT_DELAY = 0.05
const GROW_SPEED = 0.5
const GROW_DELAY = 0.075
const BAR_WIDTH = 4
const COLOR_ONE = 'hsl(15, 73%, 50%)'
const COLOR_TWO = 'hsl(200, 60%, 50%)'
const COLOR_THREE = 'hsl(320, 60%, 50%)'

const visualise = async (canvas, buffer, nodes, animation) => {
  console.info('booting up')
  // let ended = false
  // Audio setup
  const audioCtx = new AudioContext()
  const bufferRef = await audioCtx.decodeAudioData(buffer)
  const source = audioCtx.createBufferSource()
  source.buffer = bufferRef
  const analyser = audioCtx.createAnalyser()
  analyser.fftSize = 2048
  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  source.connect(analyser)
  // source.addEventListener('ended', () => {
  //   // stop the source
  //   // ended = true
  // })
  source.start()
  // Rendering setup
  const ctx = canvas.getContext('2d')
  const { height, width } = canvas

  const fillStyle = ctx.createLinearGradient(
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
  ctx.fillStyle = fillStyle
  // Drawing loop
  // "add" is used to control the bars rendering
  let add = true
  return () => {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)
    analyser.getByteTimeDomainData(dataArray)
    if (add) {
      add = false

      let avg = 0
      let min = 0
      for (let i = 0; i < bufferLength; i++) {
        if (!min || dataArray[i] < min) min = dataArray[i]
        avg += dataArray[i]
      }
      // Final size is the mapping of the size against the uInt8 bounds.
      const SIZE = gsap.utils.mapRange(
        0,
        MAX_BAR_HEIGHT,
        0,
        height,
        Math.max(avg / bufferLength - min, MIN_BAR_HEIGHT)
      )

      // Once you have the size, then you can create the node.
      let newNode
      if (nodes.current.filter(node => node.alive === false).length === 0) {
        newNode = {
          alive: true,
          growth: SIZE,
          size: 0,
          x: width,
        }
      } else {
        newNode = nodes.current.filter(node => node.alive === false)[0] = {
          alive: true,
          growth: SIZE,
          size: 0,
          x: width,
        }
      }

      nodes.current = [...nodes.current, newNode]

      animation.add(
        gsap
          .timeline({
            onComplete: () => {
              // console.info("ending");
              newNode.alive = false
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
              x: `-=${width + BAR_WIDTH}`,
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
      ctx.fillStyle = fillStyle
      // const barHeight = nodes[n] % 2 === 0 ? nodes[n] : nodes[n] - 1;
      ctx.fillRect(
        nodes.current[n].x,
        height / 2 - Math.max(MIN_BAR_HEIGHT, nodes.current[n].size) / 2,
        BAR_WIDTH,
        Math.max(MIN_BAR_HEIGHT, nodes.current[n].size)
      )
    }
  }
}

const App = () => {
  const [loading, setLoading] = React.useState(true)
  const [buffer, setBuffer] = React.useState(null)
  const canvasRef = React.useRef(null)
  const playbackRef = React.useRef(null)
  const nodesRef = React.useRef([])
  const animRef = React.useRef(
    gsap.timeline({
      paused: true,
    })
  )

  React.useEffect(() => {
    // Process the audio
    console.info('grabbing audio')
    ;(async function() {
      const buffer = await (await fetch(AUDIO_URL)).arrayBuffer()
      setBuffer(buffer)
    })()
  }, [])

  React.useEffect(() => {
    let vis
    if (buffer) {
      setLoading(false)
      // Kick off the visualisation
      const grabVis = async () => {
        const vis = await visualise(
          canvasRef.current,
          buffer,
          nodesRef,
          animRef.current
        )
        gsap.ticker.add(vis)
      }
      grabVis()
    }
    if (canvasRef.current) {
      // Set the correct canvas dimensions
      canvasRef.current.width = canvasRef.current.offsetWidth
      canvasRef.current.height = canvasRef.current.offsetHeight
    }
    return () => {
      gsap.ticker.remove(vis)
    }
  }, [buffer])

  React.useEffect(() => {
    let playbackControl
    const updateTime = () => {
      // animRef.current.time(playbackControl.currentTime)
      if (playbackControl.paused) {
        animRef.current.pause(playbackControl.currentTime)
      } else {
        animRef.current.play()
      }
    }

    if (playbackRef.current && animRef.current) {
      playbackControl = playbackRef.current
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
  })

  return (
    <React.Fragment>
      {loading && <h2>Loading...</h2>}
      <canvas ref={canvasRef} />
      <audio ref={playbackRef} src={AUDIO_URL} preload controls />
    </React.Fragment>
  )
}

render(<App />, document.querySelector('#app'))
