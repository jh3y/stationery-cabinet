const {
  gsap: {
    timeline,
    set,
    // to,
    // fromTo,
    utils: { random },
  },
} = window

set('.blank--2', { xPercent: 100 })
set('.blank--3', { xPercent: 100, yPercent: -100 })
set('.blank--4', { xPercent: 100, yPercent: -200 })
set('.blank--5', { xPercent: -100 })
set('.blank--6', { xPercent: -100, yPercent: -100 })
set('.blank--7', { xPercent: -100, yPercent: -200 })
set('.blank--8', { xPercent: -100, yPercent: -300 })
set('.blank--9', { xPercent: -200 })
set('.blank--10', { xPercent: -200, yPercent: -100 })
set('.blank--11', { xPercent: -200, yPercent: -200 })
set('.blank--12', { xPercent: -200, yPercent: -300 })
set('.blank--13', { xPercent: -200, yPercent: -400 })
set('.blank--15', { xPercent: -300 })
set('.blank--16', { xPercent: -300, yPercent: -100 })
set('.blank', { '--hue': () => random(0, 360) })
set('.container', { '--hue': 0 })

set(['.wave--1', '.wave--2'], { '--hue': random(180, 210) })
set(['.wave--3', '.wave--4'], { '--hue': random(180, 210) })
set('.boat__bubble', {
  transformOrigin: '50% 50%',
  '--lightness': () => random(50, 100),
})

set(['.wave--2', '.wave--4'], { xPercent: -100 })
const WAVES_SET_ONE_DUR = random(0.8, 2)
const WAVES_SET_TWO_DUR = random(0.8, 2)

// const WAVES = timeline({ paused: true })
timeline({ paused: true })
  .to(
    ['.wave--1', '.wave--2'],
    {
      repeat: -1,
      xPercent: '+=100',
      duration: WAVES_SET_ONE_DUR,
      ease: 'none',
    },
    0
  )
  .to(
    ['.wave--3', '.wave--4'],
    {
      repeat: -1,
      xPercent: '+=100',
      duration: WAVES_SET_TWO_DUR,
      ease: 'none',
    },
    0
  )
  .to(
    ['.wave--1', '.wave--2'],
    {
      repeat: -1,
      duration: random(0.5, 2),
      y: random(0, 5),
      yoyo: true,
      ease: 'none',
    },
    0
  )
  .to(
    ['.wave--3', '.wave--4'],
    {
      repeat: -1,
      duration: random(0.5, 2),
      y: random(0, 5),
      yoyo: true,
      ease: 'none',
    },
    0
  )

// const STEAM = timeline({ paused: true })
timeline({ paused: true })
  .fromTo(
    '.boat__bubble',
    {
      x: 0,
      y: 0,
      scale: 0,
    },
    {
      stagger: {
        each: 0.15,
        repeat: -1,
      },
      repeatRefresh: true,
      x: () => random(5, 25),
      y: () => random(-5, -15),
      scale: () => random(1, 2.5),
      duration: () => random(0.1, 1.5),
      opacity: 0,
    }
  )
  .to('.boat__bubble', { opacity: 0 }, '-=0.0015')

const EYES = document.querySelector('.boat__eyes')
const blink = EYES => {
  set(EYES, { scaleY: 1 })
  if (EYES.BLINK_TL) EYES.BLINK_TL.kill()
  EYES.BLINK_TL = timeline({
    delay: Math.floor(Math.random() * 4) + 1,
    onComplete: () => blink(EYES),
  })
  EYES.BLINK_TL.to(EYES, {
    duration: 0.05,
    transformOrigin: '50% 50%',
    scaleY: 0,
    yoyo: true,
    repeat: 1,
  })
}
blink(EYES)

// const blast = () => {
//   const newBubble = document.querySelector('.boat__bubble').cloneNode()
//   document.querySelector('.boat__bubbles').appendChild(newBubble)
//   to(newBubble, {
//     scale: 2,
//     duration: 0.5,
//     onComplete: () => newBubble.remove()
//   })
//   requestAnimationFrame(blast)
// }

// .to(
//   ['.wave--1', '.wave--2'],
//   {
//     duration: random(0.5, 2),
//     yPercent: random(-10, 0),
//     repeat: -1,
//     yoyo: true,
//     ease: 'none'
//   },
//   0
// )
// set('.blank--two', { xPercent: -100 })

// set('.ship-it', {
//   transformOrigin: '50% 50%',
//   scale: 0.5,
// })

// set('.container', { transformOrigin: '50% 50%' })
// set('.boaty', { transformOrigin: '50% 50%' })

// const TL = timeline({ paused: true })
//   .to('.ship-it', {
//     scale: 1,
//   })
//   .to('button', {
//     opacity: 0,
//   })
//   .to('.container', {
//     scale: 1.25,
//   })
//   .to('.container', {
//     y: -50,
//     scale: 0.2,
//   })
//   .from('.boaty', {
//     x: '+=150vw',
//     duration: 2,
//   })
//   .to('.container', {
//     y: -15,
//     duration: 1,
//   })
//   .to('svg', {
//     x: '-=150vw',
//     duration: 2,
//   })

// const BTN = document.querySelector('button')
// BTN.addEventListener('click', () => TL.restart())
