/**
  * JS purely used for implementing replay feature
*/
const PROPS = {
  CONTAINER: 'cascading-text',
  LETTER   : 'cascading-text__letter',
  ANIMATED : 'data-animated',
  REPLAY   : 'cascading-text__replay',
}
const texts = document.querySelectorAll(`.${PROPS.CONTAINER}`)
const replays = document.querySelectorAll(`.${PROPS.REPLAY}`)

for (const replay of replays) {
  replay.addEventListener('click', () => {
    const text = replay.parentElement
    const letters = text.querySelectorAll(`.${PROPS.LETTER}`)
    const listeners = []
    for (const letter of letters) {
      const listener = new Promise((resolve, reject) => {
        letter.addEventListener('animationend', () => resolve())
      })
      listeners.push(listener)
    }
    Promise.all(listeners)
      .then(() => {
        text.removeAttribute(PROPS.ANIMATED)
      })
    text.setAttribute(PROPS.ANIMATED, true)
  })
}

const textListeners = []

for (const text of texts) {
  const letters = text.querySelectorAll(`.${PROPS.LETTER}`)

  const listeners = []

  for (const letter of letters) {
    const listener = new Promise((resolve, reject) => {
      letter.addEventListener('animationend', () => {
        resolve()
      })
    })
    listeners.push(listener)
  }

  const textListener = Promise.all(listeners)
    .then(() => {
      Promise.resolve()
    })

  textListeners.push(textListener)
}

Promise.all(textListeners)
  .then(() => {
    for (const text of texts) {
      text.removeAttribute(PROPS.ANIMATED)
    }
  })
