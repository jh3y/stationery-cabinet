// @ts-ignore
import React, { useState, useEffect, useRef } from 'https://cdn.skypack.dev/react'
// @ts-ignore
import { render } from 'https://cdn.skypack.dev/react-dom'

const ROOT_NODE = document.getElementById('app')
const PROXIMITY = 120

document.documentElement.style.setProperty('--proximity', PROXIMITY.toString())

type BadButtonProps = {
  type?: 'engage' | 'avoid'
  proximity?: number
  children?: React.Node
  debug?: boolean
  className?: string
}

const BadButton = ({children, className, debug, proximity, type, ...buttonProps}: BadButtonProps & React.HTMLProps<HTMLButtonElement>) => {
  const wrapperRef = useRef(null)
  useEffect(() => {
    const update = ({ x, y }) => {
      /**
       * Based on the type of button we set a value on CSS custom property
       * If we are engaging, we move towards cursor within proximity.
       * If we are avoiding, we move away from the cursor within proximity.
       */

      // Get the center of the button(wrapper that doesn't move)
      const BOUNDS = wrapperRef.current.getBoundingClientRect()

      // Calculate the center point and proximity from cursor
      const btnX = BOUNDS.x + BOUNDS.width / 2
      const btnY = BOUNDS.y + BOUNDS.height / 2
      const distance = Math.hypot(x - btnX, y - btnY)
      // If within proximity, set the value for transform
      if (distance <= proximity) {
        if (type === 'engage') {
          wrapperRef.current.style.setProperty('--x', -((btnX - x) / proximity))
          wrapperRef.current.style.setProperty('--y', -((btnY - y) / proximity))
        }
        if (type === 'avoid') {
          const translate = (proximity - distance) / proximity
          wrapperRef.current.style.setProperty('--x', btnX < x ? -translate : translate)
          wrapperRef.current.style.setProperty('--y', btnY < y ? -translate : translate)
        }
      } else {
        wrapperRef.current.style.setProperty('--x', 0)
        wrapperRef.current.style.setProperty('--y', 0)
      }
    }

    window.addEventListener('pointermove', update)
    return () => {
      window.removeEventListener('pointermove', update)
    }
  }, [])
  return (<span className="bad-button" data-debug={debug} ref={wrapperRef} style={{
    '--proximity': proximity
  }}>
      <button className={`bad-button__button ${className ?? ''}`} {...buttonProps}>{children}</button>
    </span>)
}

const defaults: BadButtonProps = {
  type: 'avoid',
  proximity: PROXIMITY,
}

BadButton.defaultProps = defaults

const App = () => (
  <React.Fragment>
    <BadButton type='avoid' className="button button--unsubscribe">Unsubscribe 👎</BadButton>
    <BadButton type='engage' className="button button--subscribe">Subscribe <span role="img" className="thumb">👍</span></BadButton>
  </React.Fragment>
)

render(<App />, ROOT_NODE)
