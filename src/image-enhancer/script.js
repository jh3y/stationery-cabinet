Vue.component('image-enhancer', {
  template: `
    <div class="image-enhancer">
      <span class='image-enhancer__indicator'/>
      <div v-for="c in parseInt(cells, 10)"></div>
      <button v-if="ENHANCED" v-on:click="dehance" class="image-enhancer__dehance">
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path fill="#ffffff" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      </button>
    </div>
  `,
  props: ['cells', 'src'],
  data: function () {
    return {
      ENHANCED: false,
      ENHANCING: false,
    }
  },
  methods: {
    getCursorPos: function(e) {
      const cellsPerRow = Math.sqrt(this.CELLS)
      const gridPos = this.$el.getBoundingClientRect()
      const clicked = {
        x: e.pageX - gridPos.x,
        y: e.pageY - gridPos.y,
      }
      const xPos = Math.floor(
        clicked.x / this.$el.offsetHeight * 100 / (100 / cellsPerRow)
      )
      const yPos = Math.floor(
        clicked.y / this.$el.offsetHeight * 100 / (100 / cellsPerRow)
      )
      return {
        x: xPos,
        y: yPos,
      }
    },
    indicate: function(e) {
      const pos = this.getCursorPos(e)
      const indicator = this.$el.querySelector('.image-enhancer__indicator')
      indicator.style.setProperty('--x', pos.x)
      indicator.style.setProperty('--y', pos.y)
    },
    dehance: function(e) {
      const {
        height,
        width,
        backgroundPosition,
        backgroundSize,
        zIndex,
        left,
        top,
      } = this.ACTIVE_CELL_STYLE
      TweenMax.to(this.ACTIVE_CELL, 2, {
        onStart: () => {
          this.$el.classList.add('image-enhancer--enhancing')
          this.ENHANCING = true
          this.ENHANCED = false
        },
        onComplete: () => {
          this.ENHANCING = false
          this.$el.classList.remove('image-enhancer--enhancing')
          this.ACTIVE_CELL.style.zIndex = zIndex
          const indicator = this.$el.querySelector('.image-enhancer__indicator')
          // indicator.removeAttribute('style')
          indicator.style.removeProperty('display')
        },
        top,
        left,
        height,
        width,
        backgroundSize,
        backgroundPosition,
        ease: SteppedEase.config(10),
      })
    },
    enhance: function(e) {
      if (this.ENHANCING || this.ENHANCED) return
      const gridPos = this.$el.getBoundingClientRect()
      const selected = document.querySelector('.image-enhancer__selected')
      if (selected) selected.classList.remove('image-enhancer__selected')
      const cellsPerRow = Math.sqrt(this.CELLS)
      const clicked = {
        x: e.pageX - gridPos.x,
        y: e.pageY - gridPos.y,
      }
      const xPos = Math.floor(
        clicked.x / this.$el.offsetHeight * 100 / (100 / cellsPerRow)
      )
      const yPos = Math.floor(
        clicked.y / this.$el.offsetHeight * 100 / (100 / cellsPerRow)
      )
      const newSelected = this.$el.children[yPos * cellsPerRow + xPos]
      this.ACTIVE_CELL = newSelected
      this.ACTIVE_CELL_STYLE = Object.assign({}, getComputedStyle(this.ACTIVE_CELL))
      const { backgroundPositionX, backgroundPositionY } = this.ACTIVE_CELL_STYLE
      let bpX = parseInt(backgroundPositionX, 10) * cellsPerRow
      let bpY = parseInt(backgroundPositionY, 10) * cellsPerRow
      let bSize = this.$el.offsetHeight * cellsPerRow

      // Change some styling props for the newly selected
      newSelected.style.zIndex = 4


      const scale = new TimelineMax()
      const indicator = this.$el.querySelector('.image-enhancer__indicator')
      const blink = new TimelineMax({repeat: 4})
      blink.to(indicator, 0.1, {alpha: 0})
        .to(indicator, 0.1, {alpha: 1})
      const indicate = TweenMax.from(indicator, 1, {
        onStart: () => {
          indicator.style.display = 'block'
        },
        position: 'absolute',
        height: this.$el.offsetHeight,
        width: this.$el.offsetHeight,
        left: 0,
        top: 0,
        ease: SteppedEase.config(4)
      })
      const scaleUp = TweenMax.to(newSelected, 2, {
        onStart: () => {
          this.$el.classList.add('image-enhancer--enhancing')
          this.ENHANCING = true
          indicator.style.display = 'none'
        },
        onComplete: () => {
          this.ENHANCING = false
          this.ENHANCED = true
          indicator.removeAttribute('style')
          indicator.style.display = 'none'
          this.$el.classList.remove('image-enhancer--enhancing')
        },
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        backgroundSize: `${bSize}px ${bSize}px`,
        backgroundPosition: `${bpX}px ${bpY}px`,
        ease: SteppedEase.config(cellsPerRow),
      })
      scale
        .add(indicate)
        .add(blink)
        .add(scaleUp)
    },
  },
  mounted: function() {
    this.CELLS = parseInt(this.cells, 10)
    this.$el.addEventListener('click', this.enhance)
    this.$el.addEventListener('mousemove', this.indicate)
  },
})

new Vue({
  el: '#app',
  data: function() {
    return {}
  },
  methods: {},
  mounted: function() {},
})
