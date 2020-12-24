import gsap from 'https://cdn.skypack.dev/gsap'

// const CHUNK = 5000
const VISION_TOGGLE = document.querySelector('#vision')
const VOLUME_TOGGLE = document.querySelector('#volume')
const HEAD_RANGE = 3
const MOUTH_RANGE = 4
const EYE_RANGE = 5
const AUDIO = {
  POP: new Audio('https://assets.codepen.io/605876/pop.mp3'),
  TOGGLE: new Audio('https://assets.codepen.io/605876/toggle.mp3'),
  CHEWING: new Audio('https://assets.codepen.io/605876/chewing.mp3'),
  HOOVER: new Audio('https://assets.codepen.io/605876/hoover.mp3'),
  ROLLOVER: new Audio('https://assets.codepen.io/605876/rollover.mp3'),
}
AUDIO.TOGGLE.muted = AUDIO.POP.muted = AUDIO.CHEWING.muted = AUDIO.HOOVER.muted = AUDIO.ROLLOVER.muted = true
AUDIO.CHEWING.loop = true
VOLUME_TOGGLE.addEventListener('change', () => {
  AUDIO.TOGGLE.muted = AUDIO.POP.muted = AUDIO.CHEWING.muted = AUDIO.HOOVER.muted = AUDIO.ROLLOVER.muted = !AUDIO
    .TOGGLE.muted
  if (AUDIO.TOGGLE.muted) window.PLAYER.mute()
  else window.PLAYER.unMute()
  AUDIO.TOGGLE.play()
})
VISION_TOGGLE.addEventListener('change', () => {
  AUDIO.TOGGLE.play()
})
const FOODS = [
  {
    name: 'Grapes',
    position: [0, 0],
    score: 5,
    chew: 1,
  },
  {
    name: 'Watermelon',
    position: [2, 0],
    score: 5,
    chew: 2,
  },
  {
    name: 'Banana',
    position: [5, 0],
    score: 4,
    chew: 3,
  },
  {
    name: 'Apple',
    position: [9, 0],
    score: 6,
    chew: 3,
  },
  {
    name: 'Strawberry',
    position: [13, 0],
    score: 6,
    chew: 0.5,
  },
  {
    name: 'Broccoli',
    position: [11, 1],
    score: 6,
    chew: 2,
  },
  {
    name: 'Burger',
    position: [14, 2],
    score: 1,
    chew: 10,
  },
  {
    name: 'Mushroom',
    position: [14, 1],
    score: 10,
    chew: 0.5,
  },
  {
    name: 'Pizza',
    position: [0, 3],
    score: 1,
    chew: 6,
  },
  {
    name: 'Fries',
    position: [15, 2],
    score: 0.5,
    chew: 8,
  },
  {
    name: 'Cupcake',
    position: [15, 5],
    score: 1,
    chew: 5,
  },
  {
    name: 'Cake',
    position: [14, 5],
    score: 1,
    chew: 10,
  },
  {
    name: 'Donut',
    position: [11, 5],
    score: 2,
    chew: 10,
  },
]
const SELECTORS = {
  GLOBE: '.globe',
  CONTAINER: '.globe__container',
  MOUTH_CHEWING: '.globe__mouth--chewing',
  MOUTH_SMILE: '.globe__mouth--smile',
  MOUTH_JOY: '.globe__mouth--joy',
  MOUTH_OPEN: '.globe__mouth--open',
  CHEW_CENTER: '.chew-line--center',
  CHEW_LEFT: '.chew-line--left',
  CHEW_RIGHT: '.chew-line--right',
  MOUTH_CONTAINER: '.globe__mouth-container',
  EYES: '.globe__eyes',
  EYE_JOY: '.globe__eye--joy',
  EYE_OPEN: '.globe__eye--open',
  CHEEKS: '.globe__cheeks',
  STAR: '.star',
  INVERT: 'data-parallax-invert',
  RANGE: 'data-parallax-range',
}

// Register Draggable
gsap.registerPlugin(window.Draggable)

gsap.set([SELECTORS.MOUTH_CONTAINER, SELECTORS.EYES], {
  transformOrigin: '50% 50%',
})
gsap.set(
  [
    SELECTORS.CHEEKS,
    SELECTORS.EYE_JOY,
    SELECTORS.MOUTH_OPEN,
    SELECTORS.MOUTH_JOY,
    SELECTORS.MOUTH_CHEWING,
  ],
  {
    display: 'none',
  }
)

const mapBounds = (valueX, valueY, bound, invert) => {
  const x = gsap.utils.mapRange(
    0,
    window.innerWidth,
    invert ? bound : -bound,
    invert ? -bound : bound,
    valueX
  )
  const y = gsap.utils.mapRange(
    0,
    window.innerHeight,
    invert ? bound : -bound,
    invert ? -bound : bound,
    valueY
  )
  return {
    x,
    y,
  }
}
const STARS = document.querySelectorAll(SELECTORS.STAR)
const UPDATE_FEATURES = ({ x, y }) => {
  gsap.set(SELECTORS.EYES, mapBounds(x, y, EYE_RANGE))
  gsap.set(
    [SELECTORS.MOUTH_CONTAINER, SELECTORS.CHEEKS],
    mapBounds(x, y, MOUTH_RANGE)
  )
  gsap.set(SELECTORS.GLOBE, mapBounds(x, y, HEAD_RANGE))
  STARS.forEach(s => {
    const INVERT = s.hasAttribute(SELECTORS.INVERT)
    const RANGE = parseFloat(s.getAttribute(SELECTORS.RANGE))
    gsap.set(s, mapBounds(x, y, RANGE, INVERT))
  })
}

const ROCKING = gsap
  .timeline({
    paused: true,
    repeat: -1,
    yoyo: true,
  })
  .to(SELECTORS.CONTAINER, { yPercent: '-=2' })

const CHEWING_SPEED = 0.1
const CHEWING = gsap
  .timeline({
    paused: true,
    repeat: -1,
    yoyo: true,
  })
  .to(
    SELECTORS.MOUTH_CHEWING,
    {
      yPercent: 25,
      duration: CHEWING_SPEED,
    },
    0
  )
  .to(
    SELECTORS.CHEW_CENTER,
    {
      scaleX: 0.5,
      duration: CHEWING_SPEED,
      transformOrigin: '50% 50%',
    },
    0
  )
  .to(
    SELECTORS.CHEW_LEFT,
    {
      duration: CHEWING_SPEED,
      xPercent: 80,
    },
    0
  )
  .to(
    SELECTORS.CHEW_RIGHT,
    {
      duration: CHEWING_SPEED,
      xPercent: -80,
    },
    0
  )

let blinkTween
const BLINK = () => {
  const delay = gsap.utils.random(1, 5)
  blinkTween = gsap.to(SELECTORS.EYES, {
    delay,
    scaleY: 0.1,
    repeat: 3,
    yoyo: true,
    duration: 0.05,
    onComplete: () => {
      BLINK()
    },
  })
}
BLINK()
window.addEventListener('pointermove', UPDATE_FEATURES)
const BUFFER = 50
const genPoint = multiplier => {
  const x = gsap.utils.random(
    window.innerWidth * multiplier,
    window.innerWidth * (1 - multiplier)
  )
  const y = gsap.utils.random(
    window.innerHeight * multiplier,
    window.innerHeight * (1 - multiplier)
  )
  // If there's an overlap, return the function, else return result
  const BOUNDS = document.querySelector(SELECTORS.GLOBE).getBoundingClientRect()
  if (
    x >= BOUNDS.left - BUFFER &&
    x <= BOUNDS.left + BOUNDS.width + BUFFER &&
    y >= BOUNDS.top - BUFFER &&
    y <= BOUNDS.top + BOUNDS.height + BUFFER
  )
    return genPoint(multiplier)
  else return { x, y }
}

// YouTube functions
const shutOff = () => {
  window.PLAYER.pauseVideo()
  STATE.PLAYING = false
  STATE.TIMER = 0
  STATE.TIMEOUT = null
  // TIMER_LABEL.innerText = REDUCER_LABEL.innerText = 0
  if (STATE.REDUCER) clearInterval(STATE.REDUCER)
  STATE.REDUCER = null
  if (!STATE.CHEWING) {
    gsap.set([SELECTORS.MOUTH_JOY, SELECTORS.EYE_JOY], {
      display: 'none',
    })
    gsap.set([SELECTORS.MOUTH_SMILE, SELECTORS.EYE_OPEN], { display: 'block' })
  }
  BLINK()
  ROCKING.pause()
}

const UPDATE = () => {
  STATE.TIMER -= 10
  // REDUCER_LABEL.innerText = STATE.TIMER
}
const topUp = score => {
  STATE.PLAYING = true
  window.PLAYER.playVideo()
  STATE.TIMER += score
  // TIMER_LABEL.innerText = STATE.TIMER
  if (STATE.TIMEOUT) clearTimeout(STATE.TIMEOUT)
  STATE.TIMEOUT = setTimeout(shutOff, STATE.TIMER)
  if (!STATE.REDUCER) STATE.REDUCER = setInterval(UPDATE, 10)
  // window.PLAYER[`${STATE.PLAYING ? 'pause' : 'play'}Video`]()
}

const onDrag = function(e) {
  if (this.hitTest(document.querySelector('.globe__drop-zone'), '50%')) {
    gsap.set([SELECTORS.MOUTH_SMILE, SELECTORS.MOUTH_CHEWING], {
      display: 'none',
    })
    gsap.set(SELECTORS.MOUTH_OPEN, { display: 'block' })
  } else {
    if (!STATE.PLAYING)
      gsap.set(SELECTORS[STATE.CHEWING ? 'MOUTH_CHEWING' : 'MOUTH_SMILE'], {
        display: 'block',
      })
    else if (STATE.CHEWING)
      gsap.set(SELECTORS.MOUTH_CHEWING, { display: 'block' })
    gsap.set(SELECTORS.MOUTH_OPEN, { display: 'none' })
  }
}

const onRelease = function(e) {
  if (this.hitTest(document.querySelector('.globe__drop-zone'), '50%')) {
    AUDIO.HOOVER.play()
    gsap.set(SELECTORS.MOUTH_SMILE, { display: 'none' })
    gsap.set(SELECTORS.MOUTH_OPEN, { display: 'block' })
    gsap.to(e.target, {
      scale: 0,
      onComplete: () => {
        AUDIO.HOOVER.pause()
        AUDIO.HOOVER.currentTime = 0
        topUp(parseInt(e.target.getAttribute('data-score'), 10) * 1000)
        if (blinkTween) {
          gsap.set(SELECTORS.EYES, { scaleY: 1 })
          blinkTween.kill()
        }
        gsap.set(
          [
            SELECTORS.MOUTH_JOY,
            SELECTORS.MOUTH_OPEN,
            SELECTORS.EYE_OPEN,
            SELECTORS.MOUTH_SMILE,
          ],
          {
            display: 'none',
          }
        )
        gsap.set(
          [SELECTORS.MOUTH_CHEWING, SELECTORS.EYE_JOY, SELECTORS.CHEEKS],
          { display: 'block' }
        )
        POPULATE_FOOD()
        ROCKING.play()
        CHEWING.play()
        AUDIO.CHEWING.play()
        STATE.CHEWING = true
        gsap.delayedCall(e.target.getAttribute('data-chew'), () => {
          CHEWING.pause()
          AUDIO.CHEWING.pause()
          AUDIO.CHEWING.currentTime = 0
          STATE.CHEWING = false
          gsap.set([SELECTORS.MOUTH_CHEWING, SELECTORS.CHEEKS], {
            display: 'none',
          })
          gsap.set([SELECTORS[STATE.PLAYING ? 'MOUTH_JOY' : 'MOUTH_SMILE']], {
            display: 'block',
          })
          if (!STATE.PLAYING) {
            gsap.set(SELECTORS.EYE_JOY, { display: 'none' })
            gsap.set(SELECTORS.EYE_OPEN, { display: 'block' })
          }
        })
      },
      x:
        window.innerWidth / 2 -
        parseFloat(e.target.style.getPropertyValue('--x'), 10) -
        e.target.offsetWidth / 2,
      y:
        window.innerHeight / 2 -
        parseFloat(e.target.style.getPropertyValue('--y'), 10) -
        e.target.offsetHeight / 2,
    })
  } else {
    if (!STATE.PLAYING)
      gsap.set(SELECTORS[STATE.CHEWING ? 'MOUTH_CHEWING' : 'MOUTH_SMILE'], {
        display: 'block',
      })
    else if (STATE.CHEWING)
      gsap.set(SELECTORS.MOUTH_CHEWING, { display: 'block' })
    gsap.set(SELECTORS.MOUTH_OPEN, { display: 'none' })
    gsap.to(e.target, {
      x: 0,
      y: 0,
    })
  }
}

const POPULATE_FOOD = () => {
  const ITEM = document.createElement('div')
  ITEM.className = 'food'
  const { x, y } = genPoint(0.1)
  const INDEX = Math.floor(Math.random() * (FOODS.length - 1))
  const CHOSEN = FOODS[INDEX]
  ITEM.style.setProperty('--x', x)
  ITEM.style.setProperty('--y', y)
  ITEM.style.setProperty('--bx', CHOSEN.position[0] * -72)
  ITEM.style.setProperty('--by', CHOSEN.position[1] * -72)
  ITEM.setAttribute('title', CHOSEN.name)
  ITEM.setAttribute('data-chew', CHOSEN.chew)
  ITEM.setAttribute('data-score', CHOSEN.score)
  window.Draggable.create(ITEM, {
    onDrag,
    onRelease,
  })
  ITEM.addEventListener('pointerover', () => {
    gsap.to(ITEM, {
      duration: 0.1,
      scale: 1.5,
      rotate: Math.random() > 0.5 ? 30 : -30,
      yoyo: true,
      repeat: 1,
    })
  })
  document.body.appendChild(ITEM)
  gsap.from(ITEM, { onStart: () => AUDIO.POP.play(), scale: 0, duration: 0.2 })
}
for (let i = 0; i < 5; i++) {
  POPULATE_FOOD()
}
// Start YouTube Embed Code

// YouTube Video ID
const videoId = '8NLLAeNhH3k'

const STATE = {
  PLAYING: false,
  TIMER: 0,
  CHEWING: false,
  TIMEOUT: null,
  REDUCER: null,
}

const onReady = () => {
  // Mute the player by default/for streaming
  // TODO: Remove!
  window.PLAYER.mute()
  // seekTo can skip to miss the gap at the start
  window.PLAYER.seekTo(10)
  // Pause it as seek starts playing
  window.PLAYER.pauseVideo()
}
const onStateChange = e => {
  // Track has ended
  if (e.data === 0) {
    window.PLAYER.seekTo(10)
    window.PLAYER.pauseVideo()
    STATE.PLAYING = false
  }
}
// console.info(YT)
// window.onYouTubeIframeAPIReady = () => {
// console.info('hello')
window.PLAYER = new window.YT.Player('player', {
  height: 200,
  width: 200,
  videoId,
  events: {
    onReady,
    onStateChange,
  },
})
// }
gsap.set(SELECTORS.CONTAINER, { display: 'block' })
