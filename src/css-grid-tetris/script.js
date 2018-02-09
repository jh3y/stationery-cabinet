const TRAVEL = 10

const blocks = document.querySelectorAll('.block')
const square = document.querySelectorAll('.square')
const t1 = document.querySelectorAll('.tee--1')
const t2 = document.querySelectorAll('.tee--2')
const s = document.querySelectorAll('.ess')
const l1 = document.querySelectorAll('.ell--1')
const l2 = document.querySelectorAll('.ell--2')
const stick1 = document.querySelectorAll('.stick--1')
const stick2 = document.querySelectorAll('.stick--2')

const dropDuration = 1.5

const createDrop = (elem, steps, delay) => TweenLite.to(elem, dropDuration, {
  y: '0%',
  ease: SteppedEase.config(steps),
  delay,
})


const squareDrop = createDrop(square, 10, 0.5)
const t2Drop = createDrop(t2, 10)
const sDrop = createDrop(s, 10)
const t1Drop = createDrop(t1, 9)
const l1Drop = createDrop(l1, 8)
const l2Drop = createDrop(l2, 9)
const stick1Drop = createDrop(stick1, 7)
const stick2Drop = createDrop(stick2, 7)

const blocksExplode = TweenLite.to(blocks, .35, {
  scale: 1.75,
  backgroundColor: 'white',
  borderWidth: 0,
})

const blocksImplode = TweenLite.to(blocks, .15, {
  scale: 0,
})

const timeline = new TimelineMax()
timeline.add(squareDrop)
  .add(t2Drop)
  .add(sDrop)
  .add(t1Drop)
  .add(l1Drop)
  .add(l2Drop)
  .add(stick1Drop)
  .add(stick2Drop)
  .add(blocksExplode)
  .add(blocksImplode)
  .repeat(-1)