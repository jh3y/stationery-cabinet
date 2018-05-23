const getRandom = () => Math.floor(Math.random() * 10)
/**
 * Vue cash register app
 */
const app = new Vue({
  el: '.cash-register',
  data: {
    lines: 0,
    amount: [0, 0, 0, 0],
    temp: [0, 0, 0, 0],
  },
  methods: {
    addToLine: function(e) {
      this.temp[e.target.getAttribute('data-amount-index')] = getRandom()
    },
    addLine: function(e) {
      this.amount = this.temp
      this.temp = [0, 0, 0, 0]
      this.lines = (this.lines + 1) % 10
    }
  },
})
