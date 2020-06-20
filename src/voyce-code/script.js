const {
  gsap: { timeline },
} = window
const COMMON = {
  ease: 'sine.inOut',
  y: -10,
  duration: 1,
  stagger: {
    repeat: -1,
    yoyo: true,
    each: 0.15,
  },
}
timeline()
  .to(['#c', '#o', '#d', '#e'], COMMON)
  .to([...document.querySelectorAll('.two .letter')].reverse(), COMMON, 0.1)
  .to([...document.querySelectorAll('.three .letter')].reverse(), COMMON, 0.2)
  .to([...document.querySelectorAll('.four .letter')].reverse(), COMMON, 0.3)
  .to([...document.querySelectorAll('.five .letter')].reverse(), COMMON, 0.4)
  .time(Math.random())
