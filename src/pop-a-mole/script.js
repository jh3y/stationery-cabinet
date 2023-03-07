import gsap from 'https://cdn.skypack.dev/gsap'

gsap.set('.mole', {
  yPercent: 80,
})

gsap.set('.mole', {
  display: 'block',
})

gsap
  .timeline({
    repeat: -1,
    repeatDelay: 1,
  })
  // Shooting up!
  .to('.mole', {
    yPercent: 5,
    ease: 'back.out(1)',
  })
  .to(
    '.cap',
    {
      yPercent: -15,
      duration: 0.1,
      repeat: 1,
      yoyo: true,
    },
    '>-0.2'
  )
  // Blink
  .to('.mole__eyes', {
    delay: 0.2,
    repeat: 3,
    yoyo: true,
    duration: 0.05,
    scaleY: 0.1,
    transformOrigin: '50% 50%',
  })
  // Side to side
  .to(['.cap__body', '.mole__face'], {
    xPercent: 10,
  })
  .to(
    '.cap__peak',
    {
      xPercent: -10,
    },
    '<'
  )
  .to(
    ['.mole__eyes', '.mole__tummy'],
    {
      xPercent: 8,
    },
    '<'
  )
  .to(
    '.mole__nose',
    {
      xPercent: 25,
    },
    '<'
  )
  .to(['.mole__face', '.cap__body'], {
    xPercent: -10,
    duration: 0.75,
  })
  .to(
    '.cap__peak',
    {
      xPercent: 28,
      duration: 0.5,
    },
    '<'
  )
  .to(
    ['.mole__eyes', '.mole__tummy'],
    {
      xPercent: -8,
      duration: 0.75,
    },
    '<'
  )
  .to(
    '.mole__nose',
    {
      xPercent: -25,
      duration: 0.75,
    },
    '<'
  )
  .to('.mole__eyes', {
    delay: 0.2,
    repeat: 3,
    yoyo: true,
    duration: 0.05,
    scaleY: 0.1,
    transformOrigin: '50% 50%',
  })
  .to('.mole', {
    yPercent: 80,
    delay: 0.2,
    ease: 'power4.in',
  })
  .to(
    '.cap',
    {
      yPercent: -15,
      duration: 0.2,
      ease: 'power4.in',
    },
    '<+0.05'
  )
