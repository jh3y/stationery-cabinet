const avenger = document.querySelector('.avenger')
const classes = ['shield', 'fist', 'hammer', 'helmet']
const duration = 1000

let index = 0
const loop = () => {
  index++
  if (index > classes.length - 1) index = 0
  avenger.className = `avenger avenger--${classes[index]}`
  setTimeout(loop, duration)
}

setTimeout(loop, duration)