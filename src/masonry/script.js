(function() {
  // Classname reference
  const CLASSES = {
    DRIVEWAY: 'dw',
    PANEL   : 'dw-panel',
    PAD     : 'dw-pad',
  }

  class Masonry {
    constructor(el) {
      this.state = {
        container: el,
        panels: el.querySelectorAll(`.${CLASSES.PANEL}`),
      }
      this.layout()
    }
    /**
      * Reset the layout by removing padding elements, resetting heights
      * reference and removing the container inline style
    */
    __reset() {
      const {
        container,
      } = this.state
      this.state.heights = []
      const fillers = container.querySelectorAll(`.${CLASSES.PAD}`)
      fillers.forEach((filler) => filler.remove())
      container.removeAttribute('style')
    }
    /**
      * Iterate through panels and work out the height of the layout
    */
    __populateHeights() {
      const {
        panels,
        heights,
      } = this.state
      panels.forEach((panel, idx) => {
        const {
          order,
          height,
        } = getComputedStyle(panel)
        if (!heights[order - 1]) heights[order - 1] = 0
        heights[order - 1] += parseInt(height, 10)
      })
      return heights
    }
    /**
      * Set the layout height based on referencing the content cumulative height
      * This probably doesn't need its own function but felt right to be nice
      * and neat
    */
    __setLayout() {
      const {
        heights,
        container,
      } = this.state
      this.state.maxHeight = Math.max(...heights)
      container.style.height = `${this.state.maxHeight}px`
    }
    /**
      * Pad out layout "columns" with padding elements that make heights equal
    */
    __pad() {
      const {
        heights,
        maxHeight,
        container,
      } = this.state
      heights.map((height, idx) => {
        if (height < maxHeight && height > 0) {
          const pad        = document.createElement('div')
          pad.className    = CLASSES.PAD
          pad.style.height = `${maxHeight - height}px`
          pad.style.order  = idx + 1
          container.appendChild(pad)
        }
      })
    }
    /**
      * Resets and lays out elements
    */
    layout() {
      this.__reset()
      this.__populateHeights()
      this.__setLayout()
      this.__pad()
    }
  }

  window.myMasonry = new Masonry(document.querySelector(`.${CLASSES.DRIVEWAY}`))
  /**
    * To make responsive, onResize layout again
    * NOTE:: For better performance, please debounce this!
  */
  window.addEventListener('resize', () => myMasonry.layout())
})()
