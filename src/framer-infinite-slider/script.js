import confetti from 'https://cdn.skypack.dev/canvas-confetti'
import React, {
  useRef,
  useState,
  useEffect,
} from 'https://cdn.skypack.dev/react'
import styled from 'https://cdn.skypack.dev/styled-components'
import {
  animate,
  motion,
  useMotionValue,
} from 'https://cdn.skypack.dev/framer-motion'
import { render } from 'https://cdn.skypack.dev/react-dom'

const ROOT_NODE = document.querySelector('#app')

/**
 * Framer related utilities
 */
const SWIPE_CONFIDENCE = 10000
const SWIPE_POWER = (offset, velocity) => Math.abs(offset) * velocity
// End Framer related utils
const SliderPanel = styled.li`
  height: 100%;
  flex: 0 0 100%;
  position: relative;
  width: 100%;
`

const BufferPanel = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 200%;
  display: flex;
  flex-wrap: nowrap;

  & > li {
    flex: 1;
  }
`

const FrontBuffer = styled(BufferPanel)`
  right: 100%;
`

const EndBuffer = styled(BufferPanel)`
  left: ${p => p.offset}00%;
`

const SliderContainer = styled(motion.div)`
  --ar: 9 / 16; // === 16:9
  --width: 80vmin;
  --height: calc(var(--width) * var(--ar));
  height: var(--height);
  width: var(--width);
  position: relative;
`

const StyledSlider = styled(motion.div)`
  height: 100%;
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 100%;
`

const SliderTrack = styled.ul`
  height: 100%;
  position: relative;
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
`

const PageIndex = styled.span`
  font-size: 4rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  color: hsl(0, 0%, 10%);
  height: 5rem;
  width: 5rem;
  line-height: 5rem;
  text-align: center;
  background: hsl(0, 0%, 100%);
`

const Content = styled.section`
  height: 100%;
  width: 100%;
`

const Backdrop = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  background-color: hsl(0, 0%, 40%);
`

const SliderDots = styled.ul`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 0);
  padding: 0;
  list-style-type: none;
  display: flex;
`

const SliderDotWrap = styled.li`
  height: 44px;
  width: 44px;
`

const SliderDot = styled.li`
  height: 100%;
  width: 100%;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  &:after {
    border-radius: 50%;
    content: '';
    background-color: hsl(0, 0%, 100%);
    position: absolute;
    opacity: ${p => (p.active ? 1 : 0.25)};
    top: 50%;
    left: 50%;
    height: 25%;
    width 25%;
    transform: translate(-50%, -50%);
  }
`

const Slider = ({ children }) => {
  const [index, setIndex] = useState(0)
  const [flash, setFlash] = useState(false)
  const containerRef = useRef(null)
  const offsetRef = useRef(null)
  const x = useMotionValue(0)
  useEffect(() => {
    if (flash !== false) {
      confetti()
      animate(x, offsetRef.current * -containerRef.current.offsetWidth, {
        duration: 0,
        type: 'tween',
        onComplete: () => {
          setIndex(offsetRef.current)
          offsetRef.current = null
          setFlash(false)
        },
      })
    }
  }, [flash, x])
  useEffect(() => {
    if (containerRef && containerRef.current && !flash) {
      animate(x, index * -containerRef.current.offsetWidth, {
        onComplete: () => {
          if (index === -1) {
            offsetRef.current = children.length - 1
            setFlash(true)
          } else if (index === children.length) {
            offsetRef.current = 0
            setFlash(true)
          }
        },
      })
    }
  }, [index, x, children.length, flash])
  return (
    <SliderContainer ref={containerRef}>
      <StyledSlider
        drag="x"
        layout={!flash}
        dragElastic={1}
        // transition={{
        //   x: TRANSITION_STYLE,
        // }}
        animate="x"
        onDragEnd={(_, { offset, velocity }) => {
          const SWIPE = SWIPE_POWER(offset.x, velocity.x)
          if (SWIPE < -SWIPE_CONFIDENCE) {
            setIndex(Math.min(children.length, index + 1))
          } else if (SWIPE > SWIPE_CONFIDENCE) {
            setIndex(Math.max(-1, index - 1))
          }
        }}
        style={{ x }}
        dragConstraints={{
          left: 0,
          right: 0,
        }}>
        <SliderTrack>
          <FrontBuffer aria-hidden="true">
            {children && children.length && children[children.length - 2]}
            {children && children.length && children[children.length - 1]}
          </FrontBuffer>
          {children && children.length && children}
          <EndBuffer aria-hidden="true" offset={children.length}>
            {children && children.length && children[0]}
            {children && children.length && children[1]}
          </EndBuffer>
        </SliderTrack>
      </StyledSlider>
      <SliderDots>
        {children &&
          children.length &&
          children.map((_, dotIndex) => (
            <SliderDotWrap key={dotIndex}>
              <SliderDot
                active={dotIndex === index}
                key={dotIndex}
                onClick={() => setIndex(dotIndex)}
              />
            </SliderDotWrap>
          ))}
      </SliderDots>
    </SliderContainer>
  )
}
Slider.propTypes = {
  children: React.Node,
}

const App = () => {
  return (
    <Slider>
      <SliderPanel>
        <Content>
          <Backdrop
            onDragStart={e => e.preventDefault()}
            src="http://source.unsplash.com/1600x900/?bear"
          />
          <PageIndex>1</PageIndex>
        </Content>
      </SliderPanel>
      <SliderPanel>
        <Content>
          <Backdrop
            onDragStart={e => e.preventDefault()}
            src="http://source.unsplash.com/1600x900/?dog"
          />
          <PageIndex>2</PageIndex>
        </Content>
      </SliderPanel>
      <SliderPanel>
        <Content>
          <Backdrop
            onDragStart={e => e.preventDefault()}
            src="http://source.unsplash.com/1600x900/?cat"
          />
          <PageIndex>3</PageIndex>
        </Content>
      </SliderPanel>
      <SliderPanel>
        <Content>
          <Backdrop
            onDragStart={e => e.preventDefault()}
            src="http://source.unsplash.com/1600x900/?cake"
          />
          <PageIndex>4</PageIndex>
        </Content>
      </SliderPanel>
      <SliderPanel>
        <Content>
          <Backdrop
            onDragStart={e => e.preventDefault()}
            src="http://source.unsplash.com/1600x900/?balloon"
          />
          <PageIndex>5</PageIndex>
        </Content>
      </SliderPanel>
    </Slider>
  )
}

render(<App />, ROOT_NODE)
