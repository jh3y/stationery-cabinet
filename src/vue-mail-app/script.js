const ANIMATION_DURATION = 0.15
const CLASSES = {
  COMPOSER: 'mail-composer',
  HEADER: 'mail-screen-header',
  SETTINGS: 'mail-settings',
}
let messages = []
for (let i = 0; i < 15; i++) {
  messages.push({
    from: {
      avatar: faker.image.avatar(),
      name: faker.name.findName(),
    },
    received: moment(faker.date.recent()),
    subject: faker.company.bs(),
    message: faker.lorem.paragraphs(Math.floor(Math.random() * 10 + 2)),
  })
}
messages = messages.sort((a, b) => a.received.diff(b.received)).reverse()

for (let message of messages) {
  if (message.received.isAfter(moment().subtract(5, 'hours'))) {
    message.received = message.received.format('HH:mm')
  } else {
    message.received = message.received.format('D MMM')
  }
}

const app = new Vue({
  el: '#app',
  data: {
    theme: '#a7dde9',
    openingComposer: false,
    closingComposer: false,
    composerOpen: false,
    messageOpen: false,
    activeMessage: undefined,
    activeMessageIndex: undefined,
    fakeOnePos: undefined,
    fakeTwoPos: undefined,
    messageTop: undefined,
    mailOpened: false,
    openingSettings: false,
    closingSettings: false,
    settingsOpen: false,
    loaded: false,
    messages: [],
  },
  mounted: function() {
    this.loaded = true
  },
  updated: function() {
    this.$nextTick(function() {
      if (this.openingComposer) {
        const composer = document.querySelector(`.${CLASSES.COMPOSER}`)
        const composerTl = new TimelineMax({
          onComplete: () => {
            this.openingComposer = false
            this.composerOpen = true
            this.mailOpened = true
          },
        })
        composerTl.add(
          TweenMax.to(composer, ANIMATION_DURATION, {
            right: 0,
            bottom: 0,
            height: '100%',
            width: '100%',
            borderRadius: 0,
          })
        )
      }
      if (this.activeMessage && !this.messageOpen) {
        const el = document.querySelector('.mail-message--opening')
        const fakeOne = document.querySelector('.fake-messages--top')
        const fakeTwo = document.querySelector('.fake-messages--bottom')
        const messageNav = el.querySelector(`.${CLASSES.HEADER}`)
        const messageMessage = document.querySelector('.mail-message__message')
        const messageHeader = el.querySelector('.mail-message__header')
        const sender = messageHeader.querySelector('.mail-message__sender')
        const subject = messageHeader.querySelector('.mail-message__subject')
        const avatar = messageHeader.querySelector('.mail-message__avatar')
        const timestamp = messageHeader.querySelector(
          '.mail-message__timestamp'
        )
        const openTl = new TimelineMax({
          onComplete: () => {
            this.messageOpen = true
          },
        })
        openTl
          .add(
            TweenMax.to(el, ANIMATION_DURATION, {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              height: '100%',
            })
          )
          .add(
            TweenMax.to(messageHeader, ANIMATION_DURATION, {
              height: 'auto',
              paddingTop: 10,
              marginBottom: 10,
            }),
            0
          )
          .add(
            TweenMax.to(sender, ANIMATION_DURATION, {
              fontSize: '0.75rem',
            }),
            0
          )
          .add(
            TweenMax.to(timestamp, ANIMATION_DURATION, {
              fontSize: '0.65rem',
              top: 2,
              height: '0.65rem',
            }),
            0
          )
          .add(
            TweenMax.to(subject, ANIMATION_DURATION, {
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#000',
            }),
            0
          )
          .add(
            TweenMax.to(avatar, ANIMATION_DURATION, {
              height: 50,
              width: 50,
            }),
            0
          )
          .add(TweenMax.to(fakeOne, ANIMATION_DURATION, { bottom: '100%' }), 0)
          .add(TweenMax.to(fakeTwo, ANIMATION_DURATION, { top: '100%' }), 0)
          .add(TweenMax.from(messageNav, ANIMATION_DURATION, { height: 0 }), 0)
          .add(TweenMax.to(messageNav, ANIMATION_DURATION, { height: 50 }), 0)
          .add(
            TweenMax.from(messageMessage, ANIMATION_DURATION, { height: 0 }),
            0
          )
      }
      if (this.openingSettings) {
        const el = document.querySelector(`.${CLASSES.SETTINGS}`)
        TweenMax.from(el, ANIMATION_DURATION, {
          onComplete: () => {
            this.openingSettings = false
            this.settingsOpen = true
          },
          x: '100%',
        })
      }
    })
  },
  methods: {
    openComposer: function() {
      this.openingComposer = !this.openingComposer
    },
    closeComposer: function() {
      this.closingComposer = !this.closingComposer
      const composer = document.querySelector(`.${CLASSES.COMPOSER}`)
      const composerTl = new TimelineMax({
        onComplete: () => {
          this.composerOpen = false
          this.closingComposer = false
        },
      })
      composerTl.add(
        TweenMax.to(composer, ANIMATION_DURATION, {
          bottom: 10,
          right: 10,
          height: 44,
          width: 44,
          borderRadius: '100%',
        })
      )
    },
    openInbox: function() {
      this.messages = messages
    },
    closeInbox: function() {
      this.messages = []
      this.mailOpened = false
    },
    closeMessage: function() {
      const el = document.querySelector('.mail-message--focus')
      TweenMax.to(el, ANIMATION_DURATION, {
        onComplete: () => {
          this.activeMessage = null
          this.activeMessageIndex = null
          this.messageOpen = false
        },
        x: '-100%',
      })
    },
    openMessage: function(message, idx) {
      const el = document.getElementById(`message--${idx}`)
      const list = document.querySelector('.mail-messages--main')
      const header = document.querySelector(`.${CLASSES.HEADER}`)
      this.mailOpened = true
      this.activeMessage = message
      this.activeMessageIndex = idx
      this.fakeTwoPos =
        el.offsetTop + el.offsetHeight + header.offsetHeight - list.scrollTop
      this.messageTop = el.offsetTop + header.offsetHeight - list.scrollTop
      this.fakeOnePos = list.offsetHeight - el.offsetTop + list.scrollTop
    },
    openSettings: function() {
      this.openingSettings = !this.openingSettings
    },
    closeSettings: function() {
      const el = document.querySelector(`.${CLASSES.SETTINGS}`)
      TweenMax.to(el, ANIMATION_DURATION, {
        onComplete: () => {
          this.openeingSettings = false
          this.settingsOpen = false
        },
        x: '100%',
      })
    },
    updateTheme: function(e) {
      this.theme = e.target.value
      document.documentElement.style.setProperty('--accent', e.target.value)
    },
  },
})
