const {
  gsap: { set, timeline, to },
} = window
set('.pulser', { transformOrigin: '50% 50%' })
set('.main-attraction', { transformOrigin: '50% 50%' })
set('.main-blurb', { transformOrigin: '0 100%' })

const change = (fill, mainFill, delay = 1) =>
  new timeline({ delay })
    .to('.main-backdrop', { fill: mainFill, duration: 1 }, 0)
    .to('.main-attraction', { scale: 0, duration: 0.5 }, 0)
    .to('.main-blurb', { scale: 0, duration: 0.5 }, 0)
    .set('.main-attraction', { fill })
    .to('.main-attraction', { scale: 1, duration: 0.5 })
    .to('.main-blurb', { scale: 1, duration: 0.5 }, '<')
new timeline({ repeat: -1 })
  .add(change('blue', 'orange'))
  .add(change('red', 'green'))
  .add(change('#faa', 'purple'))

to('.pulser', { scale: 1.075, duration: 0.1, yoyo: true, repeat: -1 })

const changeB = fill => to('.disco-board', { fill, duration: 0.1 })

new timeline({ repeat: -1, repeatDelay: 1, delay: 1 })
  .to('.disco-blurb', {
    scale: 0,
    transformOrigin: '100% 100% ',
    duration: 0.25,
  })
  .add(
    new timeline({ repeat: 5 })
      .add(changeB('red'))
      .add(changeB('orange'))
      .add(changeB('green'))
      .add(changeB('blue'))
      .add(changeB('indigo'))
      .add(changeB('violet'))
      .add(changeB('purple'))
  )
  .to('.disco-board', { fill: '#00aad4', duration: 0.25 })
  .to('.disco-blurb', { scale: 1, duration: 0.5 })

// 100 x to 57.75 y is the ratio for movement
const shift = distance => ({ x: distance, y: distance * -0.5775 })

set(['.road--one', '.back--one', '.front--one'], shift(2388.25 + 150))
set(['.road--two', '.back--two', '.front--two'], shift(150))

set(['.truck', '.convertible'], shift(150))

// set('.hatchback', { x: -50, y: 50 * -0.5775 })

set('.traffic-light', { fill: 'black' })
set('.traffic-light-east .traffic-light--red', { fill: 'red' })
set('.traffic-light-west .traffic-light--red', { fill: 'red' })

to(['.hatchback__body', '.convertible__body'], {
  y: 1,
  yoyo: true,
  repeat: -1,
  duration: 0.01,
})
to('.truck__body', {
  y: '+=1',
  repeat: -1,
  yoyo: true,
  duration: 0.2,
  delay: 0.1,
})
set('.truck__body', { y: 10 })

const MOVE = shift(2388.25)
const VERT_SHIFT = shift(80)
const hatchStop = () =>
  new timeline()
    .set('.traffic-light-west .traffic-light--green', { fill: 'green' }, 0)
    .set('.traffic-light-west .traffic-light--red', { fill: 'black' }, 0)
    .set('.hatchback', { x: -50, y: 50 * -0.5775 })
    .to('.hatchback', { x: 0, y: 0, duration: 4 })
    .set('.traffic-light-west .traffic-light--green', { fill: 'black' }, 0.5)
    .set('.traffic-light-west .traffic-light--amber', { fill: 'yellow' }, 0.5)
    .set('.traffic-light-west .traffic-light--amber', { fill: 'black' }, 1.5)
    .set('.traffic-light-west .traffic-light--red', { fill: 'red' }, 1.5)

const journeyStart = () =>
  new timeline({ delay: 1 })
    .set('.traffic-light-east .traffic-light--red', { fill: 'black' }, 0)
    .set('.traffic-light-east .traffic-light--amber', { fill: 'yellow' }, 0)
    .set('.traffic-light-east .traffic-light--amber', { fill: 'black' }, 1)
    .set('.traffic-light-east .traffic-light--green', { fill: 'green' }, 1)
    .to(['.road', '.front', '.back'], {
      delay: 1,
      duration: 6,
      x: `-=${MOVE.x}`,
      y: `-=${MOVE.y}`,
    })
    .to(
      '.convertible',
      {
        x: `+=${VERT_SHIFT.x}`,
        y: `+=${VERT_SHIFT.y}`,
        duration: 1,
        yoyo: true,
        repeat: 1,
      },
      '<0.5'
    )
    .to(
      '.convertible__body',
      {
        x: -15,
        y: 15 * -0.5775,
        duration: 1,
        yoyo: true,
        repeat: 1,
      },
      '<'
    )
    .to(
      '.truck__body',
      {
        x: -5,
        y: 5 * -0.5775,
        duration: 1,
        yoyo: true,
        repeat: 3,
      },
      '<'
    )
    .add(
      new timeline()
        .set('.traffic-light-east .traffic-light--green', { fill: 'black' }, 0)
        .set('.traffic-light-east .traffic-light--amber', { fill: 'yellow' }, 0)
        .set('.traffic-light-east .traffic-light--amber', { fill: 'black' }, 1)
        .set('.traffic-light-east .traffic-light--red', { fill: 'red' }, 1),
      4
    )

new timeline({ repeat: -1 }).add(journeyStart()).add(hatchStop(), '>-3')
