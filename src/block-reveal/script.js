const button = document.querySelector('button')
const restart = () => {
  myBlockReveal.start()
}
button.addEventListener('click', restart)

const { TimelineMax, TweenMax } = window

class BlockReveal {
  /**
   *
   * @param {Object} element - container element with words in
   * @param {Object} options - expect this to contain words etc. colors durations
   */
  element = undefined
  wordsPerLine = undefined
  // Start at index 1 for nth-child purposes instead of zero based.
  index = 1
  elementCache = {
    words: [],
    reveals: undefined,
  }
  constructor(element) {
    // Store element on class instance
    this.element = element
    // Set the wordsPerLine
    this.wordsPerLine =
      this.element.querySelector('.block-reveal__line').children.length - 1
    const sameLineLength = [
      ...this.element.querySelectorAll('.block-reveal__line'),
    ].every(v => {
      return v.children.length === this.wordsPerLine + 1
    })
    if (!sameLineLength)
      throw new Error('BlockReveal: Lines need to be same amount of words')
    // Cache the elements in advance so we aren't making querySelector calls all the time
    this.cacheElements()
  }
  cacheElements = () => {
    // Make a check that all lines are equal in length
    // Cache the reveals
    this.elementCache.reveals = this.element.querySelectorAll(
      '.block-reveal__block'
    )
    for (let i = 0; i < this.wordsPerLine; i++) {
      this.elementCache.words.push(
        this.element.querySelectorAll(
          `.block-reveal__line .block-reveal__word:nth-of-type(${i + 1})`
        )
      )
    }
  }
  start = () => {
    // console.info('starting', this)
    const TL = new TimelineMax({
      paused: true,
      repeat: 3,
      repeatDelay: 1,
      delay: 2,
    })
    const onStart = () => {
      const currentWords = this.elementCache.words[this.index - 1]
      currentWords.forEach((word, index) => {
        const prev =
          word.previousElementSibling ||
          word.parentElement.children[this.wordsPerLine - 1]
        const reveal = this.elementCache.reveals[index]
        reveal.style.width = `${
          prev.style.opacity
            ? Math.max(word.offsetWidth, prev.offsetWidth)
            : word.offsetWidth
        }px`
      })
    }
    TL.add(
      TweenMax.staggerTo(
        this.elementCache.reveals,
        0.4,
        { onStart, transformOrigin: 'left', scaleX: 1 },
        0.2,
        () => {
          const previousWords = this.elementCache.words[
            this.index === 1 ? this.wordsPerLine - 1 : this.index - 2
          ]
          const reveals = this.elementCache.reveals
          for (const prev of previousWords) {
            prev.style.opacity = '0'
          }
          for (const reveal of reveals) {
            reveal.style.transformOrigin = 'right'
          }
        }
      ),
      0
    )
    TL.call(() => {
      const revealed = this.elementCache.words[this.index - 1]
      for (const word of revealed) {
        word.style.opacity = '1'
      }
    })
    TL.add(
      TweenMax.staggerTo(
        this.elementCache.reveals,
        0.4,
        { scaleX: 0 },
        0.2,
        () => {
          this.index = this.index + 1 > this.wordsPerLine ? 1 : this.index + 1
        }
      )
    )
    TL.play()
  }
}

const myBlockReveal = new BlockReveal(document.querySelector('.block-reveal'))
myBlockReveal.start()
