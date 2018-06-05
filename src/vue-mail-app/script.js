const ANIMATION_DURATION = 0.25
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
  methods: {
    openComposer: function() {
      this.openingComposer = !this.openingComposer
      this.$nextTick(() => {
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
      })
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
      TweenMax.to(this.$refs.mailContainer, ANIMATION_DURATION, {
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
      this.$nextTick(() => {
        const el = document.querySelector('.mail-message--opening')
        const {
          fakeTop,
          fakeBottom,
          fakeHeader,
          mailHeader,
          mailAvatar,
          mailSubject,
          mailSender,
          mailTimestamp,
          mailContainer,
          mailContent,
        } = this.$refs
        const fakeHeaderPos = fakeHeader.getBoundingClientRect()
        const mailHeaderPos = mailHeader.getBoundingClientRect()
        const mailContainerPos = mailContainer.getBoundingClientRect()
        const openTl = new TimelineMax({
          onComplete: () => {
            this.messageOpen = true
          },
        })
        openTl
          // Move fakes out of the way
          .to(fakeHeader, ANIMATION_DURATION, { y: `-${this.messageTop}px` }, 0)
          .to(fakeTop, ANIMATION_DURATION, { bottom: '100%' }, 0)
          .to(fakeBottom, ANIMATION_DURATION, { top: '100%' }, 0)
          // Move header to top and change sizing
          .to(
            mailHeader,
            ANIMATION_DURATION,
            { y: `-${this.messageTop - fakeHeaderPos.height}`, paddingTop: 10 },
            0
          )
          .from(
            mailAvatar,
            ANIMATION_DURATION,
            { height: '34px', width: '34px' },
            0
          )
          .from(
            mailTimestamp,
            ANIMATION_DURATION,
            { fontSize: '0.75rem', y: 0 },
            0
          )
          .from(
            mailSubject,
            ANIMATION_DURATION,
            {
              overflow: 'hidden',
              fontSize: '0.75rem',
              fontWeight: '400',
              color: '#7e7e7e',
            },
            0
          )
          .from(mailSender, ANIMATION_DURATION, { fontSize: '1rem' }, 0)
          // Animate in the article
          .to(
            mailContent,
            ANIMATION_DURATION,
            {
              height: `${mailContainerPos.height -
                (mailHeaderPos.height + fakeHeaderPos.height)}px`,
              opacity: 1,
              y: `-${mailContainerPos.height -
                (mailHeaderPos.height + fakeHeaderPos.height)}px`,
            },
            0
          )
      })
    },
    openSettings: function() {
      this.openingSettings = !this.openingSettings
      this.$nextTick(() => {
        const el = document.querySelector(`.${CLASSES.SETTINGS}`)
        TweenMax.from(el, ANIMATION_DURATION, {
          onComplete: () => {
            this.openingSettings = false
            this.settingsOpen = true
          },
          x: '100%',
        })
      })
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
