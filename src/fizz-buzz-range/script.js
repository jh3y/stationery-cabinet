const root = document.documentElement
const input = document.querySelector('input')
const handle = ({ target: { value } }) => {
  if (value % 3 === 0 && value % 5 === 0)
    root.style.setProperty('--fizzbuzz', '"🍸🐝"')
  else if (value % 3 === 0) root.style.setProperty('--fizzbuzz', '"🍸"')
  else if (value % 5 === 0) root.style.setProperty('--fizzbuzz', '"🐝"')
  else root.style.setProperty('--fizzbuzz', `"${value}"`)
  root.style.setProperty('--value', value)
  root.style.setProperty(
    '--animation',
    value % 3 === 0 && value % 5 === 0 ? 0.1 : 0
  )
}
input.addEventListener('input', handle)
