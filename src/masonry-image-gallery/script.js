// Classname reference
const CLASSES = {
  MASONRY: 'masonry',
  PANEL: 'masonry-panel',
  PAD: 'masonry-pad',
}

class Masonry {
  constructor(el) {
    const {
      layout,
    } = this
    this.container = el
    this.panels = el.querySelectorAll(`.${CLASSES.PANEL}`)
    this.state = {
      heights: [],
    }
    layout()
    /**
     * To make responsive, onResize layout again
     * NOTE:: For better performance, please debounce this!
     */
    window.addEventListener('resize', _.debounce(layout, 500))
    const load = imagesLoaded(el, () => layout())
    load.on('progress', (instance, image) => {
      // This trick allows us to avoid any floating pixel sizes 👍
      image.img.style.height = image.img.height
      image.img.setAttribute('height', image.img.height)
      image.img.classList.remove('loading')
      // NOTE: Not the cleanest thing to do here but this is a demo 😅
      const parentPanel = image.img.parentNode.parentNode
      parentPanel.setAttribute('style', `height: ${image.img.height}px`)
      parentPanel.classList.remove(`${CLASSES.PANEL}--loading`)
      this.layout()
    })
  }
  /**
   * Reset the layout by removing padding elements, resetting heights
   * reference and removing the container inline style
   */
  reset = () => {
    const { container } = this
    this.state.heights = []
    const fillers = container.querySelectorAll(`.${CLASSES.PAD}`)
    if (fillers.length) {
      for (let f = 0; f < fillers.length; f++) {
        fillers[f].parentNode.removeChild(fillers[f])
      }
    }
    container.removeAttribute('style')
  }
  /**
   * Iterate through panels and work out the height of the layout
   */
  populateHeights = () => {
    const { panels, state } = this
    const { heights } = state
    for (let p = 0; p < panels.length; p++) {
      const panel = panels[p]
      const { order: cssOrder, msFlexOrder, height } = getComputedStyle(panel)
      const order = cssOrder || msFlexOrder
      if (!heights[order - 1]) heights[order - 1] = 0
      heights[order - 1] += parseFloat(height, 10)
    }
  }
  /**
   * Set the layout height based on referencing the content cumulative height
   * This probably doesn't need its own function but felt right to be nice
   * and neat
   */
  setLayout = () => {
    const { container, state } = this
    const { heights } = state
    this.state.maxHeight = Math.max(...heights)
    container.style.height = `${this.state.maxHeight}px`
  }
  // /**
  //   * JavaScript method for setting order of each panel based on panels.length and desired number of columns
  // */
  // __setOrders() {
  //   const {
  //     panels,
  //   } = this
  //   const cols = 3 // There needs to be an internal reference here that checks how many cols for viewport size
  //   panels.forEach((panel, idx) => {
  //     panel.style.order = ((idx + 1) % cols === 0) ? cols : (idx + 1) % cols
  //   })
  // }
  /**
   * Pad out layout "columns" with padding elements that make heights equal
   */
  pad = () => {
    const { container } = this
    const { heights, maxHeight } = this.state
    heights.map((height, idx) => {
      if (height < maxHeight && height > 0) {
        const pad = document.createElement('div')
        pad.className = CLASSES.PAD
        pad.style.height = `${maxHeight - height}px`
        pad.style.order = idx + 1
        pad.style.msFlexOrder = idx + 1
        container.appendChild(pad)
      }
    })
  }
  /**
   * Resets and lays out elements
   */
  layout = () => {
    this.reset()
    // this.__setOrders()
    this.populateHeights()
    this.setLayout()
    this.pad()
  }
}
window.myMasonry = new Masonry(document.querySelector(`.${CLASSES.MASONRY}`))
