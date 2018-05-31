TweenMax.defaultEase = Linear.easeNone
const contacts = []
for (let c = 0; c < 120; c++) {
  contacts.push({
    name: faker.name.findName(),
    avatar: faker.image.avatar()
  })
}
const DURATION = .25
const app = new Vue({
  el: '.phonebook',
  data: {
    contacts,
    fakePosOne: undefined,
    fakePosTwo: undefined,
    messageTop: 0,
    detailOpened: false,
    openingDetail: false,
    updating: false,
    active: 0,
    next: 1,
    prev: undefined,
    activeContact: undefined,
  },
  methods: {
    updateActiveContact: function(contactIndex) {
      if (this.contacts[contactIndex]) {
        this.active = contactIndex
        this.next = contactIndex + 1
        this.prev = contactIndex - 1
      }
    },
    selectContact: function(contactIndex, contact) {
      this.updateActiveContact(contactIndex)
      this.$refs.contacts.scrollTop = (contactIndex * 50)
      this.openingDetail = true
      this.detailOpened = true
      this.activeContact = contact
      this.$nextTick(() => {
        const el = this.$refs.contacts.children[contactIndex]
        const list = this.$refs.contacts
        this.messageTop = el.offsetTop - list.scrollTop
        this.fakePosTwo =
          el.offsetTop + el.offsetHeight - list.scrollTop
        this.fakePosOne = list.offsetHeight - el.offsetTop + list.scrollTop
        const openTL = new TimelineMax()
        openTL
          .to(this.$refs.fakeHeader, DURATION, {
            y: -(this.fakePosOne)
          }, 0)
          .to(this.$refs.topFake, DURATION, {
            bottom: 480,
          }, 0)
          .to(this.$refs.bottomFake, DURATION, {
            top: 480,
          }, 0)
          .to(this.$refs.activeAvatar, DURATION, {
            y: (this.messageTop / 2) - 50,
            x: (320 / 2) - 50
          }, 0)
          .to(this.$refs.activeName, DURATION, {
            paddingLeft: 0,
            fontSize: '2rem',
            y: (this.messageTop / 2) + 50,
            lineHeight: '2.5rem',
          }, 0)
          .to(this.$refs.activeDetails, DURATION, {
            opacity: 1,
            y: 0
          }, 0)
      })
    },
    closeDetails: function(e) {
      const closeTL = new TimelineMax({
        onComplete: () => {
          this.detailOpened = false
          this.openingDetail = false
        }
      })
      closeTL
        .to(this.$refs.fakeHeader, DURATION, {
          y: 0,
        }, 0)
        .to(this.$refs.topFake, DURATION, {
          bottom: this.fakePosOne,
        }, 0)
        .to(this.$refs.bottomFake, DURATION, {
          top: this.fakePosTwo,
        }, 0)
        .to(this.$refs.activeAvatar, DURATION, {
          x: 0,
          y: this.messageTop,
        }, 0)
        .to(this.$refs.activeName, DURATION, {
          paddingLeft: 100,
          y: this.messageTop,
          fontSize: '1rem',
          lineHeight: '100px',
        }, 0)
        .to(this.$refs.activeDetails, DURATION, {
          opacity: 0,
          y: 100,
        }, 0)
    },
    handleScroll: function(e) {
      const contactIndex = Math.floor(this.$refs.contacts.scrollTop / 50)
      this.updateActiveContact(contactIndex)
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
    this.$refs.contacts.addEventListener('scroll', this.update)
  }
})