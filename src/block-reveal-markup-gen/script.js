const { TimelineMax, TweenMax } = window

const CLASSES = {
  BLOCK: 'block-reveal__block',
  CONTAINER: 'block-reveal',
  LINE: 'block-reveal__line',
  SEGMENT: 'block-reveal__segment',
}
class BlockReveal {
  blockWidths = []
  element = undefined
  elementCache = {
    blocks: undefined,
    segments: [],
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
  segmentsPerLine = undefined
  constructor(phrases, element, options) {
    // Store element on class
    this.element = element
    // Store options on class
    this.options = { ...this.options, ...options }
    // Set the segmentsPerLine
    this.segmentsPerLine = phrases[0].length
    const sameLineLength = phrases.every(
      phrase => phrase.length === this.segmentsPerLine
    )
    if (!sameLineLength)
      throw new Error('BlockReveal: Lines need to be same amount of blocks')
    // Build the elements out
    this.buildElements(phrases)
    // Cache the elements in advance so we aren't making querySelector calls all the time
    this.cacheElements()
    // Cache the block widths for each index
    this.cacheBlockWidths()
  }
  buildElements = phrases => {
    this.element.classList.add(CLASSES.CONTAINER)
    for (let i = 0; i < this.segmentsPerLine; i++) {
      const line = document.createElement('div')
      line.classList.add(CLASSES.LINE)
      phrases.forEach(phrase => {
        const segmentEl = document.createElement('div')
        segmentEl.classList.add(CLASSES.SEGMENT)
        segmentEl.innerText = phrase[i]
        line.appendChild(segmentEl)
      })
      const block = document.createElement('div')
      block.classList.add(CLASSES.BLOCK)
      line.appendChild(block)
      this.element.appendChild(line)
    }
  }
  cacheElements = () => {
    // Cache the blocks
    this.elementCache.blocks = this.element.querySelectorAll(
      `.${CLASSES.BLOCK}`
    )
    // Cache the segments in blocks of phrases
    for (let i = 0; i < this.segmentsPerLine; i++) {
      this.elementCache.segments.push(
        this.element.querySelectorAll(
          `.${CLASSES.LINE} .${CLASSES.SEGMENT}:nth-of-type(${i + 1})`
        )
      )
    }
  }
  cacheBlockWidths = () => {
    // Iterate through the elementCache segments
    this.elementCache.segments.forEach(phrase => {
      const blockWidths = []
      // For each segment in the phrase, calculate the correct block width
      phrase.forEach(segment => {
        const current =
          segment.previousElementSibling ||
          segment.parentElement.children[this.segmentsPerLine - 1]
        const segmentWidth = Math.ceil(segment.getBoundingClientRect().width)
        const currentWidth = Math.ceil(current.getBoundingClientRect().width)
        blockWidths.push(Math.max(segmentWidth, currentWidth))
      })
      this.blockWidths.push(blockWidths)
    })
    /**
     * Push one last set of widths which equate to when everything is blank
     * and we are revealing the first set of segments.
     */
    this.blockWidths.push(
      [...this.elementCache.segments[this.index]].map(segment =>
        Math.ceil(segment.getBoundingClientRect().width)
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
      const nextsegments = this.elementCache.segments[this.index]
      nextsegments.forEach((segment, index) => {
        const block = this.elementCache.blocks[index]
        block.style.width = `${
          this.blockWidths[this.ran ? this.index : this.segmentsPerLine][index]
        }px`
      })
    }
    const onCompleteIn = () => {
      const {
        elementCache: { blocks, segments },
        index,
        segmentsPerLine,
      } = this
      const previoussegments =
        segments[index === 0 ? segmentsPerLine - 1 : index - 1]
      const newsegments = segments[index]
      for (const segment of previoussegments) {
        segment.style.opacity = '0'
      }
      for (const block of blocks) {
        block.style.transformOrigin = 'right'
      }
      for (const segment of newsegments) {
        segment.style.opacity = '1'
      }
    }
    const onCompleteOut = () => {
      this.index =
        this.index + 1 > this.segmentsPerLine - 1 ? 0 : this.index + 1
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

const container = document.querySelector('div')

const phrases = [
  ['I am', 'a', 'Block Reveal'],
  ['Times', 'go', 'by'],
  ['And', 'I', 'keep looping'],
]

const myBlockReveal = new BlockReveal(phrases, container, {
  delay: 1,
  repeat: -1,
  repeatDelay: 1,
  blockStagger: 0.15,
  blockSlide: 0.5,
})
myBlockReveal.start()
