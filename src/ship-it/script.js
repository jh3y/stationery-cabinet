const {
  gsap: {
    timeline,
    set,
    delayedCall,
    utils: { random },
  },
  Splitting,
} = window

// [ship horn.wav](https://freesound.org/people/monotraum/sounds/208714/) by [monotraum](https://freesound.org/people/monotraum/) via [freesound.org](https://freesound.org)
// [ferry ship engine and waves](https://freesound.org/people/jgrzinich/sounds/377629/) by [jgrzinich](https://freesound.org/people/jgrzinich/) via [freesound.org](https://freesound.org)
// [crane](https://freesound.org/people/sinewave1kHz/sounds/207386/) by [sinewave1kHz](https://freesound.org/people/sinewave1kHz/) via [freesound.org](https://freesound.org)
// [Videogame Menu BUTTON CLICK](https://freesound.org/people/Christopherderp/sounds/342200/) by [Christopherderp](https://freesound.org/people/Christopherderp/) via [freesound.org](https://freesound.org)
// [Air Impact Wrench](https://freesound.org/people/sevenbsb/sounds/349398/) by [sevenbsb](https://freesound.org/people/sevenbsb/) via [freesound.org](https://freesound.org)
// [traditional stamp.wav](https://freesound.org/people/I.fekry/sounds/470710/) by [I.fekry](https://freesound.org/people/I.fekry/) via [freesound.org](https://freesound.org)
const AUDIO = {
  CHEER: new Audio('https://assets.codepen.io/605876/cheer.mp3'),
  AMBIENCE: new Audio(
    'https://assets.codepen.io/605876/boat-engine-water-ambience.mp3'
  ),
  HORN_ONE: new Audio('https://assets.codepen.io/605876/boat-horn-one.mp3'),
  HORN_TWO: new Audio('https://assets.codepen.io/605876/boat-horn-two.mp3'),
  CLICK: new Audio('https://assets.codepen.io/605876/button-click.mp3'),
  CRANE_ONE: new Audio(
    'https://assets.codepen.io/605876/crane-movement-one.mp3'
  ),
  CRANE_TWO: new Audio(
    'https://assets.codepen.io/605876/crane-movement-two.mp3'
  ),
  WRENCH: new Audio('https://assets.codepen.io/605876/impact-wrench.mp3'),
  THUD: new Audio('https://assets.codepen.io/605876/thud.mp3'),
}

AUDIO.CHEER.muted = AUDIO.AMBIENCE.muted = AUDIO.HORN_ONE.muted = AUDIO.HORN_TWO.muted = AUDIO.CLICK.muted = AUDIO.CRANE_ONE.muted = AUDIO.CRANE_TWO.muted = AUDIO.WRENCH.muted = AUDIO.THUD.muted = true
// Let's tween the volume up and down
AUDIO.AMBIENCE.volume = 0
const toggleAudio = () => {
  AUDIO.CHEER.muted = AUDIO.AMBIENCE.muted = AUDIO.HORN_ONE.muted = AUDIO.HORN_TWO.muted = AUDIO.CLICK.muted = AUDIO.CRANE_ONE.muted = AUDIO.CRANE_TWO.muted = AUDIO.WRENCH.muted = AUDIO.THUD.muted = !AUDIO
    .THUD.muted
}
document.querySelector('#volume').addEventListener('input', toggleAudio)

Splitting()

let shippingSpeed = 1
const PPS = 350

const WAVES_SET_ONE_DUR = random(0.8, 2)
const WAVES_SET_TWO_DUR = random(0.8, 2)

const SCALE_UP =
  240 / document.querySelector('.container').getBoundingClientRect().width

const WAVES = timeline({ paused: true })
  .to(
    ['.wave--1', '.wave--2'],
    {
      repeat: -1,
      xPercent: '+=100',
      duration: WAVES_SET_ONE_DUR,
      ease: 'none',
    },
    0
  )
  .to(
    ['.wave--3', '.wave--4'],
    {
      repeat: -1,
      xPercent: '+=100',
      duration: WAVES_SET_TWO_DUR,
      ease: 'none',
    },
    0
  )
  .to(
    ['.wave--1', '.wave--2'],
    {
      repeat: -1,
      duration: random(0.5, 2),
      y: random(0, 5),
      yoyo: true,
      ease: 'none',
    },
    0
  )
  .to(
    ['.wave--3', '.wave--4'],
    {
      repeat: -1,
      duration: random(0.5, 2),
      y: random(0, 5),
      yoyo: true,
      ease: 'none',
    },
    0
  )

const STEAM = timeline({ paused: true })
  .fromTo(
    '.boat__bubble',
    {
      x: 0,
      y: 0,
      scale: 0,
    },
    {
      stagger: {
        each: 0.15,
        repeat: -1,
      },
      repeatRefresh: true,
      x: () => random(10, 20),
      y: () => random(-5, -15),
      scale: () => random(1, 1.75),
      duration: () => random(0.1, 1.5),
    }
  )
  .to('.boat__bubble', { opacity: 0 }, '-=0.5')

const EYES = document.querySelector('.boat__eyes')
const blink = EYES => {
  set(EYES, { scaleY: 1 })
  if (EYES.BLINK_TL) EYES.BLINK_TL.kill()
  EYES.BLINK_TL = timeline({
    delay: Math.floor(Math.random() * 4) + 1,
    onComplete: () => blink(EYES),
  })
  EYES.BLINK_TL.to(EYES, {
    duration: 0.05,
    transformOrigin: '50% 50%',
    scaleY: 0,
    yoyo: true,
    repeat: 1,
  })
}
blink(EYES)

const BUTTON_TL = () =>
  timeline()
    .set('.container', { opacity: 1 })
    .to('[data-word="Ship"]', { x: 50, y: -15 })
    .to('[data-word="it!"]', { x: 13, y: 20 }, '<')
    .to('button', { borderRadius: 0 })
    .to('button', { '--a': 0, duration: 0.5 })
    .to('.container__main', { opacity: 1 }, '<')
    .to('.word', { opacity: 0.5 }, '<')
    .to(
      [
        '.container__component',
        '.container__label',
        '.container__vent',
        '.container__hazard',
        '.container__line',
      ],
      {
        onStart: () => AUDIO.WRENCH.play(),
        stagger: 0.1,
        scale: 1,
        ease: 'elastic.out(1, 0.5)',
      }
    )
    .from('.container__logo', {
      onStart: () => AUDIO.THUD.play(),
      scale: 0,
      ease: 'elastic.out(1, 0.5)',
    })
// .to()

const CRANE_TL = () =>
  timeline({
    onStart: () => {
      AUDIO.CRANE_ONE.play()
    },
  })
    .to(['.container'], {
      yPercent: -50,
      duration: 2,
    })
    .to(
      'button',
      {
        yPercent: -56,
        duration: 2,
      },
      0
    )
    .to(['.container', 'button'], {
      onStart: () => {
        AUDIO.CRANE_ONE.pause()
        AUDIO.CRANE_ONE.currentTime = 0
        AUDIO.CRANE_TWO.play()
      },
      onComplete: () => {
        AUDIO.CRANE_TWO.pause()
        AUDIO.CRANE_TWO.currentTime = 0
      },
      duration: 2,
      scale: 0.09,
    })

const DROP_TL = () =>
  timeline({
    onStart: () => {
      AUDIO.CRANE_ONE.play()
    },
    onComplete: () => {
      AUDIO.CRANE_ONE.pause()
      AUDIO.CRANE_ONE.currentTime = 0
    },
  })
    .to(['.container'], {
      yPercent: 0,
    })
    .to(
      ['button'],
      {
        yPercent: -3,
      },
      0
    )
const SHIPPING_DISTANCE = () => window.innerWidth * 1
const SHIP_TL = () =>
  timeline({
    delay: 1,
    onStart: () => {
      delayedCall(
        () => random(0, shippingSpeed),
        () => AUDIO.HORN_TWO.play()
      )
    },
    onComplete: () => {
      STEAM.pause()
      WAVES.pause()
      AUDIO.AMBIENCE.pause()
      AUDIO.AMBIENCE.currentTime = 0
    },
  })
    .to(['.boat-svg', 'button', '.container-svg'], {
      x: () => `-=${SHIPPING_DISTANCE()}`,
      duration: shippingSpeed,
    })
    .to(WAVES, { timeScale: 1 }, '<')
    .to(AUDIO.AMBIENCE, { volume: 0 }, '<')

const BOAT_IN_TL = () => {
  shippingSpeed = SHIPPING_DISTANCE() / PPS
  return timeline({
    onStart: () => {
      AUDIO.AMBIENCE.play()
      STEAM.play()
      WAVES.play()
      delayedCall(
        () => random(0, shippingSpeed),
        () => AUDIO.HORN_ONE.play()
      )
    },
  })
    .set('.boat-svg', { opacity: 1 })
    .from('.boat-svg', {
      x: `+=${SHIPPING_DISTANCE()}`,
      duration: shippingSpeed,
    })
    .to(WAVES, { timeScale: 0.2 }, '<')
    .to(AUDIO.AMBIENCE, { volume: 1 }, '<')
}

const BTN = document.querySelector('button')
const RESET = INITIAL => {
  BTN.classList.remove('busy')
  set('.ship-it', { opacity: 1 })
  set(['.container-svg'], {
    transformOrigin: '50% 100%',
    scale: SCALE_UP,
  })
  set('.btn-txt--shipped', { display: 'none' })
  set('.container__logo', { transformOrigin: '50% 50%', rotate: -10 })
  set('button', { transformOrigin: '50% 50%', '--a': 1 })
  set('.container', { transformOrigin: '50% 50%' })
  set('.container__line', {
    transformOrigin: '50% 100%',
    scale: 0,
  })
  set(['.boat-svg', '.container'], { opacity: 0 })
  set(['.container__main', '.container__outline', '.corgo-stamp'], {
    opacity: 0,
  })
  set(
    [
      '.container__component',
      '.container__label',
      '.container__vent',
      '.container__hazard',
    ],
    {
      transformOrigin: '50% 50%',
      scale: 0,
    }
  )
  set('.ship-it', { scale: 0.5 })
  set('.blank--2', { xPercent: 100 })
  set('.blank--3', { xPercent: 100, yPercent: -100 })
  set('.blank--4', { xPercent: 100, yPercent: -200 })
  set('.blank--5', { xPercent: -100 })
  set('.blank--6', { xPercent: -100, yPercent: -100 })
  set('.blank--7', { xPercent: -100, yPercent: -200 })
  set('.blank--8', { xPercent: -100, yPercent: -300 })
  set('.blank--9', { xPercent: -200 })
  set('.blank--10', { xPercent: -200, yPercent: -100 })
  set('.blank--11', { xPercent: -200, yPercent: -200 })
  set('.blank--12', { xPercent: -200, yPercent: -300 })
  set('.blank--13', { xPercent: -200, yPercent: -400 })
  set('.blank--15', { xPercent: -300 })
  set('.blank--16', { xPercent: -300, yPercent: -100 })
  set('.blank', { '--hue': () => random(0, 360) })
  set('.container', { '--hue': () => random(0, 360) })
  set(['.wave--1', '.wave--2'], { '--hue': random(180, 210) })
  set(['.wave--3', '.wave--4'], { '--hue': random(180, 210) })
  set('.boat__bubble', {
    transformOrigin: '50% 50%',
    '--lightness': () => random(70, 100),
  })
  set('.btn-txt--shipped .char', { yPercent: 0 })
  set('.word', { opacity: 1 })
  set(['.wave--2', '.wave--4'], { xPercent: -100 })
  set('.ship-it', { scale: 0.5 })
  set('.boat-svg', { x: 0, xPercent: -50, opacity: 0 })
  set('.container', { scale: 1, x: 0, xPercent: -50, y: 0, opacity: 0 })
  set('.container-svg', { x: 0 })
  set('[data-word="Ship"]', { x: 0, y: 0 })
  set('[data-word="it!"]', { x: 0, y: 0 })
  if (!INITIAL) {
    timeline({
      onComplete: () => {
        BTN.removeAttribute('disabled')
      },
    })
      .set('button', { x: 0, y: 0, scale: 0, '--a': 1, borderRadius: 6 })
      .set('.btn-txt--shipped', { display: 'block' })
      .set('.btn-txt--ship .char', { scale: 0, transformOrigin: '50% 100%' })
      .to('button', {
        scale: 1,
      })
      .to('.btn-txt--shipped .char', {
        yPercent: 100,
        stagger: 0.1,
        delay: 1,
        duration: 0.1,
      })
      .to('.btn-txt--ship .char', {
        scale: 1,
        stagger: 0.1,
        delay: 2,
        duration: 0.1,
      })
  }
}
set('button', { scale: 1 })
RESET(true)
const SHIP = () => {
  timeline({
    onStart: () => {
      AUDIO.CLICK.play()
      BTN.classList.toggle('busy')
      BTN.disabled = true
    },
    onComplete: () => {
      AUDIO.CHEER.play()
      RESET()
    },
  })
    .to('.ship-it', {
      scale: 1,
    })
    .add(BUTTON_TL())
    .add(CRANE_TL())
    .add(BOAT_IN_TL())
    .add(DROP_TL())
    .add(SHIP_TL())
}
BTN.addEventListener('click', () => {
  SHIP()
})
