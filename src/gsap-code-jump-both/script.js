const {
  hljs,
  TextPlugin,
  gsap: { timeline, to, set, registerPlugin },
} = window
registerPlugin(TextPlugin)

const REPEAT_DELAY = 6
const DURATION = 1
const INITIAL_DELAY = 6
const STEPS = 5

document.addEventListener('DOMContentLoaded', () => {
  const CIRCLE = document.querySelector('.circle')
  document.querySelectorAll('pre code').forEach(block => {
    hljs.highlightBlock(block)
  })
  new timeline({
    delay: INITIAL_DELAY,
    repeat: -1,
    repeatDelay: REPEAT_DELAY,
    yoyo: true,
  })
    .add(
      to('.before', {
        duration: 1,
        opacity: 0,
        x: -25,
      }),
      0
    )
    .add(
      to('.after', {
        duration: 1,
        opacity: 1,
        x: 0,
      }),
      0
    )
    .add(
      set('.step__comma', {
        text: {
          value: ',',
        },
        opacity: 0,
      }),
      0
    )
    .add(
      to('.step__comma', {
        opacity: 1,
        text: {
          value: ',',
        },
        onReverseComplete: () => {
          document.querySelector('.step__comma').innerHTML = ''
        },
        duration: DURATION,
      }),
      0
    )
    .add(
      set('.step__jump-term', {
        opacity: 0,
        y: 10,
      }),
      0
    )
    .add(
      to('.step__jump-term', {
        text: {
          value: ' jump-none',
          delimiter: '',
        },
        duration: DURATION * 0.5,
      }),
      0
    )
    .add(
      to('.step__jump-term', {
        y: 0,
        opacity: 1,
        duration: DURATION * 0.75,
        onReverseComplete: () => {
          document.documentElement.style.setProperty(
            '--timing-function',
            `steps(${STEPS})`
          )
          CIRCLE.style.setProperty('--bg', `#a5c5ff`)
          CIRCLE.classList.remove('circle--animated')
          CIRCLE.style.opacity = 0
          setTimeout(() => {
            CIRCLE.classList.add('circle--animated')
            CIRCLE.style.opacity = 1
          }, 0)
        },
        onComplete: () => {
          document.documentElement.style.setProperty(
            '--timing-function',
            `steps(${STEPS}, jump-none)`
          )
          CIRCLE.style.setProperty('--bg', `#6eff7c`)
          CIRCLE.classList.remove('circle--animated')
          CIRCLE.style.opacity = 0
          setTimeout(() => {
            CIRCLE.classList.add('circle--animated')
            CIRCLE.style.opacity = 1
          }, 0)
        },
      }),
      0
    )
})
