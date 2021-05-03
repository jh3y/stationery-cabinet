import gsap from 'https://cdn.skypack.dev/gsap'

const { DrawSVGPlugin } = window
const { registerPlugin, fromTo } = gsap

registerPlugin(DrawSVGPlugin)

fromTo(
  '.temporal path',
  {
    drawSVG: 0,
  },
  {
    repeat: -1,
    repeatDelay: 2,
    drawSVG: '-100%',
    duration: 1.25,
    ease: 'power1.inOut',
  }
)
