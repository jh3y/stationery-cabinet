const quack = new Audio(
  'https://freesound.org/data/previews/418/418509_5632532-lq.mp3'
)
const duck = document.querySelector('.duck-loader')
const mute = document.querySelector('.mute')
const play = () => {
  quack
    .play()
    .then(() => {
      const dur = Math.floor(Math.random() * 5000)
      duck.style.setProperty('--wing', dur)
      if (quack.muted)
        duck.style.setProperty('--wing', 0)
      setTimeout(play, dur)
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
