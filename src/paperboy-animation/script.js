const root = document.documentElement
const $bike = document.querySelector('.bike')
const $colorizer = document.querySelector('.colorizer')
const $colorways = document.querySelector('.colorways')

const CLASSMAP = {
  'bike__handlebars': '--handlebars',
  'bike__seat': '--seat',
  'bike__frame': '--frame',
  'bike__stem': '--stem',
  'bike__forks': '--forks',
  'bike__wheel': '--mags',
  'bike__cranks': '--sprocket',
  'bike__tyres': '--tyres',
  'bike__crank': '--cranks',

}

const THEMES = {
  DEFAULT: {
    '--frame': '#ff0000',
    '--seat': '#000000',
    '--handlebars': '#ff0000',
    '--forks': '#ff0000',
    '--stem': '#000000',
    '--mags': '#ffffff',
    '--sprocket': '#c0c0c0',
    '--pedals': '#c0c0c0',
    '--tyres': '#000000',
    '--cranks': '#000000',
  },
  STEALTH: {
    '--frame': '#000000',
    '--seat': '#000000',
    '--handlebars': '#6e6e6e',
    '--forks': '#6e6e6e',
    '--stem': '#000000',
    '--mags': '#ffffff',
    '--sprocket': '#6e6e6e',
    '--pedals': '#c0c0c0',
    '--tyres': '#000000',
    '--cranks': '#000000',
  },
  LEMONANDLIME: {
    '--frame': '#00f900',
    '--seat': '#000000',
    '--handlebars': '#fffb00',
    '--forks': '#fffb00',
    '--stem': '#000000',
    '--mags': '#c5c5c5',
    '--sprocket': '#ffffff',
    '--pedals': '#c0c0c0',
    '--tyres': '#000000',
    '--cranks': '#000000',
  },
  SKYLINE: {
    '--frame': '#3af4f8',
    '--seat': '#000000',
    '--handlebars': '#3af4f8',
    '--forks': '#3af4f8',
    '--stem': '#000000',
    '--mags': '#000000',
    '--sprocket': '#c0c0c0',
    '--pedals': '#c0c0c0',
    '--tyres': '#ffffff',
    '--cranks': '#000000',
  },
  BADBARBIE: {
    '--frame': '#000000',
    '--seat': '#ff00ec',
    '--handlebars': '#ff00ec',
    '--forks': '#000000',
    '--stem': '#000000',
    '--mags': '#ff00ec',
    '--sprocket': '#ff00ec',
    '--pedals': '#c0c0c0',
    '--tyres': '#000000',
    '--cranks': '#000000',
  }
}

const addOffClick = (e, cb) => {
  const offClick = (evt) => {
    if (e !== evt) {
      cb()
      document.removeEventListener('click', offClick)
    }
  }
  document.addEventListener('click', offClick)
}

const bootstrapTheme = theme => {
  for (const prop of Object.keys(theme)) {
    root.style.setProperty(prop, theme[prop])
  }
}

const handleColorChange = (e) => {
  let propToUpdate
  for (const className of e.target.classList) {
    if (CLASSMAP[className]) propToUpdate = CLASSMAP[className]
  }
  if (propToUpdate) {
    const currentValue = root.style.getPropertyValue(propToUpdate) || getComputedStyle(e.target).backgroundColor
    $colorizer.value = currentValue
    const updateColor = (e) => {
      root.style.setProperty(propToUpdate, e.target.value)
      addOffClick(e, () => {
        $colorizer.removeEventListener('input', updateColor)
      })
    }
    $colorizer.addEventListener('input', updateColor)
    $colorizer.click()
  }
}

const setColorway = (e) => {
  if (e.target.hasAttribute('data-colorway')) {
    bootstrapTheme(THEMES[e.target.getAttribute('data-colorway')])
  }
}

bootstrapTheme(THEMES.DEFAULT)
$bike.addEventListener('click', handleColorChange)
$colorways.addEventListener('click', setColorway)