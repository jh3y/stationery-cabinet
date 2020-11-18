const {
  gsap: {
    timeline,
    set,
    utils: { random },
  },
} = window

const AUDIO = {
  CLICK: new Audio('https://assets.codepen.io/605876/click.mp3'),
  IN: new Audio('https://assets.codepen.io/605876/pac-in.mp3'),
  OUT: new Audio('https://assets.codepen.io/605876/pac-out.mp3'),
}

const CONTAINER = document.querySelector('.pac-input')
const PAC = CONTAINER.querySelector('.pac-input__pac')
const GHOST = CONTAINER.querySelector('.pac-input__ghost')
const EYES = GHOST.querySelector('.pac-input__ghost-eyes')
const INPUT = CONTAINER.querySelector('input')
const CLOAK = CONTAINER.querySelector('.pac-input__cloak')

const COLORS = {
  INPUT: 'hsl(0, 0%, 60%)',
  BG: 'hsl(0, 0%, 0%)',
  GHOST: ['orange', 'green', 'pink', 'red'],
}
const DURATIONS = {
  ENV: 0.15,
  CHOMP: 1,
  GHOST: 1,
  EYES: 0.5,
}

const BLINK = () => {
  const delay = random(2, 6)
  timeline().to(EYES, {
    delay,
    onComplete: () => BLINK(),
    scaleY: 0.1,
    repeat: 3,
    yoyo: true,
    duration: 0.05,
  })
}
BLINK()

const hidePassword = () => {
  timeline({
    onStart: () => AUDIO.CLICK.play(),
    onComplete: () => {
      AUDIO.OUT.pause()
      AUDIO.OUT.currentTime = 0
    },
  })
    .to(GHOST, {
      duration: DURATIONS.EYES,
      right: '105%',
      ease: 'none',
      onStart: () => {
        AUDIO.OUT.play()
        set(GHOST, { backgroundColor: COLORS.INPUT })
      },
    })
    .to(
      CLOAK,
      {
        duration: DURATIONS.EYES,
        onComplete: () => {
          set(PAC, { right: 10, scale: 0 })
          set(INPUT, { attr: { type: 'password' } })
        },
        left: -5,
        ease: 'none',
      },
      0
    )
    .to(CLOAK, DURATIONS.ENV, {
      duration: DURATIONS.ENV,
      opacity: 0,
      onComplete: () => {
        set(CLOAK, { left: '100%', opacity: 1 })
      },
    })
    .to(
      PAC,
      {
        duration: DURATIONS.ENV,
        scale: 1,
      },
      DURATIONS.EYES
    )
}

const showPassword = () => {
  timeline({
    onStart: () => AUDIO.CLICK.play(),
    onComplete: () => {
      AUDIO.IN.pause()
      AUDIO.IN.currentTime = 0
    },
  })
    .to(INPUT, {
      duration: DURATIONS.ENV,
      onStart: () => {
        set(GHOST, {
          backgroundColor: `var(--ghost--${
            COLORS.GHOST[Math.floor(Math.random() * COLORS.GHOST.length)]
          })`,
        })
      },
      letterSpacing: 15,
      backgroundColor: COLORS.BG,
      color: 'hsl(0, 0, 98%)',
    })
    .to(
      CLOAK,
      {
        duration: DURATIONS.ENV,
        backgroundColor: COLORS.BG,
      },
      0
    )
    .to(PAC, DURATIONS.CHOMP, {
      duration: DURATIONS.CHOMP,
      right: '105%',
      ease: 'none',
      onStart: () => {
        AUDIO.IN.play()
        PAC.classList.add('pac-input__pac--chomping')
      },
      onComplete: () => {
        PAC.classList.remove('pac-input__pac--chomping')
        set(INPUT, { attr: { type: 'text' } })
      },
    })
    .to(
      CLOAK,
      {
        duration: DURATIONS.CHOMP,
        left: -5,
        ease: 'none',
      },
      '<'
    )
    .to(GHOST, {
      duration: DURATIONS.GHOST,
      right: 10,
      ease: 'none',
    })

    .to(
      CLOAK,
      {
        duration: DURATIONS.GHOST,
        left: '100%',
        ease: 'none',
      },
      '<'
    )
    .to(INPUT, {
      duration: DURATIONS.ENV,
      letterSpacing: 1,
      backgroundColor: COLORS.INPUT,
      color: 'black',
    })
    .to(
      CLOAK,
      {
        duration: DURATIONS.ENV,
        backgroundColor: COLORS.INPUT,
      },
      '<'
    )
}

PAC.addEventListener('click', showPassword)
GHOST.addEventListener('click', hidePassword)
