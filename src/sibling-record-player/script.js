const btn = document.querySelector('button.playlist__control--next')
btn.addEventListener('click', () => {
  const current = document.querySelector('.playlist__track--playing')
  const next = current.nextElementSibling
  if (next) {
    current.className = 'playlist__track'
    next.className += ' playlist__track--playing'
  }
})
