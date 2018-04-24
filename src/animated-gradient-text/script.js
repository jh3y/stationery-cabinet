// This is the paragraph I want to animate
// CodePen is a social development environment for front-end
// designers and developers. 👋
// Finishing on the CodePen logo
const textOne = document.querySelector('.text--1')
const textTwo = document.querySelector('.text--2')
const logo = document.querySelector('.logo')
const wrap = document.querySelector('.text__wrap')

const advertTl = new TimelineMax()

// There are different styles of animation
// 1. Introduction with Logo
const intro = () => {
  const scaleTL = new TimelineMax()
  scaleTL.from(logo, 0.5, {scale: 5, opacity: 0, display: 'block'})
    .to(textOne, 0.25, {text: 'CodePen'}, 0.5)
    .to(wrap, 0.125, {scale: 1.25, delay: 0.125})
    .to(wrap, 0.125, { scale: 1})
    .to(logo, 0, {opacity: 0, display: 'none'}, 1.5)
    // .to(textOne, 0, {text: 'is', immediateRender: false}, 1.5)
  return scaleTL
}
// 2. Just appear
const swap = (el, text, delay = 0.5) => {
  const swapTL = new TimelineMax()
  swapTL.to(el, 0, {text, delay, immediateRender: false})
  return swapTL
}
// 3. Type each letter
// 4. Slide in from right
const slidingWords = () => {
  const swipeTL = new TimelineMax()
  swipeTL
    .to(textOne, 0, {delay: 0.5, text: 'social', delimiter: " "}, 0)
    .to(textTwo, 0, {delay: 0.5, text: 'development', delimiter: " ", opacity: 0, x: 1000}, 0)
    .from(textOne, 0.25, {opacity: 0, x: -1000, immediateRender: false}, 0.5)
    .to(textTwo, 0.25, {opacity: 1, x: 0, immediateRender: false}, 1)
  return swipeTL
}
// 5. Slide in from left
const environment = () => {
  const envTL = new TimelineMax()
  envTL.to(textOne, 0, {delay: 0.5, text: 'environment', scale: 2}, 0)
    .to(textTwo, 0, {delay: 0.5, text: ''}, 0)
  return envTL
}
// 6. Pulse
// 7. Pop


advertTl.add(intro())
  .add(swap(textOne, 'is', 0))
  .add(swap(textOne, 'a'))
  .add(slidingWords())
  .add(environment())
  // .add(swipe(textOne, 'environment'))
  // .add(swap('for'))
  // .add(swap('front-end'))
  // .add(swap('designers'))
  // .add(swap('and'))
  // .add(swap('developers.'))
  // .add(swap('👋'))
