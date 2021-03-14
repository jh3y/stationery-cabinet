const SPOTLIGHT = document.querySelector('.spotlight')
const TEXT = document.querySelector('.spotlight h1')
const DUMMY = document.querySelector('.dummy')

const UPDATE = ({ x, y }) => {
  const { left, top, width, height } = SPOTLIGHT.getBoundingClientRect()
  const X_POS = ((x - left) / width) * 100
  const Y_POS = ((y - top) / height) * 100
  SPOTLIGHT.style.setProperty('--spotlight-x', Math.floor(X_POS))
  DUMMY.style.setProperty('--spotlight-x', Math.floor(X_POS))
  TEXT.style.setProperty('--spotlight-x', Math.floor(X_POS))
  SPOTLIGHT.style.setProperty('--spotlight-y', Math.floor(Y_POS))
  DUMMY.style.setProperty('--spotlight-y', Math.floor(Y_POS))
  TEXT.style.setProperty('--spotlight-y', Math.floor(Y_POS))
}

SPOTLIGHT.addEventListener('pointermove', UPDATE)
