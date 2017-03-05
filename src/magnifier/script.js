class Magnify {
  constructor(el) {
    this.__element = el
    el.style.setProperty('--clientX', 0)
    el.style.setProperty('--clientY', 0)
    el.addEventListener('mousemove', this.update.bind(this))
  }
  update(e) {
    // console.info(e, this.__element, this.__element.getBoundingClientRect())
    const newClientX = Math.floor(e.pageX - this.__element.getBoundingClientRect().left)
    const newClientY = Math.floor(e.pageY - this.__element.getBoundingClientRect().top)
    this.__element.style.setProperty('--clientX', newClientX)
    this.__element.style.setProperty('--clientY', newClientY)
  }
}

var magnifiers = document.querySelectorAll('[magnify]')
magnifiers.forEach((el) => {
  window.myMagnify = new Magnify(el)
})
