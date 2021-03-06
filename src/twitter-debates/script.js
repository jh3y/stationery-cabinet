import 'https://cdn.skypack.dev/regenerator-runtime'
import gsap from 'https://cdn.skypack.dev/gsap'
import Tweakpane from 'https://cdn.skypack.dev/tweakpane'

// Rotate to 110/-110 respectively with mapped range of 0-100
gsap.set('.domo__arm--left', {
  transformOrigin: '75% 25%',
})
gsap.set('.domo__arm--right', {
  transformOrigin: '25% 25%',
})

gsap.set('.domo__anger', {
  opacity: 0,
})

const duration = 1

const getMedia = async constraints => {
  let stream = null
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints)
  } catch (err) {
    // console.error(err)
  }
  return stream
}
const CONFIG = {
  min: -50,
  max: -20,
  smoothing: 0.8,
}
const PANE = new Tweakpane()
const SENSITIVITY = PANE.addFolder({
  title: 'Sensitivity',
  expanded: false,
})
SENSITIVITY.addInput(CONFIG, 'min', {
  label: 'Min (dB)',
  min: -100,
  max: 50,
  step: 1,
})
SENSITIVITY.addInput(CONFIG, 'max', {
  label: 'Max (dB)',
  min: -100,
  max: 50,
  step: 1,
})
PANE.addInput(CONFIG, 'smoothing', {
  label: 'Smoothing Time Constant',
  min: 0,
  max: 1,
  step: 0.01,
})
PANE.on('change', () => {
  ANALYSER.minDecibels = CONFIG.min
  ANALYSER.maxDecibels = CONFIG.max
  ANALYSER.smoothingTimeConstant = CONFIG.smoothing
})

const ANGER_TL = gsap
  .timeline({
    paused: false,
    // yoyo: true,
    // repeat: -1,
  })
  .from(['#mouth-clip', '.domo__mouth'], {
    scaleY: 0.4,
    duration,
  })
  .from(
    '.domo__teeth--bottom',
    {
      yPercent: -50,
      duration,
    },
    0
  )
  .to(
    '.domo__anger',
    {
      opacity: 1,
      duration,
    },
    0
  )
  .to(
    '.domo__arm--left',
    {
      rotate: 110,
      duration,
    },
    0
  )
  .to(
    '.domo__arm--right',
    {
      rotate: -110,
      duration,
    },
    0
  )
  .set('.domo__eyes ellipse', { display: 'none' }, 0.8)

let AudioContext = window.webkitAudioContext || window.AudioContext

let ANALYSER

const REPORT = () => {
  const BUFFER_LENGTH = ANALYSER.frequencyBinCount
  // Create a data array
  const DATA_ARR = new Uint8Array(BUFFER_LENGTH)
  ANALYSER.getByteFrequencyData(DATA_ARR)
  const VOLUME_LEVEL = Math.max(...DATA_ARR) / 256
  // Hue will go from 100 - 0
  gsap.to(ANGER_TL, {
    duration: 0.25,
    progress: VOLUME_LEVEL,
  })
}

gsap.ticker.fps(60)

const createAnalyser = mediaStream => {
  const CONTEXT = new AudioContext()
  ANALYSER = CONTEXT.createAnalyser()
  ANALYSER.minDecibels = -50
  ANALYSER.maxDecibels = -20
  ANALYSER.smoothingTimeConstant = 0.95
  ANALYSER.fftSize = 256
  // Hook the content up to a source. We're going to use a MediaStreamSource (Mic)
  const SOURCE = CONTEXT.createMediaStreamSource(mediaStream)
  // Connect the analyser to the source
  SOURCE.connect(ANALYSER)
  gsap.ticker.add(REPORT)
}

const START = async () => {
  const STREAM = await getMedia({
    audio: true,
  })
  createAnalyser(STREAM)
}

START()
