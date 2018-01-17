

const getPositionInput = document.querySelector('.get-position-input .input')
const getPositionTextArea = document.querySelector('.get-position-textarea .input')
const getSelectionTextArea = document.querySelector('.get-selection-textarea .input')
const getSelectionInput = document.querySelector('.get-selection-input .input')


// This is the main function for grabbing the actual position for where a marker should be placed.
// This is before taking into account any scroll position or element padding
const getEndCoordinates = (e, selectionPoint) => {
  // grab the element that has the input listener
  const input = e.currentTarget
  // get the current caret position with selectionEnd, this tells us at which index of the content we are currently at
  const caretPosition = selectionPoint
  // create a dummy element that will be a clone of our input
  const div = document.createElement('div')
  // create a marker element that will get it's position from
  const span = document.createElement('span')
  // get the computed style of the input and clone it onto the dummy element
  const copyStyle = getComputedStyle(input)
  for (const prop of copyStyle) {
    div.style[prop] = copyStyle[prop]
  }
  // append it to the body
  document.body.appendChild(div)
  const swap = '.'
  // set the div content to that of the textarea up until selection
  // console.info('value', input.value, input.value.substr(0, caretPosition).toString(), input.value.replace(/ /g, '&nbsp'))
  const inputValue = input.value.replace(/ /g, swap)
  const textContent = inputValue.substr(0, caretPosition)
  div.textContent = textContent
  if (input.tagName === 'TEXTAREA') div.style.height = 'auto'
  // if a single line input then the div needs to be single line and not break out like a text area
  if (input.tagName === 'INPUT') div.style.width = 'auto'
  // give the span some content so it isn't just appended to a newline
  span.textContent = inputValue.substr(caretPosition) || swap
  span.style.position = 'absolute'
  // append the span marker to the div
  div.appendChild(span)
  // get the marker position
  const {
    offsetTop: top,
    offsetLeft: left,
  } = span
  // remove the div from the body once the coordinates have been grabbed
  document.body.removeChild(div)
  return {
    top,
    left,
  }
}

const showPositionMarker = (e) => {
  const marker = e.currentTarget.parentElement.querySelector('.input__marker')
  const processClick = (evt) => {
    if (e !== evt && evt.target !== e.target) {
      marker.classList.remove('input__marker--visible')
      marker.__IS_SHOWING = false
      document.removeEventListener('click', processClick)
    }
  }
  if (!marker.__IS_SHOWING) {
    document.addEventListener('click', processClick)
    marker.__IS_SHOWING = true
    marker.classList.add('input__marker--visible')
  }
  if (marker.__IS_SHOWING) {
    const {
      top,
      left,
    } = getEndCoordinates(e, e.currentTarget.selectionEnd)
    // grab the right padding
    const padding = parseInt(getComputedStyle(e.currentTarget).paddingRight, 10)
    const {
      paddingRight,
      paddingBottom,
      lineHeight,
    } = getComputedStyle(e.currentTarget)
    marker.style.left = Math.min(left - e.currentTarget.scrollLeft, e.currentTarget.offsetWidth - padding)
    marker.style.top = Math.min(top - e.currentTarget.scrollTop, e.currentTarget.offsetHeight - parseInt(lineHeight, 10))
  }
}

const getSelectionArea = (e) => {
  const marker = e.currentTarget.parentElement.querySelector('.input__marker')
  const {
    selectionStart,
    selectionEnd,
  } = e.currentTarget
  const processClick = (evt) => {
    if (e !== evt && evt.target !== e.target) {
      marker.classList.remove('input__marker--visible')
      marker.__IS_SHOWING = false
      document.removeEventListener('click', processClick)
    }
  }
  if (selectionStart === selectionEnd) {
    if (marker.__IS_SHOWING) {
      marker.__IS_SHOWING = false
      marker.classList.remove('input__marker--visible')
      document.removeEventListener('click', processClick)
    }
    return
  }
  const {
    top: startTop,
    left: startLeft,
  } = getEndCoordinates(e, selectionStart)
  const {
    top: endTop,
    left: endLeft,
  } = getEndCoordinates(e, selectionEnd)
  if (!marker.__IS_SHOWING && selectionStart !== selectionEnd) {
    document.addEventListener('click', processClick)
    marker.__IS_SHOWING = true
    marker.classList.add('input__marker--visible')
  }
  if (marker.__IS_SHOWING) {
    // startTop will always be the smallest value and we will always put the marker at the top of the selection so
    marker.style.top = startTop - e.currentTarget.scrollTop
    // as for the left marker
    // if startTop doesn't equal endTop then we have a multiline selection
    // therefore the middle will be the furthest point possible right minus the start halved and added to the start, mouthful
    const endPoint = (startTop !== endTop) ? e.currentTarget.offsetWidth - parseInt(getComputedStyle(e.currentTarget).paddingRight, 10) : endLeft
    const newLeft = ((endPoint - startLeft) / 2) + startLeft
    marker.style.left = newLeft - e.currentTarget.scrollLeft
  }

}
getPositionInput.addEventListener('input', showPositionMarker)
getPositionInput.addEventListener('click', showPositionMarker)
getPositionTextArea.addEventListener('input', showPositionMarker)
getPositionTextArea.addEventListener('click', showPositionMarker)
getSelectionTextArea.addEventListener('mouseup', getSelectionArea)
getSelectionInput.addEventListener('mouseup', getSelectionArea)