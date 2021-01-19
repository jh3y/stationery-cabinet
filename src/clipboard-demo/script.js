const COPY = document.querySelector('#copy')
const PASTE = document.querySelector('#paste')
const KEY = document.querySelector('#key')
const VALUE = document.querySelector('#value')

COPY.addEventListener('click', () => {
  navigator.clipboard.writeText(KEY.value)
})

PASTE.addEventListener('click', () => {
  navigator.clipboard.readText().then(v => (VALUE.value = v))
})
