const root = document.documentElement
const inputs = document.querySelectorAll('input')

const update = (e) => {
  root.style.setProperty(`--${e.target.id}`, e.target.value)
}

inputs.forEach((input) => input.addEventListener('input', update))