/**
  * debounce function
  * use inDebounce to maintain internal reference of timeout to clear
*/
const debounce = (func, delay) => {
  let inDebounce
  return function() {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() =>
      func.apply(context, args)
    , delay)
  }
}

/**
  * throttle function that catches and triggers last invocation
  * use time to see if there is a last invocation
*/
const throttle = (func, limit) => {
  let inThrottle
  let lastFunc
  let lastRan
  return function() {
    const context = this
    const args = arguments
    if (!inThrottle) {
      func.apply(context, args)
      lastRan = Date.now()
      inThrottle = true
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}

const app = new Vue({
  el: '#app',
  data: {
    timeFormat: 'h:mm:ss A',
    time: moment().format('h:mm:ss A'),
    logs: [],
  },
  methods: {
    log: function(type) {
      const newDate = new Date()
      this.logs.unshift({
        type,
        time: moment().format(this.timeFormat)
      })
    },
    debounceCall: debounce(function() { this.log('DEBOUNCE') }, 3000),
    throttleCall: throttle(function() { this.log('THROTTLE') }, 1000),
    updateTime: function() {
      this.time = moment().format(this.timeFormat)
    }
  },
  mounted: function() {
    setInterval(this.updateTime, 1000)
  }
})