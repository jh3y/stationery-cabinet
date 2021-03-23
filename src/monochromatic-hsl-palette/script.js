const { $, Prism } = window

const CODE_BLOCK = document.querySelector('code')
const STYLE_BLOCK = document.querySelector('#update')
const CODE_TEMPLATE = (hue, saturation, lightness) => {
  const STEP = (lightness[1] - lightness[0]) / 7
  let RESULT = `:root {\n`
  for (let s = 0; s < 8; s++) {
    RESULT += `  --shade-${s + 1}: hsl(${hue}, ${saturation}%, ${Math.floor(
      lightness[1] - s * STEP
    )}%);\n`
  }
  return (RESULT += '}')
}

const UPDATE = () => {
  const CODE = CODE_TEMPLATE(
    $('#hue').slider('value'),
    $('#saturation').slider('value'),
    $('#lightness').slider('values')
  )
  const HTML = Prism.highlight(CODE, Prism.languages.css, 'css')
  STYLE_BLOCK.innerHTML = CODE
  CODE_BLOCK.innerHTML = HTML
}

$('#hue').slider({
  min: 0,
  max: 360,
  step: 1,
  slide: UPDATE,
})
$('#saturation').slider({
  min: 0,
  max: 100,
  step: 1,
  slide: UPDATE,
})
$('#lightness').slider({
  range: true,
  min: 0,
  max: 100,
  values: [0, 100],
  step: 1,
  slide: UPDATE,
})

$('#hue').slider('value', Math.floor(Math.random() * 360))
$('#saturation').slider('value', Math.floor(Math.random() * 100))

UPDATE()
