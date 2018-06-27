const debounce = (func, delay) => {
  let inDebounce
  return function() {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() =>
      func.apply(context, args)
    , delay)
  }
}
const $loadingScreen = document.querySelector('.loading-screen')
const loop = () => {
  $loadingScreen.classList.remove('loading-screen--loading')
  setTimeout(() => $loadingScreen.classList.add('loading-screen--loading'), 0)
}
document.body.addEventListener('animationend', debounce(loop, 2000))