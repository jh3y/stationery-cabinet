const { TimelineMax, TweenMax, Power0 } = window
const container = document.querySelector('.my-video-player')
/**
 *
 */
class VideoPlayer {
  indicators = []
  constructor(container, src) {
    this.container = container
    this.buildMarkup(src)
    this.bindStuff()
  }
  /**
   * Generate the markup for the video player based
   * on a video URL
   */
  buildMarkup = videoSrc => {
    this.video = document.createElement('video')
    this.video.src = videoSrc
    this.video.setAttribute('controls', true)
    this.video.classList.add('video-player__video')
    this.container.append(this.video)
    for (let i = 0; i < 4; i++) {
      const indicator = document.createElement('div')
      indicator.classList.add('video-player__indicator')
      this.indicators.push(indicator)
      this.container.append(indicator)
    }
    this.replay = document.createElement('button')
    this.replay.classList.add('video-player__action')
    this.replay.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
      </svg>
    `
    this.container.append(this.replay)
    this.container.classList.add('video-player')
  }
  buildTimelines = () => {
    const { indicators } = this
    this.timeline = new TimelineMax()
      .add(
        TweenMax.to(indicators[2], this.video.duration / 2, {
          scaleX: 1,
          ease: Power0.easeNone,
        }),
        0
      )
      .add(
        TweenMax.to(indicators[3], this.video.duration / 2, {
          scaleY: 1,
          ease: Power0.easeNone,
        }),
        0
      )
      .add(
        TweenMax.to(indicators[0], this.video.duration / 2, {
          scaleX: 1,
          ease: Power0.easeNone,
        }),
        this.video.duration / 2
      )
      .add(
        TweenMax.to(indicators[1], this.video.duration / 2, {
          scaleY: 1,
          ease: Power0.easeNone,
        }),
        this.video.duration / 2
      )

    this.timeline.seek(this.video.currentTime)
    this.timeline.paused(true)

    this.endTimeline = new TimelineMax({
      onComplete: () => this.timeline.seek(0),
      onReverseComplete: () => this.video.play(),
    })
      .add(
        TweenMax.to(this.video, 0.25, {
          scale: 0,
        })
      )
      .add(TweenMax.to(this.replay, 0.25, { scale: 1 }))
    this.endTimeline.paused(true)
  }
  play = () => {
    this.timeline.play()
  }
  pause = () => {
    if (this.timeline) {
      this.timeline.pause()
    }
  }

  end = () => {
    this.endTimeline.play()
  }

  seek = () => {
    if (this.timeline) {
      this.timeline.seek(this.video.currentTime)
    }
  }

  /**
   * Bind the different video events etc.
   */
  bindStuff = () => {
    this.video.addEventListener('play', this.play)
    this.video.addEventListener('pause', this.pause)
    this.video.addEventListener('ended', this.end)
    this.video.addEventListener('seeking', this.seek)
    this.video.addEventListener('durationchange', this.buildTimelines)
    this.replay.addEventListener('click', () => {
      this.video.currentTime = 0
      this.endTimeline.reverse()
    })
  }
}

new VideoPlayer(
  container,
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/video-player-video.mp4'
)
