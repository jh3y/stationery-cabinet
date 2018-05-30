// const phonebook = document.querySelector('.phonebook')
// const contacts = document.querySelectorAll('.phonebook__contact')
// const update = () => {
//   const contactIndex = Math.floor(phonebook.scrollTop / 50)
//   if (contacts[contactIndex]) {
//     const active = document.querySelector('.phonebook__contact--active')
//     const newActive = contacts[contactIndex]
//     const next = document.querySelector('.phonebook__contact--next')
//     const prev = document.querySelector('.phonebook__contact--prev')
//     if (newActive.nextElementSibling) {
//       if (next) next.classList.remove('phonebook__contact--next')
//       newActive.nextElementSibling.classList.add('phonebook__contact--next')
//     }
//     if (newActive.previousElementSibling) {
//       if (prev) prev.classList.remove('phonebook__contact--prev')
//       newActive.previousElementSibling.classList.add('phonebook__contact--prev')
//     }
//     active.classList.remove('phonebook__contact--active')
//     newActive.classList.add('phonebook__contact--active')
//   }
// }

// phonebook.addEventListener('scroll', update)
const contacts = []
for (let c = 0; c < 120; c++) {
  contacts.push({
    name: faker.name.findName(),
    avatar: faker.image.avatar()
  })
}
const app = new Vue({
  el: '.phonebook',
  data: {
    contacts,
    updating: false,
    active: 0,
    next: 1,
    prev: undefined,
  },
  methods: {
    handleScroll: function(e) {
      const contactIndex = Math.floor(this.$el.scrollTop / 50)
      if (this.contacts[contactIndex]) {
        this.active = contactIndex
        this.next = contactIndex + 1
        this.prev = contactIndex - 1
      }
      this.updating = false
    },
    update: function(e) {
      if (this.updating) return
      else {
        requestAnimationFrame(this.handleScroll)
        this.updating = true
      }
    }
  },
  mounted: function() {
    this.$el.classList.remove('phonebook--loading')
    this.$el.addEventListener('scroll', this.update)
  }
})