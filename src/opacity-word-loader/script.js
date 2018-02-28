const app = new Vue({
  el: '#app',
  data: {
    progress: 50,
    dirty: false,
  },
  methods: {
    updateLoader: function(e) {
      this.dirty = true
      this.progress = 100 - e.target.value
    }
  }
})
