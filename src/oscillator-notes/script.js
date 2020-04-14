const KEYS = document.querySelectorAll('.keyboard__key')
const KEYBOARD = document.querySelector('.keyboard')

const AUDIO_CONTEXT = new AudioContext()
const GAIN_NODE = AUDIO_CONTEXT.createGain()
GAIN_NODE.connect(AUDIO_CONTEXT.destination)

let oscillator
let playing

const resetKeys = () => {
  for (const KEY of KEYS) {
    KEY.className = `keyboard__key key ${
      KEY.dataset.sharp === 'true' ? 'key--sharp' : ''
    }`
  }
}

const playKey = key => {
  resetKeys()
  key.classList.add('key--active')
  oscillator.frequency.setValueAtTime(
    parseFloat(key.getAttribute('data-frequency'), 10),
    AUDIO_CONTEXT.currentTime
  )
  playing = key
}

const playOthers = e => {
  if (e.pointerType === 'touch') {
    const { x, y } = e
    for (let k = 0; k < KEYS.length; k++) {
      const KEY = KEYS[k]
      const bounds = KEY.getBoundingClientRect()
      if (
        x > bounds.x &&
        x < bounds.x + bounds.width &&
        y > bounds.y &&
        y < bounds.y + bounds.height &&
        KEY !== playing
      ) {
        playKey(KEY)
        break
      }
    }
  } else if (
    e.target.className.includes('keyboard__key') &&
    e.target !== playing
  ) {
    playKey(e.target)
  }
}

const stop = () => {
  resetKeys()
  window.removeEventListener('pointerup', stop)
  KEYBOARD.removeEventListener('pointermove', playOthers)
  oscillator.addEventListener('ended', () => {
    oscillator = undefined
    playing = undefined
  })
  oscillator.stop()
}

const play = frequency => {
  const playSound = () => {
    oscillator = AUDIO_CONTEXT.createOscillator()
    oscillator.type = 'sine' // sine, square, sawtooth, triangle
    oscillator.connect(GAIN_NODE)
    oscillator.frequency.setValueAtTime(frequency, AUDIO_CONTEXT.currentTime)
    oscillator.start()
  }
  playSound()
  // Example stopping after 1 second. You can set the time in a stop argument 👍
  // oscillator.stop(AUDIO_CONTEXT.currentTime + 1)
}

KEYBOARD.addEventListener('pointerdown', e => {
  if (e.target.className.includes('keyboard__key')) {
    playing = e.target
    e.target.classList.add('key--active')
    play(parseFloat(e.target.getAttribute('data-frequency'), 10))
    window.addEventListener('pointerup', stop)
    KEYBOARD.addEventListener('pointermove', playOthers)
  }
})
