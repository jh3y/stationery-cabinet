import faker from 'https://cdn.skypack.dev/faker'
import gsap from 'https://cdn.skypack.dev/gsap'

const RULE = document.querySelector('.rule')
const NAMES = new Array(12).fill().map(child => faker.name.findName())
const LIST = document.querySelector('.list__children')
const RADIO = document.querySelectorAll('[type="radio"]')
const EVENODD = document.querySelector('.evenodd-selector')
const NTHCHILD = document.querySelector('.nthchild-selector')
const A = document.querySelector('.a-selector')
const B = document.querySelector('.b-selector')
const A2 = document.querySelector('.a2-selector')
const B2 = document.querySelector('.b2-selector')
const SHOW = document.querySelector('#shownumber')
const CHAIN = document.querySelector('#chain')

// Generate a stylesheet for use
const STYLE = document.createElement('style')
STYLE.appendChild(document.createTextNode(''))
document.head.appendChild(STYLE)

let children = ``
for (const NAME of NAMES) children += `<li class="list__child">${NAME}</li>`
LIST.innerHTML = children
const BOUNDS = 30
const updateList = ({ x: pointerX, y: pointerY }) => {
  const x = gsap.utils.mapRange(0, window.innerWidth, -BOUNDS, BOUNDS, pointerX)
  const y = gsap.utils.mapRange(
    0,
    window.innerHeight,
    BOUNDS,
    -BOUNDS,
    pointerY
  )
  gsap.set('.list__container', { '--x': x, '--y': y })
}

const STATE = {
  active: undefined,
  ab: false,
  nthchild: false,
  evenodd: false,
}

const getCSS = (
  nthSelector,
  chainSelector
) => `.list__child:nth-child(${nthSelector})${
  chainSelector ? `:nth-child(${chainSelector})` : ``
} {
  opacity: 0.5;
  color: var(--struck);
  text-decoration: line-through;
}`

const applyStyle = () => {
  if (STYLE.sheet.rules.length !== 0) STYLE.sheet.deleteRule(0)
  const NTH = `${A.value !== '1' ? A.value : ''}n${B.value > 0 ? '+' : ''}${
    B.value !== '0' ? B.value : ''
  }`
  const NTHCHAIN = `${A2.value !== '1' ? A2.value : ''}n${
    B2.value > 0 ? '+' : ''
  }${B2.value !== '0' ? B2.value : ''}`
  switch (STATE.active) {
    case 'evenodd':
      RULE.innerText = `:nth-child(${EVENODD.value})`
      return STYLE.sheet.insertRule(getCSS(EVENODD.value), 0)
    case 'nthchild':
      RULE.innerText = `:nth-child(${NTHCHILD.value})`
      return STYLE.sheet.insertRule(getCSS(NTHCHILD.value), 0)
    case 'ab':
      RULE.innerText = `:nth-child(${NTH})`
      if (CHAIN.checked) RULE.innerText += `:nth-child(${NTHCHAIN})`
      return STYLE.sheet.insertRule(
        getCSS(NTH, CHAIN.checked ? NTHCHAIN : undefined),
        0
      )
    default:
      return
  }
}

const update = e => {
  if (STATE.active) STATE[STATE.active] = false
  STATE[e.target.value] = true
  STATE.active = e.target.value
  applyStyle()
}

document.addEventListener('pointermove', updateList)
RADIO.forEach(R => R.addEventListener('change', update))
A.addEventListener('input', applyStyle)
B.addEventListener('input', applyStyle)
A2.addEventListener('input', applyStyle)
B2.addEventListener('input', applyStyle)
NTHCHILD.addEventListener('input', applyStyle)
EVENODD.addEventListener('change', applyStyle)
CHAIN.addEventListener('change', applyStyle)
SHOW.addEventListener('change', () =>
  document.documentElement.style.setProperty(
    '--list-style',
    SHOW.checked ? 'decimal' : 'none'
  )
)
