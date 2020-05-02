const {
  gsap: { timeline },
} = window

const URL = 'https://pokeapi.co/api/v2/pokemon/'
const POKEMON_COUNT = 151
const OPEN_SPEED = 0.25
const HEADER = document.querySelector('.pokedex__pokemon-name')
const IMG = document.querySelector('.pokedex__image')
const OPEN_BUTTON = document.querySelector('.open')
const CLOSE_BUTTON = document.querySelector('.close')
const GRAB_BUTTON = document.querySelector('.grab')

const getPokemon = async () => {
  const ID = Math.floor(Math.random() * POKEMON_COUNT) + 1
  const POKEMON_DATA = await (await fetch(`${URL}${ID}`)).json()
  return POKEMON_DATA
}

const UPDATE_SOUND = new Audio(
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/pokedex.mp3'
)
const OPEN_SOUND = new Audio(
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/open.mp3'
)
let flashTL
const updatePokemon = async () => {
  const {
    name,
    sprites: { front_default: src },
  } = await getPokemon()
  HEADER.innerHTML = name
  IMG.removeAttribute('href')
  IMG.setAttribute('href', src)
  UPDATE_SOUND.play()
  const repeat = Math.floor(Math.random() * 5) + 2
  if (flashTL) {
    flashTL.progress(0)
    flashTL.kill()
  }
  flashTL = new timeline().to('.pokedex__flash', {
    duration: OPEN_SPEED / 2,
    repeat: repeat % 2 !== 1 ? repeat - 1 : repeat,
    opacity: 1,
    yoyo: true,
    ease: 'steps(1)',
  })
}

GRAB_BUTTON.addEventListener('click', updatePokemon)
const OPEN_TL = new timeline({
  paused: true,
  onStart: () => {
    OPEN_SOUND.play()
  },
  onComplete: updatePokemon,
})
  .to('.pokedex__container', { x: '-=43%', duration: OPEN_SPEED }, 0)
  .to('.pokedex__flip', { rotateY: '+=180', duration: OPEN_SPEED }, 0)

const openPokedex = () => {
  OPEN_TL.play()
}
OPEN_BUTTON.addEventListener('click', openPokedex)
CLOSE_BUTTON.addEventListener('click', () => {
  OPEN_SOUND.play()
  OPEN_TL.reverse()
})
