const textOne = document.querySelector('.text--1')
const textTwo = document.querySelector('.text--2')
const logo = document.querySelector('.logo')
const wrap = document.querySelector('.text__wrap')
const replay = document.querySelector('.replay')
const audio = document.querySelector('audio')
const mute = document.querySelector('.mute')

const intro = () => {
  const scaleTL = new TimelineMax()
  scaleTL
    .from(logo, 0.5, { scale: 0, opacity: 0, display: 'block' })
    .to(textOne, 0.25, { text: 'CodePen' }, 0.5)
    .to(wrap, 0.125, { scale: 1.25, delay: 0.125 })
    .to(wrap, 0.125, { scale: 1 })
    .to(logo, 0, { opacity: 0, display: 'none' }, 1.5)
  return scaleTL
}
const swap = (el, text, delay = 0.5) => {
  const swapTL = new TimelineMax()
  swapTL.to(el, 0, { text, delay, opacity: 1, x: '0%', immediateRender: false })
  return swapTL
}
const slidingWords = () => {
  const swipeTL = new TimelineMax()
  swipeTL
    .to(textOne, 0.15, { delay: 0.1, scale: 0.85 })
    .to(textOne, 0, { text: 'social', delimiter: ' ' })
    .to(textOne, 0.1, { scale: 1 })
    .to(textTwo, 0.15, {
      delay: 0.25,
      text: `&nbsp;development`,
      delimiter: ' ',
    })
    .to(wrap, 0.1, { delay: 0.25, scale: 0.75 })
    .to(wrap, 0.1, { scale: 1 })
  return swipeTL
}
const environment = () => {
  const envTL = new TimelineMax()
  envTL
    .to(wrap, 0, { delay: 0.5, scale: 1.5 }, 0)
    .to(textOne, 0, { delay: 0.5, text: 'environment' }, 0)
    .to(textTwo, 0, { delay: 0.5, text: '' }, 0)
    .to(wrap, 0, { scale: 1 }, 1)
  return envTL
}
const type = (el, text, delay = 0.5) => {
  const typeTL = new TimelineMax()
  typeTL.add(TweenMax.to(el, 0, { delay, text: '' }))
  for (let l = 0; l < text.length; l++) {
    typeTL.add(TweenMax.to(el, 0.15, { text: text.slice(0, l + 1) }))
  }
  return typeTL
}
const frontEnd = () => {
  const frontEndTL = new TimelineMax()
  frontEndTL
    .to(textOne, 0, { text: 'front', delay: 0.5 }, 0)
    .to(textTwo, 0, { text: '-end', delay: 0.5 }, 0)
    .from(textOne, 0.25, { x: '-25%', opacity: 0, immediateRender: false }, 0.5)
    .from(
      textTwo,
      0.25,
      { x: '-125%', opacity: 0, immediateRender: false },
      0.5
    )
    .to(textOne, 0.15, { x: '125%', opacity: 0 }, 1)
    .to(textTwo, 0.15, { x: '25%', opacity: 0 }, 1)
    .to(textOne, 0.15, { x: '0%', text: 'designers', opacity: 1 }, 1.25)
    .to(textTwo, 0, { x: '0%', text: '' }, 1.25)
  return frontEndTL
}
const bounce = () => {
  const bounceTL = new TimelineMax({ repeat: 1 })
  bounceTL.to(wrap, 0.1, { scale: 1.05 }).to(wrap, 0.1, { scale: 1 })
  return bounceTL
}
const wave = () => {
  const waveTL = new TimelineMax({ delay: 0.25, repeat: 2 })
  waveTL
    .to(textOne, 0.1, { rotation: -25, transformOrigin: 'bottom right' })
    .to(textOne, 0.1, { rotation: 25, transformOrigin: 'bottom right' })
  return waveTL
}
const fadeLogo = () => {
  const logoTL = new TimelineMax({ delay: 0.25 })
  logoTL
  .to(textOne, 0.15, { opacity: 0 }, 0)
  .to(textOne, 0, { display: 'none' })
  .to(logo, 0, { scale: 5, opacity: 0, display: 'block' })
  .to(logo, 0.25, { scale: 1 }, 0.5)
  .to(logo, 0.5, { opacity: 1 }, 0.5)
  .to(audio, 0.25, { volume: 0 }, 1)
  .to(replay, 0.5, {
    opacity: 1,
    onStart: () => replay.classList.remove('replay--hidden'),
  }, 1.5)
  return logoTL
}
const advertTL = new TimelineMax({
  onStart: () => {
    replay.classList.add('replay--hidden')
    textOne.style.color = 'transparent'
    audio.play()
  },
  onComplete: () => {
    audio.pause()
    audio.currentTime = 0
  },
})

advertTL
  .add(intro())
  .add(swap(textOne, 'is', 0))
  .add(swap(textOne, 'a'))
  .add(slidingWords())
  .add(environment())
  .add(type(textOne, 'for'))
  .add(frontEnd())
  .add(swap(textOne, 'and'))
  .add(swap(textOne, 'developers'))
  .add(bounce())
  .add(
    TweenMax.to(textOne, 0, {
      text: '👋',
      immediateRender: false,
      delay: 0.5,
      onStart: () => (textOne.style.color = 'black'),
    })
  )
  .add(wave())
  .add(fadeLogo())
replay.addEventListener('click', () => advertTL.restart())
audio.muted = true
mute.addEventListener('click', () => {
  audio.muted = !audio.muted
  if (audio.muted) {
    mute.classList.add('mute--active')
  } else {
    mute.classList.remove('mute--active')
  }
})
