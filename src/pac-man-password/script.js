const pacInput = document.querySelector('.pac-input')
const pac = pacInput.querySelector('.pac-input__pac')
const ghost = pacInput.querySelector('.pac-input__ghost')
const input = pacInput.querySelector('input')

// const togglePasswordVisibility = () => {
//   if (pacInput.hasAttribute('data-visible')) {
//     // show ghost eyes and animate dots in
//     pacInput.removeAttribute('data-visible')
//     console.info('hide')
//     const ghostTimeline = new TimelineMax()
//       ghostTimeline
//         .add(TweenMax.to(ghost, .5, {
//           x: -200
//         }))
//         .add(TweenMax.to(input, .15, {
//           letterSpacing: 1,
//           backgroundColor: '#fafafa',
//           color: 'black'
//         }))
//         .add(TweenMax.to(pac, 0, {
//           x: 0
//         }))
//         .add(TweenMax.from(pac, .15, {
//           scale: 0
//         }))
//   } else {

// }

const hidePassword = () => {
  pacInput.removeAttribute('data-visible')
  console.info('hide')
  const ghostTimeline = new TimelineMax()
  ghostTimeline
    .add(
      TweenMax.to(ghost, 0.5, {
        x: -200,
      })
    )
    .add(
      TweenMax.to(input, 0.15, {
        letterSpacing: 1,
        backgroundColor: '#fafafa',
        color: 'black',
      })
    )
    .add(
      TweenMax.to(pac, 0, {
        x: 0,
      })
    )
    .add(
      TweenMax.from(pac, 0.15, {
        scale: 0,
      })
    )
}

const showPassword = () => {
  pacInput.setAttribute('data-visible', true)
  console.info('show')
  const pacTimeline = new TimelineMax()
  pacTimeline
    .add(
      TweenMax.to(input, 0.15, {
        letterSpacing: 10,
        backgroundColor: '#111',
        color: 'yellow',
      })
    )
    .add(
      TweenMax.to(pac, 2, {
        x: -200,
      })
    )
    .add(
      TweenMax.to(ghost, 0.4, {
        scale: 1,
      })
    )
}

pac.addEventListener('click', showPassword)
ghost.addEventListener('click', hidePassword)
