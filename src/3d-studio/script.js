// Purely for toggling audio
const AUDIO_TOGGLE = document.querySelector('#audio')
const AUDIO = document.querySelector('.ambience')
AUDIO.volume = 0.5
AUDIO_TOGGLE.addEventListener('input', () => {
  AUDIO.muted = !AUDIO.muted
  AUDIO.play()
})
