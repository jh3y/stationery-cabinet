/**
 * Facebook went and invented a new measure of time called a "flick"
 * https://www.theverge.com/tldr/2018/1/22/16920740/facebook-unit-of-time-flicks-frame-rate-ticks-github-nanosecond-second
 *
 * One flick is equivalent to 1/705600000 of a second
 * So, flicks per second is 705600000
 * That means flicks per millisecond is 705600, please correct me if I've got the Marh wrong there somehow 😅
 * Flicks per minute is 42336000000
 */
const flicksPerMilliSecond = 705600
const interval = 50
const app = new Vue({
  el: '#app',
  data: {
    flickCount: 0,
    randomQuotes: [
      `It would take ${((705600000 * 60) * 12).toLocaleString()} flicks to boil an egg!`
    ]
  },
  methods: {
    resetFlickCount: function() {
      this.flickCount = 0
    },
    updateFlickCount: function() {
      this.flickCount += interval * flicksPerMilliSecond
    }
  },
  mounted: function() {
    setInterval(this.updateFlickCount, interval)
  }
})