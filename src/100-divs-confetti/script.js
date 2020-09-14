const { gsap } = window

gsap.set('.confetti__wrapper', { '--rotate': () => gsap.utils.random(-30, 30) })
gsap.set('.confetti', { '--hue': () => gsap.utils.random(0, 359) })
gsap
  .timeline({
    repeat: -1,
  })
  .set('.confetti__content', {
    rotate: -60,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    opacity: 1,
  })
  .to('.confetti', {
    duration: () => gsap.utils.random(2, 4),
    physics2D: {
      velocity: () => gsap.utils.random(100, 130),
      angle: -60,
      acceleration: 50,
      accelerationAngle: 90,
    },
  })
  .to(
    '.confetti__content',
    {
      rotateX: () => gsap.utils.random(0, 360),
      rotateY: () => gsap.utils.random(0, 360),
      rotateZ: () => gsap.utils.random(0, 360),
      duration: () => gsap.utils.random(1, 4),
    },
    '<'
  )
// .to(
//   '.confetti__content',
//   {
//     opacity: 0,
//     duration: 0.2,
//   },
//   '>-0.2'
// )
