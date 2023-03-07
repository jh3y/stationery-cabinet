// import ComfyJs from 'https://cdn.skypack.dev/comfy.js'
import gsap from 'https://cdn.skypack.dev/gsap'
const { ComfyJS } = window

gsap.set(['.sloan', '.sloan__bubble'], {
  display: 'none',
  transformOrigin: '50% -300%',
})

const AUDIO = new Audio(
  'https://assets.codepen.io/605876/tarzan-yell--slowed-down.mp3'
)

const DURATION = 8

ComfyJS.onCommand = (user, command) => {
  if (command === 'swing') {
    gsap
      .timeline({
        onStart: () => {
          gsap.delayedCall(1, () => {
            AUDIO.play()
          })
        },
        onComplete: () => {
          gsap.set('.sloan', {
            display: 'none',
          })
        },
      })
      .set('.sloan', {
        display: 'block',
      })
      .set('.sloan__bubble', {
        display: 'none',
      })
      .fromTo(
        '.sloan',
        {
          x: -window.innerWidth * 0.5,
          rotate: 30,
        },
        {
          x: window.innerWidth * 0.5,
          duration: DURATION,
          rotate: -30,
          ease: 'none',
        }
      )
      .set(
        '.sloan__bubble',
        {
          display: 'block',
        },
        DURATION * 0.5
      )
  }
}

ComfyJS.Init('ThePracticalDev')
