// There be demons here.
const BUTTON = document.querySelector('#trigger')
const CLOSER = document.querySelector('#closer')
const POP = document.querySelector('#popjavascript')
const SHOW = () => POP.showPopup()
const HIDE = () => {
  POP.hidePopup()
}
BUTTON.addEventListener('click', SHOW)
CLOSER.addEventListener('click', HIDE)