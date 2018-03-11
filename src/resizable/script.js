class Resizable {
  defaultOptions = {
    ghosting: true,
    handles: ['n', 's', 'e', 'w', 'se', 'sw', 'ne', 'nw']
  }
  constructor(element, options) {
    this.element = element
    this.options = Object.assign({}, this.defaultOptions, options)
    this.handles = this.options.handles
    this.ghosting = this.options.ghosting
    this.create()
  }

  create = () => {
    const {
      element,
      options,
    } = this
    element.classList.add('rsizable')
    for (let handle of options.handles) this.createHandle(handle)
  }

  start = (e) => {
    let {
      pageX: startX,
      pageY: startY,
      touches,
    } = e

    if (touches && touches.length === 1) {
      startX = touches[0].pageX
      startY = touches[0].pageY
    }

    const {
      height,
      width,
      x,
      y,
    } = this.element.getBoundingClientRect()


    const resize = (evt) => {
      const direction = e.target.getAttribute('data-rsize-direction')
      let { pageX: X, pageY: Y, touches } = evt
      if (touches && touches.length === 1) {
        X = touches[0].pageX
        Y = touches[0].pageY
      }
      for (const d of direction.split('')) {
        switch(d) {
          case 'n':
            // If position absolute, set top to Y
            this.element.style.setProperty('--height', height + (startY - Y))
            break
          case 's':
            this.element.style.setProperty('--height', height + (Y - startY))
            break
          case 'e':
            this.element.style.setProperty('--width', width + (X - startX))
            break
          case 'w':
            // If position absolute, set left to X
            this.element.style.setProperty('--width', width + (startX - X))
            break
        }
      }
    }

    const end = () => {
      if (this.ghost) this.ghost.remove()
      document.body.removeEventListener('mousemove', resize)
      document.body.removeEventListener('touchmove', resize)
      document.body.removeEventListener('mouseup', end)
      document.body.removeEventListener('touchend', end)
    }

    document.body.addEventListener('mousemove', resize)
    document.body.addEventListener('mouseup', end)

    // Add touch support 😉
    document.body.addEventListener('touchmove', resize)
    document.body.addEventListener('touchend', end)

    if (this.options.ghosting) {
      const ghost = document.createElement('span')
      ghost.classList.add('rsizable__ghost')
      ghost.style.setProperty('--x', x + 1)
      ghost.style.setProperty('--y', y + 1)
      ghost.style.setProperty('--height', height - 2)
      ghost.style.setProperty('--width', width - 2)
      document.body.appendChild(ghost)
      this.ghost = ghost
    }
  }

  createHandle = (direction) => {
    const newHandle = document.createElement('span')
    newHandle.classList.add('rsizable__handle', `rsizable__handle--${direction}`)
    newHandle.setAttribute('data-rsize-direction', direction)
    newHandle.style.setProperty('--cursor', `${direction}-resize`)
    this.element.appendChild(newHandle)
    newHandle.addEventListener('mousedown', this.start)
    newHandle.addEventListener('touchstart', this.start)
  }
}

const imageToResize = document.querySelector('.image-container')
const resizableImage = new Resizable(imageToResize, {})
