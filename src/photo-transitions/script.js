const { ReactDOM, React, TimelineMax, TweenMax, PropTypes } = window
const { useRef, useReducer } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

/**
 * Grabbed with
 * https://source.unsplash.com/featured/800x450?bear
 */
const PHOTOS = [
  {
    src:
      'https://images.unsplash.com/photo-1560481442-09099ef36b4c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=800',
    alt: 'Panda sleeping on a log',
  },
  {
    src:
      'https://images.unsplash.com/photo-1559019038-dbd8b96c7e13?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9',
    alt: 'Panda sitting on a woodern platform',
  },
  {
    src:
      'https://images.unsplash.com/photo-1538099130811-745e64318258?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=800',
    alt: 'Red Panda licking its lips',
  },
  {
    src:
      'https://images.unsplash.com/photo-1457140072488-87e5ffde2d77?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=800',
    alt: 'Bear looking distant',
  },
  {
    src:
      'https://images.unsplash.com/photo-1540125895252-edefe1c0132e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=800',
    alt: 'Panda cubs playing',
  },
  {
    src:
      'https://images.unsplash.com/photo-1525869916826-972885c91c1e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=80&w=800',
    alt: 'Bear cub exploring',
  },
]

const PhotoTransitionerReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT_PHOTO':
      return {
        ...state,
        photoIndex: state.photoIndex + 1,
      }
    case 'UPDATE_CURSOR':
      return {
        ...state,
        cursor: {
          x: action.x,
          y: action.y,
          opacity: action.opacity,
        },
      }
  }
}
const INITIAL_STATE = {
  photoIndex: 0,
  cursor: {
    x: 0,
    y: 0,
    opacity: 0,
  },
}
const PhotoTransitioner = ({ photos }) => {
  const containerRef = useRef(null)
  const photosContainerRef = useRef(null)
  const opacityTimerRef = useRef(null)
  const playingRef = useRef(null)
  const [state, dispatch] = useReducer(PhotoTransitionerReducer, INITIAL_STATE)

  const hideCursor = () => {
    containerRef.current.style.setProperty('--opacity', 0)
  }
  const initiateCursorTimeout = () => {
    if (opacityTimerRef.current) clearTimeout(opacityTimerRef.current)
    opacityTimerRef.current = setTimeout(hideCursor, 500)
  }

  const updateCursor = e => {
    const { clientX, clientY } = e
    const {
      height,
      width,
      top,
      left,
    } = containerRef.current.getBoundingClientRect()
    const x = ((clientX - left) / width) * 100
    const y = ((clientY - top) / height) * 100
    containerRef.current.style.setProperty('--opacity', 1)
    containerRef.current.style.setProperty('--cursorX', x)
    containerRef.current.style.setProperty('--cursorY', y)
    initiateCursorTimeout()
  }

  const showNext = () => {
    if (playingRef.current) return
    const photos = photosContainerRef.current.children
    const onComplete = () => {
      playingRef.current = false
      dispatch({ type: 'INCREMENT_PHOTO' })
    }
    const onStart = () => {
      playingRef.current = true
      containerRef.current.style.setProperty('--opacity', 1)
      initiateCursorTimeout()
    }
    new TimelineMax({ onStart, onComplete })
      .set(photos[(state.photoIndex + 1) % photos.length], {
        zIndex: state.photoIndex + 1,
      })
      .add(
        TweenMax.to(photos[(state.photoIndex + 1) % photos.length], 0.75, {
          '--radius': 150,
        })
      )
      .set(photos[state.photoIndex % photos.length], { '--radius': 0 })
  }

  return (
    <div
      ref={containerRef}
      onTouchMove={updateCursor}
      onMouseMove={updateCursor}
      onMouseOut={hideCursor}
      className="photo-transitioner"
      style={{
        '--cursorX': state.cursor.x,
        '--cursorY': state.cursor.y,
      }}>
      <div ref={photosContainerRef} className="photo-transitioner__photos">
        {photos.map((photo, index) => (
          <img
            className={`photo-transitioner__photo ${index ===
              state.photoIndex && 'photo-transitioner__photo--active'}`}
            src={photo.src}
            alt={photo.alt}
            key={`photo-transitioner-photo--${index}`}
          />
        ))}
      </div>
      <button onClick={showNext} className="photo-transitioner__cursor" />
    </div>
  )
}
PhotoTransitioner.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string,
    })
  ).isRequired,
}

const App = () => {
  return (
    <div className="app-container">
      <PhotoTransitioner photos={PHOTOS} />
      <h1>Click a Photo</h1>
    </div>
  )
}

render(<App />, rootNode)
