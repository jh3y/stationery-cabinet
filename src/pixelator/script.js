const {
  React: { useState, useRef, useEffect },
  ReactDOM: { render },
  styled,
  PropTypes: T,
  dat: { GUI },
  confirm,
} = window

const CONFIG = {
  height: 10,
  width: 10,
  size: 10,
  color: '#e74c3c',
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  & > * + * {
    margin-top: 2rem;
  }
`
const Grid = styled.div`
  display: grid;
  background: hsl(0, 0%, 85%);
  grid-template-rows: repeat(${p => p.height}, ${p => p.size}px);
  grid-template-columns: repeat(${p => p.width}, ${p => p.size}px);
`
const Cell = styled.div`
  background: var(--color, transparent);
  border: 1px solid var(--color, black);
  color: red;
`
const PixelCanvas = ({ color, erase, cells, size, height, width }) => {
  const gridRef = useRef(null)
  const erasing = useRef(false)
  const update = e => {
    if (e.target.parentNode === gridRef.current) {
      e.target.style.setProperty('--color', erasing.current ? null : color)

      cells[
        parseInt(e.target.getAttribute('data-index'), 10)
      ].color = erasing.current ? null : color
    }
  }
  const end = e => {
    gridRef.current.removeEventListener('pointermove', update)
    window.removeEventListener('pointerup', end)
    erasing.current = false
  }

  const start = e => {
    if (e.button === 2) {
      e.preventDefault()
      erasing.current = true
    }
    gridRef.current.addEventListener('pointermove', update)
    window.addEventListener('pointerup', end)
  }

  useEffect(() => {
    for (const cell of gridRef.current.children) {
      cell.removeAttribute('style')
    }
  }, [height, width])

  return (
    <Grid
      onPointerDown={start}
      onContextMenu={e => {
        e.preventDefault()
        return false
      }}
      ref={gridRef}
      width={width}
      height={height}
      size={size}>
      {cells.map((c, index) => (
        <Cell key={index} data-index={index} index={index} />
      ))}
    </Grid>
  )
}
PixelCanvas.propTypes = {
  color: T.string,
  erase: T.bool,
  cells: T.arrayOf(
    T.shape({
      color: T.string,
    })
  ),
  size: T.number,
  width: T.number,
  height: T.number,
}

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  & > * + * {
    margin-top: 2rem;
  }
`

const Debug = styled.div`
  height: ${p => p.height}px;
  width: ${p => p.width}px;
  position: relative;
  background: purple;
  &:after {
    content: '';
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-${p => p.translateX}px, -${p => p.translateY}px);
    box-shadow: ${p => p.shadow};
  }
`
// opacity: 0.5;

const App = () => {
  const [size, setSize] = useState(CONFIG.size)
  const [width, setWidth] = useState(CONFIG.width)
  const [height, setHeight] = useState(CONFIG.height)
  const [color, setColor] = useState(CONFIG.color)
  const [shadow, setShadow] = useState('')
  const [processing, setProcessing] = useState(false)
  const [translateX, setTranslateX] = useState(null)
  const [translateY, setTranslateY] = useState(null)
  const cellRef = useRef([...new Array(height * width).fill().map(() => ({}))])

  useEffect(() => {
    const changeDimension = changer => dimension => {
      if (
        confirm(
          'Are you sure? Making this change will wipe your current canvas.'
        )
      ) {
        cellRef.current = [
          ...new Array(CONFIG.height * CONFIG.width).fill().map(() => ({})),
        ]
        changer(dimension)
        setShadow(null)
      }
    }
    const CONTROLLER = new GUI()
    CONTROLLER.add(CONFIG, 'height', 0, 50, 1).onFinishChange(
      changeDimension(setHeight)
    )
    CONTROLLER.add(CONFIG, 'width', 0, 50, 1).onFinishChange(
      changeDimension(setWidth)
    )
    CONTROLLER.add(CONFIG, 'size', 0, 50, 1).onFinishChange(size => {
      setSize(size)
    })
    CONTROLLER.addColor(CONFIG, 'color').onFinishChange(color =>
      setColor(color)
    )
  }, [])

  useEffect(() => {
    const generateShadow = () => {
      // Work out translation based on width, height, and size
      // translateX half of the width plus half of the size
      const translateX = width * size * 0.5 + size * 0.5
      const translateY = height * size * 0.5 - size * 0.5
      // generate the box shadow
      // Iterate over the cell reference
      let str = ``
      for (let c = 0; c < cellRef.current.length; c++) {
        const x = (c % width) + 1
        const y = Math.floor(c / width)
        // console.info(x, y)
        if (cellRef.current[c].color) {
          // Create a box shadow string and append it to the str
          str += `${x * size}px ${y * size}px 0 0 ${cellRef.current[c].color},`
        }
      }
      setTranslateX(translateX)
      setTranslateY(translateY)
      setShadow(
        str.trim() === '' ? 'none' : str.substring(0, str.lastIndexOf(','))
      )
      setProcessing(false)
    }
    if (processing) {
      generateShadow()
    }
  }, [height, processing, size, width])

  return (
    <Container>
      <PixelCanvas
        size={size}
        width={width}
        height={height}
        cells={cellRef.current}
        color={color}
      />
      <Controls>
        <button onClick={() => setProcessing(true)}>
          {processing ? 'Processing' : 'Print to console!'}
        </button>

        <Debug
          shadow={shadow}
          width={size}
          height={size}
          translateX={translateX}
          translateY={translateY}
        />
      </Controls>
    </Container>
  )
}

render(<App />, document.querySelector('#app'))
