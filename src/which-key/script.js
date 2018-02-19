Vue.component('keyfilter', {
  template: `
    <div class="filter">
      <label class="filter__label" :for="label">{{ label }}</label>
      <input type="checkbox" class="filter__input" :checked="active" v-on:change="toggle" :data-type="type" :id="label"/>
    </div>
  `,
  props: [ 'active', 'label', 'toggle', 'type']
})
Vue.component('key', {
  template: `
    <div class="key">
      <div class="key__code">{{ code }}</div>
      <div class="key__value">{{ value }}</div>
      <div class="key__event">{{ event }}</div>
    </div>
  `,
  props: ['code', 'value', 'event']
})

new Vue({
  el: '#app',
  data: function () {
    return {
      keyed: [],
      showLog: true,
      typeFilters: {
        keypress: true,
        keyup: false,
        keydown: false,
      },
      valueFilters: {
        numeric: true,
        letters: true,
        'everything else': true,
      }
    }
  },
  methods: {
    bind: function (e) {
      const {
        log,
        typeFilters,
      } = this
      for (const filter of Object.keys(typeFilters)) {
        if (typeFilters[filter]) window.addEventListener(filter, log)
      }
    },
    clear: function () {
      this.keyed.splice(0)
    },
    log: function (e) {
      const {
        keyed
      } = this
      const {
        which,
      } = e
      const isALetter = (which > 96 && which < 123) || (which > 64 && which < 91)
      const isANumber = (which > 47 && which < 58)
      if (this.valueFilters.letters && isALetter) keyed.unshift(e)
      if (this.valueFilters.numeric && isANumber) keyed.unshift(e)
      if (this.valueFilters['everything else'] && (!isALetter && !isANumber)) keyed.unshift(e)
      if (keyed.length >= 7) keyed.pop()
    },
    toggleFilter: function(e) {
      const {
        log,
        typeFilters,
        valueFilters,
      } = this
      const {
        checked,
        id,
        dataset,
      } = e.target
      this[`${dataset.type}Filters`][id] = checked
      if (dataset.type === 'type')
        window[typeFilters[id] ? 'addEventListener' : 'removeEventListener'](id, log)
    },
    toggleLog: function(e) {
      this.showLog = e.target.checked
    }
  },
  mounted: function () {
    this.bind()
  },
})