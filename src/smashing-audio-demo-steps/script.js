import gsap from 'https://cdn.skypack.dev/gsap'
import { GUI } from 'https://cdn.skypack.dev/dat.gui'

const TOGGLE = document.querySelector('#toggle')
const STOP = document.querySelector('.stop')
const AUDIO = document.querySelector('audio')
const LABEL = document.querySelector('label')
const CANVAS = document.querySelector('canvas')
const DRAWING_CONTEXT = CANVAS.getContext('2d')

let AUDIO_CONTEXT
let REPORT
let ANALYSER
let START_POINT

CANVAS.width = CANVAS.offsetWidth
CANVAS.height = CANVAS.offsetHeight

const CONFIG = {
  fft: 2048,
  show: true,
  duration: 0.1,
  fps: 24,
  barWidth: 4,
  barMinHeight: 0.04,
  barMaxHeight: 0.8,
  barGap: 2,
}

const CTRL = new GUI()
CTRL.add(CONFIG, 'show')
  .name('Show Audio')
  .onChange(show => (AUDIO.style.display = show ? 'block' : 'none'))

gsap.ticker.fps(CONFIG.fps)

let visualizing = false
let recorder
let timeline = gsap.timeline()

// use for visualization
const BARS = []
const fillStyle = DRAWING_CONTEXT.createLinearGradient(
  CANVAS.width / 2,
  0,
  CANVAS.width / 2,
  CANVAS.height
)
// Color stop is three colors
fillStyle.addColorStop(0.2, 'hsl(10, 80%, 50%)')
fillStyle.addColorStop(0.8, 'hsl(10, 80%, 50%)')
fillStyle.addColorStop(0.5, 'hsl(120, 80%, 50%)')

DRAWING_CONTEXT.fillStyle = fillStyle

const drawBar = ({ x, size }) => {
  const POINT_X = x - CONFIG.barWidth / 2
  const POINT_Y = CANVAS.height / 2 - size / 2
  DRAWING_CONTEXT.fillRect(POINT_X, POINT_Y, CONFIG.barWidth, size)
}

const drawBars = () => {
  DRAWING_CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)
  for (const BAR of BARS) {
    drawBar(BAR)
  }
}

const BAR_DURATION =
  CANVAS.width / ((CONFIG.barWidth + CONFIG.barGap) * CONFIG.fps)

const addBar = (volume = 0) => {
  const BAR = {
    x: CANVAS.width + CONFIG.barWidth / 2,
    // Note the volume is 0
    size: gsap.utils.mapRange(
      0,
      100,
      CANVAS.height * CONFIG.barMinHeight,
      CANVAS.height * CONFIG.barMaxHeight
    )(volume),
  }
  // Add to bars Array
  BARS.push(BAR)
  // Add the bar animation to the timeline
  // The actual pixels per second is (1 / fps * shift) * fps
  // if we have 50fps, the bar needs to have moved bar width before the next comes in
  // 1/50 = 4 === 50 * 4 = 200
  timeline.to(
    BAR,
    {
      x: `-=${CANVAS.width + CONFIG.barWidth}`,
      ease: 'none',
      duration: BAR_DURATION,
    },
    BARS.length * (1 / CONFIG.fps)
  )
}

// Given the canvas and the nodes Array, etc. Pad out the timeline and draw it.
const padTimeline = () => {
  // Doesn't matter if we have more bars than width. We will shift them over to the correct spot
  const padCount = Math.floor(CANVAS.width / CONFIG.barWidth)

  // Duplicate of what happens in REPORT needs moving and refactoring.
  for (let p = 0; p < padCount; p++) {
    addBar()
  }
  START_POINT = timeline.totalDuration() - BAR_DURATION
  // Sets the timeline to the correct spot for being added to
  timeline.totalTime(START_POINT)
}

const ANALYSE = stream => {
  AUDIO_CONTEXT = new AudioContext()
  ANALYSER = AUDIO_CONTEXT.createAnalyser()
  ANALYSER.fftSize = CONFIG.fft
  const SOURCE = AUDIO_CONTEXT.createMediaStreamSource(stream)
  const DATA_ARR = new Uint8Array(ANALYSER.frequencyBinCount)
  SOURCE.connect(ANALYSER)

  // Reset the bars and pad them out...
  if (BARS && BARS.length > 0) {
    BARS.length = 0
    padTimeline()
  }

  REPORT = () => {
    if (recorder && recorder.state === 'recording') {
      ANALYSER.getByteFrequencyData(DATA_ARR)
      const VOLUME = Math.floor((Math.max(...DATA_ARR) / 255) * 100)
      addBar(VOLUME)
    }
    if (recorder || visualizing) {
      drawBars()
    }
  }
  gsap.ticker.add(REPORT)
}

const RECORD = () => {
  const toggleRecording = async () => {
    // If we aren't recording, we need to start a recording.
    if (!recorder) {
      visualizing = true
      STOP.style.display = 'flex'
      TOGGLE.style.setProperty('--active', 1)
      // Reset the timeline
      timeline.clear()
      // Reset the audio tag
      AUDIO.removeAttribute('src')
      AUDIO.removeAttribute('controls')
      TOGGLE.title = 'Pause Recording'
      const CHUNKS = []
      const MEDIA_STREAM = await window.navigator.mediaDevices.getUserMedia({
        audio: true,
      })

      recorder = new MediaRecorder(MEDIA_STREAM)
      // This signals stopping the recording. Only accessible via the "Stop" button.
      recorder.ondataavailable = event => {
        // Update the UI
        TOGGLE.style.setProperty('--active', 0)
        STOP.style.display = 'none'
        TOGGLE.title = 'Start Recording'
        // Create the blob and show an audio element
        CHUNKS.push(event.data)
        const AUDIO_BLOB = new Blob(CHUNKS, { type: 'audio/mp3' })
        AUDIO.setAttribute('src', window.URL.createObjectURL(AUDIO_BLOB))
        // Tear down after recording.
        recorder.stream.getTracks().forEach(t => t.stop())
        recorder = null
      }
      recorder.start()
      timeline.play()
      ANALYSE(recorder.stream)
    } else {
      const RECORDING = recorder.state === 'recording'
      // Pause or resume recorder based on state.
      TOGGLE.style.setProperty('--active', RECORDING ? 0 : 1)
      timeline[RECORDING ? 'pause' : 'play']()
      recorder[RECORDING ? 'pause' : 'resume']()
    }
  }
  // Don't pause or restart it now. Start initially, pause, then make Stop available.
  toggleRecording()
}

TOGGLE.addEventListener('click', RECORD)

const SCRUB = (time = 0) => {
  gsap.to(timeline, {
    totalTime: time,
    onComplete: () => {
      gsap.ticker.remove(REPORT)
    },
  })
}

STOP.addEventListener('click', () => {
  if (recorder) recorder.stop()
  AUDIO.setAttribute('controls', true)
  AUDIO_CONTEXT.close()
  timeline.pause()
  SCRUB(START_POINT)
})

// INITIAL RENDERING so we don't have a black box.
padTimeline()
drawBars()

const UPDATE = e => {
  switch (e.type) {
    case 'play':
      gsap.ticker.add(REPORT)
      timeline.totalTime(AUDIO.currentTime + START_POINT)
      timeline.play()
      break
    case 'seeking':
    case 'seeked':
      timeline.totalTime(AUDIO.currentTime + START_POINT)
      break
    case 'pause':
      timeline.pause()
      break
    case 'ended':
      timeline.pause()
      SCRUB(START_POINT)
      break
  }
}

// Set up AUDIO scrubbing
['play', 'seeking', 'seeked', 'pause', 'ended'].forEach(event => AUDIO.addEventListener(event, UPDATE))
