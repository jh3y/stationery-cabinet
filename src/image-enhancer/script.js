const styled = styled.default

const indicator = styled('span', { size: Number })`
  display: none;
  border: 2px solid white;
  z-index: 5;
  position: absolute;
  height: ${p => p.size}px;
  width: ${p => p.size}px;
  top: calc(var(--y) * 10%);
  left: calc(var(--x) * 10%);
`

const close = styled.button`
  cursor: pointer;
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 5;
  width: 44px;
  height: 44px;
  background: blue;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #1a1aff;
  }

  &:active {
    background: #00c;
  }
`

const generateCells = (cells, size) => {
  const CELLSPERROW = Math.sqrt(cells)
  let result = ``
  for (let c = 1; c < cells + 1; c++) {
    const x = (c - 1) % CELLSPERROW
    const yPlaceholder = Math.floor(c / CELLSPERROW)
    const y = c % CELLSPERROW === 0 ? yPlaceholder - 1 : yPlaceholder
    result += `
      &:nth-of-type(${c}) {
        background-position: -${x * size}px -${y * size}px;
        left: ${x * (100 / CELLSPERROW)}%;
        top: ${y * (100 / CELLSPERROW)}%;
      }
    `
  }
  return result
}
const cell = styled('div', {
  cells: Number,
  bSize: Number,
  size: Number,
  src: String,
})`
  background-image: url(${p => p.src});
  background-size: ${p => p.bSize}px ${p => p.bSize}px;
  background-repeat: no-repeat;
  position: absolute;
  height: ${p => p.size}px;
  width: ${p => p.size}px;
  ${p => generateCells(p.cells, p.size)};
`

const loader = styled.div`
  height: 2px;
  width: 100%;
  background: white;
  position: absolute;
  z-index: 6;
  animation: load .5s infinite linear;
`

const wrapper = styled('div', {
  cells: Number,
  size: Number,
  enhancing: Boolean,
})`
  cursor: pointer;
  height: ${p => p.size}px;
  width: ${p => p.size}px;
  position: relative;
  overflow: hidden;

  &:hover span {
    display: block;
  }

  &:after {
    content: '';
    height: 100%;
    width: 100%;
    display: block;
    background: repeating-linear-gradient(
        90deg,
        blue 0%,
        blue 0.25%,
        transparent 0.25%,
        transparent ${p => Math.sqrt(p.cells) - 0.25}%,
        blue ${p => Math.sqrt(p.cells) - 0.25}%,
        blue ${p => Math.sqrt(p.cells)}%
      ),
      repeating-linear-gradient(
        0deg,
        blue 0%,
        blue 0.25%,
        transparent 0.25%,
        transparent ${p => Math.sqrt(p.cells) - 0.25}%,
        blue ${p => Math.sqrt(p.cells) - 0.25}%,
        blue ${p => Math.sqrt(p.cells)}%
      );
    z-index: 4;
    position: absolute;
  }

  &:before {
    content: '';
    height: 100%;
    width: 100%;
    display: block;
    position: absolute;
    z-index: 5;
    ${p =>
      p.enhancing &&
      `
      animation: flash ${2 / Math.sqrt(p.cells)}s steps(2);
      animation-iteration-count: ${Math.sqrt(p.cells)};
    `};
  }
`

Vue.component('image-enhancer', {
  components: {
    cell,
    close,
    indicator,
    loader,
    wrapper,
  },
  template: `
    <wrapper :size="parseInt(size, 10)" :loading="LOADING" :enhancing="ENHANCING" :cells="parseInt(cells, 10)" class="image-enhancer" @mousemove.native="indicate" @click.native="enhance">
      <loader v-if="LOADING"/>
      <cell v-if="!LOADING" ref="cells" v-for="(c, key) in parseInt(cells, 10)" :key="c" :cells="parseInt(cells, 10)" :src="src" :bSize="parseInt(size, 10)" :size="parseInt(size, 10) / Math.sqrt(parseInt(cells, 10)) "/>
      <indicator v-if="!LOADING" ref="indicator" :size="300 / Math.sqrt(parseInt(cells, 10))" :enhancing="ENHANCING"/>
      <close v-if="ENHANCED" @click.native="dehance">
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path fill="#ffffff" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      </close>
    </wrapper>
  `,
  props: ['cells', 'src', 'src', 'size'],
  data: function() {
    return {
      ENHANCED: false,
      ENHANCING: false,
      INDICATING: false,
      LOADING: true,
    }
  },
  methods: {
    getCursorPos: function(e) {
      const cellsPerRow = Math.sqrt(parseInt(this.cells, 10))
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
      if (this.LOADING) return
      const pos = this.getCursorPos(e)
      this.$refs.indicator.$el.style.setProperty('--x', pos.x)
      this.$refs.indicator.$el.style.setProperty('--y', pos.y)
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
          this.ENHANCING = true
          this.ENHANCED = false
        },
        onComplete: () => {
          this.ENHANCING = false
          this.ACTIVE_CELL.style.zIndex = zIndex
          this.$refs.indicator.$el.style.removeProperty('display')
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
      if (this.ENHANCING || this.ENHANCED || this.INDICATING || this.LOADING) return
      const cursorPos = this.getCursorPos(e)
      const CELLS_PER_ROW = Math.sqrt(parseInt(this.cells, 10))
      const indicator = this.$refs.indicator.$el
      const cells = this.$refs.cells

      this.ACTIVE_CELL = cells[cursorPos.y * CELLS_PER_ROW + cursorPos.x].$el
      this.ACTIVE_CELL_STYLE = Object.assign(
        {},
        getComputedStyle(this.ACTIVE_CELL)
      )
      const {
        backgroundPositionX,
        backgroundPositionY,
      } = this.ACTIVE_CELL_STYLE

      const bpX = parseInt(backgroundPositionX, 10) * CELLS_PER_ROW
      const bpY = parseInt(backgroundPositionY, 10) * CELLS_PER_ROW
      const bSize = this.$el.offsetHeight * CELLS_PER_ROW

      // Change some styling props for the newly selected
      this.ACTIVE_CELL.style.zIndex = 4

      const scale = new TimelineMax()
      const blink = new TimelineMax({ repeat: 4 })
      blink.to(indicator, 0.1, { alpha: 0 }).to(indicator, 0.1, { alpha: 1 })

      const indicate = TweenMax.from(indicator, 1, {
        onStart: () => {
          this.INDICATING = true
          indicator.style.display = 'block'
        },
        position: 'absolute',
        height: this.$el.offsetHeight,
        width: this.$el.offsetHeight,
        left: 0,
        top: 0,
        ease: SteppedEase.config(4),
      })

      const scaleUp = TweenMax.to(this.ACTIVE_CELL, 2, {
        onStart: () => {
          this.ENHANCING = true
          indicator.style.display = 'none'
        },
        onComplete: () => {
          this.ENHANCING = false
          this.ENHANCED = true
          this.INDICATING = false
          indicator.removeAttribute('style')
          indicator.style.display = 'none'
        },
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        backgroundSize: `${bSize}px ${bSize}px`,
        backgroundPosition: `${bpX}px ${bpY}px`,
        ease: SteppedEase.config(CELLS_PER_ROW),
      })
      scale
        .add(indicate)
        .add(blink)
        .add(scaleUp)
    },
  },
  mounted: function(e) {
    // Small hacky piece for loading of the image 😅
    const assetHasLoaded = (src) => new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = resolve
      img.onerror = reject
      img.src = src
    })
    assetHasLoaded(this.src)
      .then(() => this.LOADING = false)
      .catch(() => console.error(`There was a problem loading ${this.src}`))
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
