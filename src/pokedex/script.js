const URL = 'https://pokeapi.co/api/v2/pokemon/'
const POKEMON_COUNT = 151

const HEADER = document.querySelector('.pokedex__pokemon-name')
const IMG = document.querySelector('.pokedex__image')
const GRAB_BUTTON = document.querySelector('.grab')
const SVG_GRAB_BUTTON = document.querySelector('.pokedex__main-button')
const BUTTONS = [GRAB_BUTTON, SVG_GRAB_BUTTON]

const getPokemon = async () => {
  const ID = Math.floor(Math.random() * POKEMON_COUNT) + 1
  const POKEMON_DATA = await (await fetch(`${URL}${ID}`)).json()
  // console.info(POKEMON_DATA)
  return POKEMON_DATA
}

const UPDATE_SOUND = new Audio(
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/pokedex.mp3'
)

const updatePokemon = async () => {
  const {
    name,
    sprites: { front_default: src },
  } = await getPokemon()
  HEADER.innerHTML = name
  IMG.removeAttribute('href')
  IMG.setAttribute('href', src)
  // IMG.href = src
  // Play sound
  UPDATE_SOUND.play()
  // Update the button appearance
  SVG_GRAB_BUTTON.classList.remove('pokedex__main-button--active')
}

const depressButton = () => {
  SVG_GRAB_BUTTON.classList.add('pokedex__main-button--active')
}

BUTTONS.forEach(BUTTON => BUTTON.addEventListener('pointerup', updatePokemon))
BUTTONS.forEach(BUTTON => BUTTON.addEventListener('pointerdown', depressButton))

// Grab the initial pokemon
updatePokemon()
