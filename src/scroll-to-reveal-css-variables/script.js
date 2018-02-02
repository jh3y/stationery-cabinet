
const root = document.documentElement;
const update = (e) => {

  const pos = window.scrollY / (document.body.offsetHeight - window.innerHeight)
  root.style.setProperty('--pos', pos)
}

window.addEventListener('scroll', update)