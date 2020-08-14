const BTN = document.querySelectorAll('.button')
BTN.forEach(b =>
  b.addEventListener('click', () => {
    const PARTICLES = b.querySelectorAll('.heart__particle')
    PARTICLES.forEach((p, index) => {
      p.removeAttribute('style')
      const CHARACTER = {
        '--d': Math.random() * 60 - 30 + 30,
        '--r': (360 / 25) * index,
        '--h': Math.random() * 360,
        '--t': Math.random() * 0.25 + 0.25,
        '--s': Math.random() * 0.5,
      }
      p.setAttribute(
        'style',
        JSON.stringify(CHARACTER)
          .replace(/,/g, ';')
          .substring(1, JSON.stringify(CHARACTER).length - 1)
          .replace(/"/g, '')
      )
    })

    b.classList.toggle('button--active')
  })
)
