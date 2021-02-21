import gsap from 'https://cdn.skypack.dev/gsap'

const duration = 1
const JUMP_DISTRO = gsap.utils.distribute({
  amount: 1,
  base: 0,
  grid: 'auto',
  from: 'edges',
})
const HUE_DISTRO = gsap.utils.distribute({
  amount: 1,
  base: 0,
  grid: 'auto',
  from: 'center',
})

const SHROOMS = gsap.utils.toArray('.shroom')
const JUMP = () => {
  const TL = gsap.timeline()
  for (let m = 0; m < SHROOMS.length; m++) {
    const SHROOM = SHROOMS[m]
    const BODY = SHROOM.querySelector('.shroom__body')
    gsap.set(BODY, { transformOrigin: '50% 100%' })
    const HUE_TL = gsap.timeline().to(SHROOM, {
      '--hue': 360,
      duration: duration * 2,
      yoyo: true,
    })
    const JUMP_TL = gsap
      .timeline()
      .set(BODY, {
        scaleY: 0.9,
        scaleX: 1.1,
      })
      .to(BODY, {
        yPercent: -25,
        duration: duration,
        yoyo: true,
        repeat: 1,
      })
      .to(
        BODY,
        {
          scaleY: 0.9,
          scaleX: 1.1,
          duration: 0.25,
        },
        '>-0.2'
      )
      .to(
        BODY,
        {
          scaleY: 1,
          scaleX: 1,
          duration: 0.25,
        },
        0
      )
      .to(
        BODY,
        {
          scaleY: 1.1,
          scaleX: 0.9,
          duration: 0.25,
        },
        '>'
      )
    TL.add(JUMP_TL, JUMP_DISTRO(m, SHROOM, SHROOMS)).add(
      HUE_TL,
      HUE_DISTRO(m, SHROOM, SHROOMS)
    )
  }
  return TL
}

const PADDED = gsap.timeline({ repeat: -1 })
PADDED.add(JUMP())
  .add(JUMP(), '>-1')
  .add(JUMP(), '>-1')

gsap.fromTo(
  PADDED,
  {
    totalTime: 1,
  },
  {
    repeat: -1,
    duration: 1,
    totalTime: 5,
    ease: 'none',
  }
)
gsap.set('.shroom__field', { opacity: 1 })
