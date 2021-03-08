import gsap from 'https://cdn.skypack.dev/gsap'

const SQUARES = gsap.utils.toArray('.square')

gsap.set(SQUARES, {
  transformOrigin: 'right bottom',
  zIndex: index => 9 - index,
  strokeDasharray: index => `${14 - index * 1.5} ${index * 2}`,
  strokeWidth: index => 5 - index * 0.5,
})

const duration = 10
gsap
  .timeline({ repeat: -1 })
  .set(document.documentElement, {
    '--hue': 328,
  })
  .to(document.documentElement, {
    '--hue': 271,
    duration,
  })
  .to(document.documentElement, {
    '--hue': 91,
    duration,
  })
  .to(document.documentElement, {
    '--hue': 328,
    duration,
  })

for (let s = 0; s < SQUARES.length; s++) {
  const SQUARE = SQUARES[s]
  gsap
    .timeline({
      repeat: -1,
    })
    .to(SQUARE, {
      rotation: 180,
      duration: 3.5,
    })
    .set(SQUARE, {
      transformOrigin: 'right top',
    })
    .to(SQUARE, {
      rotation: '+=180',
      duration: 3.5,
    })
    .set(SQUARE, {
      transformOrigin: 'left top',
    })
    .to(SQUARE, {
      rotation: '+=180',
      duration: 3.5,
    })
    .set(SQUARE, {
      transformOrigin: 'left bottom',
    })
    .to(SQUARE, {
      rotation: '+=180',
      duration: 3.5,
    })
    .timeScale(s + 1)
}
