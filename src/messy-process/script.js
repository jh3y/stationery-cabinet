const {
  gsap: {
    to,
    timeline,
    set,
    utils: { random },
  },
} = window

set('svg', { display: 'block ' })

set('.text path', {
  fill: 'hsl(0, 0%, 100%)',
  transformOrigin: '50% 100%',
  scaleY: 0,
})

const strands = [...document.querySelectorAll('.strands path')]

set(strands, {
  '--hue': random(0, 360),
  '--luminosity': () => random(15, 40),
  strokeDashoffset: index => -Math.round(strands[index].getTotalLength()) - 25,
  strokeDasharray: index => Math.round(strands[index].getTotalLength()) + 50,
})

const STRAND_TWEEN = () =>
  to(
    strands.sort(() => 0.5 - Math.random()),
    {
      repeatRefresh: true,
      duration: () => random(2, 10),
      strokeDashoffset: 0,
      stagger: 0.1,
    }
  )

const TEXT_TWEEN = () =>
  to(
    [...document.querySelectorAll('.text path')].sort(
      () => 0.5 - Math.random()
    ),
    {
      ease: 'bounce.out',
      scaleY: 1,
      stagger: 0.1,
      duration: 0.5,
    }
  )

const PLAY = () =>
  timeline()
    .add(STRAND_TWEEN())
    .add(TEXT_TWEEN(), '<3.5')

let TL = PLAY()

document.body.addEventListener('click', () => {
  set(strands, {
    '--hue': random(0, 360),
    '--luminosity': () => random(15, 40),
  })
  TL.pause()
  TL.time(0)
  TL.kill()
  TL = PLAY()
  // PLAY()
})
