// create enumeration object for repeated class names
const CLASSES = {
  marker: 'input__marker',
  visible: 'input__marker--visible',
}

const createMarker = (content, modifier) => {
  // create a marker for the input
  const marker = document.createElement('div')
  marker.classList.add(CLASSES.marker, `${CLASSES.marker}--${modifier}`)
  marker.textContent = content
  return marker
}

/**
 * returns x, y coordinates for absolute positioning of a span within a given text input
 * at a given selection point
 * @param {object} input - the input element to obtain coordinates for
 * @param {number} selectionPoint - the selection point for the input
 */
const getCursorXY = (input, selectionPoint) => {
  const {
    offsetLeft: inputX,
    offsetTop: inputY,
  } = input
  // create a dummy element that will be a clone of our input
  const div = document.createElement('div')
  // get the computed style of the input and clone it onto the dummy element
  const copyStyle = getComputedStyle(input)
  for (const prop of copyStyle) {
    div.style[prop] = copyStyle[prop]
  }
  // we need a character that will replace whitespace when filling our dummy element if it's a single line <input/>
  const swap = '.'
  const inputValue = input.tagName === 'INPUT' ? input.value.replace(/ /g, swap) : input.value
  // set the div content to that of the textarea up until selection
  const textContent = inputValue.substr(0, selectionPoint)
  // set the text content of the dummy element div
  div.textContent = textContent
  if (input.tagName === 'TEXTAREA') div.style.height = 'auto'
  // if a single line input then the div needs to be single line and not break out like a text area
  if (input.tagName === 'INPUT') div.style.width = 'auto'
  // create a marker element to obtain caret position
  const span = document.createElement('span')
  // give the span the textContent of remaining content so that the recreated dummy element is as close as possible
  span.textContent = inputValue.substr(selectionPoint) || '.'
  // append the span marker to the div
  div.appendChild(span)
  // append the dummy element to the body
  document.body.appendChild(div)
  // get the marker position, this is the caret position top and left relative to the input
  const { offsetLeft: spanX, offsetTop: spanY } = span
  // lastly, remove that dummy element
  // NOTE:: can comment this out for debugging purposes if you want to see where that span is rendered
  document.body.removeChild(div)
  // return an object with the x and y of the caret. account for input positioning so that you don't need to wrap the input
  return {
    x: inputX + spanX,
    y: inputY + spanY,
  }
}

/**
 * shows a position marker that highlights where the caret is
 * @param {object} e - the input or click event that has been fired
 */
const showPositionMarker = e => {
  // grab the input element
  const { currentTarget: input } = e
  // create a function that will handle clicking off of the input and hide the marker
  const processClick = evt => {
    if (e !== evt && evt.target !== e.target) {
      toggleMarker()
    }
  }
  // create a function that will toggle the showing of the marker
  const toggleMarker = () => {
    input.__IS_SHOWING_MARKER = !input.__IS_SHOWING_MARKER

    if (input.__IS_SHOWING_MARKER && !input.__MARKER) {
      // assign a created marker to input
      input.__MARKER = createMarker('Here I am! 😜', 'position')
      // append it to the body
      document.body.appendChild(input.__MARKER)
      document.addEventListener('click', processClick)
    } else {
      document.body.removeChild(input.__MARKER)
      document.removeEventListener('click', processClick)
      input.__MARKER = null
    }
  }
  // if the marker isn't showing, show it
  if (!input.__IS_SHOWING_MARKER) toggleMarker()
  // if the marker is showing, update its position
  if (input.__IS_SHOWING_MARKER) {
    // grab the properties from the input that we are interested in
    const {
      offsetLeft,
      offsetTop,
      offsetHeight,
      offsetWidth,
      scrollLeft,
      scrollTop,
      selectionEnd,
    } = input
    // get style property values that we are interested in
    const { lineHeight, paddingRight } = getComputedStyle(input)
    // get the caret X and Y from our helper function
    const { x, y } = getCursorXY(input, selectionEnd)
    // set the marker positioning
    // for the left positioning we ensure that the maximum left position is the width of the input minus the right padding using Math.min
    // we also account for current scroll position of the input
    const newLeft = Math.min(
      x - scrollLeft,
      (offsetLeft + offsetWidth) - parseInt(paddingRight, 10)
    )
    // for the top positioning we ensure that the maximum top position is the height of the input minus line height
    // we also account for current scroll position of the input
    const newTop = Math.min(
      y - scrollTop,
      (offsetTop + offsetHeight) - parseInt(lineHeight, 10)
    )
    input.__MARKER.setAttribute('style', `left: ${newLeft}px; top: ${newTop}px`)
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
    offsetLeft,
    offsetWidth,
    scrollLeft,
    scrollTop,
    selectionStart,
    selectionEnd,
  } = input
  // grab styling properties we are interested in
  const { paddingRight } = getComputedStyle(input)
  // create a function that will handle clicking off of the input and hide the marker
  const processClick = evt => {
    if (e !== evt && evt.target !== e.target) {
      toggleMarker()
    }
  }
  // create a function that will toggle the showing of the marker
  const toggleMarker = () => {
    input.__IS_SHOWING_MARKER = !input.__IS_SHOWING_MARKER

    if (input.__IS_SHOWING_MARKER && !input.__MARKER) {
      // assign a created marker to input
      input.__MARKER = createMarker('Here\'s your selection! 🎉', 'selection')
      // append it to the body
      document.body.appendChild(input.__MARKER)
      document.addEventListener('click', processClick)
    } else {
      document.body.removeChild(input.__MARKER)
      document.removeEventListener('click', processClick)
      input.__MARKER = null
    }
  }
  // if selectionStart === selectionEnd then there is no actual selection, hide the marker and return
  if (selectionStart === selectionEnd) {
    if (input.__IS_SHOWING_MARKER) toggleMarker()
    return
  }
  // we need to get the start and end positions so we can work out a midpoint to show our marker
  // first, get the starting top and left using selectionStart
  const { y: startTop, x: startLeft } = getCursorXY(input, selectionStart)
  // then get the ending top and left using selectionEnd
  const { y: endTop, x: endLeft } = getCursorXY(input, selectionEnd)
  // if the marker isn't showing and there's a selection, show the marker
  if (!input.__IS_SHOWING_MARKER && selectionStart !== selectionEnd) {
    toggleMarker()
  }
  // if the marker is showing then update its position
  if (input.__IS_SHOWING_MARKER) {
    // we don't care about the value of endTop as our marker will always show at the top point and this will always be startTop
    // account for scroll position by negating scrollTop
    // as for left positioning, we need to first work out if the end point is on the same line or we have multiline selection
    // in the latter case, the endpoint will be the furthest possible right selection point
    const endPoint =
      startTop !== endTop ? offsetLeft + (offsetWidth - parseInt(paddingRight, 10)) : endLeft
    // we want the marker to show above the selection and in the middle of the selection so start point plus halve the endpoint minus the start point
    const newLeft = startLeft + ((endPoint - startLeft) / 2)
    // set the marker positioning
    input.__MARKER.setAttribute('style', `left: ${newLeft - scrollLeft}px; top: ${startTop - scrollTop}px`)
  }
}


/**
 * shows a custom UI based on whether a user has typed a certain character, in this case #(keycode 35 on keypress event)
 * for this demo, just allow user to select from a predetermined list of animals
 * @param {object} e - event fired for keypress, keydown or keyup
 */
const showCustomUI = (e) => {
  // grab properties of event we are interested in
  const {
    currentTarget: input,
    which,
    type,
  } = e
  // grab properties of input that we are interested in
  const {
    offsetHeight,
    offsetLeft,
    offsetTop,
    offsetWidth,
    scrollLeft,
    scrollTop,
    selectionStart,
    value,
  } = input
  const {
    paddingRight,
    lineHeight,
  } = getComputedStyle(input)
  // create a function that will handle clicking off of the input and hide the marker
  const processClick = evt => {
    if (e !== evt && evt.target !== e.target) {
      toggleCustomUI()
    }
  }
  /**
   * toggles selected item in list via arrow keys
   * create a new selected item if one doesn't exist
   * else update the selected item based on the given selection direction
   * @param {string} dir - defines which element sibling to select next
   */
  const toggleItem = (dir = 'next') => {
    const list = input.__CUSTOM_UI.querySelector('ul')
    if (!input.__SELECTED_ITEM) {
      input.__SELECTED_ITEM = input.__CUSTOM_UI.querySelector('li')
      input.__SELECTED_ITEM.classList.add('custom-suggestions--active')
    } else {
      input.__SELECTED_ITEM.classList.remove('custom-suggestions--active')
      let nextActive = input.__SELECTED_ITEM[`${dir}ElementSibling`]
      if (!nextActive && dir === 'next') nextActive = list.firstChild
      else if (!nextActive) nextActive = list.lastChild
      input.__SELECTED_ITEM = nextActive
      nextActive.classList.add('custom-suggestions--active')
    }
  }
  /**
   * filter a dummy list of data and append a <ul> to the marker element to show to the end user
   */
  const filterList = () => {
    const filter = value.slice(input.__EDIT_START + 1, selectionStart).toLowerCase()
    const suggestions = ['Cat 😺', 'Dog 🐶', 'Rabbit 🐰']
    const filteredSuggestions = suggestions.filter((entry) => entry.toLowerCase().includes(filter))
    if (!filteredSuggestions.length) filteredSuggestions.push('No suggestions available...')
    const suggestedList = document.createElement('ul')
    suggestedList.classList.add('custom-suggestions')
    filteredSuggestions.forEach((entry) => {
      const entryItem = document.createElement('li')
      entryItem.textContent = entry
      suggestedList.appendChild(entryItem)
    })
    if (input.__CUSTOM_UI.firstChild)
      input.__CUSTOM_UI.replaceChild(suggestedList, input.__CUSTOM_UI.firstChild)
    else
      input.__CUSTOM_UI.appendChild(suggestedList)
  }
  /**
   * given a selected value, replace the special character and insert selected value
   * @param {string} selected - the selected value to be inserted into inputs text content
   * @param {bool} click - defines whether the event was a click or not
   */
  const selectItem = (selected, click = false) => {
    const start = input.value.slice(0, input.__EDIT_START)
    const end = input.value.slice( click ? selectionStart + 1 : selectionStart, input.value.length)
    input.value = `${start}${selected}${end}`
  }
  /**
   * handle when the suggestions list is clicked so that user can select from list
   * @param {event} e - click event on marker element
   */
  const clickItem = (e) => {
    e.preventDefault()
    if (e.target.tagName === 'LI') {
      input.focus()
      toggleCustomUI()
      selectItem(e.target.textContent, true)
    }
  }
  // toggle custom UI on and off
  const toggleCustomUI = () => {
    input.__EDIT_START = selectionStart
    input.__IS_SHOWING_CUSTOM_UI = !input.__IS_SHOWING_CUSTOM_UI

    if (input.__IS_SHOWING_CUSTOM_UI && !input.__CUSTOM_UI) {
      // assign a created marker to input
      input.__CUSTOM_UI = createMarker(null, 'custom')
      // append it to the body
      document.body.appendChild(input.__CUSTOM_UI)
      input.__CUSTOM_UI.addEventListener('click', clickItem)
      document.addEventListener('click', processClick)
    } else {
      input.__CUSTOM_UI.removeEventListener('click', clickItem)
      document.body.removeChild(input.__CUSTOM_UI)
      document.removeEventListener('click', processClick)
      input.__CUSTOM_UI = null
    }

    if (input.__IS_SHOWING_CUSTOM_UI) {
      // update list to show
      filterList()
      // update position
      const { x, y } = getCursorXY(input, selectionStart)
      const newLeft = Math.min(
        x - scrollLeft,
        (offsetLeft + offsetWidth) - parseInt(paddingRight, 10)
      )
      const newTop = Math.min(
        y - scrollTop,
        (offsetTop + offsetHeight) - parseInt(lineHeight, 10)
      )
      input.__CUSTOM_UI.setAttribute('style', `left: ${newLeft}px; top: ${newTop}px`)
    }
  }

  const previousChar = value.charAt(selectionStart - 1).trim()
  // determine whether we can show custom UI, format must be special character preceded by a space
  if (which === 35 && previousChar === '') {
    toggleCustomUI()
  } else if (input.__IS_SHOWING_CUSTOM_UI) {
    switch(which) {
      case 35:
      case 32:
        toggleCustomUI()
        break
      case 8:
        if (selectionStart === input.__EDIT_START)
          toggleCustomUI()
        else
          filterList()
        break
      case 13:
        if (input.__SELECTED_ITEM) {
          e.preventDefault()
          selectItem(input.__CUSTOM_UI.querySelector('.custom-suggestions--active').textContent)
          toggleCustomUI()
        } else {
          toggleCustomUI()
        }
        break
      case 38:
      case 40:
        if (type === 'keydown') {
          e.preventDefault()
          // up is 38
          toggleItem(which === 38 ? 'previous' : 'next')
          // down is 40
        }
        break
      case 37:
      case 39:
        if (selectionStart < input.__EDIT_START + 1)
          toggleCustomUI()
        break
      default:
        filterList()
        break
    }
  }
}

// grab instance of different inputs
const getPositionInput = document.querySelector('.get-position-input')
const getPositionTextArea = document.querySelector('.get-position-textarea')
const getSelectionTextArea = document.querySelector('.get-selection-textarea')
const getSelectionInput = document.querySelector('.get-selection-input')
const showCustomUIInput = document.querySelector('.show-custom-ui-input')
const showCustomUITextArea = document.querySelector('.show-custom-ui-textarea')
// bind event listeners to the different text inputs
getPositionInput.addEventListener('input', showPositionMarker)
getPositionInput.addEventListener('click', showPositionMarker)
getPositionTextArea.addEventListener('input', showPositionMarker)
getPositionTextArea.addEventListener('click', showPositionMarker)
getSelectionTextArea.addEventListener('mouseup', getSelectionArea)
getSelectionInput.addEventListener('mouseup', getSelectionArea)
getSelectionTextArea.addEventListener('input', getSelectionArea)
getSelectionInput.addEventListener('input', getSelectionArea)
showCustomUIInput.addEventListener('keypress', showCustomUI)
showCustomUIInput.addEventListener('keydown', showCustomUI)
showCustomUIInput.addEventListener('keyup', showCustomUI)
showCustomUITextArea.addEventListener('keypress', showCustomUI)
showCustomUITextArea.addEventListener('keydown', showCustomUI)
showCustomUITextArea.addEventListener('keyup', showCustomUI)