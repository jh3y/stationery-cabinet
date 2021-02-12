import gsap from 'https://cdn.skypack.dev/gsap'

const AUDIO = {
  IN: new Audio('https://assets.codepen.io/605876/squeak-in.mp3'),
  OUT: new Audio('https://assets.codepen.io/605876/squeak-out.mp3'),
}

const bindSound = splat => {
  splat.addEventListener('pointerdown', () => {
    AUDIO.OUT.pause()
    AUDIO.IN.currentTime = AUDIO.OUT.currentTime = 0
    AUDIO.IN.play()
  })
  splat.addEventListener('pointerup', () => {
    AUDIO.IN.pause()
    AUDIO.IN.currentTime = AUDIO.OUT.currentTime = 0
    AUDIO.OUT.play()
  })
}

const SPLATS = document.querySelectorAll('.splatted')
SPLATS.forEach(splat => bindSound(splat))

const LIMIT = 25
document.addEventListener('pointermove', ({ x, y }) => {
  const posX = gsap.utils.mapRange(0, window.innerWidth, LIMIT, -LIMIT, x)
  const posY = gsap.utils.mapRange(0, window.innerHeight, LIMIT, -LIMIT, y)
  gsap.set(document.documentElement, {
    '--x': posX,
    '--y': posY,
  })
})
