const { TweenMax, Elastic } = window
const mr = document.querySelector('.mr-greedy')
const mrBody = mr.querySelector('.mr-greedy__body-belly')
const mrMouth = mr.querySelector('.mr-greedy__mouth')

const wobble = scaleX => () => {
  const shocked = mrMouth.classList.contains('mr-greedy__mouth--shocked')
  TweenMax.to(mrBody, 1, {
    scaleX,
    ease: Elastic.easeOut.config(1, 0.3),
    onStart: () =>
      mrMouth.classList[shocked ? 'remove' : 'add'](
        'mr-greedy__mouth--shocked'
      ),
  })
}

mr.addEventListener('mousedown', wobble(1.15))
mr.addEventListener('mouseup', wobble(1))
mr.addEventListener('touchstart', wobble(1.15))
mr.addEventListener('touchend', wobble(1))
