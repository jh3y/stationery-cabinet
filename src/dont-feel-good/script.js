const bearGrid = document.querySelector('.bear-grid')
const bearCells = bearGrid.querySelectorAll('.bear-grid__cell')
const lastCell = bearCells[bearCells.length - 1]
const replay = document.querySelector('.replay')


const imageHasLoaded = (src) => new Promise((resolve, reject) => {
  const img = new Image()
  img.onload = resolve
  img.onerror = reject
  img.src = src
})

const showReset = () => {
  bearGrid.classList.toggle('bear-grid--fading')
  replay.classList.toggle('replay--show')
}

const fade = () => {
  replay.classList.toggle('replay--show')
  bearGrid.classList.toggle('bear-grid--fading')
}


lastCell.addEventListener('animationend', showReset)
replay.addEventListener('click', fade)

imageHasLoaded('https://jh3y-doodles.netlify.com/dontfeelgoodbear.svg')
  .then(() => {
    bearGrid.classList.toggle('bear-grid--fading')
  })