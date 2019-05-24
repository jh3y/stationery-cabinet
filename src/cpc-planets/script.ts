declare const TimelineMax:any;
declare const TweenMax:any;
interface ElementCache {
  words: NodeListOf<Element>[],
  reveals: NodeListOf<Element>
}
class BlockReveal {
  private duration: number = 0.5;
  private stagger: number = 0.25;
  private delay: number = 2;
  private elementCache: ElementCache = {
    words: [],
    reveals: this.el.querySelectorAll('span')
  };
  private index: number = 1; // Start at index 1 because we use this as the nth-of-type selector
  private wordsPerLine: number;
  constructor(readonly el: HTMLElement, readonly options = {}) {
    this.wordsPerLine = this.el.querySelectorAll('.block-reveal__line:nth-of-type(1) h1').length
    this.cacheElements()
    this.setWidth()
    // TODO: Make checks here so that all lines have same amount of words
    this.start()
  }
  cacheElements(): void {
    for (let i = 0; i < this.wordsPerLine; i++) {
      this.elementCache.words.push(this.el.querySelectorAll(`.block-reveal__line h1:nth-of-type(${i + 1})`))
    }
  }
  /**
   * This method purely exists to center align the block reveal
   * on the y-axis
   */
  setWidth(): void {
    let result = 0
    const words = this.el.querySelectorAll('h1')
    for (const word of words) if (word.offsetWidth > result) result = word.offsetWidth
    this.el.style.width = `${result}px`
  }

  start():void {
    const TL = new TimelineMax({
      paused: true,
      repeat: -1,
      repeatDelay: this.delay
    })
    const onStart = () => {
      const currentWords = this.elementCache.words[this.index - 1] as NodeListOf<HTMLElement>
      for (const word of currentWords) {
        const next = word.previousElementSibling as HTMLElement || word.parentElement.children[this.wordsPerLine - 1] as HTMLElement
        const reveal = word.parentElement.querySelector('span') as HTMLElement
        // Need to set the reveal to the size of the largest word.
        reveal.style.width = `${next ? Math.max(word.offsetWidth, next.offsetWidth).toString() : word.offsetWidth.toString()}px`
      }
    }
    TL.add(TweenMax.staggerTo(this.elementCache.reveals, this.duration, {onStart, transformOrigin: 'left', scaleX: 1}, this.stagger, () => {
      const previousWords = this.elementCache.words[this.index === 1 ? this.wordsPerLine - 1 : this.index - 2] as NodeListOf<HTMLElement>
      const reveals = this.elementCache.reveals as NodeListOf<HTMLElement>
      for (const prev of previousWords) {
        prev.style.opacity = '0'
      }
      for (const reveal of reveals) {
        reveal.style.transformOrigin = 'right'
      }
    }), 0)
    TL.call(() => {
      const revealed = this.elementCache.words[this.index - 1] as NodeListOf<HTMLElement>
      for (const word of revealed) {
        word.style.opacity = '1'
      }
    })
    TL.add(TweenMax.staggerTo(this.elementCache.reveals, this.duration, {scaleX: 0}, this.stagger, () => {
      this.index = this.index + 1 > this.wordsPerLine ? 1 : this.index + 1
    }))
    TL.play()
  }
}

const myReveal = new BlockReveal(document.querySelector('.block-reveal'))