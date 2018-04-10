Vue.component('image-enhancer', {
  template: `
    <div class="image-enhancer">
      <div v-for="c in parseInt(cells, 10)"></div>
      <button v-if="ENHANCED" v-on:click="dehance" class="image-enhancer__dehance"></button>
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
    dehance: function(e) {
      console.info('dehancing')
    },
    enhance: function(e) {
      if (this.ENHANCING || this.ENHANCED) return
      const gridPos = this.$el.getBoundingClientRect()
      const clicked = {
        x: e.pageX - gridPos.x,
        y: e.pageY - gridPos.y,
      }
      const selected = document.querySelector('.image-enhancer__selected')
      if (selected) selected.classList.remove('image-enhancer__selected')
      const cellsPerRow = Math.sqrt(this.$el.children.length)
      const xPos = Math.floor(
        clicked.x / this.$el.offsetHeight * 100 / (100 / cellsPerRow)
      )
      const yPos = Math.floor(
        clicked.y / this.$el.offsetHeight * 100 / (100 / cellsPerRow)
      )
      const newSelected = this.$el.children[yPos * cellsPerRow + xPos]
      const { backgroundPositionX, backgroundPositionY } = getComputedStyle(
        newSelected
      )
      let modifier = Math.sqrt(this.$el.children.length)
      let bpX = parseInt(backgroundPositionX, 10) * modifier
      let bpY = parseInt(backgroundPositionY, 10) * modifier
      let bSize = this.$el.offsetHeight * modifier
      TweenMax.to(newSelected, 2, {
        onStart: () => {
          newSelected.style.zIndex = 2
          this.$el.classList.add('image-enhancer--enhancing')
          this.ENHANCING = true
        },
        onComplete: () => {
          this.ENHANCING = false
          this.ENHANCED = true
          this.$el.classList.remove('image-enhancer--enhancing')
        },
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        backgroundSize: `${bSize}px ${bSize}px`,
        backgroundPosition: `${bpX}px ${bpY}px`,
        ease: SteppedEase.config(modifier),
      })
    },
  },
  mounted: function() {
    this.$el.addEventListener('click', this.enhance)
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
