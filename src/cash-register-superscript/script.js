const getRandom = () => Math.floor(Math.random() * 10)
const app = new Vue({
  el: '.cash-register',
  data: {
    subbing: false,
    lines: 0,
    receiptLines: 0,
    showLines: 0,
    amount: [0, 0, 0, 0],
    temp: [0, 0, 0, 0],
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
  },
})
