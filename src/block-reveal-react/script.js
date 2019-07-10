const { React, ReactDOM, TimelineMax, TweenMax, PropTypes } = window
const { useEffect, useRef } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const CLASSES = {
  BLOCK: 'block-reveal__block',
  CONTAINER: 'block-reveal',
  LINE: 'block-reveal__line',
  SEGMENT: 'block-reveal__segment',
}

const BlockReveal = ({
  active,
  phrases,
  delay,
  repeat,
  repeatDelay,
  blockStagger,
  blockSlide,
}) => {
  const cache = useRef({
    blocks: undefined,
    segments: [],
    blockWidths: [],
  })
  const index = useRef(0)
  const ran = useRef(0)
  const containerRef = useRef(null)
  /**
   * Check that all lines have the same number of segments
   */
  useEffect(() => {
    if (!phrases.length) throw new Error('Block Reveal: No phrases defined!')
    const segmentsPerLine = phrases[0].length
    const sameSegmentLength = phrases.every(
      phrase => phrase.length === segmentsPerLine
    )
    if (!sameSegmentLength)
      throw new Error('Block Reveal: Inconsistent number of segments')
  }, [])
  /**
   * Use an Effect to cache all of our elements and index widths 👍
   */ useEffect(() => {
    if (containerRef.current) {
      const segmentsPerLine = phrases[0].length
      // Here we need to loop througn the different elements and create a cache
      cache.current.blocks = containerRef.current.querySelectorAll(
        `.${CLASSES.BLOCK}`
      )
      for (let i = 0; i < segmentsPerLine; i++) {
        cache.current.segments.push(
          containerRef.current.querySelectorAll(
            `.${CLASSES.LINE} .${CLASSES.SEGMENT}:nth-of-type(${i + 1})`
          )
        )
      }
      cache.current.segments.forEach(phrase => {
        const blockWidths = []
        // For each segment in the phrase, calculate the correct block width
        phrase.forEach(segment => {
          const current =
            segment.previousElementSibling ||
            segment.parentElement.children[segmentsPerLine - 1]
          const segmentWidth = Math.ceil(segment.getBoundingClientRect().width)
          const currentWidth = Math.ceil(current.getBoundingClientRect().width)
          blockWidths.push(Math.max(segmentWidth, currentWidth))
        })
        cache.current.blockWidths.push(blockWidths)
      })
      /**
       * Push one last set of widths which equate to when everything is blank
       * and we are revealing the first set of segments.
       */ cache.current.blockWidths.push(
        [...cache.current.segments[index.current]].map(segment =>
          Math.ceil(segment.getBoundingClientRect().width)
        )
      )
    }
  }, [containerRef.current])
  /**
   * Trigger this if the prop active is true and there is a ref
   */ useEffect(() => {
    if (containerRef.current && active) {
      const segmentsPerLine = phrases[0].length
      const TL = new TimelineMax({
        delay,
        repeat,
        repeatDelay,
      })
      const onStart = () => {
        const nextsegments = cache.current.segments[index.current]
        nextsegments.forEach((segment, segmentIndex) => {
          const block = cache.current.blocks[segmentIndex]
          block.style.width = `${cache.current.blockWidths[ran.current ? index.current : segmentsPerLine][segmentIndex]}px`
        })
      }
      const onCompleteIn = () => {
        const previoussegments =
          cache.current.segments[
            index.current === 0 ? segmentsPerLine - 1 : index.current - 1
          ]
        const newsegments = cache.current.segments[index.current]
        for (const segment of previoussegments) {
          segment.style.opacity = '0'
        }
        for (const block of cache.current.blocks) {
          block.style.transformOrigin = 'right'
        }
        for (const segment of newsegments) {
          segment.style.opacity = '1'
        }
      }
      const onCompleteOut = () => {
        index.current =
          index.current + 1 > segmentsPerLine - 1 ? 0 : index.current + 1
        ran.current += 1
      }
      TL.add(
        TweenMax.staggerTo(
          cache.current.blocks,
          blockSlide,
          { onStart, transformOrigin: 'left', scaleX: 1 },
          blockStagger,
          onCompleteIn
        )
      )
      TL.add(
        TweenMax.staggerTo(
          cache.current.blocks,
          blockSlide,
          { scaleX: 0 },
          blockStagger,
          onCompleteOut
        )
      )
    }
  }, [active])
  return (
    <div className="block-reveal" ref={containerRef}>
      {new Array(phrases[0].length).fill().map((p, i) => {
        return (
          <div key={`line--${i}`} className="block-reveal__line">
            {phrases.map(phrase => (
              <div className="block-reveal__segment" key={`${phrase}--${i}`}>
                {phrase[i]}
              </div>
            ))}
            <div className="block-reveal__block" />
          </div>
        )
      })}
    </div>
  )
}
BlockReveal.defaultProps = {
  active: true,
  delay: 1,
  repeat: -1,
  repeatDelay: 1,
  blockStagger: 0.1,
  blockSlide: 0.4,
}
BlockReveal.propTypes = {
  active: PropTypes.bool,
  phrases: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  delay: PropTypes.number,
  repeat: PropTypes.number,
  repeatDelay: PropTypes.number,
  blockStagger: PropTypes.number,
  blockSlide: PropTypes.number,
}
/**
 * DEMO APP BEGINS HERE
 */
const phrases = [
  ['I am', 'a', 'Block Reveal'],
  ['I am', 'made with', 'React & GreenSock 💪'],
  ['And', 'I', 'keep looping on and on...'],
]
const App = () => {
  return (
    <BlockReveal
      active={true}
      phrases={phrases}
      delay={1}
      repeat={-1}
      repeatDelay={1}
      blockStagger={0.15}
      blockSlide={0.5}
    />
  )
}
render(<App />, rootNode)
