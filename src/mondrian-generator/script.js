const app = new Vue({
  el: '#app',
  data: {
    blocks: [],
  },
  methods: {
    generateBlocks: function() {
      for (let i = 0; i < 10; i++) {
        this.blocks.push({
          colSpan: Math.floor(Math.random() * 3 + 1),
          rowSpan: Math.floor(Math.random() * 3 + 1),
          colorIndex: Math.floor(Math.random() * 6 + 1),
        })
      }
    },
    regenerate: function() {
      this.blocks = []
      setTimeout(() => this.generateBlocks(), 0)
    },
  },
  mounted: function () {
    this.generateBlocks()
  }
})
