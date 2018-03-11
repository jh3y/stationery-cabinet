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
    const {
      pageX: startX,
      pageY: startY,
    } = e

    const {
      height,
      width,
      x,
      y,
    } = this.element.getBoundingClientRect()

    this.initial = { height, startX, startY, width}

    const resize = (evt) => {
      const direction = e.target.getAttribute('data-rsize-direction')
      for (const d of direction.split('')) {
        switch(d) {
          case 'n':
            // If position absolute, set top to evt.pageY
            this.element.style.setProperty('--height', height + (startY - evt.pageY))
            break
          case 's':
            this.element.style.setProperty('--height', height + (evt.pageY - startY))
            break
          case 'e':
            this.element.style.setProperty('--width', width + (evt.pageX - startX))
            break
          case 'w':
            // If position absolute, set left to evt.pageY
            this.element.style.setProperty('--width', width + (startX - evt.pageX))
            break
        }
      }
    }

    const end = () => {
      if (this.ghost) this.ghost.remove()
      document.body.removeEventListener('mousemove', resize)
    }

    document.body.addEventListener('mousemove', resize)
    document.body.addEventListener('mouseup', end)

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
  }
}

const imageToResize = document.querySelector('.image-container')
const resizableImage = new Resizable(imageToResize, {})
