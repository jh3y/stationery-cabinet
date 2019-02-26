const { TweenMax, Elastic } = window
const mr = document.querySelector('.mr-greedy')
const mrBody = mr.querySelector('.mr-greedy__body')
const mrMouth = mr.querySelector('.mr-greedy__mouth')

const defaultPath =
  'M 736.90889,638.55043 C 738.12347,787.84109 689.33699,809.24203 608.33492,839.6739 528.02264,869.84661 305.47179,863.40528 306.90039,692.93069 307.42874,629.88363 318.17154,593.9533 447.32136,517.63194 535.9484,465.2576 551.00196,359.07417 615.47792,354.40087 769.29395,343.25207 735.4996,465.32692 736.90889,638.55043 Z'
const enlargedPath =
  'M 736.90889,638.55043 C 738.12347,787.84109 689.33699,809.24203 608.33492,839.6739 528.02264,869.84661 251.18608,861.97671 252.61468,691.50212 253.14303,628.45506 318.17154,593.9533 447.32136,517.63194 535.9484,465.2576 551.00196,359.07417 615.47792,354.40087 769.29395,343.25207 735.4996,465.32692 736.90889,638.55043 Z'

const wobble = d => () => {
  const shocked = mrMouth.classList.contains('mr-greedy__mouth--shocked')
  TweenMax.to(mrBody, 1, {
    attr: {
      d,
    },
    ease: Elastic.easeOut.config(1, 0.3),
    onStart: () =>
      mrMouth.classList[shocked ? 'remove' : 'add'](
        'mr-greedy__mouth--shocked'
      ),
  })
}

mr.addEventListener('mousedown', wobble(enlargedPath))
mr.addEventListener('mouseup', wobble(defaultPath))
mr.addEventListener('touchstart', wobble(enlargedPath))
mr.addEventListener('touchend', wobble(defaultPath))
