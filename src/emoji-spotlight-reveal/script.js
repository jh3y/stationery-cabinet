const spotlight = document.querySelector('.spotlight')
const crowd = document.querySelector('.crowd')
const crowdPos = crowd.getBoundingClientRect()

const spotlightUpdate = (e) => {
  const root = document.documentElement
  let {
    pageX: x,
    pageY: y
  } = e
  if (e.touches && e.touches.length) {
    x = e.touches[0].clientX
    y = e.touches[0].clientY
  }

  root.style.setProperty('--x', x)
  root.style.setProperty('--y', y)
  const chosen = document.querySelector('.emoji--chosen')
  if (chosen) chosen.classList.remove('emoji--chosen')
  // Work out which emojis are in range
  const spectatorSize = crowd.children[0].getBoundingClientRect()
  // position X is x - crowd.left
  const left = x - crowdPos.left
  const top = y - crowdPos.top
  if (!(left < 0 || left > crowdPos.width) && !(top < 0 || top > crowdPos.height)) {
    const emojiX = Math.floor(left / spectatorSize.width)
    const emojiY = Math.floor(top / spectatorSize.height)
    const chosen = (emojiY * 20) + emojiX
    crowd.children[chosen].classList.add('emoji--chosen')
  }
}

document.addEventListener('touchmove', spotlightUpdate)
document.addEventListener('mousemove', spotlightUpdate)