// eslint-disable-next-line
;(function() {
  const {
    gsap: { set, to, timeline },
  } = window
  let BOUNDS
  const $TEXT_ONE = document.querySelector('.text--one')
  const $TEXT_TWO = document.querySelector('.text--two')
  const $LOGO = document.querySelector('img')

  const $CRANES = [...document.querySelectorAll('.crane')]
  const $LINE_ONE = [...$TEXT_ONE.querySelectorAll('.word')]
  const $DOTS = [...document.querySelectorAll('.dot')]
  const $CROSSES = [...document.querySelectorAll('.cross')]
  const $MOVING_PARTS = [$DOTS[0], $DOTS[1], ...$CROSSES, $DOTS[3]]
  // Only targets the crosses and dots in the actual words, not the duplicates
  const $DOUBLE_DOTS_ONE = [...$TEXT_ONE.querySelectorAll('.i__dot')]
  const $DOUBLE_CROSSES_ONE = [...$TEXT_ONE.querySelectorAll('.t__cross')]

  set($TEXT_TWO, { opacity: 0 })
  set($LOGO, { opacity: 0 })
  set($LINE_ONE, { opacity: 0 })
  set($DOTS, { opacity: 0 })
  set($CROSSES, { opacity: 0 })

  const DOT_ONE_TL = (index, craneDuration, takeDuration) => {
    const CRANE = $CRANES[index]
    // Work out the speed in relation to where the text is in the window
    // Let's say the velocity is 1px === 1ms

    return new timeline()
      .add(
        to(CRANE, {
          duration: craneDuration,
          [CRANE.className.includes('vertical') ? 'y' : 'x']: `${
            CRANE.className.includes('right') ? '-' : '+'
          }=100vmax`,
        })
      )
      .add(
        to($MOVING_PARTS[index], {
          duration: takeDuration,
          [CRANE.className.includes('vertical') ? 'y' : 'x']: `${
            CRANE.className.includes('right') ? '+' : '-'
          }=100vmax`,
        }),
        craneDuration
      )
      .add(
        to($CRANES[index], {
          duration: takeDuration,
          [CRANE.className.includes('vertical') ? 'y' : 'x']: `${
            CRANE.className.includes('right') ? '+' : '-'
          }=100vmax`,
        }),
        craneDuration
      )
  }

  const setPositions = () => {
    BOUNDS = $MOVING_PARTS.map(el => {
      return el.classList.contains('dot')
        ? { pos: el.querySelector('.i__dot').getBoundingClientRect(), el }
        : { pos: el.querySelector('.t__cross').getBoundingClientRect(), el }
    })
    // 0 === UsIng
    // 1 === JavaScrIpt
    // 2 === JavaScripT
    // 3 === To
    // 4 === texT
    // 5 === . <

    for (let b = 0; b < BOUNDS.length; b++) {
      const BOUND = BOUNDS[b]
      const CRANE = $CRANES[b]
      const isH = CRANE.className.includes('horizontal')
      set(CRANE, {
        top: isH ? BOUND.pos.top + BOUND.pos.height / 2 : BOUND.pos.top,
        left: isH
          ? CRANE.className.includes('right')
            ? BOUND.pos.left + BOUND.pos.width
            : BOUND.pos.left
          : BOUND.pos.left + BOUND.pos.height / 2,
        [isH ? 'x' : 'y']: CRANE.className.includes('right')
          ? '+=100vmax'
          : '-=100vmax',
        transformOrigin: '50% 50%',
      })
    }
  }

  const animate = () =>
    new timeline({ delay: 1, repeat: 0, repeatDelay: 1 })
      .add(setPositions())
      // Fade in all the words
      .add(to($LINE_ONE, { duration: 0.25, stagger: 0.1, opacity: 1 }))
      // Bring in the duplicates and hide the originals 👍
      .add(
        set([$DOTS[0], $DOTS[1], $CROSSES], {
          opacity: 1,
        })
      )
      .add(set([$DOUBLE_DOTS_ONE, $DOUBLE_CROSSES_ONE], { opacity: 0 }))
      // Bring in the crane and take out the dots
      .add(DOT_ONE_TL(0, 0.5, 0.5))
      .add(DOT_ONE_TL(1, 0.5, 0.5))
      // Take away those crosses
      .add(DOT_ONE_TL(2, 0.5, 0.5))
      .add(DOT_ONE_TL(3, 0.5, 0.5))
      .add(DOT_ONE_TL(4, 0.5, 0.5))
  let TL = animate()
  window.addEventListener('resize', () => {
    TL.seek(0)
    setPositions()
    TL.play()
  })
})()
