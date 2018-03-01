const root = document.documentElement
const OPEN_CLASS = 'menu--open'
const menu = document.querySelector('.menu')
const menuColors = menu.querySelector('.menu__colors')
const menuBtn = menu.querySelector('.menu__button')
const counter = document.querySelector('.counter')
const propCheck = document.querySelector('#propagationCheck')

document.addEventListener('click', () => counter.innerText = parseInt(counter.innerText, 10) + 1)



const changeBg = (e) => {
  root.style.setProperty('--bg-color', e.target.style.getPropertyValue('--color'))
}
menuColors.addEventListener('click', changeBg)

const addOffClick = (e, cb) => {
  const offClick = (evt) => {
    if (e !== evt) {
      cb()
      document.removeEventListener('click', offClick)
    }
  }
  document.addEventListener('click', offClick)
}

const handleClick = (e) => {
  const toggleMenu = () => menu.classList.toggle(OPEN_CLASS)
  if (propCheck.checked) e.stopPropagation()
  if (!menu.classList.contains(OPEN_CLASS)) {
    toggleMenu()
    addOffClick(e, toggleMenu)
  }
}

menuBtn.addEventListener('click', handleClick)
