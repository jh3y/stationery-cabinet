const {
  gsap: {
    set,
    to,
    timeline,
    utils: { random },
  },
} = window

const TAILS = [...document.querySelectorAll('.kitty__tail')]
const STARS = [...document.querySelectorAll('.stars path')]
const BUBBLES = [...document.querySelectorAll('.rocket__bubbles path')]
const EYES = [...document.querySelectorAll('.kitty__eye')]

set('.scene', { display: 'block' })

set(TAILS[1], { display: 'none' })
to(TAILS[0], {
  duration: 0.1,
  ease: 'none',
  yoyo: true,
  repeat: -1,
  morphSVG: TAILS[1],
})

set('.stars path', {
  y: -1185,
  transformOrigin: '50% 50%',
  rotation: 'random(0, 360)',
})

STARS.forEach(star =>
  to(star, {
    repeat: -1,
    duration: 'random(4, 10)',
    delay: () => 'random(-10, -5)',
    y: 1185,
    ease: 'none',
  })
)

set(BUBBLES, { scale: 0, transformOrigin: '50% 50%' })
BUBBLES.forEach(bubble =>
  timeline({ repeat: -1 })
    .to(bubble, {
      duration: 0.5,
      scale: 2.5,
    })
    .to(
      bubble,
      {
        duration: 0.2,
        opacity: 0,
      },
      '>-0.2'
    )
    .seek(Math.random())
)

set(EYES, { transformOrigin: '50% 50%', rotate: -25 })

const blink = () => {
  const delay = random(2, 5)
  to(EYES, {
    delay,
    duration: 0.1,
    repeat: 1,
    yoyo: true,
    scaleY: 0,
    onComplete: () => blink(),
  })
}
blink()

to('.kitty__head', {
  repeat: -1,
  yoyo: true,
  rotate: 2,
  duration: 0.1,
  transformOrigin: '75% 75%',
})

to('.kitty__arm', {
  repeat: -1,
  yoyo: true,
  rotate: 2,
  duration: 0.1,
  transformOrigin: '75% 15%',
})
to('.kitty__leg--left', {
  repeat: -1,
  yoyo: true,
  rotate: 2,
  duration: 0.1,
  transformOrigin: '50% 5%',
})
to('.kitty__leg--right', {
  repeat: -1,
  yoyo: true,
  rotate: -2,
  duration: 0.1,
  transformOrigin: '50% 5%',
})
const PARTY = timeline({
  paused: true,
}).fromTo(
  document.body,
  {
    '--hue': 0,
  },
  {
    '--hue': 360,
    repeat: 10,
    ease: 'none',
  }
)

// HMM not sure??
// to('.kitty__arm--right', {
//   repeat: -1,
//   yoyo: true,
//   rotate: -2,
//   duration: 0.1,
//   transformOrigin: '75% 25%',
// })

// Yeah, that's it...

// Why are you still going?

// You wouldn't want to party would you?

// No, stop, honestly, this party isn't even that cool!

const keys = []
const shouldWeParty = e => {
  keys.push(e.key)
  if (
    keys
      .slice(keys.length - 5, keys.length)
      .join('')
      .toLowerCase() === 'party'
  ) {
    // Let's party
    keys.length = 0
    PARTY.restart()
  }
}
window.addEventListener('keyup', shouldWeParty)
