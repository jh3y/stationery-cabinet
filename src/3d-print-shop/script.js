import 'https://cdn.skypack.dev/regenerator-runtime'

const PRINTER = document.querySelector('.printer')

const AUDIO = new Audio('https://assets.codepen.io/605876/print.mp3')

let printing = false

const PREVIEW = document.querySelector('img.screen__preview-img')
const SUBMIT = document.querySelector('[type="submit"]')
const URL_INPUT = document.querySelector('[type="url"]')
PREVIEW.addEventListener('load', e => {
  setTimeout(() => AUDIO.play(), 1000)
  PRINTER.classList.add('printing')
  const PRINT = document.createElement('div')
  PRINT.className = 'printed'
  PRINT.innerHTML = `
    <div class="printed__spinner">
      <div class="printed__paper">
        <div class="printed__papiere">
          <img class="printed__image" src=${PREVIEW.src}/>
        </div>
      </div>
      <div class="printed__paper-back"></div>
    </div>
  `
  PRINTER.appendChild(PRINT)
  setTimeout(() => {
    printing = false
    SUBMIT.removeAttribute('disabled')
    PRINTER.classList.remove('printing')
  }, 4500)
})

const PROCESS = async () => {
  if (printing) return
  printing = true
  SUBMIT.disabled = true
  const res = await fetch(URL_INPUT.value)
  PREVIEW.src = res.url
  URL_INPUT.value = ''
}

const PRINT = e => {
  e.preventDefault()
  PROCESS()
}

const PRINT_FORM = document.querySelector('form')
PRINT_FORM.addEventListener('submit', PRINT)
