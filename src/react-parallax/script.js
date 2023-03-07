import React from 'https://cdn.skypack.dev/react'
import T from 'https://cdn.skypack.dev/prop-types'
import gsap from 'https://cdn.skypack.dev/gsap'
import { render } from 'https://cdn.skypack.dev/react-dom'

/**
 * All movements and rotations are based on a decimal scale.
 * 0 - 1 for movement will be 0% - 100% translation
 * 0 - 1 for rotation will be 0deg to 360deg rotation
 *
 * Position is based on relative position to the container in percentage.
 * Z Positioning is a number and the coefficient is defined in the styles.
 */
const DEFAULT_CONFIG = {
  // Starting positions for X and Y
  positionX: 50,
  positionY: 50,
  positionZ: 0,
  // Range of movement in decimal where 1 === 100. Use negative for opposite directions.
  // Range of movement in decimal where 1 === 100. Use negative for opposite directions.
  rotate: 0,
  rotateX: 0,
  rotateY: 0,
  moveX: 0,
  moveY: 0,
}

// Range mapping utility
const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return value =>
    outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}

const ParallaxContainer = ({ config, children }) => {
  const containerRef = React.useRef(null)
  React.useEffect(() => {
    // Function that updates a CSS coefficient for moving things.
    // Base the center point on the center of the container.
    // Then define a width each side. Default to window width/height.
    const UPDATE = ({ x, y }) => {
      // We are going to normalize -100 to 100 with a range and then use CSS coefficient for updates
      // Can base the range on the position of the container and a distance from it based on screen size.

      // Get the dimensions of the parentNode as the parallax moves and changes dimensions.
      const containerBounds = containerRef.current.parentNode.getBoundingClientRect()
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
        gsap.utils.clamp(-100, 100, POS_X)
      )
      containerRef.current.style.setProperty(
        '--range-y',
        gsap.utils.clamp(-100, 100, POS_Y)
      )
    }
    window.addEventListener('pointermove', UPDATE)
    return () => {
      window.removeEventListener('pointermove', UPDATE)
    }
  }, [])
  return (
    <div
      ref={containerRef}
      className="parallax relative h-full w-full"
      style={{
        '--r': config.rotate,
        '--rx': config.rotateX,
        '--ry': config.rotateY,
      }}>
      {children}
    </div>
  )
}

ParallaxContainer.defaultProps = {
  config: {
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    coefficientX: 0.5,
    coefficientY: 0.5,
  },
}
ParallaxContainer.propTypes = {
  children: T.node,
  config: T.shape({
    rotate: T.number,
    rotateX: T.number,
    rotateY: T.number,
  }),
}

const ParallaxItem = ({ children, config }) => {
  const params = { ...DEFAULT_CONFIG, ...config }
  return (
    <div
      className="absolute parallax-item"
      style={{
        '--x': params.positionX,
        '--y': params.positionY,
        '--z': params.positionZ,
        '--r': params.rotate,
        '--rx': params.rotateX,
        '--ry': params.rotateY,
        '--mx': params.moveX,
        '--my': params.moveY,
        '--height': params.height,
        '--width': params.width,
      }}>
      {children}
    </div>
  )
}

ParallaxItem.propTypes = {
  children: T.node,
  config: T.shape({
    positionX: T.number,
    positionY: T.number,
    positionZ: T.number,
    rotate: T.number,
    rotateX: T.number,
    rotateY: T.number,
    moveX: T.number,
    moveY: T.number,
  }),
}
ParallaxItem.defaultProps = {
  config: DEFAULT_CONFIG,
}

const Parallax = () => (
  <ParallaxContainer
    config={{
      rotate: 0.01,
      rotateX: -0.02,
      rotateY: 0.05,
      coefficientX: 0.75,
      coefficientY: 0.75,
    }}>
    { /* For reference when mapping <img style={{ opacity: 0.5 }} src="/kody-flying_blue.png" /> */}
    <ParallaxItem
      config={{
        positionX: 50,
        positionY: 56,
        moveX: 0.15,
        moveY: -0.25,
        height: 68,
        width: 66,
      }}>
      <img src="https://assets.codepen.io/605876/kody.png" />
    </ParallaxItem>
    <ParallaxItem
      config={{
        positionX: 74,
        positionY: 15,
        moveX: 1.5,
        moveY: -0.85,
        height: 17,
        width: 17,
      }}>
      <img src="https://assets.codepen.io/605876/battery.png" />
    </ParallaxItem>
    <ParallaxItem
      config={{
        positionX: 35,
        positionY: 95,
        moveX: 1.5,
        moveY: -0.85,
        height: 7,
        width: 5,
      }}>
      <img src="https://assets.codepen.io/605876/leaf-eight.png" />
    </ParallaxItem>
    <ParallaxItem
      config={{
        positionX: 96,
        positionY: 64,
        moveX: 1.5,
        moveY: -0.85,
        height: 4,
        width: 8,
      }}>
      <img src="https://assets.codepen.io/605876/leaf-eleven.png" />
    </ParallaxItem>
    <ParallaxItem
      config={{
        positionX: 84,
        positionY: 21,
        moveX: 1.5,
        moveY: -0.85,
        height: 7,
        width: 6,
      }}>
      <img src="https://assets.codepen.io/605876/leaf-five.png" />
    </ParallaxItem>
    <ParallaxItem
      config={{
        positionX: 57,
        positionY: 18,
        moveX: 1.5,
        moveY: -0.85,
        height: 7,
        width: 3,
      }}>
      <img src="https://assets.codepen.io/605876/leaf-four.png" />
    </ParallaxItem>
    <ParallaxItem
      config={{
        positionX: 55,
        positionY: 95,
        moveX: 1.5,
        moveY: -0.85,
        height: 10,
        width: 6,
      }}>
      <img src="https://assets.codepen.io/605876/leaf-nine.png" />
    </ParallaxItem>
    <ParallaxItem
      config={{
        positionX: 9,
        positionY: 21,
        moveX: 1.5,
        moveY: -0.85,
        height: 8,
        width: 8,
      }}>
      <img src="https://assets.codepen.io/605876/leaf-one.png" />
    </ParallaxItem>
    <ParallaxItem
      config={{
        positionX: 4,
        positionY: 84,
        moveX: 1.5,
        moveY: -0.85,
        height: 8,
        width: 8,
      }}>
      <img src="https://assets.codepen.io/605876/leaf-seven.png" />
    </ParallaxItem>
    <ParallaxItem
      config={{
        positionX: 9,
        positionY: 74,
        moveX: 1.5,
        moveY: -0.85,
        height: 5,
        width: 8,
      }}>
      <img src="https://assets.codepen.io/605876/leaf-six.png" />
    </ParallaxItem>
    <ParallaxItem
      config={{
        positionX: 83,
        positionY: 64,
        moveX: 1.5,
        moveY: -0.85,
        height: 9,
        width: 9,
      }}>
      <img src="https://assets.codepen.io/605876/leaf-ten.png" />
    </ParallaxItem>
    <ParallaxItem
      config={{
        positionX: 56,
        positionY: 4,
        moveX: 1.5,
        moveY: -0.85,
        height: 8,
        width: 8,
      }}>
      <img src="https://assets.codepen.io/605876/leaf-three.png" />
    </ParallaxItem>
    <ParallaxItem
      config={{
        positionX: 28,
        positionY: 32,
        moveX: 1.5,
        moveY: -0.85,
        height: 4,
        width: 8,
      }}>
      <img src="https://assets.codepen.io/605876/leaf-two.png" />
    </ParallaxItem>
    <ParallaxItem
      config={{
        positionX: 80,
        positionY: 83,
        moveX: 1.5,
        moveY: -0.85,
        height: 26,
        width: 36,
      }}>
      <img src="https://assets.codepen.io/605876/one-wheel.png" />
    </ParallaxItem>
    <ParallaxItem
      config={{
        positionX: 10,
        positionY: 51,
        moveX: 1.5,
        moveY: -0.85,
        height: 24,
        width: 20,
      }}>
      <img src="https://assets.codepen.io/605876/speaker.png" />
    </ParallaxItem>
    <ParallaxItem
      config={{
        positionX: 83,
        positionY: 39,
        moveX: 1.5,
        moveY: -0.85,
        height: 36,
        width: 36,
      }}>
      <img src="https://assets.codepen.io/605876/snowboards.png" />
    </ParallaxItem>
    <ParallaxItem
      config={{
        positionX: 27,
        positionY: 12,
        moveX: 1.5,
        moveY: -0.85,
        height: 15,
        width: 15,
      }}>
      <img src="https://assets.codepen.io/605876/refresh.png" />
    </ParallaxItem>

  </ParallaxContainer>
)

const App = () => (
  <div className="parallax-container">
    <Parallax />
  </div>
)

render(<App />, document.getElementById('app'))
