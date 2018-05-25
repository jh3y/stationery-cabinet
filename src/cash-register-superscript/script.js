const getRandom = () => Math.floor(Math.random() * 10)
const createNoteLocations = () => {
  const loc = []
  for (let i = 0; i < 10; i++) {
    loc.push([
      Math.floor(Math.random() * 100) - 50,
      Math.floor(Math.random() * 300) + 150,
      Math.floor(Math.random() * 90) - 90
    ])
  }
  return loc
}
const app = new Vue({
  el: '.cash-register',
  data: {
    subbing: false,
    lines: 0,
    receiptLines: 0,
    showLines: 0,
    amount: [0, 0, 0, 0],
    temp: [0, 0, 0, 0],
    notes: createNoteLocations(),
    tending: false,
    registerNoise: new Audio('https://freesound.org/data/previews/184/184438_850742-lq.mp3')
  },
  methods: {
    addToLine: function(e) {
      this.temp[e.target.getAttribute('data-amount-index')] = getRandom()
    },
    addReceiptItem: function(lines = 1) {
      this.amount = this.temp
      this.temp = [0, 0, 0, 0]
      this.lines = this.lines + 1
      this.receiptLines = this.receiptLines + lines
      this.$nextTick(() => {
        this.showLines = this.showLines + lines
      })
    },
    addLine: function() {
      this.addReceiptItem()
    },
    addSub: function() {
      this.addReceiptItem(2)
    },
    tend: function(e) {
      if ((this.tending === false && e.target.className.indexOf('front') !== -1) || (this.tending && e.target.className.indexOf('tend') !== -1)) return
      this.tending = !this.tending
      if (this.tending) {
        this.registerNoise.play()
      }
      if (this.tending === false)
        this.registerNoise.pause()
        this.registerNoise.currentTime = 0
        this.notes = createNoteLocations()
    }
  },
})
