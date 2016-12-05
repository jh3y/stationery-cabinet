const input = document.querySelector('input')
const button = document.querySelector('button.custom')

const changeColorValue = () => button.setAttribute('style', `--color: ${input.value}`)

input.addEventListener('keyup', changeColorValue)
