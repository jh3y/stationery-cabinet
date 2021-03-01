import 'https://cdn.skypack.dev/regenerator-runtime'
import gsap from 'https://cdn.skypack.dev/gsap'

const LABEL = document.querySelector('h1')

const getMedia = async constraints => {
  let stream = null
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints)
  } catch (err) {
    // console.error(err)
  }
  return stream
}

const createAnalyser = mediaStream => {
  const CONTEXT = new AudioContext()
  const ANALYSER = CONTEXT.createAnalyser()
  ANALYSER.fftSize = 256
  // Hook the content up to a source. We're going to use a MediaStreamSource (Mic)
  const SOURCE = CONTEXT.createMediaStreamSource(mediaStream)
  // Connect the analyser to the source
  SOURCE.connect(ANALYSER)
  // ANALYSER.connect(CONTEXT.destination)
  const REPORT = () => {
    const BUFFER_LENGTH = ANALYSER.frequencyBinCount
    // Create a data array
    const DATA_ARR = new Uint8Array(BUFFER_LENGTH)
    ANALYSER.getByteFrequencyData(DATA_ARR)
    const VOLUME_LEVEL = Math.max(...DATA_ARR) / 256
    LABEL.innerText = `${Math.floor(VOLUME_LEVEL * 100)}%`
    // Hue will go from 100 - 0
    gsap.to(LABEL, {
      scale: 1 + VOLUME_LEVEL * 2,
      duration: 0.1,
      '--hue': 100 - Math.floor(VOLUME_LEVEL * 100),
    })
    requestAnimationFrame(REPORT)
  }
  REPORT()
}

const START = async () => {
  const STREAM = await getMedia({
    audio: true,
  })
  createAnalyser(STREAM)
}

START()
