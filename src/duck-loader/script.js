const quack = new Audio(
  'https://freesound.org/data/previews/418/418509_5632532-lq.mp3'
)
const mute = document.querySelector('.mute')
const play = () => {
  quack
    .play()
    .then(() => {
      setTimeout(play, Math.floor(Math.random() * 5000))
    })
    .catch(e => {
      console.warn('Could not get quacking yet as no interaction 🦆 😭')
    })
}
play()
quack.muted = true
mute.addEventListener('click', () => {
  quack.muted = !quack.muted
  if (quack.muted) {
    mute.classList.add('mute--active')
  } else {
    mute.classList.remove('mute--active')
    play()
  }
})
