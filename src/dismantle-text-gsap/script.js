// eslint-disable-next-line
;(function() {
  const {
    gsap: { set, to, timeline },
  } = window
  const $TEXT_ONE = document.querySelector('.text--one')
  const $TEXT_TWO = document.querySelector('.text--two')
  const $LOGO = document.querySelector('img')
  const $LOGO_CONTAINER = document.querySelector('.logo-container')
  const $CRANES = [...document.querySelectorAll('.crane')]
  const $LINE_ONE = [...$TEXT_ONE.querySelectorAll('.word')]
  const $LINE_TWO = [...$TEXT_TWO.querySelectorAll('.word')]
  const $DOTS = [...document.querySelectorAll('.dot')]
  const $CROSSES = [...document.querySelectorAll('.cross')]
  const $MOVING_PARTS = [$DOTS[0], $DOTS[1], ...$CROSSES, $DOTS[3]]
  // Only targets the crosses and dots in the actual words, not the duplicates
  const $DOUBLE_DOTS_ONE = [...$TEXT_ONE.querySelectorAll('.i__dot')]
  const $DOUBLE_CROSSES_ONE = [...$TEXT_ONE.querySelectorAll('.t__cross')]

  const FADE_DUR = 0.25
  const STAGGER = 0.1
  const STEP_DELAY = 1
  const STEP_DUR = 0.05

  const resetPositions = () => {
    set(
      [
        ...$MOVING_PARTS,
        ...$CRANES,
        $LINE_ONE,
        ...$DOTS,
        ...$CROSSES,
        ...$LINE_ONE,
        ...$LINE_TWO,
        $LINE_TWO,
        ...$DOUBLE_CROSSES_ONE,
        ...$DOUBLE_DOTS_ONE,
        ...$CRANES,
        $LOGO_CONTAINER,
      ],
      {
        clearProps: true,
      }
    )
    for (const CRANE of $CRANES) CRANE.removeAttribute('data-offset')
    set([$TEXT_TWO, $LINE_ONE, $DOTS, $CROSSES, $LINE_TWO], {
      opacity: 0,
    })
  }

  const movePart = (index, reversed, onStart) => {
    const CRANE = $CRANES[index]
    // Work out the speed in relation to where the text is in the window
    const DURATION = CRANE.dataset.offset / 750
    return (
      new timeline({ repeatRefresh: true, reversed, onStart })
        // .add(set($MOVING_PARTS[index], { opacity: 1 }))
        .add(
          to(CRANE, {
            duration: DURATION,
            [CRANE.className.includes('vertical') ? 'y' : 'x']: `${
              CRANE.className.includes('right') ? '-' : '+'
            }=${CRANE.dataset.offset}`,
          })
        )
        .add(
          to($MOVING_PARTS[index], {
            duration: DURATION,
            [CRANE.className.includes('vertical') ? 'y' : 'x']: `${
              CRANE.className.includes('right') ? '+' : '-'
            }=${CRANE.dataset.offset}`,
          }),
          DURATION
        )
        .add(
          to($CRANES[index], {
            duration: DURATION,
            [CRANE.className.includes('vertical') ? 'y' : 'x']: `${
              CRANE.className.includes('right') ? '+' : '-'
            }=${CRANE.dataset.offset}`,
          }),
          DURATION
        )
    )
  }

  const setPositions = () => {
    /**
     * Set up the logo position
     */
    const LOGO_BOUNDS = $LOGO.getBoundingClientRect()
    // Use the image height as that will be set whereas the image may not have loaded
    // and means the rendered width would be 0
    $LOGO_CONTAINER.dataset.offset = LOGO_BOUNDS.left + LOGO_BOUNDS.height * 2
    set($LOGO_CONTAINER, { x: -$LOGO_CONTAINER.dataset.offset })

    /**
     * Set up all the moving parts
     */
    const BOUNDS = $MOVING_PARTS.map(el => {
      return {
        pos:
          el.tagName.toLowerCase() === 'svg'
            ? el.querySelector('g').getBoundingClientRect()
            : el.getBoundingClientRect(),
        el,
      }
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
      CRANE.dataset.offset = isH
        ? CRANE.className.includes('right')
          ? BOUND.pos.left + BOUND.pos.width * 2
          : BOUND.pos.left + BOUND.pos.width * 2
        : BOUND.pos.top + BOUND.pos.height * 2
      set(CRANE, {
        [isH ? 'top' : 'bottom']: isH
          ? BOUND.pos.top + BOUND.pos.height / 2 - CRANE.offsetHeight / 2
          : window.innerHeight - (BOUND.pos.top + BOUND.pos.height),
        [isH
          ? CRANE.className.includes('right')
            ? 'left'
            : 'right'
          : 'left']: isH
          ? CRANE.className.includes('right')
            ? BOUND.pos.left + BOUND.pos.width
            : window.innerWidth - BOUND.pos.left
          : BOUND.pos.left + BOUND.pos.height / 2 - CRANE.offsetWidth / 2,
        [isH ? 'x' : 'y']: CRANE.className.includes('right')
          ? `+=${CRANE.dataset.offset}`
          : `-=${CRANE.dataset.offset}`,
        transformOrigin: '50% 50%',
      })
    }
  }

  const genTL = () => {
    resetPositions()
    setPositions()
    return (
      new timeline({
        delay: 1,
        repeat: -1,
        repeatDelay: 1.5,
      })
        // Fade in all the words
        .add(
          to($LINE_ONE, { duration: FADE_DUR, stagger: STAGGER, opacity: 1 })
        )
        // Bring in the duplicates and hide the originals 👍
        .add(
          set([$DOTS[0], $DOTS[1], $CROSSES], {
            opacity: 1,
          })
        )
        .add(set([...$DOUBLE_DOTS_ONE, ...$DOUBLE_CROSSES_ONE], { opacity: 0 }))
        // Bring in the crane and take out the dots
        .add(movePart(0))
        .add(movePart(1))
        .add(movePart(2))
        .add(movePart(3))
        .add(movePart(4))
        .add(
          new timeline()
            .add(to($LINE_ONE, { duration: STEP_DUR, opacity: 0 }))
            .add(to($DOTS[2], { duration: STEP_DUR, opacity: 1 }), 0)
        )
        .add(set($TEXT_TWO, { opacity: 1 }))
        .add(
          to($LINE_TWO, {
            delay: STEP_DELAY,
            duration: FADE_DUR,
            stagger: STAGGER,
            opacity: 1,
          })
        )
        .add(
          movePart(5, true, () => set($DOTS[3], { opacity: 1 })),
          '-=0.5'
        )
        .add(
          to([$TEXT_TWO, $DOTS[2], $DOTS[3]], {
            delay: STEP_DELAY,
            duration: STEP_DUR,
            opacity: 0,
          })
        )
        .add(
          to($LOGO_CONTAINER, {
            delay: STEP_DELAY,
            duration: $LOGO_CONTAINER.dataset.offset / 500,
            x: `+=${$LOGO_CONTAINER.dataset.offset}`,
          })
        )
        .add(
          to($CRANES[5], {
            duration: $LOGO_CONTAINER.dataset.offset / 1000,
            x: `-=${$LOGO_CONTAINER.dataset.offset}`,
          })
        )
    )
  }
  let TL = genTL()
  /**
   * When we resize the window, we need to kill the current timeline and
   * generate a new one killing and invalidating all of the current timeline settings
   */
  window.addEventListener('resize', () => {
    TL.kill()
    TL.invalidate()
    TL = genTL()
  })
})()
