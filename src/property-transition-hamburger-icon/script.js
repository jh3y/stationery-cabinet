const BTN = document.querySelector('button')

const TOGGLE = () => {
  BTN.setAttribute(
    'aria-pressed',
    BTN.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'
  )
}

BTN.addEventListener('click', TOGGLE)
