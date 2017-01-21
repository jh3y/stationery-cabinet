(function() {
  // Classname reference
  const CLASSES = {
    DRIVEWAY: 'dw',
    PANEL   : 'dw-panel',
    PAD     : 'dw-pad',
  }

  let heights
  let maxHeight
  let fillers
  const container = document.querySelector(`.${CLASSES.DRIVEWAY}`)
  const panels    = document.querySelectorAll(`.${CLASSES.PANEL}`)

  /**
    * Pad out layout "columns" with padding elements that make widths equal
  */
  const pad = () => {
    heights.map((height, idx) => {
      if (height < maxHeight) {
        const pad        = document.createElement('div')
        pad.className    = CLASSES.PAD
        pad.style.height = `${maxHeight - height}px`
        pad.style.order  = idx + 1
        container.appendChild(pad)
      }
    })
  }

  /**
    * Iterate through panels and work out the height of the layout
  */
  const populateHeights = () => {
    panels.forEach((panel, idx) => {
      const {
        order,
        height,
      } = getComputedStyle(panel)
      heights[order - 1] += parseInt(height, 10)
    })
  }

  /**
    * Set the layout height based on referencing the content cumulative height
    * This probably doesn't need its own function but felt right to be nice
    * and neat
  */
  const setLayout = () => {
    maxHeight = Math.max(...heights)
    container.style.height = `${maxHeight}px`
  }

  /**
    * Reset the layout by removing padding elements, resetting heights
    * reference and removing the container inline style
  */
  const reset = () => {
    fillers = document.querySelectorAll(`.${CLASSES.PAD}`)
    heights = [0, 0, 0, 0]
    fillers.forEach((filler) => filler.remove())
    container.removeAttribute('style')
  }

  const layout = () => {
    reset()
    populateHeights()
    setLayout()
    pad()
  }

  layout()

  /**
    * To make responsive, onResize layout again
    * NOTE:: For better performance, please debounce layout()
  */
  window.addEventListener('resize', layout)
})()
