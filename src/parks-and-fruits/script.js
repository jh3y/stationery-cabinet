const { gsap, Flip } = window

gsap.registerPlugin(Flip)

gsap.set(['.a', '.b'], {
  width: '100vw',
  height: '100vh',
})

gsap.set('li', {
  position: 'absolute',
})

gsap.set('.b', {
  yPercent: 100,
})

Flip.fit('.c', '.right-long')
gsap.set('.c', {
  xPercent: 100,
})

// Flip.fit('li:nth-of-type(2)', '.grid__item:nth-of-type(3)')
// gsap.set('li:nth-of-type(2)', {
//   yPercent: 100 + Math.min(window.innerHeight, window.innerWidth) * 0.02,
// })

const MAIN = gsap
  .timeline({
    // repeat: -1,
    delay: 1,
  })
  .add(
    Flip.fit('.a', '.top-left', {
      duration: 1,
    })
  )
  .add(
    Flip.fit('.b', '.bottom-left', {
      duration: 1,
    }),
    0
  )
  .add(
    Flip.fit('.c', '.right-long', {
      duration: 1,
    }),
    0
  )
