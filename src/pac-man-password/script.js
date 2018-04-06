const pacInput = document.querySelector('.pac-input')
const pac = pacInput.querySelector('.pac-input__pac')
const ghost = pacInput.querySelector('.pac-input__ghost')
const ghostEyes = ghost.querySelector('.pac-input__ghost-eyes')
const input = pacInput.querySelector('input')
const cloak = pacInput.querySelector('.pac-input__cloak')
const inputBounds = input.getBoundingClientRect()
const pacBounds = pac.getBoundingClientRect()

const COLORS = {
  INPUT: '#aaa',
  BG: '#111',
  GHOST: [
    'rgb(253, 177, 71)',
    'rgb(63, 219, 192)',
    'rgb(251, 179, 202)',
    'rgb(248, 34, 17)',
  ]
}
const DURATIONS = {
  ENV: 0.15,
  CHOMP: 1,
  GHOST: 1,
  EYES: 0.5,
}

const hidePassword = () => {
  const ghostTimeline = new TimelineMax()
  ghostTimeline
    .add(
      TweenMax.to(ghost, DURATIONS.EYES, {
        right: '105%',
        ease: Power0.easeNone,
        onStart: () => {
          ghost.style.backgroundColor = COLORS.INPUT
        },
        onComplete: () => {
          ghost.style.backgroundColor = 'green'
        },
      }),
      0
    )
    .add(
      TweenMax.to(cloak, DURATIONS.EYES, {
        onComplete: () => {
          input.setAttribute('type', 'password')
        },
        left: -5,
        ease: Power0.easeNone,
      }),
      0
    )
    .add(
      TweenMax.to(pac, 0, {
        right: 10,
        scale: 0,
      })
    )
    .add(
      TweenMax.to(cloak, DURATIONS.ENV, {
        opacity: 0,
        onComplete: () => {
          cloak.style.left = '100%'
          cloak.style.opacity = 1
        },
      })
    )
    .add(
      TweenMax.to(pac, DURATIONS.ENV, {
        scale: 1,
      }),
      DURATIONS.EYES
    )
}

const showPassword = () => {
  const pacTimeline = new TimelineMax()
  pacTimeline
    .add(
      TweenMax.to(input, DURATIONS.ENV, {
        onStart: () => {
          ghost.style.backgroundColor = COLORS.GHOST[Math.floor(Math.random() * COLORS.GHOST.length)]
        },
        letterSpacing: 15,
        backgroundColor: COLORS.BG,
        color: 'yellow',
      })
    )
    .add(
      TweenMax.to(cloak, DURATIONS.ENV, {
        backgroundColor: COLORS.BG,
      }),
      0
    )
    .add(
      TweenMax.to(pac, DURATIONS.CHOMP, {
        right: '105%',
        ease: Power0.easeNone,
        onStart: () => {
          pac.classList.add('pac-input__pac--chomping')
        },
        onComplete: () => {
          pac.classList.remove('pac-input__pac--chomping')
          input.setAttribute('type', 'text')
        },
      })
    )
    .add(
      TweenMax.to(cloak, DURATIONS.CHOMP, {
        left: -5,
        ease: Power0.easeNone,
      }),
      DURATIONS.ENV
    )
    .add(
      TweenMax.to(ghost, DURATIONS.GHOST, {
        right: 10,
        ease: Power0.easeNone,
      })
    )
    .add(
      TweenMax.to(cloak, DURATIONS.GHOST, {
        left: '100%',
        ease: Power0.easeNone,
      }),
      DURATIONS.ENV + DURATIONS.CHOMP
    )
    .add(
      TweenMax.to(input, DURATIONS.ENV, {
        letterSpacing: 1,
        backgroundColor: COLORS.INPUT,
        color: 'black',
      })
    )
    .add(
      TweenMax.to(cloak, DURATIONS.ENV, {
        backgroundColor: COLORS.INPUT,
      }),
      DURATIONS.ENV + DURATIONS.CHOMP + DURATIONS.GHOST
    )
}

pac.addEventListener('click', showPassword)
ghost.addEventListener('click', hidePassword)
