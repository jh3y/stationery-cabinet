const whassup = document.querySelector('.whassup')
const replay = document.querySelector('.replay')
let sup

const whassupTl = new TimelineMax({
  onStart: () => {
    replay.classList.add('replay--hidden')
  },
})

whassupTl.to(whassup, 0.5, {
  text: 'Wha',
  onComplete: () => {
    sup = document.createElement('sup')
    whassup.appendChild(sup)
    let text = new Array(Math.floor(Math.random() * 10) + 5).join('s')
    text += 'up?'
    TweenMax.to(sup, Math.random() * 2 + 0.5, {
      text,
      onComplete: () => {
        replay.classList.remove('replay--hidden')
      },
    })
  },
})

replay.addEventListener('click', () => whassupTl.restart())
