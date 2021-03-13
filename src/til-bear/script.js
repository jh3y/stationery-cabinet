import gsap from 'https://cdn.skypack.dev/gsap'
const ALERT = new Audio('https://assets.codepen.io/605876/mgs-alert.mp3')
ALERT.preload = 'auto'

const TL = gsap
  .timeline({
    paused: true,
  })
  .set('.shocked-bear__brows', {
    display: 'none',
  })
  .to('.shocked-bear', {
    yPercent: -100,
  })
  .set('.shocked-bear__brows', {
    display: 'block',
    delay: 0.5,
    onStart: () => {
      ALERT.play()
    },
  })
  .to('.shocked-bear', {
    yPercent: 0,
    delay: 1,
  })

document.addEventListener('click', () => TL.restart())

// ComfyJS.onCommand((user, command, message, flags, extras) => {
//   console.info(user)
//   if (command === 'til') TL.restart()
// })
// ComfyJS.Init('jh3yy')
