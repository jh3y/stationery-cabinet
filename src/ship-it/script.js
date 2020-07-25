const {
  gsap: {
    // timeline,
    set,
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
