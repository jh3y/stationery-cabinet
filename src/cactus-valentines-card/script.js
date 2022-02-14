import gsap from 'https://cdn.skypack.dev/gsap'

const CARD = document.querySelector('.card')

const PARALLAX_UPDATE = ({ x, y }) => {
  const newX = gsap.utils.mapRange(0, window.innerWidth, -50, 50)(x)
  const newY = gsap.utils.mapRange(0, window.innerHeight, -50, 50)(y)
  gsap.set(CARD, {
    '--x': newX,
    '--y': newY,
  })
}

gsap.set(['.illustration__label', '.cact-us'], { opacity: 0 })
gsap.set(['.cact-u__shakes', '.cact-i__shakes'], { display: 'none' })
gsap.set(['.cact-u__body', '.cact-i__body'], { transformOrigin: '50% 90% ' })
gsap.set('.hearts', { opacity: 0 })
gsap.set(
  ['.cact-u__shadow', '.cact-i__shadow', '.cact-u__eyes', '.cact-i__eyes'],
  { transformOrigin: '50% 50%', scale: 1 }
)
gsap.set('.cact-i__wave', { transformOrigin: '80% 80%' })
gsap.set('.cact-u__wave', { transformOrigin: '20% 80%' })
gsap.set('.cact-u', {
  xPercent: '-=200',
})
gsap.set('.cact-i', {
  xPercent: '+=200',
})

const JUMP_SPEED = 0.15
const genCactusJump = (cactus, direction) => {
  const CACTUS_JUMP_TL = gsap.timeline({ repeat: 3, repeatRefresh: true })
  CACTUS_JUMP_TL.to(`.${cactus}__body`, {
    scaleY: 0.9,
    scaleX: 1.1,
    duration: JUMP_SPEED,
  })
    .to(
      `.${cactus}__face`,
      {
        yPercent: 60,
        duration: JUMP_SPEED,
      },
      '<'
    )
    .to(
      `.${cactus}__arms`,
      {
        yPercent: 10,
        duration: JUMP_SPEED,
      },
      '<'
    )
    .to([`.${cactus}__cactus`, `.${cactus}__pot`], {
      y: -50,
      duration: JUMP_SPEED,
    })
    .to(
      `.${cactus}`,
      {
        xPercent: `${direction}=50`,
        duration: JUMP_SPEED,
      },
      '<'
    )
    .to(
      `.${cactus}__shadow`,
      {
        scale: 0,
        duration: JUMP_SPEED,
      },
      '<'
    )
    .to(
      `.${cactus}__arms`,
      {
        yPercent: -5,
        duration: JUMP_SPEED,
      },
      '<'
    )
    .to(
      `.${cactus}__face`,
      {
        yPercent: 0,
        duration: JUMP_SPEED,
      },
      '<'
    )
    .to(
      `.${cactus}__body`,
      {
        scaleY: 1,
        scaleX: 0.9,
        duration: JUMP_SPEED,
      },
      '<'
    )
    .to([`.${cactus}__cactus`, `.${cactus}__pot`], {
      y: 0,
      duration: JUMP_SPEED,
    })
    .to(
      `.${cactus}__shadow`,
      {
        scale: 1,
        duration: JUMP_SPEED,
      },
      '<'
    )
    .to(
      `.${cactus}__body`,
      {
        scaleX: 1,
        scaleY: 1,
        duration: JUMP_SPEED,
      },
      '>-0.1'
    )
    .to(
      `.${cactus}__arms`,
      {
        yPercent: 0,
        duration: JUMP_SPEED,
      },
      '<'
    )
  return CACTUS_JUMP_TL
}

const BLINK = eyes => {
  const delay = gsap.utils.random(2, 6)
  gsap.timeline().to(eyes, {
    delay,
    onComplete: () => BLINK(eyes),
    scaleY: 0.1,
    repeat: 3,
    yoyo: true,
    duration: 0.05,
  })
}
BLINK('.cact-u__eyes')
BLINK('.cact-i__eyes')

const TOGGLE_OPEN = () => {
  document.querySelector('.card').classList.toggle('card--open')
}
const TOGGLE_FLIPPED = () => {
  document.querySelector('.card').classList.toggle('card--flipped')
}

const TL = gsap
  .timeline({
    delay: 0,
    onComplete: () => {
      gsap.set('.card', { clearProps: true })
      gsap.set('.card', { display: 'block' })
      window.addEventListener('pointermove', PARALLAX_UPDATE)
      window.addEventListener('click', TOGGLE_OPEN)
      window.addEventListener('dblclick', TOGGLE_FLIPPED)
    },
  })
  .from('.card', {
    rotateY: -360,
    yPercent: 200,
    duration: 2,
    ease: 'elastic.out(1, 1)'
  })
  .add(genCactusJump('cact-u', '+'))
  .to('.illustration__label--cact-u', { opacity: 1 })
  .add(genCactusJump('cact-i', '-'))
  .to('.illustration__label--cact-i', { opacity: 1 })
  .to('.cact-i__wave', {
    rotate: 25,
    repeat: 5,
    yoyo: true,
    duration: JUMP_SPEED * 0.5,
  })
  .to('.cact-u__wave', {
    rotate: -25,
    repeat: 5,
    yoyo: true,
    duration: JUMP_SPEED * 0.5,
  })
  .to(['.cact-us', '.illustration__label--cact-us'], {
    opacity: 1,
  })
  .to(['.hearts', '.instruction'], { opacity: 1 })

gsap.set('.heart', {
  transformOrigin: '50% 100%',
  scale: 0,
  xPercent: gsap.utils.distribute({
    base: -150,
    amount: 300,
  }),
  rotate: gsap.utils.distribute({
    base: -60,
    amount: 120,
  }),
})

const HEARTS = gsap.utils.toArray('.heart')

HEARTS.forEach(heart =>
  gsap
    .timeline({
      repeat: -1,
      repeatRefresh: true,
    })
    .set(heart, {
      opacity: 1,
      yPercent: 0,
      scale: 0,
    })
    .to(heart, {
      yPercent: `-${gsap.utils.random(100, 300)}`,
      scale: 1,
      duration: gsap.utils.random(1, 3),
    })
    .to(
      heart,
      {
        opacity: 0,
        duration: 0.1,
      },
      '>-0.1'
    )
)

gsap.set('.card', { display: 'block' })
