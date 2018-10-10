const buttons = document.querySelectorAll('.btn')

let count = 0
const handleClick = e => {
  count += parseInt(e.currentTarget.getAttribute('data-select'), 10)
  document.documentElement.style.setProperty('--selection', count)
}

for (const button of buttons) {
  button.addEventListener('click', handleClick)
}
