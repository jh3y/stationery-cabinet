import React, { useState, useEffect } from 'https://cdn.skypack.dev/react'
import gsap from 'https://cdn.skypack.dev/gsap'
import { render } from 'https://cdn.skypack.dev/react-dom'
import { GUI } from 'https://cdn.skypack.dev/dat.gui'
import Color from 'https://cdn.skypack.dev/color'

const ROOT_NODE = document.querySelector('#app')

const useParallax = (callback, elementRef, proximityArg = 100) => {
  React.useEffect(() => {
    if (!elementRef.current || !callback) return
    const UPDATE = ({ x, y }) => {
      const bounds = 100
      const proximity =
        typeof proximityArg === 'function' ? proximityArg() : proximityArg
      const elementBounds = elementRef.current.getBoundingClientRect()
      const centerX = elementBounds.left + elementBounds.width / 2
      const centerY = elementBounds.top + elementBounds.height / 2
      const boundX = gsap.utils.mapRange(
        centerX - proximity,
        centerX + proximity,
        -bounds,
        bounds,
        x
      )
      const boundY = gsap.utils.mapRange(
        centerY - proximity,
        centerY + proximity,
        -bounds,
        bounds,
        y
      )
      callback(boundX / 100, boundY / 100)
    }
    window.addEventListener('pointermove', UPDATE)
    return () => {
      window.removeEventListener('pointermove', UPDATE)
    }
  }, [elementRef, callback])
}

const App = () => {
  useParallax(
    x => {
      document.documentElement.style.setProperty(
        '--ratio-x',
        gsap.utils.clamp(-1, 1, x)
      )
    },
    { current: document.body },
    () => window.innerWidth * 0.5
  )
  const [word, setWord] = useState('Hey!')
  const [renderStamp, setRenderStamp] = useState(new Date().toUTCString())

  useEffect(() => {
    const CONFIG = {
      word,
      bg: '#ffffff',
    }
    const CONTROLLER = new GUI()
    CONTROLLER.add(CONFIG, 'word')
      .onFinishChange(setWord)
      .name('Text')
    CONTROLLER.addColor(CONFIG, 'bg')
      .onFinishChange(color => {
        const NEW_COLOR = new Color(color)
        console.info(NEW_COLOR, NEW_COLOR.isDark())
        document.documentElement.style.setProperty('--bg', NEW_COLOR.hsl())
        document.documentElement.style.setProperty(
          '--tx',
          `hsl(0, 0%, ${NEW_COLOR.isDark() ? '100%' : '0%'})`
        )
      })
      .name('Background')
  }, [])

  useEffect(() => {
    setRenderStamp(new Date().toUTCString())
  }, [word])

  return (
    <>
      <h1
        key={renderStamp}
        style={{
          '--letters': word.length,
        }}>
        {word.split('').map((letter, index) => (
          <span
            key={index}
            style={{
              '--index': index,
              '--letter': `"${letter}"`,
            }}>
            {letter}
            <span aria-hidden="true">{letter}</span>
            <span aria-hidden="true">{letter}</span>
          </span>
        ))}
      </h1>
      <button
        className="replay"
        onClick={() => setRenderStamp(new Date().toUTCString())}>
        replay
      </button>
    </>
  )
}

render(<App />, ROOT_NODE)
