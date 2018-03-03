// CodePen is a social development environment for front-end
// designers and developers. 👋
// Finish on the logo

const textElement = document.querySelector('.text')

const textTl = new TimelineMax()

const addStart = TweenMax.to(textElement, 0, {text: 'Hey', delay: 1, delimiter:" "})

const second = TweenMax.to(textElement, 0, {scale: 1, text: 'it\'s', delay: 1, delimiter:" "})

const scaleUp = TweenMax.to(textElement, .1, {scale: 2})
const scaleDown = TweenMax.to(textElement, .1, { scale: 1})

const double = TweenMax.to(textElement, 0, {text: 'front', delay: 0.5})

const doubleup = TweenMax.to(textElement, 0, {text: 'front end', delay: 0.5})

const third = TweenMax.to(textElement, 0, {text: 'me.', delay: 1, delimiter:" "})

textTl.add(addStart)
  .add(second)
  .add(scaleUp)
  .add(scaleDown)
  .add(double)
  .add(doubleup)
  .add(third)
