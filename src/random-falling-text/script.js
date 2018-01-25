const root = document.documentElement
const app = new Vue({
  el: '#app',
  data: {
    value: 'Edit me!'
  },
  methods: {
    change: function(e) {
      this.value = e.target.innerText
    },
    updateCSS: function(e) {
      root.style.setProperty(`--${e.target.id}`, e.target.value / 100)
    }
  },
})
