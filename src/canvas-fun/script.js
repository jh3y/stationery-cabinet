const { gsap } = window

const MSG = document.querySelector('h1')

const SRCSET = [
  'https://assets.codepen.io/605876/peep-one.svg',
  'https://assets.codepen.io/605876/peep-two.svg',
  'https://assets.codepen.io/605876/peep-three.svg',
  'https://assets.codepen.io/605876/peep-four.svg',
  'https://assets.codepen.io/605876/peep-five.svg',
  'https://assets.codepen.io/605876/peep-six.svg',
  'https://assets.codepen.io/605876/peep-seven.svg',
  'https://assets.codepen.io/605876/peep-eight.svg',
  'https://assets.codepen.io/605876/peep-nine.svg',
  'https://assets.codepen.io/605876/peep-ten.svg',
  'https://assets.codepen.io/605876/peep-eleven.svg',
  'https://assets.codepen.io/605876/peep-twelve.svg',
  'https://assets.codepen.io/605876/peep-thirteen.svg',
  'https://assets.codepen.io/605876/peep-fourteen.svg',
  'https://assets.codepen.io/605876/peep-fifteen.svg',
  'https://assets.codepen.io/605876/peep-sixteen.svg',
  'https://assets.codepen.io/605876/peep-seventeen.svg',
  'https://assets.codepen.io/605876/peep-eighteen.svg',
  'https://assets.codepen.io/605876/peep-nineteen.svg',
  'https://assets.codepen.io/605876/peep-twenty.svg',
]

const PEEPS = []

const AUDIO = {
  AMBIENCE: new Audio('https://assets.codepen.io/605876/ambience.mp3'),
  SHOCK_ONE: new Audio('https://assets.codepen.io/605876/shock-one.mp3'),
  SHOCK_TWO: new Audio('https://assets.codepen.io/605876/shock-two.mp3'),
}

AUDIO.AMBIENCE.loop = true

const SHUFFLED = SRCSET.sort(() => Math.random() - 0.5)

class Peep {
  constructor(src, fader) {
    this.IS_FADER = fader
    this.FADED = false
    this.CANVI = []
    this.IMAGE = document.createElement('img')
    this.IMAGE.addEventListener('load', this.render)
    // This pleases the canvas
    this.IMAGE.crossOrigin = 'Anonymous'
    this.IMAGE.src = src
    this.DIR = Math.random() > 0.5 ? '-' : '+'
  }
  render = () => {
    // create a container
    this.CONTAINER = document.createElement('div')
    this.CONTAINER.className = 'peep'
    gsap.set(this.CONTAINER, { display: 'none' })
    this.CONTAINER.style.setProperty(
      '--ar',
      this.IMAGE.width / this.IMAGE.height
    )
    this.CONTAINER.style.setProperty('--x', gsap.utils.random(20, 80))
    gsap.set(this.CONTAINER, {
      transformOrigin: '50% 50%',
      rotateY: this.DIR === '-' ? 180 : 360,
    })

    // this.CONTAINER.appendChild(this.IMAGE)
    document.body.appendChild(this.CONTAINER)
    // create a canvas and draw it onto the page
    this.generateCanvi()
    // Generate bop
    this.genBop()
  }

  genBop = () => {
    const start = () => {
      const BOUNDS = this.CONTAINER.getBoundingClientRect()
      if (
        (BOUNDS.left + BOUNDS.width >= window.innerWidth - 50 &&
          this.DIR === '+') ||
        (this.DIR === '+' && Math.random() > 0.95)
      ) {
        gsap.set(this.CONTAINER, { rotateY: 180 })
        this.DIR = '-'
      }
      if (
        (BOUNDS.left <= 50 && this.DIR === '-') ||
        (this.DIR === '-' && Math.random() > 0.95)
      ) {
        this.DIR = '+'
        gsap.set(this.CONTAINER, { rotateY: 360 })
      }
      const speed = gsap.utils.random(0.2, 1)
      this.bop = gsap
        .timeline({ onComplete: () => start() })
        .to(this.CONTAINER, {
          x: `${this.DIR}=${gsap.utils.random(1, 20)}`,
          duration: speed,
        })
        .to(
          this.CONTAINER,
          { y: '-=1', repeat: 1, yoyo: true, duration: speed / 2 },
          0
        )
    }
    start()
  }

  genFade = () =>
    this.CONTAINER && this.CONTAINER.children
      ? gsap
          .timeline({
            repeatRefresh: true,
            onComplete: () => {
              this.FADED = true
            },
            onStart: () => {
              AUDIO[Math.random() > 0.5 ? 'SHOCK_ONE' : 'SHOCK_TWO'].play()
              gsap.set([...this.CONTAINER.children], {
                display: index => (index === 0 ? 'none' : 'block'),
              })
            },
          })
          .to([...this.CONTAINER.children], {
            repeatRefresh: true,
            duration: 'random(1, 3)',
            y: () => `-=${gsap.utils.random(100, 500)}`,
            x: () => `-=${gsap.utils.random(-100, 100)}`,
            opacity: 0,
            stagger: {
              each: 0.001,
            },
          })
      : () => {}

  reset = () => {
    this.FADED = false
    gsap.set([...this.CONTAINER.children], {
      display: index => (index === 0 ? 'block' : 'none'),
      opacity: 1,
      x: 0,
      y: 0,
    })
  }

  manipulateImageData = data => {
    for (let p = 0; p < data.height * data.width; p++) {
      const [, , , a] = data.data.slice(p * 4, p * 4 + 4)
      data.data[p * 4 + 3] = Math.random() > 0.1 ? 0 : a
    }
    return data
  }

  generateCanvi = () => {
    const CANVI_LEN = 20
    const width = this.IMAGE.width
    const height = this.IMAGE.height
    this.CONTAINER.appendChild(this.IMAGE)
    gsap.set(this.CONTAINER, { display: 'block' })
    if (this.IS_FADER) {
      for (let c = 0; c < CANVI_LEN; c++) {
        const CANVAS = document.createElement('canvas')
        CANVAS.width = width
        CANVAS.height = height
        CANVAS.style.display = 'none'
        const CONTEXT = CANVAS.getContext('2d')
        CONTEXT.drawImage(this.IMAGE, 0, 0)
        const DATA = CONTEXT.getImageData(0, 0, width, height)
        CONTEXT.clearRect(0, 0, width, height)
        CONTEXT.putImageData(
          this.manipulateImageData(DATA),
          0,
          0,
          0,
          0,
          width,
          height
        )
        this.CONTAINER.append(CANVAS)
      }
    }
  }
}

for (let s = 0; s < SHUFFLED.length; s++) {
  PEEPS.push(new Peep(SHUFFLED[s], s % 2 === 0))
}

const STATE = {
  FADING: false,
  SUPPORTING: true,
}
let SHIVER

const fade = e => {
  if (
    (e && e.target && e.target.id === 'volume') ||
    PEEPS.map(p => p.CONTAINER).filter(c => c !== undefined).length !== 20
  ) {
    return
  }
  // Stagger the faders
  // for (const PEEP of PEEPS.filter)
  const FADERS = PEEPS.filter(p => p.IS_FADER)
  const REMAINERS = PEEPS.filter(p => !p.IS_FADER)
  // Check if we're fading or resetting
  const READY_TO_FADE = FADERS.filter(f => f.FADED).length === 0
  if (READY_TO_FADE && !STATE.FADING) {
    for (const PEEP of PEEPS) {
      if (PEEP.bop) {
        PEEP.bop.time(0)
        PEEP.bop.kill()
      }
    }
    STATE.FADING = true
    const FADE_AWAY = gsap.timeline({
      paused: true,
      onComplete: () => {
        MSG.innerHTML = STATE.SUPPORTING
          ? 'Snap again to reset!'
          : 'Tap to reset!'
        STATE.FADING = false
      },
    })

    for (let f = 0; f < FADERS.length; f++) {
      FADE_AWAY.add(FADERS[f].genFade(), f * 0.1)
    }
    const REMAINER_CONTAINERS = [...REMAINERS.map(r => r.CONTAINER)].filter(
      r => r !== undefined
    )
    SHIVER = gsap.timeline().to(REMAINER_CONTAINERS, {
      x: () => `+=${gsap.utils.random(0.1, 1)}`,
      y: () => `-=${gsap.utils.random(0.1, 1)}`,
      stagger: {
        repeat: -1,
        yoyo: true,
        each: 0.1,
      },
      duration: 0.1,
    })
    FADE_AWAY.play()
  } else if (!READY_TO_FADE && !STATE.FADING) {
    MSG.innerHTML = STATE.SUPPORTING ? 'Snap your fingers!' : 'Tap!'
    if (SHIVER) SHIVER.kill()
    for (const FADER of FADERS) FADER.reset()
    for (const PEEP of PEEPS) PEEP.genBop()
  }
}

if (window.location.host.includes('localhost'))
  document.body.addEventListener('click', fade)

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia

const handleStream = stream => {
  const context = new AudioContext()
  const source = context.createMediaStreamSource(stream)
  const processor = context.createScriptProcessor(undefined, 2, 2)

  source.connect(processor)
  processor.connect(context.destination)

  processor.onaudioprocess = e => {
    if ([...e.inputBuffer.getChannelData(0)].filter(d => d > 0.25).length)
      fade()
  }
}

const monitor = () => {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(handleStream)
  } else if (navigator.getUserMedia) {
    navigator.getUserMedia({ audio: true, video: false }, handleStream, () =>
      alert('There was an issue obtaining your audio')
    )
  } else {
    alert('getUserMedia not supported, use that mouse!')
    STATE.SUPPORTING = false
    MSG.innerHTML = 'Tap!'
    document.body.addEventListener('click', fade)
  }
}
monitor()

AUDIO.AMBIENCE.muted = AUDIO.SHOCK_ONE.muted = AUDIO.SHOCK_TWO.muted = true

const toggleAudio = e => {
  AUDIO.AMBIENCE.muted = AUDIO.SHOCK_ONE.muted = AUDIO.SHOCK_TWO.muted = !AUDIO
    .SHOCK_TWO.muted
  if (!AUDIO.AMBIENCE.muted) AUDIO.AMBIENCE.play()
  else AUDIO.AMBIENCE.pause()
}

document
  .querySelector('label')
  .addEventListener('click', e => e.stopPropagation())

document.querySelector('#volume').addEventListener('input', toggleAudio)
