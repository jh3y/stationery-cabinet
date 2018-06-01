TweenMax.defaultEase = Linear.easeNone
let contacts = []
for (let c = 0; c < 100; c++) {
  const newContact = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    avatar: faker.internet.avatar(),
    number: faker.phone.phoneNumber(),
  }
  const items = [
    { email: 'internet.email' },
    { homenumber: 'phone.phoneNumber' },
    { twitter: 'internet.userName' },
    { instagram: 'internet.userName' },
    { codepen: 'internet.userName' },
  ]
  const add = i => {
    const key = Object.keys(i)[0]
    const value = i[key].split('.')
    if (Math.random() > 0.5)
      newContact[key] = faker[value[0]][value[1]](
        value[1] === 'phoneNumber' ? null : newContact.firstName,
        newContact.lastName
      )
  }
  for (let i of items) add(i)
  if (Math.random() > 0.5) newContact.whatsapp = newContact.number
  contacts.push(newContact)
}
contacts = contacts.sort((a, b) => (a.firstName > b.firstName ? 1 : -1))

const DURATION = 0.25
const CLASSES = {
  LOADING: 'phonebook--loading',
}
const CONTACTHEIGHT = 50
const PADDING = 20

const app = new Vue({
  el: '.phonebook',
  data: {
    contacts,
    fakePosOne: undefined,
    fakePosTwo: undefined,
    messageTop: 0,
    detailOpened: false,
    updating: false,
    active: 0,
    next: 1,
    prev: undefined,
    activeContact: contacts[0],
  },
  methods: {
    updateActiveContact: function(contactIndex) {
      if (this.contacts[contactIndex]) {
        this.active = contactIndex
        this.next = contactIndex + 1
        this.prev = contactIndex - 1
        this.activeContact = this.contacts[contactIndex]
      }
    },
    selectContact: function(contactIndex, contact) {
      this.updateActiveContact(contactIndex)
      this.$refs.contacts.scrollTop = contactIndex * CONTACTHEIGHT
      this.detailOpened = true
      this.activeContact = contact
      this.$nextTick(() => {
        const el = this.$refs.contacts.children[contactIndex]
        const list = this.$refs.contacts
        const elStyle = el.getBoundingClientRect()
        const listStyle = list.getBoundingClientRect()
        this.messageTop = el.offsetTop - list.scrollTop
        this.fakePosTwo = el.offsetTop + el.offsetHeight - list.scrollTop
        this.fakePosOne = list.offsetHeight - el.offsetTop + list.scrollTop
        const openTL = new TimelineMax()
        openTL
          .to(
            this.$refs.fakeHeader,
            DURATION,
            {
              y: -this.fakePosOne,
            },
            0
          )
          .to(
            this.$refs.topFake,
            DURATION,
            {
              bottom: listStyle.height,
            },
            0
          )
          .to(
            this.$refs.bottomFake,
            DURATION,
            {
              top: listStyle.height,
            },
            0
          )
          .to(
            this.$refs.activeAvatar,
            DURATION,
            {
              y: this.messageTop / 2 - elStyle.height / 2,
              x: listStyle.width / 2 - elStyle.height / 2,
            },
            0
          )
          .to(
            this.$refs.activeAvatarBack,
            DURATION,
            {
              opacity: 0.65,
            },
            0
          )
          .to(
            this.$refs.activeName,
            DURATION,
            {
              paddingLeft: PADDING,
              fontSize: '2rem',
              y: this.messageTop / 2 + elStyle.height / 2,
              lineHeight: '2.5rem',
            },
            0
          )
          .to(
            this.$refs.activeDetails,
            DURATION,
            {
              opacity: 1,
              y: 0,
            },
            0
          )
      })
    },
    closeDetails: function(e) {
      const avatarStyle = this.$refs.activeAvatar.getBoundingClientRect()
      const closeTL = new TimelineMax({
        onComplete: () => {
          this.detailOpened = false
        },
      })
      closeTL
        .to(
          this.$refs.fakeHeader,
          DURATION,
          {
            y: 0,
          },
          0
        )
        .to(
          this.$refs.topFake,
          DURATION,
          {
            bottom: this.fakePosOne,
          },
          0
        )
        .to(
          this.$refs.bottomFake,
          DURATION,
          {
            top: this.fakePosTwo,
          },
          0
        )
        .to(
          this.$refs.activeAvatar,
          DURATION,
          {
            x: 0,
            y: this.messageTop,
          },
          0
        )
        .to(
          this.$refs.activeAvatarBack,
          DURATION,
          {
            opacity: 0,
          },
          0
        )
        .to(
          this.$refs.activeName,
          DURATION,
          {
            paddingLeft: avatarStyle.width + PADDING,
            y: this.messageTop,
            fontSize: '1.25rem',
            lineHeight: `${avatarStyle.height}px`,
          },
          0
        )
        .to(
          this.$refs.activeDetails,
          DURATION,
          {
            opacity: 0,
            y: avatarStyle.height,
          },
          0
        )
    },
    handleScroll: function(e) {
      const { $refs, updateActiveContact } = this
      const contactIndex = Math.floor($refs.contacts.scrollTop / CONTACTHEIGHT)
      updateActiveContact(contactIndex)
      this.updating = false
    },
    update: function(e) {
      const { handleScroll, updating } = this
      if (updating) return
      else {
        // use raf to improve scroll performance
        requestAnimationFrame(handleScroll)
        this.updating = true
      }
    },
  },
  mounted: function() {
    this.$el.classList.remove(CLASSES.LOADING)
    this.$refs.contacts.addEventListener('scroll', this.update)
  },
})
