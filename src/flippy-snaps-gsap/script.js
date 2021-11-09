import gsap from 'https://cdn.skypack.dev/gsap'
import { GUI } from 'https://cdn.skypack.dev/dat.gui'
import React, {
  useEffect,
  useRef,
  useState,
} from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'

const ROOT_NODE = document.querySelector('#app')

const Parallax = ({ config, children }) => {
  const containerRef = React.useRef(null)
  React.useEffect(() => {
    // Function that updates a CSS coefficient for moving things.
    // Base the center point on the center of the container.
    // Then define a width each side. Default to window width/height.
    const UPDATE = ({ x, y }) => {
      // We are going to normalize -100 to 100 with a range and then use CSS coefficient for updates
      // Can base the range on the position of the container and a distance from it based on screen size.
      if (!containerRef.current) return
      // Get the dimensions of the parentNode as the parallax moves and changes dimensions.
      const containerBounds = containerRef.current.parentElement?.getBoundingClientRect()
      if (!containerBounds) return
      const centerX = containerBounds.left + containerBounds.width / 2
      const centerY = containerBounds.top + containerBounds.height / 2

      const startX = config.coefficientX
        ? centerX - config.coefficientX * window.innerWidth
        : 0
      const endX = config.coefficientX
        ? centerX + config.coefficientX * window.innerWidth
        : window.innerWidth
      const startY = config.coefficientY
        ? centerY - config.coefficientY * window.innerHeight
        : 0
      const endY = config.coefficientY
        ? centerY + config.coefficientY * window.innerHeight
        : window.innerHeight

      const POS_X = gsap.utils.mapRange(startX, endX, -100, 100)(x)
      const POS_Y = gsap.utils.mapRange(startY, endY, -100, 100)(y)

      containerRef.current.style.setProperty(
        '--range-x',
        `${gsap.utils.clamp(-100, 100, POS_X)}`
      )
      containerRef.current.style.setProperty(
        '--range-y',
        `${gsap.utils.clamp(-100, 100, POS_Y)}`
      )
    }
    window.addEventListener('pointermove', UPDATE)
    return () => {
      window.removeEventListener('pointermove', UPDATE)
    }
  }, [config.coefficientX, config.coefficientY])
  return (
    <div
      ref={containerRef}
      className="parallax relative w-full h-full"
      style={{
        '--r': config.rotate,
        '--rx': config.rotateX,
        '--ry': config.rotateY,
      }}>
      {children}
    </div>
  )
}

Parallax.defaultProps = {
  config: {
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    coefficientX: 0.5,
    coefficientY: 0.5,
  },
}

const ParallaxWrapper = ({ children }) => (
  <div className="parallax__wrapper w-full h-full">{children}</div>
)

const FlippySnap = ({ disabled, gridSize, onFlip, snaps }) => {
  const CELL_COUNT = gridSize * gridSize
  const count = useRef(0)
  const containerRef = useRef(null)
  const audioRef = useRef(
    new Audio('https://assets.codepen.io/605876/page-flip.mp3')
  )
  audioRef.current.volume = 0.5
  const flip = e => {
    if (disabled) return console.info('already flippin')
    const x = parseInt(e.target.parentNode.getAttribute('data-snap-x'), 10)
    const y = parseInt(e.target.parentNode.getAttribute('data-snap-y'), 10)
    count.current = count.current + 1
    gsap.to('.flippy-snap__card', {
      '--count': count.current,
      delay: gsap.utils.distribute({
        from: [x / gridSize, y / gridSize],
        amount: gridSize / 20,
        base: 0,
        grid: 'auto',
        ease: 'power1.inOut',
      }),
      onStart: () => {
        audioRef.current.play()
      },
      duration: 0.2,
      onComplete: () => {
        // At this point update the images
        if (onFlip) onFlip(count)
      },
    })
  }

  const hoverCard = e => {
    gsap.set('.flippy-snap__card-wrapper', {
      '--hovered': 0,
    })
    const centerX = parseInt(e.currentTarget.getAttribute('data-snap-x'), 10)
    const centerY = parseInt(e.currentTarget.getAttribute('data-snap-y'), 10)
    // Work out the surrounding cards to hover.
    e.currentTarget.style.setProperty('--hovered', 1)
    const SURROUNDING = [
      document.querySelector(
        `.flippy-snap__card-wrapper[data-snap-x="${centerX -
          1}"][data-snap-y="${centerY}"]`
      ),
      document.querySelector(
        `.flippy-snap__card-wrapper[data-snap-x="${centerX +
          1}"][data-snap-y="${centerY}"]`
      ),
      document.querySelector(
        `.flippy-snap__card-wrapper[data-snap-x="${centerX -
          1}"][data-snap-y="${centerY - 1}"]`
      ),
      document.querySelector(
        `.flippy-snap__card-wrapper[data-snap-x="${centerX}"][data-snap-y="${centerY -
          1}"]`
      ),
      document.querySelector(
        `.flippy-snap__card-wrapper[data-snap-x="${centerX +
          1}"][data-snap-y="${centerY - 1}"]`
      ),
      document.querySelector(
        `.flippy-snap__card-wrapper[data-snap-x="${centerX -
          1}"][data-snap-y="${centerY + 1}"]`
      ),
      document.querySelector(
        `.flippy-snap__card-wrapper[data-snap-x="${centerX}"][data-snap-y="${centerY +
          1}"]`
      ),
      document.querySelector(
        `.flippy-snap__card-wrapper[data-snap-x="${centerX +
          1}"][data-snap-y="${centerY + 1}"]`
      ),
    ].filter(el => el !== null)

    console.info(SURROUNDING)
    gsap.set(SURROUNDING, {
      '--hovered': 0.5,
    })
  }

  const dehover = () => {
    gsap.set('.flippy-snap__card-wrapper', {
      '--hovered': 0,
    })
  }

  return (
    <div
      className="flippy-snap"
      ref={containerRef}
      onMouseLeave={dehover}
      style={{
        '--grid-size': gridSize,
        '--count': count.current,
        '--current-image': `url('${snaps[0]}')`,
        '--next-image': `url('${snaps[1]}')`,
      }}
      onClick={flip}>
      {new Array(CELL_COUNT).fill().map((cell, index) => {
        const x = index % gridSize
        const y = Math.floor(index / gridSize)
        return (
          <div
            className="flippy-snap__card-wrapper"
            onMouseOver={hoverCard}
            data-snap-x={x}
            data-snap-y={y}>
            <div
              className="flippy-snap__card"
              data-snap-x={x}
              data-snap-y={y}
              style={{
                '--x': x,
                '--y': y,
                '--snap-x': x * -100,
                '--snap-y': y * -100,
              }}>
              <div className="flippy-snap__card--front"></div>
              <div className="flippy-snap__card--rear"></div>
            </div>
          </div>
        )
      })}
      {disabled ? <div className="flippy-snap__loader"></div> : null}
    </div>
  )
}

FlippySnap.defaultProps = {
  gridSize: 9,
}

const App = () => {
  const [snaps, setSnaps] = useState([])
  const [disabled, setDisabled] = useState(false)
  const [gridSize, setGridSize] = useState(9)
  const snapRef = useRef(null)
  const grabPic = async () => {
    const pic = await fetch('https://source.unsplash.com/random/1000x1000')
    return pic.url
  }

  useEffect(() => {
    const setup = async () => {
      const url = await grabPic()
      const nextUrl = await grabPic()
      setSnaps([url, nextUrl])
      setDisabled(false)
    }
    setup()
  }, [])

  useEffect(() => {
    // Set up DAT.GUI
    const CONFIG = {
      gridSize,
    }
    const CONTROLLER = new GUI()
    CONTROLLER.add(CONFIG, 'gridSize', 2, 15, 1)
      .onFinishChange(setGridSize)
      .name('Grid Size')
  }, [])

  const setNewImage = async count => {
    const newSnap = await grabPic()
    setSnaps(
      count.current % 2 !== 0 ? [newSnap, snaps[1]] : [snaps[0], newSnap]
    )
    setDisabled(false)
  }

  const onFlip = async count => {
    setDisabled(true)
    setNewImage(count)
  }

  if (snaps.length !== 2) return <h1 className="loader">Loading...</h1>
  return (
    <ParallaxWrapper>
      <Parallax
        config={{
          rotate: 0.01,
          rotateX: 0.1,
          rotateY: 0.25,
          coefficientX: 0.75,
          coefficientY: 0.75,
        }}>
        <FlippySnap
          gridSize={gridSize}
          disabled={disabled}
          snaps={snaps}
          onFlip={onFlip}
          snapRef={snapRef}
        />
      </Parallax>
    </ParallaxWrapper>
  )
}

render(<App />, ROOT_NODE)
