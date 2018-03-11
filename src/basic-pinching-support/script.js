class Zoomable {
  constructor(el) {
    this.lowerLimit = parseFloat(el.getAttribute('lower-limit')) || 0.5
    this.upperLimit = parseFloat(el.getAttribute('upper-limit')) || 3
    this.zoomRate = parseFloat(el.getAttribute('zoom-rate')) || 0.1
    this.scale = 1
    this.el = el
    el.addEventListener('touchstart', this.startZoom)
    el.addEventListener('touchend', this.endZoom)
  }

  zoom = e => {
    const { touches } = e
    if (touches && touches.length === 2) {
      let previousDistance = this.distance
      this.distance = Math.sqrt(
        (touches[0].clientX - touches[1].clientX) *
          (touches[0].clientX - touches[1].clientX) +
          (touches[0].clientY - touches[1].clientY) *
            (touches[0].clientY - touches[1].clientY)
      )
      if (this.distance < previousDistance) {
        this.scale = this.scale - this.zoomRate
      } else if (this.distance > previousDistance) {
        this.scale = this.scale + this.zoomRate
      }
      if ((this.distance > this.lowerLimit) && (this.scale < this.upperLimit)) {
        this.el.style.setProperty('--scale', this.scale)
      }
    }
  }

  endZoom = e => {
    this.el.removeEventListener('touchmove', this.zoom)
  }

  startZoom = e => {
    this.el.addEventListener('touchmove', this.zoom)
  }
}

const img = document.querySelector('img')
const zoomableImage = new Zoomable(img)