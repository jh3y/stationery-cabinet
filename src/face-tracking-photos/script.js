const app = new Vue({
  el: '#app',
  data: {
    loaded: false,
    muted: true,
    thugging: false,
  },
  methods: {
    processTracking: function(e) {
      if (e.data.length === 2) {
        // which eye is left and which is right?
        const videoBounds = this.$refs.video.getBoundingClientRect()
        let left
        let right
        if (e.data[0].x < e.data[1].x) {
          left = e.data[0]
          right = e.data[1]
        } else {
          right = e.data[0]
          left = e.data[1]
        }
        const shadesHeight = left.height
        const shadesWidth = right.x + right.width - left.x
        const shadesX = left.x + videoBounds.left
        const shadesY =
          left.y + left.height / 2 + videoBounds.top
        // This is all just what has been working on my own face 😓
        this.$refs.shades.style.setProperty('--width', shadesWidth * 1.5)
        this.$refs.shades.style.setProperty('--x', shadesX)
        this.$refs.shades.style.setProperty('--y', shadesY)
      }
    },
    thug: function(e) {
      this.thugging = !this.thugging
      const stop = () => {
        if (this.playing) {
          this.playing.then(() => {
            this.$refs.audio.pause()
            this.$refs.audio.currentTime = 0
            if (this.stopper) clearTimeout(this.stopper)
            this.playing = undefined
          })
        }
      }
      if (this.thugging) {
        try {
          this.playing = this.$refs.audio.play()
          this.stopper = setTimeout(stop, 10000)
        } catch (err) {
          console.info(err)
        }
      } else if (this.$refs.audio.currentTime > 0) {
        stop()
      }

    },
    toggleSound: function(e) {
      this.muted = !this.muted
      this.$refs.audio.muted = this.muted
    },
    initTracking: function() {
      const eyes = new tracking.ObjectTracker('eye')
      eyes.on('track', this.processTracking)
      tracking.track('#frame', eyes, { camera: true })
    },
  },
  mounted: function() {
    const { audio, video } = this.$refs
    video.addEventListener('playing', () => (this.loaded = true))
    audio.muted = this.muted
    this.initTracking()
  },
})
