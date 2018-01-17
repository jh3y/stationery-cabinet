// create enumeration object for repeated class names
const CLASSES = {
  marker: 'input__marker',
  visible: 'input__marker--visible',
}

/**
 * returns x, y coordinates for absolute positioning of a span within a given text input
 * at a given selection point
 * @param {object} input - the input element to obtain coordinates for
 * @param {number} selectionPoint - the selection point for the input
 */
const getCaretXY = (input, selectionPoint) => {
  // create a dummy element that will be a clone of our input
  const div = document.createElement('div')
  // get the computed style of the input and clone it onto the dummy element
  const copyStyle = getComputedStyle(input)
  for (const prop of copyStyle) {
    div.style[prop] = copyStyle[prop]
  }
  // append the dummy element to the body
  document.body.appendChild(div)
  // we need a character that will replace whitespace when filling our dummy element
  const swap = '.'
  // set the div content to that of the textarea up until selection
  const inputValue = input.value.replace(/ /g, swap)
  const textContent = inputValue.substr(0, selectionPoint)
  // set the text content of the dummy element div
  div.textContent = textContent
  if (input.tagName === 'TEXTAREA') div.style.height = 'auto'
  // if a single line input then the div needs to be single line and not break out like a text area
  if (input.tagName === 'INPUT') div.style.width = 'auto'
  // create a marker element to obtain caret position
  const span = document.createElement('span')
  // set its positioning to absolute
  span.style.position = 'absolute'
  // append the span marker to the div
  div.appendChild(span)
  // get the marker position, this is the caret position top and left
  const { offsetLeft: x, offsetTop: y } = span
  // lastly, remove that dummy element
  // NOTE:: can comment this out for debugging purposes if you want to see where that span is rendered
  document.body.removeChild(div)
  // return an object with the x and y of the caret
  return {
    x,
    y,
  }
}

/**
 * shows a position marker that highlights where the caret is
 * @param {object} e - the input or click event that has been fired
 */
const showPositionMarker = e => {
  // grab the marker for the input
  const marker = e.currentTarget.parentElement.querySelector(
    `.${CLASSES.marker}`
  )
  // create a function that will handle clicking off of the input and hide the marker
  const processClick = evt => {
    if (e !== evt && evt.target !== e.target) {
      toggleMarker()
    }
  }
  // create a function that will toggle the showing of the marker
  const toggleMarker = () => {
    marker.__IS_SHOWING = !marker.__IS_SHOWING
    document[
      marker.classList.contains(CLASSES.visible)
        ? 'removeEventListener'
        : 'addEventListener'
    ]('click', processClick)
    marker.classList[
      marker.classList.contains(CLASSES.visible) ? 'remove' : 'add'
    ](CLASSES.visible)
  }
  // if the marker isn't showing, show it
  if (!marker.__IS_SHOWING) toggleMarker()
  // if the marker is showing, update its position
  if (marker.__IS_SHOWING) {
    // grab the input element
    const { currentTarget: input } = e
    // grab the properties from the input that we are interested in
    const {
      offsetHeight,
      offsetWidth,
      scrollLeft,
      scrollTop,
      selectionEnd,
    } = input
    // get style property values that we are interested in
    const { lineHeight, paddingRight } = getComputedStyle(input)
    // get the caret X and Y from our helper function
    const { x, y } = getCaretXY(input, selectionEnd)
    // set the marker positioning
    // for the left positioning we ensure that the maximum left position is the width of the input minus the right padding using Math.min
    // we also account for current scroll position of the input
    marker.style.left = Math.min(
      x - scrollLeft,
      offsetWidth - parseInt(paddingRight, 10)
    )
    // for the top positioning we ensure that the maximum top position is the height of the input minus line height
    // we also account for current scroll position of the input
    marker.style.top = Math.min(
      y - scrollTop,
      offsetHeight - parseInt(lineHeight, 10)
    )
  }
}

/**
 * shows a position marker for where a user has selected input content
 * @param {object} e - mouseup event for text selection
 */
const getSelectionArea = e => {
  // grab the input element
  const { currentTarget: input } = e
  // grab the properties of the input we are interested in
  const {
    offsetWidth,
    scrollLeft,
    scrollTop,
    selectionStart,
    selectionEnd,
  } = input
  // grab styling properties we are interested in
  const { paddingRight } = getComputedStyle(input)
  // grab the marker for the input
  const marker = input.parentElement.querySelector(`.${CLASSES.marker}`)
  // create a function that will handle clicking off of the input and hide the marker
  const processClick = evt => {
    if (e !== evt && evt.target !== e.target) {
      toggleMarker()
    }
  }
  // create a function that will toggle the showing of the marker
  const toggleMarker = () => {
    marker.__IS_SHOWING = !marker.__IS_SHOWING
    document[
      marker.classList.contains(CLASSES.visible)
        ? 'removeEventListener'
        : 'addEventListener'
    ]('click', processClick)
    marker.classList[
      marker.classList.contains(CLASSES.visible) ? 'remove' : 'add'
    ](CLASSES.visible)
  }
  // if selectionStart === selectionEnd then there is no actual selection, hide the marker and return
  if (selectionStart === selectionEnd) {
    if (marker.__IS_SHOWING) toggleMarker()
    return
  }
  // we need to get the start and end positions so we can work out a midpoint to show our marker
  // first, get the starting top and left using selectionStart
  const { y: startTop, x: startLeft } = getCaretXY(input, selectionStart)
  // then get the ending top and left using selectionEnd
  const { y: endTop, x: endLeft } = getCaretXY(input, selectionEnd)
  // if the marker isn't showing and there's a selection, show the marker
  if (!marker.__IS_SHOWING && selectionStart !== selectionEnd) {
    toggleMarker()
  }
  // if the marker is showing then update its position
  if (marker.__IS_SHOWING) {
    // we don't care about the value of endTop as our marker will always show at the top point and this will always be startTop
    // account for scroll position by negating scrollTop
    marker.style.top = startTop - scrollTop
    // as for left positioning, we need to first work out if the end point is on the same line or we have multiline selection
    // in the latter case, the endpoint will be the furthest possible right selection point
    const endPoint =
      startTop !== endTop ? offsetWidth - parseInt(paddingRight, 10) : endLeft
    // we want the marker to show above the selection and in the middle of the selection so start point plus halve the endpoint minus the start point
    const newLeft = startLeft + ((endPoint - startLeft) / 2)
    // set the left positioning taking into account the scroll position
    marker.style.left = newLeft - scrollLeft
  }
}

// grab instance of different inputs
const getPositionInput = document.querySelector('.get-position-input .input')
const getPositionTextArea = document.querySelector(
  '.get-position-textarea .input'
)
const getSelectionTextArea = document.querySelector(
  '.get-selection-textarea .input'
)
const getSelectionInput = document.querySelector('.get-selection-input .input')
// bind event listeners to the different text inputs
getPositionInput.addEventListener('input', showPositionMarker)
getPositionInput.addEventListener('click', showPositionMarker)
getPositionTextArea.addEventListener('input', showPositionMarker)
getPositionTextArea.addEventListener('click', showPositionMarker)
getSelectionTextArea.addEventListener('mouseup', getSelectionArea)
getSelectionInput.addEventListener('mouseup', getSelectionArea)
getSelectionTextArea.addEventListener('input', getSelectionArea)
getSelectionInput.addEventListener('input', getSelectionArea)
