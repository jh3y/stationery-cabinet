const { TimelineMax, TweenMax } = window

const CLASSES = {
  BLOCK: 'block-reveal__block',
  LINE: 'block-reveal__line',
  WORD: 'block-reveal__word',
}
class BlockReveal {
  blockWidths = []
  element = undefined
  elementCache = {
    blocks: undefined,
    words: [],
  }
  index = 0
  ran = 0
  options = {
    delay: 2,
    repeat: 2,
    repeatDelay: 1,
    blockStagger: 0.2,
    blockSlide: 0.4,
  }
  wordsPerLine = undefined
  constructor(element, options) {
    // Store element on class
    this.element = element
    // Store options on class
    this.options = { ...this.options, ...options }
    // Set the wordsPerLine
    this.wordsPerLine = this.element
      .querySelector(`.${CLASSES.LINE}`)
      .querySelectorAll(`.${CLASSES.WORD}`).length
    const sameLineLength = [
      ...this.element.querySelectorAll(`.${CLASSES.LINE}`),
    ].every(
      v => v.querySelectorAll(`.${CLASSES.WORD}`).length === this.wordsPerLine
    )
    if (!sameLineLength)
      throw new Error('BlockReveal: Lines need to be same amount of words')
    // Cache the elements in advance so we aren't making querySelector calls all the time
    this.cacheElements()
    // Cache the block widths for each index
    this.cacheBlockWidths()
  }
  cacheElements = () => {
    // Cache the blocks
    this.elementCache.blocks = this.element.querySelectorAll(
      `.${CLASSES.BLOCK}`
    )
    // Cache the words in blocks of phrases
    for (let i = 0; i < this.wordsPerLine; i++) {
      this.elementCache.words.push(
        this.element.querySelectorAll(
          `.${CLASSES.LINE} .${CLASSES.WORD}:nth-of-type(${i + 1})`
        )
      )
    }
  }
  cacheBlockWidths = () => {
    // Iterate through the elementCache words
    this.elementCache.words.forEach(phrase => {
      const blockWidths = []
      // For each word in the phrase, calculate the correct block width
      phrase.forEach(word => {
        const current =
          word.previousElementSibling ||
          word.parentElement.children[this.wordsPerLine - 1]
        const wordWidth = Math.ceil(word.getBoundingClientRect().width)
        const currentWidth = Math.ceil(current.getBoundingClientRect().width)
        blockWidths.push(Math.max(wordWidth, currentWidth))
      })
      this.blockWidths.push(blockWidths)
    })
    /**
     * Push one last set of widths which equate to when everything is blank
     * and we are revealing the first set of words.
     */
    this.blockWidths.push(
      [...this.elementCache.words[this.index]].map(word =>
        Math.ceil(word.getBoundingClientRect().width)
      )
    )
  }
  start = () => {
    const {
      options: { delay, repeat, repeatDelay },
    } = this

    const TL = new TimelineMax({
      delay,
      repeat,
      repeatDelay,
    })
    const onStart = () => {
      const nextWords = this.elementCache.words[this.index]
      nextWords.forEach((word, index) => {
        const block = this.elementCache.blocks[index]
        block.style.width = `${
          this.blockWidths[this.ran ? this.index : this.wordsPerLine][index]
        }px`
      })
    }
    const onCompleteIn = () => {
      const {
        elementCache: { blocks, words },
        index,
        wordsPerLine,
      } = this
      const previousWords = words[index === 0 ? wordsPerLine - 1 : index - 1]
      const newWords = words[index]
      for (const word of previousWords) {
        word.style.opacity = '0'
      }
      for (const block of blocks) {
        block.style.transformOrigin = 'right'
      }
      for (const word of newWords) {
        word.style.opacity = '1'
      }
    }
    const onCompleteOut = () => {
      this.index = this.index + 1 > this.wordsPerLine - 1 ? 0 : this.index + 1
      this.ran += 1
    }
    TL.add(
      TweenMax.staggerTo(
        this.elementCache.blocks,
        this.options.blockSlide,
        { onStart, transformOrigin: 'left', scaleX: 1 },
        this.options.blockStagger,
        onCompleteIn
      )
    )
    TL.add(
      TweenMax.staggerTo(
        this.elementCache.blocks,
        this.options.blockSlide,
        { scaleX: 0 },
        this.options.blockStagger,
        onCompleteOut
      )
    )
  }
}

const block = document.querySelector('.block-reveal')
const myBlockReveal = new BlockReveal(block, {
  delay: 1,
  repeat: -1,
  repeatDelay: 1,
  blockStagger: 0.15,
  blockSlide: 0.5,
})
myBlockReveal.start()
